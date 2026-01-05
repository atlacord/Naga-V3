const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const {
  MessageFlags, 
  ModalBuilder, 
  LabelBuilder, 
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder, 
  TextInputBuilder,
  TextInputStyle,
  roleMention,
  channelMention
} = require('discord.js');
const validateAndTransformMultiplier = require('../../lib/xp-boost/validateAndTransformMultiplier');

class XPAddOrUpdate extends InteractionHandler {
  constructor(ctx, options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    });
  }

  parse(interaction) {
    const [userId, expirationTime, customId] = interaction.customId.split(':');

    if (customId != 'add_menu') return this.none();

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

    if (!doc.data.xpBoost) {
      doc.data.xpBoost = {
        roles: new Map(),
        channels: new Map(),
        ignore: {
          roles: new Map(),
          channels: new Map()
        }
      }
    }

    const choice = interaction.values[0];

    const roleOrChannelModal = new ModalBuilder();
    const roleOrChannelLabel = new LabelBuilder();

    const multiplierTextInput = new TextInputBuilder()
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Examples: 30, 50%')
      .setRequired(true);
    const multiplierLabel = new LabelBuilder()
      .setLabel('Add a Multiplier')
      .setDescription('Enter a percent expressed as a whole number between 1 and 100, with or without a %.')
      .setTextInputComponent(multiplierTextInput);
    
    if (choice === 'add_role') {
      const timestamp = Date.now();

      roleOrChannelModal.setCustomId(`${timestamp}:add_role`).setTitle('Add or Update a Role for XP Boosts');

      const roleSelectMenu = new RoleSelectMenuBuilder().setCustomId(`add_role_list`).setRequired(true);

      roleOrChannelLabel.setLabel('Choose a role').setRoleSelectMenuComponent(roleSelectMenu);

      multiplierTextInput.setCustomId('add_role_multiplier');

      roleOrChannelModal.addLabelComponents(roleOrChannelLabel, multiplierLabel);

      await interaction.showModal(roleOrChannelModal);

      const roleModalFilter = (i) => (i.user.id === interaction.user.id) && (i.customId === `${timestamp}:add_role`);

      let roleModalSubmitInteraction;

      try {
        roleModalSubmitInteraction = await interaction.awaitModalSubmit({ time: 300_000, filter: roleModalFilter });
      } catch (err) {
        return this.container.logger.error(`[${timestamp}:add_role, ${interaction.user.id}]: ${err}`);
      }

      const role = roleModalSubmitInteraction.fields.getSelectedRoles(`add_role_list`).values().next().value;

      const multiplier = roleModalSubmitInteraction.fields.getTextInputValue('add_role_multiplier');
        
      const transformedMultiplier = validateAndTransformMultiplier(multiplier);

      if (!transformedMultiplier) {
        return roleModalSubmitInteraction.reply({
          content: 'Invalid multiplier format!',
          flags: MessageFlags.Ephemeral
        });
      }

      const multiplierPercent = Math.trunc(transformedMultiplier * 100 - 100);

      doc.data.xpBoost.roles.set(role.id, transformedMultiplier);

      try {
        await doc.save();
        roleModalSubmitInteraction.reply({
          content: `Successfully added (or updated) ${roleMention(role.id)} (${role.name}, ${role.id}) with multiplier ${multiplierPercent}%`,
          flags: MessageFlags.Ephemeral
        });
      } catch (err) {
        console.error(err);
        return roleModalSubmitInteraction.reply(`An error occurred while saving to the database: \`\`\`${err}\`\`\``);
      }
    } else if (choice === 'add_channel') {
      const timestamp = Date.now();

      const roleOrChannelModal = new ModalBuilder().setCustomId(`${timestamp}:add_channel`).setTitle('Add or Update a Channel for XP Boosts');
      
      const channelSelectMenu = new ChannelSelectMenuBuilder()
        .setCustomId('add_channel_list')
        .setChannelTypes('GuildText')
        .setRequired(true);

      roleOrChannelLabel.setLabel('Choose a channel').setChannelSelectMenuComponent(channelSelectMenu);

      multiplierTextInput.setCustomId('add_channel_multiplier');

      roleOrChannelModal.addLabelComponents(roleOrChannelLabel, multiplierLabel);

      await interaction.showModal(roleOrChannelModal);

      const channelModalFilter = (i) => (i.user.id === interaction.user.id) && (i.customId === `${timestamp}:add_channel`);

      let channelModalSubmitInteraction;

      try {
        channelModalSubmitInteraction = await interaction.awaitModalSubmit({ time: 300_000, filter: channelModalFilter });
      } catch (err) {
        return this.container.logger.error(`[${timestamp}:add_channel, ${interaction.user.id}]: Collector didn\'t receive a modal submission!`);
      }

      const multiplier = channelModalSubmitInteraction.fields.getTextInputValue('add_channel_multiplier');
        
      const transformedMultiplier = validateAndTransformMultiplier(multiplier);

      if (!transformedMultiplier) {
        return channelModalSubmitInteraction.reply({
          content: 'Invalid multiplier format!',
          flags: MessageFlags.Ephemeral
        });
      }

      const multiplierPercent = Math.trunc(transformedMultiplier * 100 - 100);

      const channel = channelModalSubmitInteraction.fields.getSelectedChannels('add_channel_list').values().next().value;

      doc.data.xpBoost.channels.set(channel.id, transformedMultiplier);

      try {
        await doc.save();
        channelModalSubmitInteraction.reply({
          content: `Successfully added (or updated) ${channelMention(channel.id)} (${channel.name}, ${channel.id}) with multiplier ${multiplierPercent}%`,
          flags: MessageFlags.Ephemeral
        });
      } catch (err) {
        console.error(err);
        return channelModalSubmitInteraction.reply(`An error occurred while saving to the database: \`\`\`${err}\`\`\``);
      }
    }

    interaction.message.edit({ components: interaction.message.components });
  }
}

module.exports = { XPAddOrUpdate };