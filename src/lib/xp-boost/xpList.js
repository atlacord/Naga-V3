const Server = require('../../models/Server');
const validateEntity = require('./validateEntity');

module.exports = async function list(messageOrInteraction) {
  const fields = [];
      
  const doc = await Server.findById(messageOrInteraction.guild.id);

  const roles = [];

  for (const [id, multiplier] of doc.data.xpBoost.roles) {
    const role = await validateEntity(id, messageOrInteraction.guild);
    const multiplierPercent = Math.trunc(multiplier * 100 - 100);

    roles.push(`${role.name} (\`${role.id}\`): ${multiplierPercent}%`);
  }

  if (roles.length != 0) {
    fields.push({ name: 'Roles', value: roles.join('\n') });
  }

  const channels = [];

  for (const [id, multiplier] of doc.data.xpBoost.channels) {
    const channel = await validateEntity(id, messageOrInteraction.guild);
    const multiplierPercent = Math.trunc(multiplier * 100 - 100);

    channels.push(`${channel.name} (\`${channel.id}\`): ${multiplierPercent}%`);
  }

  if (channels.length != 0) {
    fields.push({ name: 'Channels', value: channels.join('\n')});
  }

  const ignoredChannels = [];
  
  for (const id of doc.data.xpBoost.ignoredChannels) {
    const channel = await validateEntity(id, messageOrInteraction.guild);

    ignoredChannels.push(`${channel.name} (\`${channel.id}\`)`);
  }

  if (ignoredChannels.length != 0) {
    fields.push({ name: 'Ignored Channels', value: ignoredChannels.join('\n') });
  }

  let embed;

  if (fields.length === 0) {
    embed = { description: 'There is nothing in the database!'};
  } else {
    embed = { fields: fields };
  }

  messageOrInteraction.reply({ embeds: [embed], allowedMentions: { parse: [] } });
}