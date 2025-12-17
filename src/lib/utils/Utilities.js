class Utilities {
  async sendSuccess(channelOrInteraction, content) {
    const embeds = [
      { 
        color: 4437377,
        description: `<:yes:917982955362734100> ${content}`
      }
    ];

    if (channelOrInteraction.isChatInputCommand?.()) {
      if (channelOrInteraction.deferred) {
        return await interaction.editReply({ embeds: embeds });
      } else {
        return await interaction.reply({ embeds: embeds });
      }
    }

    return await channelOrInteraction.send({ embeds: embeds });
  }

  async sendError(channelOrInteraction, content) {
    const embeds = [
      {
        color: 15747399,
        description: `<:no:917982868922335272> ${content}`
      }
    ];

    if (channelOrInteraction.isChatInputCommand?.()) {
      if (channelOrInteraction.deferred) {
        return await interaction.editReply({ embeds: embeds });
      } else {
        return await interaction.reply({ embeds: embeds });
      }
    }

    return await channelOrInteraction.send({ embeds: embeds });
  }

  hexToRgb(hex) {
    const num = parseInt(hex.replace('#', ''), 16);
    return [
      num >> 16,
      (num >> 8) & 255,
      num & 255,
    ];
  }

  rgbToHex(red, green, blue) {
    return ( (blue | (green << 8) | (red << 16) ) | (1 << 24) ).toString(16).slice(1);
  }

  hexToInteger(hex) {
    return parseInt(hex.replace('#', ''), 16);
  }

  integerToHex(int) {
    const num = parseInt(int, 10);
    return `#${num.toString(16).padStart(6, '0')}`;
  }
}

module.exports = { Utilities };