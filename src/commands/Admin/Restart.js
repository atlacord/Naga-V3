const util = require('util');
const { exec } = require('child_process');
const { Command } = require('@sapphire/framework');

class Restart extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'restart',
            aliases: ['rs'],
            description: 'Restarts the bot client',
            preconditions: ['DevOnly']
        });
    };

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
            .setName('restart')
            .setDescription('restarts the bot client')
        )
    };

    /**
     * Restarts the bot client
     * @param {Message|Interaction} msg A Message or Interaction object 
     * @returns 
     */
    async restart(msg) {
        try {
            this.container.utils.sendSuccess(msg.channel, `Restarting ${this.container.client.user.username}.`);

            process.exec(`pm2 restart Naga`, (error, stdout) => {
                const outputType = error || stdout;
                let output = outputType;
                if (typeof outputType === 'object') {
                    output = inspect(outputType, {
                        depth: Infinity
                    });
                };
            });
        } catch (err) {
            this.container.utils.sendError(msg.channel, err);
        };
    };

    async messageRun(message) {
        await this.restart(message);
    };

    async chatInputRun(interaction) {
        await this.restart(interaction);
    };
};

module.exports = { Restart };