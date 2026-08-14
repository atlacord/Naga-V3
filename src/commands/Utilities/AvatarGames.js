const { Subcommand } = require('@sapphire/plugin-subcommands');

class AvatarGames extends Subcommand {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'avatargames',
            aliases: ['agames', 'ag'],
            preconditions: ['EventMaster'],
            description: 'Starts/ends Avatar Games',
            subcommands: [
                {
                    name: 'start',
                    messageRun: 'start',
                    chatInputRun: 'start'
                },
                {
                    name: 'end', 
                    messageRun: 'end',
                    chatInputRun: 'end',
                }
            ]
        });
    };
    
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
            .setName('avatargames')
            .setDescription('Starts and ends Avatar Games')
            .addSubcommand((command) => 
                command
                .setName('start')
                .setDescription('Starts Avatar Games')
            )
            .addSubcommand((command) =>
                command
                .setName('end')
                .setDescription('Ends Avatar Games')
            )
        );
    };

    async start(messageOrInteraction) {
        const channel = await this.container.resolver.channel(messageOrInteraction.guild, '709827097559826553');
        await channel.edit({ permissionOverwrites: [{ allow: 1024n, deny: 0n, type: 0, reason: 'Starting Avatar Games'}] }).then(this.container.utils.sendSuccess(messageOrInteraction.channel, 'Starting Avatar Games!'));
    };

    async end(messageOrInteraction) {
        const channel = await this.container.resolver.channel(messageOrInteraction.guild, '709827097559826553');
        await channel.edit({ permissionOverwrites: [{ allow: 0n, deny: 1024n, type: 0, reason: 'Ending Avatar Games'}] }).then(this.container.utils.sendSuccess(messageOrInteraction.channel, 'Ending Avatar Games.'));
    };
};

module.exports = { AvatarGames };