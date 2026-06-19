const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { MessageFlags } = require('discord.js');
const modal = require('../../lib/guide/contact/Modal.js');

class ContactStaff extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

    parse(interaction) {
        if (interaction.customId !== 'guide_button_contact') return this.none();
        return this.some();
    }

    async run(interaction) {
        await interaction.showModal(modal);
    };
}

module.exports = { ContactStaff };