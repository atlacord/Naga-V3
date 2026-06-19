const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { faq } = require('../../lib/guide/FAQ');
const { channelInfo } = require('../../lib/guide/Channels');
const { roleInfo } = require('../../lib/guide/Roles');
const { team } = require('../../lib/guide/Team');
const { replyStore } = require('../../lib/guide/ReplyStore');

class ButtonSelector extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    };

    parse(interaction) {
        if ((!interaction.customId.startsWith('guide_button')) || (interaction.customId === 'guide_button_contact')) {
            return this.none();
        }
        return this.some();
    };

    async run(interaction) {
        try {
            let content;
            if (interaction.componentType !== 2) return;
            switch (interaction.customId) {
                case 'guide_button_faq':
                    content = faq;
                    break;
                case 'guide_button_channelinfo':
                    content = channelInfo('guide');
                    break;
                case 'guide_button_roleinfo':
                    content = roleInfo('activity');
                    break;
                case 'guide_button_team':
                    content = await team(this.container);
            };
            let reply = await interaction.reply(content);
            replyStore.set(interaction.member.id, reply);
            return;
        } catch (err) {
            console.error(err);
        };
    };
};

module.exports = { ButtonSelector };