const { Command, Resolvers } = require('@sapphire/framework');
const { PermissionFlagsBits } = require('discord.js');

class SetColor extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'setcolors',
      aliases: ['setcolor'],
      description: 'Set colors for a specified role. You can set a primary, secondary, and tertiary color, with at least a primary required.',
      detailedDescription: {
        'Command Forms and Arguments': '`n.setcolors [role] [primary color] [secondary color] [tertiary color]`\n' + 
                                       '**Role:** ID or name. If it\'s a name, it must be wrapped in double quotes\n' +
                                       '**Primary/Secondary/Tertiary Colors:**: Hex code or an integer (base 10). Primary ' +
                                       'is required, secondary and tertiary are optional.'
      },
      preconditions: ['Sentry']
    });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('setcolor')
        .setDescription('colors')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
          option
            .setName('role')
            .setDescription('The role ID or name.')
            .setRequired(true)
        )
        .addStringOption((option) => 
          option
            .setName('primary_color')
            .setDescription('The primary color. Can be a hex code or an integer (base 10).')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('secondary_color').setDescription('The secondary color. Can be a hex code or an integer (base 10).')
        )
        .addStringOption((option) =>
          option.setName('tertiary_color').setDescription('The tertiary color. Can be a hex code or an integer (base 10).')
        ), { guildIds: ['650143161645006848'] });
  }

  async messageRun(message, args) {
    const roleArg = await args.pick('string').catch(() => null);
    const primaryColor = await args.pick('string').catch(() => null);
    const secondaryColor = await args.pick('string').catch(() => null);
    const tertiaryColor = await args.pick('string').catch(() => null);

    if (!roleArg) {
      return this.container.utils.sendError(message.channel, 'You need to provide a role!');
    }

    if (!primaryColor) {
      return this.container.utils.sendError(message.channel, 'You need to provide a primary color!');
    }

    try {       
      const result = await this.execute(roleArg, primaryColor, secondaryColor, tertiaryColor, message.guild);
      this.container.utils.sendSuccess(message.channel, result);
    } catch (err) {
      console.error(err);

      if (err === 'roleError') {
        this.container.utils.sendError(message.channel, 'Unknown role!');
      } else {
        this.container.utils.sendError(message.channel, `An error occurred: \`\`\`${err}\`\`\``);
      }
    }
  }
  
  async chatInputRun(interaction) {
    const roleArg = interaction.options.getString('role');
    const primaryColor = interaction.options.getString('primary_color');
    const secondaryColor = interaction.options.getString('secondary_color');
    const tertiaryColor = interaction.options.getString('tertiary_color');

    await interaction.deferReply();

    if (!secondaryColor && tertiaryColor) {
      return interaction.editReply('You need to have a secondary color if you want to set a tertiary!');
    }

    try {
      const result = await this.execute(roleArg, primaryColor, secondaryColor, tertiaryColor, interaction.guild);
      return interaction.editReply(result);
    } catch (err) {
      console.error(err);

      if (err === 'roleError') {
        await interaction.editReply('Unknown role!');
      } else {
        await interaction.editReply(`An error occurred: \`\`\`${err}\`\`\``);
      }
    }
  }

  async execute(roleArg, primaryColor, secondaryColor, tertiaryColor, guild) {
    const roleResult = await Resolvers.resolveRole(roleArg, guild);
    if (roleResult.isErr()) return roleResult.unwrapRaw();

    const role = roleResult.unwrap();

    const oldRoleColors = Object.values(role.colors).filter(Boolean).map(int => this.container.utils.integerToHex(int));
    
    await role.edit({ 
      colors: { 
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        tertiaryColor: tertiaryColor
      }
    });

    const confirmationMessage = ['Successfully changed the primary color'];

    if (secondaryColor) confirmationMessage.push(', secondary color');
    if (tertiaryColor) confirmationMessage.push(', and tertiary color');

    confirmationMessage.push(`of role <@&${role.id}> (${role.id})`);

    confirmationMessage.push(`\n\n__Old Colors__\nPrimary: ${oldRoleColors[0]}`);

    if (secondaryColor) confirmationMessage.push(`\nSecondary: ${oldRoleColors[1]}`);
    if (tertiaryColor) confirmationMessage.push(`\nTertiary: ${oldRoleColors[2]}`);
    
    return confirmationMessage.join(' ');
  }
}

module.exports = { SetColor };