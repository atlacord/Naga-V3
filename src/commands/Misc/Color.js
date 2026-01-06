const { Command } = require('@sapphire/framework');
const axios = require('axios');

const HEX_REGEX = /^#?[0-9a-fA-F]{6}$/;

class Color extends Command {
  constructor(context, options) {
    super(context, {
      ...options, 
      name: 'color',
      aliases: ['colour'],
      description: 'Display a color. Displays a random color if one isn\'t provided.',
      detailedDescription: {
        'Command Forms and Arguments': '`n.color [hex code / random]`\n' + 
                                       '**Hex Code:** A standard hex code\n' +
                                       '**Random:** A random color'
      },
    });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('color')
        .setDescription('colors')
        .addStringOption((option) =>
          option
            .setName('hex')
            .setDescription('A hex code')
            .setRequired(false)
        )
        .addBooleanOption((option) => 
          option
            .setName('random')
            .setDescription('A random color')
            .setRequired(false)
        )
    )
  }

  hextoRGB(hex) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
  }

  random() {
    let int = (Math.random() * (1 << 24) | 0)
    let color = {
      integer: int,
      hex: ('00000' + int.toString(16)).slice(-6),
      rgb: [(int & 0xff0000) >> 16, (int & 0x00ff00) >> 8, (int & 0x0000ff)]
    }
    return color;
  }

  /**
   * Fetches color information from API
   * @param {String} color A color hex code
   * @returns 
   */
  async requestColor(color) {
    if (!color.match(HEX_REGEX)) color = 'random';
    if (color === 'random') color = this.random().hex;
    let colorObj = {
      name: null,
      hex: color || null,
      integer: null,
      rgb: this.hextoRGB(color),
      preview: null,
    };

    colorObj.integer = parseInt(`0x${colorObj.hex}`)
    colorObj.preview = `http://placehold.it/300x300.png/${colorObj.hex}/000000&text=%E2%80%8B`;

    await axios.all([axios.get(`https://www.thecolorapi.com/id?hex=${color}`)]).then(res => {
      colorObj.name = res[0].data.name.value;
      colorObj.preview = res[0].data.image.bare;
    });

    return colorObj;
  };

  buildEmbed(color) {
    let embed = {
      title: 'Color',
      color: color.integer || 0,
      thumbnail: { url: color.preview },
      fields: [
          { name: 'Name', value: color.name, inline: false },
          { name: 'Hex', value: color.hex, inline: false },
          { name: 'RGB', value: color.rgb.join(', '), inline: false }
      ],
    }
    return embed;
  }

  async messageRun(message, args) {
    let colorArg = await args.pick('string').catch(() => null) || this.random().hex;

    try {
      let color = await this.requestColor(colorArg);
      let embed = this.buildEmbed(color);

      message.channel.send({ embeds: [embed] })
    } catch(err) {
        console.error(err);
    }
  }
  
  async chatInputRun(interaction) {
    const colorArg = interaction.options.getString('hex');
    const isRandom = interaction.options.getBoolean('random');

    let color = colorArg || this.random().hex;
    if (isRandom) color = this.random().hex;

    await interaction.deferReply();

    try {
      color = await this.requestColor(color);
      let embed = this.buildEmbed(color);

      return interaction.editReply({embeds: [embed]});
    } catch (err) {
      console.error(err);
      interaction.editReply(`An error occurred: \`\`\`${err}\`\`\``)
    }
  }
}

module.exports = { Color };