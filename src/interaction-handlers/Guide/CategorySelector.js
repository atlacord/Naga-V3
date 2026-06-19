const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { channelInfo } = require('../../lib/guide/Channels');
const { roleInfo } = require('../../lib/guide/Roles');
const { replyStore } = require('../../lib/guide/ReplyStore');

class CategorySelector extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu
        });
    };

    parse(interaction) {
        if (!interaction.customId.endsWith('selectcategory')) {
            return this.none();
        };
        return this.some();
    };

    async run(interaction) {
        try {
            interaction.deferUpdate();
            let category = interaction.values[0];
            let content = null;
            switch (interaction.customId) {
                case 'guide_channels_selectcategory':
                    content = channelInfo(category, true);
                    break;
                case 'guide_roles_selectcategory':
                    content = roleInfo(category, true);
                    break;
            };
            let reply = replyStore.get(interaction.member.id);
            return reply.edit(content);
        } catch (err) {
            console.error(err);
        }
    };
};

module.exports = { CategorySelector };