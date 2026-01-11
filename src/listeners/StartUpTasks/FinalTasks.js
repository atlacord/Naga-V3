const { Listener } = require('@sapphire/framework');

const fs = require('fs');

const excludedFiles = ['FinalTasks.js'];

const files = fs
  .readdirSync(__dirname)
  .filter(file => !excludedFiles.includes(file));

const TASK_AMOUNT = files.length;

class FinalTasks extends Listener {
  constructor(context, options) {
      super(context, { 
        ...options,
        event: 'startupTaskCompleted' 
      });

      this.completedTasks = new Set();
  }

  run(taskName) {
    this.completedTasks.add(taskName);

    if (this.completedTasks.size === TASK_AMOUNT) {
      const { username, id } = this.container.client.user;
      this.container.logger.info(`Successfully logged in as ${username} (${id})`);
    }
  }
}

module.exports = { FinalTasks }
