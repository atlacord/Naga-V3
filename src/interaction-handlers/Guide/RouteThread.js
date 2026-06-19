const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { MessageFlags } = require('discord.js');
const { route } = require('../../lib/guide/contact/RouteThread.js');

class RouteThread extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        })
    }

  parse(interaction) {
    if (interaction.customId !== 'modal_contact') return this.none();
    if (Date.now() > interaction.expirationTime) {
        interaction.reply({
            content: 'This menu has expired',
            flags: MessageFlags.Ephemeral
        }).catch(() => {});

        return this.none();
    }

        return this.some();
    };

    async run(interaction) {
        route(interaction);
        await interaction.reply({ flags: MessageFlags.Ephemeral, content: 'Your submission was received successfully!'})
    };
}

module.exports = { RouteThread };