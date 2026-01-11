const { Listener } = require('@sapphire/framework');

class ShowLoadedInteractionHandlers extends Listener {
  constructor(context, options) {
    super(context, {
      ...options, 
      once: true,
      event: 'modelsCreated'
    });
  }

  run() {
    const interactionHandlers = this.container.stores.get('interaction-handlers');

    if (interactionHandlers.length != 0) {
      this.container.logger.info('Loading interaction handlers...');

      for (const [handlerName, handler] of interactionHandlers) {
        if (handler.enabled) this.container.logger.info(`+ Loaded ${handlerName}`);
      }
    }
    this.container.client.emit('startupTaskCompleted', 'showLoadedInteractionHandlers');
  }
}

module.exports = { ShowLoadedInteractionHandlers };