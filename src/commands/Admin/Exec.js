const util = require('util');
const { exec } = require('child_process');
const { Command } = require('@sapphire/framework');

class Exec extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'exec',
            aliases: ['exe'],
            description: 'Executes shell commands',
            preconditions: ['DevOnly']
        });
    };

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
            .setName('exec')
            .setDescription('Executes shell commands')
            .addStringOption((option) =>
            option
            .setName('command')
            .setDescription('A terminal command')
            .setRequired(true)
            )
        )
    };

    /**
     * @param {import('eris').TextableChannel} channel
     * @param {String} content
     * @param {String} lang
     */
    sendCode(channel, content, lang = 'js', options = {}) {
        let msg = `\`\`\`${lang}\n${message}\`\`\``;
        if (options.header) {
            msg = `${options.header}\n${msg}`;
        }
        if (options.footer) {
            msg = `${msg}\n${options.footer}`;
        }
        return this.container.utils.sendMessage(channel, msg, options);
    };

    /**
     * @param {import('axoncore').CommandEnvironment} env
     */
    exec(command) {
		return new Promise((resolve, reject) => {
			exec(command, (err, stdout, stderr) => {
				if (err) return reject(err);
				return resolve(stdout || stderr);
			});
		});
    };

    /**
     * Executes shell commands
     * @param {Message} msg
     * @param {string} command 
     * @returns 
     */
    async execute(msg, command) {
        try {
            let result = await this.exec(command);
            return this.sendCode(msg.channel, result, 'js');
        } catch (err) {
            this.container.utils.sendError(msg.channel, err);
        };
    };

    async messageRun(message, args) {
        const command = await args.pick('string').catch(() => null); 
        await this.execute(message, command);
    };

    async chatInputRun(interaction) {
        const command = interaction.options.getString('command');
        await this.execute(interaction, command);
    };
};

module.exports = { Exec };