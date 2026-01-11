const { Listener } = require('@sapphire/framework');

class ShowLoadedCommands extends Listener {
  constructor(context, options) {
    super(context, {
      ...options, 
      once: true,
      event: 'modelsCreated'
    });
  }

  run() {
    const commands = this.container.stores.get('commands').values();

    if (commands.length != 0) {
      this.container.logger.info('Loading commands...');

      for (const command of commands) {
        if (command.enabled) this.container.logger.info(`+ Loaded ${command.name}`);
      }
    }

    this.container.client.emit('startupTaskCompleted', 'showLoadedCommands');
  }
}

module.exports = { ShowLoadedCommands };