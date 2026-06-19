const { Command, Resolvers } = require('@sapphire/framework');
const { Tatsu } = require('tatsu');

const tatsu = new Tatsu(process.env.TATSU_KEY);

class UserInfo extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'userinfo',
      aliases: ['whois', 'w'],
      description: 'Show information about a user.',
      detailedDescription: {
        'Command Forms and Arguments': 'n.userinfo [user]\n' +
        '**User:** User ID or name. If it\'s a name with multiple words, it must be wrapped in double quotes. Required.'
      }
    });

    this.perms = {
      Administrator: 'Administrator',
      ManageGuild: 'Manage Server',
      ManageRoles: 'Manage Roles',
      ManageChannels: 'Manage Channels',
      ManageMessages: 'Manage Messages',
      ManageThreads: 'Manage Threads and Posts',
      ManageWebhooks: 'Manage Webhooks',
      ManageNicknames: 'Manage Nicknames',
      ManageGuildExpressions: 'Manage Emojis',
      ManageThreads: 'Manage Threads',
      ModerateMembers: 'Timeout Members',
      PinMessages: 'Pin Messages',
      BypassSlowmode: 'Bypass Slowmode',
      CreateGuildExpressions: 'Create Guild Expressions',
      ViewGuildInsights: 'View Server Insights',
      KickMembers: 'Kick Members',
      BanMembers: 'Ban Members',
      MentionEveryone: 'Mention Everyone',
    }
  }

    registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('userinfo')
        .setDescription('Shows information about a member.')
        .addUserOption((option) =>
        option
        .setName('user')
        .setDescription('A member of the server')
        .setRequired(false)
      )
    )
  };

    async userInfo(messageOrInteraction, user) {
        let member;
        if (!user) {
            member = messageOrInteraction.member;
        } else {
            member = await this.container.resolver.user(messageOrInteraction.guild, user) || messageOrInteraction.member;
        }
        if (!member) return this.container.utils.sendError(messageOrInteraction.channel, `Couldn't find member ${user}.`);

        // for (let i = 0; i < this.utils.checkStaff(member).length; i += 1) {
        //    staff.push(this.utils.checkStaff(member)[i]);
        // }

        let tatsuRank = await tatsu.getMemberRanking('370708369951948800', member.id);

        let roles, roleColor;
        if (member.roles.cache.size) {
            try {
                let r = []
                roles = member.roles.cache.filter(r => r.id !== messageOrInteraction.guild.id).each(role => r.push(role));
                roles = r.sort((a,b) => b.position - a.position);
                roles = roles.map(r => `<@&${r.id}>`).join(', ');
            } catch (err) {
                console.error(err);
            }
        } else {
            roles = 'No Roles';
            roleColor = this.container.utils.getColor('blue');
        }

        let embed = {  
            author: { name: member.displayName, icon_url: member.displayAvatarURL() },
            thumbnail: { url: member.displayAvatarURL() },
            color: roleColor || this.container.utils.getColor('blue'),
            // description: bio || null,

            fields: [
                { name: 'Username', value: `<@!${member.id}>`, inline: true },
                { name: 'Server XP', value: `${tatsuRank.score.toLocaleString()} XP (Rank #${tatsuRank.rank})`, inline: false },
                { name: 'Joined', value: `<t:${Math.floor(member.joinedAt / 1000)}:F>`, inline: false },
                { name: 'Registered', value: `<t:${Math.floor(member.user.createdAt / 1000)}:F>`, inline: false },
                { name: `Roles [${member.roles.cache.size - 1}]`, value: roles, inline: false }
            ],

            footer: { text: `ID: ${member.id}` },
            timestamp: new Date(),
        }

        if (member.permissions) {
            const memberPerms = member.permissions.json;
            const infoPerms = [];
            for (let key in memberPerms) {
                if (!perms[key] || memberPerms[key] !== true) continue;
                if (memberPerms[key]) {
                    infoPerms.push(perms[key]);
                }
                infoPerms.sort();
            }
        
            if (infoPerms.length) {
                embed.fields.push({ name: 'Server Permissions', value: infoPerms.join(', '), inline: false });
            }
        }
        await messageOrInteraction.channel.send({ embeds: [embed] });
    }

    async messageRun(message, args) {
        const memberArg = await args.pick('string').catch(() => null);
        if (!memberArg) this.userInfo(message);
        else this.userInfo(message, memberArg);
    };

    async chatInputRun(interaction) {
        const member = interaction.options.getUser('user') || interaction.member;
        await interaction.deferReply();
        this.userInfo(interaction, member);
    } 
}

module.exports = { UserInfo };