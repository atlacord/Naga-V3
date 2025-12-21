const { Command, Resolvers } = require('@sapphire/framework');

class RoleInfo extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'roleinfo',
      aliases: ['ri'],
      description: 'Show information about a role.',
      detailedDescription: {
        'Command Forms and Arguments': '`n.roleinfo [role]`\n' +
                                       '**Role:** ID or name. If it\'s a name with multiple words, it must be wrapped in double quotes. Required.'
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

  async messageRun(message, args) {
    try {
      const roleArg = await args.pick('string').catch(() => null);

      if (!roleArg) return this.container.utils.sendError(message.channel, 'You need to provide a role!');

      const role = (await Resolvers.resolveRole(roleArg, message.guild)).unwrapOrElse(() => null);

      if (!role) return this.container.utils.sendError(message.channel, 'Unknown role!');

      const roleColors = [`Primary: \`${this.container.utils.integerToHex(role.colors.primaryColor)}\``];
      if (role.colors.secondaryColor) roleColors.push(`Secondary: \`#${role.colors.secondaryColor.toString(16)}\``);
      if (role.colors.tertiaryColor) roleColors.push(`Tertiary: \`#${role.colors.tertiaryColor.toString(16)}\``);

      if (role.colors.primaryColor === 0) {
        role.colors.primaryColor = 9031664;
      }

      const embed = {  
        color: role.colors.primaryColor,
        author: { 
          name: role.name, 
          icon_url: null 
        },
        thumbnail: { url: null },

        fields: [
          { name: 'Name', value: role.name, inline: true },
          { name: 'Mentionable', value: role.mentionable, inline: true },
          { name: 'Hoisted', value: role.hoist, inline: true },
          { name: 'Colors', value: roleColors.join('\n'), inline: true },
          { name: 'Position', value: role.position, inline: true },
          { name: 'Managed via Integration', value: role.managed, inline: false },
          { name: 'Created', value: `<t:${Math.floor(role.createdAt / 1000)}:F>`, inline: false },
        ],
        footer: { text: `ID: ${role.id}`}
      };

      if (role.icon !== null) {
        embed.author.icon_url = role.iconURL;
        embed.thumbnail.url = role.iconURL;
      }

      if (role.permissions) {
        const rolePerms = role.permissions.toArray();
        const infoPerms = [];

        for (const perm of rolePerms) {
          if (this.perms[perm]) infoPerms.push(this.perms[perm]);
        }

        if (infoPerms.length) {
          embed.fields.push({ name: 'Role Permissions', value: infoPerms.join(', '), inline: false });
        }
      }

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      this.container.utils.sendError(message.channel, `An error occurred: \`\`\`${err}\`\`\``);
    }
  }
}

module.exports = { RoleInfo };