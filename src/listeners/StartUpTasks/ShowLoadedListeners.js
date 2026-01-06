const { Listener } = require('@sapphire/framework');

class ShowLoadedListeners extends Listener {
  constructor(context, options) {
    super(context, {
      ...options, 
      once: true,
      event: 'modelsCreated'
    });
  }

  run() {
    const listenerStore = [...this.container.stores.get('listeners')];
    const nonCoreListeners = listenerStore.filter(([name]) => !name.startsWith('Core'));
    const nonStartUpTaskListeners = nonCoreListeners.filter(([_, listener]) => listener.location.directories[0] != 'StartUpTasks');

    if (nonStartUpTaskListeners.length != 0) {
      this.container.logger.info('Loading listeners...');

      for (const [listenerName, listener] of nonStartUpTaskListeners) {
        if (listener.enabled) this.container.logger.info(`+ Loaded ${listenerName}`);
      }
    }

    this.container.client.emit('startupTaskCompleted', 'showLoadedListeners');
  }
}

module.exports = { ShowLoadedListeners };