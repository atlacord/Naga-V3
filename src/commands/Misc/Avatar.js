const { Command } = require('@sapphire/framework');

class Avatar extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'avatar',
      aliases: ['useravatar'],
      description: 'Display a user\'s avatar.',
      detailedDescription: {
        'Command Forms and Arguments': '`n.avatar [user]`\n'
      },
    });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('avatar')
        .setDescription('Returns a user avatar')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('User')
            .setRequired(false)
        )
    )
  }

    async messageRun(message, args) {
        try { 
            const userArg = await args.pick('string').catch(() => null) || message.author;
            const user = await message.channel.guild.members.fetch(userArg);
            let avatar = user.displayAvatarURL({ size: 4096 }) || user.avatarURL({ size: 4096}) // Fetches user's guild avatar, falls back to user avatar if one isn't set

            let embed = {
                title: 'Avatar',
                color: user.displayColor || this.container.utils.getColor('blue'),
                description: `${user.displayName} (${user.user.username})`,
                image: { url: avatar },
                footer: { text: user.id },
                timestamp: new Date()
            };

            message.channel.send({ embeds: [embed] })
        } catch(err) {
            console.error(err);
        }
    }

    async chatInputRun(interaction) {
        const userArg = interaction.options.getUser('user') || interaction.user;
        await interaction.deferReply();

        try { 
            let user = await interaction.channel.guild.members.fetch(userArg);
            let avatar = user.displayAvatarURL({ size: 4096 }) || user.avatarURL({ size: 4096 }) // Fetches user's guild avatar, falls back to user avatar if one isn't set

            let embed = {
                title: 'Avatar',
                color: user.displayColor || this.container.utils.getColor('blue'),
                description: `${user.displayName} (${user.user.username})`,
                image: { url: avatar },
                footer: { text: user.id },
                timestamp: new Date()
            };

            interaction.editReply({ embeds: [embed] })
        } catch(err) {
            console.error(err);
            this.container.utils.sendError(interaction.channel, err);
        }
    }
}

module.exports = { Avatar };