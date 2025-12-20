const { Command, Resolvers } = require('@sapphire/framework');
const { PermissionFlagsBits } = require('discord.js');

const HEX_COLOR_REGEX = /^#?[0-9a-fA-F]{6}$/;
const BASE_10_INTEGER_REGEX = /^(0|[1-9]\d*)$/;

class SetColors extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'setcolors',
      aliases: ['setcolor'],
      description: 'Set colors for a specified role. You can set a primary or a secondary color, with at least a primary required.',
      detailedDescription: {
        'Command Forms and Arguments': '`n.setcolors [role] [primary color] [secondary color]`\n' + 
                                       '**Role:** ID or name. If it\'s a name with multiple words, it must be wrapped in double quotes. Required.\n' +
                                       '**Primary and Secondary Colors**: Hex code or an integer (base 10). Primary ' +
                                       'is required, secondary is optional.'
      },
      preconditions: ['Sentry'],
      requiredClientPermissions: 'ManageRoles'
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
        ));
  }

  async messageRun(message, args) {
    const roleArg = await args.pick('string').catch(() => null);
    const primaryColor = await args.pick('string').catch(() => null);
    const secondaryColor = await args.pick('string').catch(() => null);

    if (!roleArg) {
      return this.container.utils.sendError(message.channel, 'You need to provide a role!');
    }

    if (!primaryColor) {
      return this.container.utils.sendError(message.channel, 'You need to provide a primary color!');
    }

    try {       
      const result = await this.execute(roleArg, primaryColor, secondaryColor, message.guild);
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

    await interaction.deferReply();

    try {
      const result = await this.execute(roleArg, primaryColor, secondaryColor, interaction.guild);
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

  validateColors(primary, secondary) {
    if (HEX_COLOR_REGEX.test(primary) || BASE_10_INTEGER_REGEX.test(primary)) {
      if (BASE_10_INTEGER_REGEX.test(primary)) {
        primary = Number(primary);
        if (primary > 16777215) throw new RangeError('Primary color must be between 0 and 16777215!');
      }
    } else {
      throw new Error('Invalid primary color format! Argument has to be a valid hex value or base 10 integer.');
    } 

    if (secondary) {
      if (HEX_COLOR_REGEX.test(secondary) || BASE_10_INTEGER_REGEX.test(secondary)) {
        if (BASE_10_INTEGER_REGEX.test(secondary)) {
          secondary = Number(secondary);
          if (secondary > 16777215) throw new RangeError('Secondary color must be between 0 and 16777215!');
        }
      } else {
        throw new Error('Invalid secondary color format! Argument has to be a valid hex value or base 10 integer.');
      }
    }

    return [primary, secondary]
  }

  async execute(roleArg, primaryColor, secondaryColor, guild) {
    const roleResult = await Resolvers.resolveRole(roleArg, guild);
    if (roleResult.isErr()) return roleResult.unwrapRaw();

    const role = roleResult.unwrap();

    const oldRoleColors = Object.values(role.colors).filter(Boolean).map(int => this.container.utils.integerToHex(int));

    [primaryColor, secondaryColor] = this.validateColors(primaryColor, secondaryColor);
    
    await role.edit({ 
      colors: { 
        primaryColor: primaryColor,
        secondaryColor: secondaryColor
      }
    });

    const confirmationMessage = ['Successfully changed the primary color'];

    if (secondaryColor) confirmationMessage.push('and secondary color');

    confirmationMessage.push(`of role <@&${role.id}> (${role.name}, ${role.id})`);

    confirmationMessage.push(`\n\n__Old Colors__\nPrimary: \`${oldRoleColors[0]}\``);

    if (oldRoleColors[1]) confirmationMessage.push(`\nSecondary: \`${oldRoleColors[1]}\``);

    if (oldRoleColors[2]) confirmationMessage.push(`\nTertiary: \`${oldRoleColors[2]}\``);
    
    return confirmationMessage.join(' ');
  }
}

module.exports = { SetColors };