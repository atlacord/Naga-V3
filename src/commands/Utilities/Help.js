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

  insertPrefixAndCommandName(string, commandName) {
    return string.replace('$command', `${this.container.prefix}${commandName}`);
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

    Object.values(allCommands).forEach((c) => c.sort());

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
      description: `You can only view commands you have permission to use. To see more information about a command, do \`${this.container.prefix}help [command]\`.`,
      fields: fields
    };

    await message.channel.send({ embeds: [allCommandsEmbed] });
  }

  async specificCommand(message, commandName) {
    const commandStore = this.container.stores.get('commands');

    const command = commandStore.find(c => c.name === commandName || c.aliases.includes(commandName));

    if (!command) return;

    const hasPermission = await this.hasPermission(message, command);
    if (!hasPermission) return;

    const fields = [];

    if (command.aliases && command.aliases.length > 0) fields.push({ name: 'Aliases', value: command.aliases.join(', ') });

    if (command.detailedDescription && Object.keys(command.detailedDescription).length > 0) {
      for (let [name, description] of Object.entries(command.detailedDescription)) {
        const capitalizedName = name[0].toUpperCase() + name.slice(1);

        if (Array.isArray(description)) description = description.join(', ');

        fields.push({ name: capitalizedName, value: this.insertPrefixAndCommandName(description, command.name) });
      }
    }

    const commandEmbed = {
      color: 9031664, 
      author: {
        name: `Help for ${command.name}`,
        iconURL: this.container.client.user.displayAvatarURL()
      },
      description: this.insertPrefixAndCommandName(command.description, command.name),
      fields: fields
    };

    await message.channel.send({ embeds: [commandEmbed] });
  }
}

module.exports = { Help };