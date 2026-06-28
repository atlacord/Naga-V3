const { Command, Resolvers } = require('@sapphire/framework');
const axios = require('axios');

class Dog extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'dog',
            aliases: ['puppy', 'doggo', 'twodog' ],
            description: 'Sends a cute puppy.',
            detailedDescription: {
                'Command Forms and Arguments': 'n.dog'
            }
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
        .setName('dog')
        .setDescription('Sends a cute puppy')
        )
    };

    async dog(messageOrInteraction) {
        try {
            await axios.all([axios.get(`https://dog.ceo/api/breeds/image/random`)]).then(res => {
                var curl = res[0].data.message;

                this.container.utils.sendMessage(messageOrInteraction.channel, {
                    embed: {
                        color: this.utils.getColor('darkblue'),
                        description: `**Found an adorable doggo!**`,
                        image: { 
                            url: curl 
                        }
                    }
                });
            });
        } catch (err) {
            return this.container.utils.sendError(messageOrInteraction.channel, `An error occurred: \`\`\`${err}\`\`\``);
        }
    }

    async messageRun(message) {
        this.dog(message);
    };

    async chatInputRun(interaction) {
        await interaction.deferReply();
        this.dog(interaction);
    };
};

module.exports = { Dog };