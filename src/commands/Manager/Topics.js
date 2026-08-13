const { Resolvers } = require('@sapphire/framework');
const { Subcommand } = require('@sapphire/plugin-subcommands');

class Topics extends Subcommand {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'topics',
            aliases: ['topics'],
            preconditions: ['Sentry'],
            description: 'Topic management',
            detailedDescription: {
                'Command Forms and Arguments': 'n.topics add, n.topics remove, n.topics edit, and n.topics list'
            }
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
        .setName('topics')
        .setDescription('Topic management')
        )
    };

    async add(messageOrInteraction, category, topics) {
        const doc = await this.container.models.get('Server').findById(messageOrInteraction.guild.id);

        switch (category) {
            case 'atla':
                doc.data.atlaTopics.push(topics);
                break;
            case 'lok':
                doc.data.lokTopics.push(topics);
                break;
            default:
                doc.data.topics.push(topics);
                break;
        };

        doc.save().then(() => this.container.utils.sendSuccess(messageOrInteraction, `${topics.length} successfully added!`));
        return;
    };

    async edit(messageOrInteraction, category, index, content) {
        const doc = await this.container.models.get('Server').findById(messageOrInteraction.guild.id);

        let data;
        switch (category) {
            case 'atla':
                data = doc.data.atlaTopics;
                break;
            case 'lok':
                data = doc.data.lokTopics;
                break;
            default:
                data = doc.data.topics;
                break;
        };

        let oldEntry, newEntry;
        if (index) {
            newEntry = content;

            if (index > data.length - 1 || index < 0) {
                return this.container.utils.sendError(messageOrInteraction.channel, 'Position out of bounds.');
            };

            oldEntry = data[index];
        } else {
            const oldEntryRegex = /\[(.+?)\]/;

            oldEntry = content.match(oldEntryRegex)[1];
            newEntry = content.replace(oldEntryRegex, '').trim();

            index = data.indexOf(oldEntry);
        };

        data.splice(index, 1, newEntry);

        doc.save().then(() => this.container.utils.sendSuccess(messageOrInteraction.channel, `Topic replaced!\n\nOld: \`${oldEntry}\`\nNew: \`${newEntry}\`\n\nUse **\`${this.name} list\`** to see the updated topic list.`))
    };

    async remove(messageOrInteraction, category, index, content) {
        const doc = await this.container.models.get('Server').findById(messageOrInteraction.guild.id);

        let data;
        switch (category) {
            case 'atla':
                data = doc.data.atlaTopics;
                break;
            case 'lok':
                data = doc.data.lokTopics;
                break;
            default:
                data = doc.data.topics;
                break;
        };

        if (index) {
            if (index > data.length - 1 || index < 0) {
                return this.container.utils.sendError(messageOrInteraction.channel, 'Position out of bounds.');
            };
        } else {
            index = data.indexOf(content);
            if (index === -1) {
                return this.container.utils.sendError(messageOrInteraction.channel, 'Topic doesn\'t exist.');
            };
        };

        const deletedEntry = data.splice(index, 1);

        doc.save().then(() => this.container.utils.sendSuccess(messageOrInteraction, `The following topic has been successfully deleted: \`${deletedEntry}\`.`));
        return;
    };

    async messageRun(message) {
        switch (this.name) {
            case 'add':
                await this.add(message);
                break;
            case 'edit':
                await this.edit(message);
                break;
            case 'remove':
                await this.remove(message);
                break;
        };
    };

    async chatInputRun(interaction) {
        await interaction.deferReply();
                switch (this.name) {
            case 'add':
                await this.add(message);
                break;
            case 'edit':
                await this.edit(message);
                break;
            case 'remove':
                await this.remove(message);
                break;
        };
    };
};

module.exports = { Topics };