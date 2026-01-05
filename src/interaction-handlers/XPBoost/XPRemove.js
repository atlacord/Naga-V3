const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const {
  MessageFlags, 
  ModalBuilder, 
  LabelBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
const validateEntity = require('../../lib/xp-boost/validateEntity');

class XPRemove extends InteractionHandler {
  constructor(ctx, options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    });
  }

  parse(interaction) {
    const [userId, expirationTime, customId] = interaction.customId.split(':');

    if (customId != 'remove_menu') return this.none();

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

    if (choice === 'remove_role') {
      const timestamp = Date.now();

      const roleModal = new ModalBuilder().setCustomId(`${timestamp}:remove_role`).setTitle('Remove Roles for XP Boosts');

      const dbRoles = doc.data.xpBoost.roles.keys();

      if (doc.data.xpBoost.roles.size === 0) {
        return interaction.reply({ content: 'There are no roles in the database to remove!', flags: MessageFlags.Ephemeral });
      }

      const roles = [];

      for (const id of dbRoles) {
        roles.push(await validateEntity(id, interaction.guild));
      }

      const roleMenuStringSelectMenuOptions = [];

      for (const role of roles) {
        roleMenuStringSelectMenuOptions.push(
          new StringSelectMenuOptionBuilder()
            .setLabel(`${role.name} (${role.id})`)
            .setValue(`${role.name}_${role.id}`)
        )
      }

      const roleStringSelectMenu = new StringSelectMenuBuilder()
        .setCustomId(`${interaction.user.id}:remove_role_menu`)
        .addOptions(roleMenuStringSelectMenuOptions)
        .setMinValues(1)
        .setMaxValues(roleMenuStringSelectMenuOptions.length)
        .setRequired(true)

      const roleLabel = new LabelBuilder()
        .setLabel('Select Roles to Remove')
        .setStringSelectMenuComponent(roleStringSelectMenu);

      roleModal.addLabelComponents(roleLabel);

      await interaction.showModal(roleModal);

      const roleModalFilter = (i) => (i.user.id === interaction.user.id) && (i.customId === `${timestamp}:remove_role`);

      let roleModalSubmitInteraction;

      try {
        roleModalSubmitInteraction = await interaction.awaitModalSubmit({ time: 300_000, filter: roleModalFilter });
      } catch (err) {
        return this.container.logger.error(`[${timestamp}:remove_role, ${interaction.user.id}]: Collector didn\'t receive a modal submission!`);
      }

      let rolesToBeDeleted = roleModalSubmitInteraction.fields.getStringSelectValues(`${interaction.user.id}:remove_role_menu`);

      rolesToBeDeleted = rolesToBeDeleted.map(value => {
        const [name, id] = value.split('_');
        const multiplier = doc.data.xpBoost.roles.get(id);
        const multiplierPercent = Math.trunc(multiplier * 100 - 100)

        doc.data.xpBoost.roles.delete(id);

        return `${name} (\`${id}\`): ${multiplierPercent}%`;
      });

      try {
        await doc.save();
        roleModalSubmitInteraction.reply({ content: `Roles that were deleted:\n${rolesToBeDeleted.join('\n')}`, flags: MessageFlags.Ephemeral });
      } catch (err) {
        console.error(err);
        return roleModalSubmitInteraction.reply({ content: `An error occurred while saving to the database: \`\`\`${err}\`\`\``, flags: MessageFlags.Ephemeral });
      }
    } else if (choice === 'remove_channel') {
      const timestamp = Date.now();

      const channelModal = new ModalBuilder().setCustomId(`${timestamp}:remove_channel`).setTitle('Remove Channels for XP Boosts');

      const dbChannels = doc.data.xpBoost.channels.keys();

      if (doc.data.xpBoost.channels.size === 0) {
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
        .setCustomId(`${interaction.user.id}:remove_channel_menu`)
        .addOptions(channelMenuStringSelectMenuOptions)
        .setMinValues(1)
        .setMaxValues(channelMenuStringSelectMenuOptions.length)
        .setRequired(true)

      const channelLabel = new LabelBuilder()
        .setLabel('Select Channels to Remove')
        .setStringSelectMenuComponent(channelStringSelectMenu);

      channelModal.addLabelComponents(channelLabel);

      await interaction.showModal(channelModal);

      const channelModalFilter = (i) => (i.user.id === interaction.user.id) && (i.customId === `${timestamp}:remove_channel`);

      let channelModalSubmitInteraction;

      try {
        channelModalSubmitInteraction = await interaction.awaitModalSubmit({ time: 300_000, filter: channelModalFilter });
      } catch (err) {
        return this.container.logger.error(`[${timestamp}:remove_channel, ${interaction.user.id}]: Collector didn\'t receive a modal submission!`);
      }

      let channelsToBeDeleted = channelModalSubmitInteraction.fields.getStringSelectValues(`${interaction.user.id}:remove_channel_menu`);

      channelsToBeDeleted = channelsToBeDeleted.map(value => {
        const [name, id] = value.split('_');
        const multiplier = doc.data.xpBoost.channels.get(id);
        const multiplierPercent = Math.trunc(multiplier * 100 - 100)

        doc.data.xpBoost.channels.delete(id);

        return `${name} (\`${id}\`): ${multiplierPercent}%`;
      });

      try {
        await doc.save();
        channelModalSubmitInteraction.reply({ content: `Channels that were deleted:\n${channelsToBeDeleted.join('\n')}`, flags: MessageFlags.Ephemeral });
      } catch (err) {
        console.error(err);
        return channelModalSubmitInteraction.reply({ content: `An error occurred while saving to the database: \`\`\`${err}\`\`\``, flags: MessageFlags.Ephemeral });
      }
    }

    interaction.message.edit({ components: interaction.message.components });
  }
}

module.exports = { XPRemove };