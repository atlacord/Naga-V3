const { Command, Resolvers } = require('@sapphire/framework');

const allowedChannels = [
    '372086844956868618', 
    '721604232532459540', 
    '1008421501487304844'
];

class ATLATopic extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'atla',
            aliases: [],
            description: 'Sends a random ATLA topic to spark a conversation!',
            detailedDescription: {
                'Command Forms and Arguments': 'n.atla'
            }
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
        .setName('atla')
        .setDescription('Sends a random ATLA topic to spark a conversation!')
        )
    };

    async checkChannel(channel) {
        return allowedChannels.includes(channel.id);
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
            if (!this.checkChannel(messageOrInteraction.channel)) return;

            const doc = await this.container.models.get('Server').findById(messageOrInteraction.guild.id);
            const topics = doc.data.atlaTopics;

            let cooldown = this.handleCooldown(doc.data.topicTimestamps.atla);
            if (cooldown !== false) {
                return this.container.utils.sendError(messageOrInteraction.channel, `This command has already been used recently! Try again in **${cooldown}**!`);
            };

            let topic = Math.floor(Math.random() * topics.length)
            
            if (doc.data.ignoredATLATopics.length === topics.length) {
                doc.data.ignoredATLATopics = [];
            };

            while (doc.data.ignoredATLATopics.includes(topic)) {
                topic = Math.floor(Math.random() * topics.length);
            };

            doc.data.ignoredATLATopics.push(topic);

            return this.container.utils.sendMessage(messageOrInteraction.channel, {
                embed: {
                    color: this.utils.getColor('blue'),
                    description: topics[topic]
                }
            }).then(doc.data.topicTimestamps.atla = messageOrInteraction.createdAt, doc.save());
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

module.exports = { ATLATopic };