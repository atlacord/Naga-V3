const { Command, Resolvers } = require('@sapphire/framework');

const ignoredCategories = [
    '372086709950611456', // Avatar
    '765832566875095040', // Miscellaneous
    '372085914765099008', // Moderation
    '719883529470738523', // Lake Laogai
    '828540781291241492' // The Garden Gate
]; // Ignore mod categories to avoid conflict with n.topics command

class Topic extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'topic',
            aliases: [],
            description: 'Sends a random topic to spark a conversation!',
            detailedDescription: {
                'Command Forms and Arguments': 'n.topic'
            }
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
        .setName('topic')
        .setDescription('Sends a random topic to spark a conversation!')
        )
    };

    async checkCategory(channel) {
        let category;
        if (channel instanceof ThreadChannel || channel instanceof PrivateThreadChannel) {
            let parentChannel = await this.container.client.channels.cache.get(channel.parentID);
            category = parentChannel.parentID;
        } else {
            category = channel.parentID;
        };

        return ignoredCategories.includes(category);
    };

    handleCooldown(timestamp) {
        const timeLeft = Date.now() - timestamp;
        if (timeLeft <= COMMAND_COOLDOWN) {
            let time = Math.ceil((600000 - timeLeft) / 100) / 10
            let minutes = Math.floor(time / 60);
            let seconds = Math.ceil(time - minutes * 60);
            if (minutes === 0) {
                return `${seconds} sec`;
            } else {
                return `${minutes} minutes ${seconds} seconds`;
            }
        } else return false;
    };

    async topic(messageOrInteraction) {
        try {
            if (this.checkCategory(messageOrInteraction.channel)) return;

            const doc = await this.container.models.get('Server').findById(messageOrInteraction.guild.id);
            const topics = doc.data.topics;

            let cooldown = this.handleCooldown(doc.data.topicTimestamps.normal);
            if (cooldown !== false) {
                return this.container.utils.sendError(messageOrInteraction.channel, `This command has already been used recently! Try again in **${cooldown}**!`);
            };

            let topic = Math.floor(Math.random() * topics.length)
            
            if (doc.data.ignoredTopics.length === topics.length) {
                doc.data.ignoredTopics = [];
            };

            while (doc.data.ignoredTopics.includes(topic)) {
                topic = Math.floor(Math.random() * topics.length);
            };

            doc.data.ignoredTopics.push(topic);

            return this.container.utils.sendMessage(messageOrInteraction.channel, {
                embed: {
                    color: this.utils.getColor('blue'),
                    description: topics[topic]
                }
            }).then(doc.data.topicTimestamps.normal = messageOrInteraction.createdAt, doc.save());
        } catch (err) {
            return this.container.utils.sendError(messageOrInteraction.channel, err);
        };
    };

    async messageRun(message) {
        this.topic(message);
    };

    async chatInputRun(interaction) {
        await interaction.deferReply();
        this.topic(interaction);
    };
};

module.exports = { Topic };