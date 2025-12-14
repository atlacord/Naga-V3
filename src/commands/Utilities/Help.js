const { Command } = require('@sapphire/framework');

class Help extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'help',
      description: 'Show all commands or specific information about a command.',
      detailedDescription: {
        usage: ['n.help', 'n.help [command]']
      }
    });
  }

  async hasPermission(message, command) {
    const result = await command.preconditions.messageRun(message, command, { message, command });
    return result.isOk();
  }

  sortObjectByKey(obj) {
    return Object.keys(obj)
      .sort()
      .reduce((accumulator, key) => ({ ...accumulator, [key]: obj[key] }), {});
  }

  async messageRun(message, args) {
    let commandName = (await args.pick('string').catch(() => null))?.toLowerCase();

    if (!commandName) {
      this.allCommands(message);
    } else {
      this.specificCommand(message, commandName.toLowerCase());
    }
  }

  async allCommands(message) {
    const commands = this.container.stores.get('commands');
    const allCommands = {};

    for (const [name, command] of commands) {
      const hasPermission = await this.hasPermission(message, command);

      if (hasPermission) {
        const category = command.fullCategory[0];
        if (!allCommands[category]) allCommands[category] = [];
        allCommands[category].push(name);
      }
    }

    const sortedCommands = this.sortObjectByKey(allCommands);

    const fields = [];

    for (const [category, commands] of Object.entries(sortedCommands)) {
      fields.push({ name: category, value: commands.join(', ')});
    }

    const allCommandsEmbed = {
      color: 9031664,
      author: {
        name: `All Commands for Naga`,
        iconURL: this.container.client.user.displayAvatarURL()
      },
      description: 'You can only view commands you have permission to use. To see more information about a command, do `n.help [command]`.',
      fields: fields
    };

    await message.channel.send({ embeds: [allCommandsEmbed] });
  }

  async specificCommand(message, commandName) {
    const command = this.container.stores.get('commands').get(commandName);
    if (!command) return;

    const hasPermission = await this.hasPermission(message, command);
    if (!hasPermission) return;

    const embedDescription = [];

    embedDescription.push(command.description ? `**Description:** ${command.description}` : 'None.');

    if (command.aliases && command.aliases.length > 0) embedDescription.push(`**Aliases:** ${command.aliases.join(', ')}`);

    if (command.detailedDescription && Object.keys(command.detailedDescription).length > 0) {
      for (let [name, description] of Object.entries(command.detailedDescription)) {
        const capitalizedName = name[0].toUpperCase() + name.slice(1);
        if (Array.isArray(description)) description = description.join(', ');
        embedDescription.push(`**${capitalizedName}:** ${description}`);
      }
    }

    const commandEmbed = {
      color: 9031664, 
      author: {
        name: `Help for ${commandName}`,
        iconURL: this.container.client.user.displayAvatarURL()
      },
      description: embedDescription.join('\n')
    };

    await message.channel.send({ embeds: [commandEmbed] });
  }
}

module.exports = { Help };