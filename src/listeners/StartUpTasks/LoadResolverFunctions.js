const { Listener } = require('@sapphire/framework');

class LoadResolverFunctions extends Listener {
  constructor(context, options) {
    super(context, {
      ...options, 
      once: true,
      event: 'applicationCommandRegistriesRegistered'
    });
  }

  run() {
    this.container.logger.info('Loading all resolver functions...')

    const { Resolver } = require('../../lib/utils/Resolver');
    this.container.resolver = new Resolver();

    this.container.logger.info('+ Loaded all resolver functions');

    this.container.client.emit('startupTaskCompleted', 'loadResolverFunctions');
  }
}

module.exports = { LoadResolverFunctions };