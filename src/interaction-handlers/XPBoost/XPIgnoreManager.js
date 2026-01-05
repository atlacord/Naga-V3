const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const {
  MessageFlags, 
  ModalBuilder, 
  LabelBuilder,
  ChannelSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
const validateEntity = require('../../lib/xp-boost/validateEntity');

class XPIgnoreManager extends InteractionHandler {
  constructor(ctx, options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    });
  }

  parse(interaction) {
    const [userId, expirationTime, customId] = interaction.customId.split(':');

    if (customId != 'ignore_manager_menu') return this.none();

    if (userId != interaction.user.id) {
      interaction.reply({
        content: 'You can\'t use this menu!',
        flags: MessageFlags.Ephemeral
      }).catch(() => {});

      return this.none();
    }


    if (Date.now() > expirationTime) {
      interaction.reply({
        content: 'This menu has expired!',
        flags: MessageFlags.Ephemeral
      }).catch(() => {});

      return this.none();
    }

    return this.some();
  }

  async run(interaction) {
    const doc = await this.container.models.get('Server').findById(interaction.guild.id);

    const choice = interaction.values[0];

    if (choice === 'ignore_channel') {
      const timestamp = Date.now();

      const channelModal = new ModalBuilder().setCustomId(`${timestamp}:ignore_channel`).setTitle('Ignore Channels for XP Boosts');
            
      const channelSelectMenu = new ChannelSelectMenuBuilder()
        .setCustomId('ignore_channel_list')
        .setChannelTypes('GuildText', 'GuildCategory')
        .setMinValues(1)
        .setMaxValues(10)
        .setRequired(true);
      const channelLabel = new LabelBuilder()
        .setLabel('Choose channels and/or categories (up to 10)')
        .setDescription('If the channels or categories chosen are already being XP boosted, they will be removed and ignored.')
        .setChannelSelectMenuComponent(channelSelectMenu);

      channelModal.addLabelComponents(channelLabel);

      await interaction.showModal(channelModal);

      const channelModalFilter = (i) => (i.user.id === interaction.user.id) && (i.customId === `${timestamp}:ignore_channel`);

      let channelModalSubmitInteraction;

      try {
        channelModalSubmitInteraction = await interaction.awaitModalSubmit({ time: 300_000, filter: channelModalFilter });
      } catch (err) {
        return this.container.logger.error(`[${timestamp}:ignore_channel, ${interaction.user.id}]: Collector didn\'t receive a modal submission!`);
      }

      const channelsToIgnore = channelModalSubmitInteraction.fields.getSelectedChannels('ignore_channel_list');

      const channelsIgnored = [];

      for (const [id, channel] of channelsToIgnore) {
        if (doc.data.xpBoost.channels.has(id)) {
          doc.data.xpBoost.channels.delete(id);
        }

        if (!doc.data.xpBoost.ignoredChannels.includes(id)) {
          doc.data.xpBoost.ignoredChannels.push(id);
          channelsIgnored.push(`${channel.name} (\`${id}\`)`);
        }
      }

      try {
        await doc.save();

        let content = `No channels were added! This is probably because the channels you chose are already being ignored.`;

        if (channelsIgnored != 0) {
          content = `Successfully ignored the following channels:\n${channelsIgnored.join('\n')}`;
        }

        channelModalSubmitInteraction.reply({ content: content, flags: MessageFlags.Ephemeral });
      } catch (err) {
        console.error(err);
        return channelModalSubmitInteraction.reply({ content: `An error occurred while saving to the database: \`\`\`${err}\`\`\``, flags: MessageFlags.Ephemeral });
      }
    } else if (choice === 'unignore_channel') {
      const timestamp = Date.now();

      const channelModal = new ModalBuilder().setCustomId(`${timestamp}:unignore_channel`).setTitle('Unignore Channels for XP Boosts');

      const dbChannels = doc.data.xpBoost.ignoredChannels;

      if (dbChannels.length === 0) {
        return interaction.reply({ content: 'There are no channels in the database to remove!', flags: MessageFlags.Ephemeral });
      }

      const channels = [];

       for (const id of dbChannels) {
        channels.push(await validateEntity(id, interaction.guild));
      }

      const channelMenuStringSelectMenuOptions = [];

      for (const channel of channels) {
        channelMenuStringSelectMenuOptions.push(
          new StringSelectMenuOptionBuilder()
            .setLabel(`${channel.name} (${channel.id})`)
            .setValue(`${channel.name}_${channel.id}`)
        )
      }

      const channelStringSelectMenu = new StringSelectMenuBuilder()
        .setCustomId(`${interaction.user.id}:unignore_channel_menu`)
        .addOptions(channelMenuStringSelectMenuOptions)
        .setMinValues(1)
        .setMaxValues(channelMenuStringSelectMenuOptions.length)
        .setRequired(true)

      const channelLabel = new LabelBuilder()
        .setLabel('Select Channels to Unignore')
        .setStringSelectMenuComponent(channelStringSelectMenu);

      channelModal.addLabelComponents(channelLabel);

      await interaction.showModal(channelModal);

      const channelModalFilter = (i) => (i.user.id === interaction.user.id) && (i.customId === `${timestamp}:unignore_channel`);

      let channelModalSubmitInteraction;

      try {
        channelModalSubmitInteraction = await interaction.awaitModalSubmit({ time: 300_000, filter: channelModalFilter });
      } catch (err) {
        return this.container.logger.error(`[${timestamp}:unignore_channel, ${interaction.user.id}]: Collector didn\'t receive a modal submission!`);
      }

      let channelsToBeUnignored = channelModalSubmitInteraction.fields.getStringSelectValues(`${interaction.user.id}:unignore_channel_menu`);

      channelsToBeUnignored = channelsToBeUnignored.map(value => {
        const [name, id] = value.split('_');

        const index = doc.data.xpBoost.ignoredChannels.indexOf(id);
        doc.data.xpBoost.ignoredChannels.splice(index, 1);

        return `${name} (\`${id})\`)`;
      });

      try {
        await doc.save();
        channelModalSubmitInteraction.reply({ content: `Successfully unignored the following chanenls:\n${channelsToBeUnignored.join('\n')}`, flags: MessageFlags.Ephemeral });
      } catch (err) {
        console.error(err);
        return channelModalSubmitInteraction.reply({ content: `An error occurred while saving to the database: \`\`\`${err}\`\`\``, flags: MessageFlags.Ephemeral });
      }
    }

    interaction.message.edit({ components: interaction.message.components });
  }
}

module.exports = { XPIgnoreManager };