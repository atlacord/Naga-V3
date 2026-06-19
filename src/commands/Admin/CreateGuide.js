const { Command } = require('@sapphire/framework');
const home = require('../../lib/guide/Home');

class CreateGuide extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'createguide',
      aliases: ['guide'],
      description: 'Recreates the guide component if it is deleted',
      detailedDescription: { usage: ['n.createguide'] },
      preconditions: ['Admin']
    });
  }

  async messageRun(message, args) {
    const client = this.container.client;
    let channel = await client.channels.cache.get('1053064927935467530');
    let msg = await channel.messages.fetch('1066847898748338226');
    await msg.edit(home);
  }
}

module.exports = { CreateGuide };