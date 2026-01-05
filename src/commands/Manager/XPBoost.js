const { Subcommand } = require('@sapphire/plugin-subcommands');
const { 
  ContainerBuilder, 
  TextDisplayBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SectionBuilder,
  ActionRowBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ButtonStyle
} = require('discord.js');
const xpList = require('../../lib/xp-boost/xpList');

class XPBoost extends Subcommand {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'xpboost',
      aliases: ['xp', 'xpboosts'],
      preconditions: ['Sentry'],
      description: 'Manage XP boost related stuff.',
      subcommands: [
        {
          name: 'manage',
          messageRun: 'manage',
          default: true
        },
        {
          name: 'list', 
          messageRun: 'list'
        }
      ]
    });

    this.xpListCollector = null;
  }

  async manage(message) {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const generalInfoText = 'Manage roles or channels affected by XP boost or ignore channels. To ' +
                            'update a role or channel\'s multiplier, add the role through the ' +
                            '\'Add or update role or channel\' dropdown menu and enter the new value.\n\n' +
                            'This prompt expires in 5 minutes.';
    const generalInfoTextDisplay = new TextDisplayBuilder().setContent(generalInfoText);

    const addSelectMenu = new StringSelectMenuBuilder()
      .setCustomId(`${message.author.id}:${expiresAt}:add_menu`)
      .setPlaceholder('Add or update a role or channel')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Add or update a role')
          .setValue('add_role'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Add or update a channel')
          .setValue('add_channel')
      );
    const addActionRow = new ActionRowBuilder().addComponents(addSelectMenu);

    const removeSelectMenu = new StringSelectMenuBuilder()
      .setCustomId(`${message.author.id}:${expiresAt}:remove_menu`)
      .setPlaceholder('Remove roles or channels')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Remove a role')
          .setValue('remove_role'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Remove a channel')
          .setValue('remove_channel')
      );
    const removeActionRow = new ActionRowBuilder().addComponents(removeSelectMenu);

    const ignoreAddRemoveMenu = new StringSelectMenuBuilder()
      .setCustomId(`${message.author.id}:${expiresAt}:ignore_manager_menu`)
      .setPlaceholder('Manage channels excluded from XP boosts')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Ignore a channel')
          .setValue('ignore_channel'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Unignore a channel')
          .setValue('unignore_channel')
      );
    const ignoreAddRemoveActionRow = new ActionRowBuilder().addComponents(ignoreAddRemoveMenu);

    const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large);

    const listSection = new SectionBuilder()
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent('Click the button on the right to see a list of XP-boosted roles and channels as well as ignored channels.')
      )
      .setButtonAccessory((button) =>
        button
          .setCustomId(`${message.author.id}:${expiresAt}:xp_list`)
          .setStyle(ButtonStyle.Primary)
          .setLabel('Complete List')
      );

    const container = new ContainerBuilder()
      .addTextDisplayComponents(generalInfoTextDisplay)
      .addActionRowComponents(addActionRow, removeActionRow, ignoreAddRemoveActionRow)
      .addSeparatorComponents(separator)
      .addSectionComponents(listSection);

    message.channel.send({ 
      components: [container],
      flags: MessageFlags.IsComponentsV2 
    });
  }

  async list(message) {
    xpList(message);
  }
}

module.exports = { XPBoost };