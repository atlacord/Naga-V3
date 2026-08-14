const { Command, Resolvers } = require('@sapphire/framework');
const quotes = require('../../assets/irohquotes.json');

class IrohQuote extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'iroh',
            aliases: [],
            description: 'Sends a random quote from Uncle Iroh',
            detailedDescription: {
                'Command Forms and Arguments': 'n.iroh'
            }
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
        .setName('iroh')
        .setDescription('Sends a random quote from Uncle Iroh.')
        )
    };

    async iroh(messageOrInteraction) {
        try {
            const quote = Math.floor(Math.random() * quotes.length);
                return this.sendMessage(messageOrInteraction.channel, {
                    embed: {
                    color: this.container.utils.getColor('blue'),
                    thumbnail: { url: 'https://i.pinimg.com/originals/4d/8c/d0/4d8cd09d595ab1cefb8098d4ec13ec0b.png' },
                    description: quotes[quote]
                }
            });
        } catch (err) {
            return this.container.utils.sendError(messageOrInteraction.channel, `An error occurred: \`\`\`${err}\`\`\``);
        }
    }

    async messageRun(message) {
        this.iroh(message);
    };

    async chatInputRun(interaction) {
        await interaction.deferReply();
        this.iroh(interaction);
    };
};

module.exports = { IrohQuote };