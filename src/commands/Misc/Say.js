const { Command } = require('@sapphire/framework');

class Say extends Command {
    constructor(context, options) {
        super(context, {
        ...options, 
        name: 'say',
        description: 'Sends a message in a given channel.',
        detailedDescription: {
            'Command Forms and Arguments': 'say [message] \nsay [channel] [message]'
        },
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
            .setName('say')
            .setDescription('Sends a message in a given channel')
            .addStringOption((option) => 
            option
                .setName('message')
                .setDescription('The message to send')
                .setRequired(true)
            )
            .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('A channel in the current server')
                .setRequired(false)
            )
        )
    }

    async messageRun(message, args) {
        const channelArg = await args.pick('string').catch(() => null);
        const messageArg = await args.pick('string').catch(() => null);

        try {
            const channel = await this.container.resolver.channel(message.channel.guild, channelArg);
            channel.send(messageArg);
        } catch (err) {
            console.error(err);
            this.container.utils.sendError(message.channel, err)
        }
    }

    async chatInputRun(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const message = interaction.options.getString('message');
        
        try {
            channel.send(message);
        } catch (err) {
            console.error(err);
            this.container.utils.sendError(interaction.channel, err);
        }
    }
}

module.exports = Say;