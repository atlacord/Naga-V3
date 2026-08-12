const util = require('util');
const { Command } = require('@sapphire/framework');

class Eval extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'eval',
            aliases: ['e'],
            description: 'Evaluates JavaScript code',
            preconditions: ['DevOnly']
        });
    };

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
            .setName('eval')
            .setDescription('Evaluates JavaScript code')
            .addStringOption((option) =>
            option
            .setName('code')
            .setDescription('JavaScript code to evaluate')
            .setRequired(true)
            )
        )
    };

    /**
     * @param {String} evalString
     */
    cleanUpToken(evalString) {
        return evalString.replace(new RegExp(this.container.client.token, 'g'), 'ur mom');
    };

    /**
     * @param {import('eris').TextableChannel} channel
     * @param {String} content
     * @param {String} lang
     */
    sendCode(channel, content, lang = 'js') {
        return this.sendMessage(channel, {
            embed: {
                color: this.utils.getColor('green'),
                author: {
                    name: 'Eval Result',
                },
                description: `\`\`\`${lang}\n${content}\`\`\``
            }
        });
    };

    /**
     * Evals JavaScript code
     * @param {Message|Interact} msg Message or Interaction object
     * @param {string} args JavaScript code to evaluate
     * @returns 
     */
    async evaluate(msg, args) {
        let evalString;
        try {
            evalString = await eval(args.join(' '));

            if (typeof evalString === 'object') {
                evalString = util.inspect(evalString, { depth: 0, showHidden: true });
            } else {
                evalString = String(evalString);
            };

            evalString = this.cleanUpToken(evalString);

            if (evalString.length === 0) {
                return this.container.utils.sendError(msg.channel, 'Please provide something to eval.');
            };

            const splitEvaled = evalString.match(/[\s\S]{1,1900}[\n\r]/g) || [evalString];

            if (splitEvaled.length > 3) {
                this.container.utils.sendMessage(msg.channel, `Cut the response! [3/${splitEvaled.length} | ${evalString.length} characters]`);
            };

            for (i of splitEvaled) {
                this.parseConstructorPreConditionsRequiredUserPermissions(msg.channel, i);
            };
        } catch (err) {
            this.container.utils.sendError(msg.channel, err);
        };
    };

    async messageRun(message, args) {
        const evalValue = await args.pick('string').catch(() => null); 
        await this.evaluate(message, evalValue);
    };

    async chatInputRun(interaction) {
        const evalValue = interaction.options.getString('eval');
        await this.evaluate(interaction, evalValue);
    };
};

module.exports = { Eval };