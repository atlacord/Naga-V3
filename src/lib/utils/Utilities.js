const DISCORD_EPOCH = 1420070400000;

let flags = {
    "STAFF": {
        "friendly": "<:DiscordStaff:1102389679380246538> Discord Employee",
        "description": "User is a Discord employee.",
        "shift": 0,
    },
    "PARTNER": {
        "friendly": "<a:discordPartner:1006803535238811658> Discord Partner",
        "description": "User is a Discord partner.",
        "shift": 1,
    },
    "HYPESQUAD": {
        "friendly": "<:HypeSquadEvents:1102390600675901530> HypeSquad Events",
        "description": "User is a HypeSquad Events member.",
        "shift": 2,
    },
    "BUG_HUNTER_LEVEL_1": {
        "friendly": "<:BugHunterLvl1:1102390616849141762> Bug Hunter Level 1",
        "description": "User is a Bug Hunter.",
        "shift": 3,
    },
    "HYPESQUAD_ONLINE_HOUSE_1": {
        "friendly": "<:Bravery:1102389675550838824> HypeSquad Bravery",
        "description": "User is part of HypeSquad Bravery.",
        "shift": 6,
    },
    "HYPESQUAD_ONLINE_HOUSE_2": {
        "friendly": "<:Brilliance:1102389676498767894> HypeSquad Brilliance",
        "description": "User is part of HypeSquad Brilliance.",
        "shift": 7,
    },
    "HYPESQUAD_ONLINE_HOUSE_3": {
        "friendly": "<:Balance:1102389669943062611> HypeSquad Balance",
        "description": "User is a part of HypeSquad Balance.",
        "shift": 8,
    },
    "PREMIUM_EARLY_SUPPORTER": {
        "friendly": "<:EarlySupporter:1102389681024401478> Legacy Nitro Subscriber",
        "description": "User is an Early Supporter.",
        "shift": 9,
    },
    "BUG_HUNTER_LEVEL_2": {
        "friendly": "<:BugHunterLvl2:1102390618673647716> Bug Hunter Level 2",
        "description": "User has the gold Bug Hunter badge.",
        "shift": 14,
    },
    "VERIFIED_DEVELOPER": {
        "friendly": "<:VerifiedDev:1102389683520016484> Verified Bot Developer",
        "description": "User is a verified bot developer.",
        "shift": 17,
    },
    "CERTIFIED_MODERATOR": {
        "friendly": "<:DiscordModProgram:1102389678340067399> Discord Moderator Program Member",
        "description": "User is a Discord certified moderator alum.",
        "shift": 18,
    },
    "ACTIVE_DEVELOPER": {
        "friendly": "<:ActiveDev:1102389668848349264> Active Developer",
        "description": "User is an active developer. https://discord.com/developers/active-developer",
        "shift": 22,
    },
};

class Utilities {

  constructor() {
    this.invite = this.invite = /^(discord.gg\/|discordapp.com\/invite\/)([a-z0-9]+)$/gi;
  };

  /**
   * Returns a predefined color
   * @param {string} color 
   */
  getColor(color) {
      let colors = {
          red: 15747399,
          yellow: 16439902,
          green: 4437377,
          blue: 9031664,
          darkblue: 26544,
          pink: 16736378,
          discordgrey: 2632496,
          lotus: 15913095,
          whitelotus: 15458257,
          sentry: 11250431,
          daili: 5628531,
          moverstars: 54998
      };
      return colors[color];
  }

  async sendSuccess(channelOrInteraction, content) {
    const embeds = [
      { 
        color: 4437377,
        description: `<:yes:917982955362734100> ${content}`
      }
    ];

    if (channelOrInteraction.isChatInputCommand?.()) {
      if (channelOrInteraction.deferred) {
        return await channelOrInteraction.editReply({ embeds: embeds });
      } else {
        return await channelOrInteraction.reply({ embeds: embeds });
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
        return await channelOrInteraction.editReply({ embeds: embeds });
      } else {
        return await channelOrInteraction.reply({ embeds: embeds });
      }
    }

    return await channelOrInteraction.send({ embeds: embeds });
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
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

  /**
   * Escape special characters in regex
   */
  regEscape(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }


  /**
   * Returns a list of Discord user flags in a human readable format
   * @param {Number} flagNumber 
   * @returns {Array} An array of flag strings
   */
  getFlags(flagNumber) {
      let results = [];

      for (let i = 0; i <= 64; i++) {
          const bitwise = 1n << BigInt(i);
  
          if (flagNumber & parseInt(bitwise)) {
              const flag = Object.entries(flags).find((f) => f[1].shift === i)?.[0] || `UNKNOWN_FLAG_${i}`;
              if (flag !== `UNKNOWN_FLAG_${i}`) results.push(flags[flag].friendly);
          }
      }
  
      return results || "None";
  }

  /**
  * Creates a Promise that resolves after a specified duration.
  * @param {number} ms How long to wait before resolving (in milliseconds)
  * @returns {Promise<void>}
  */
  delayFor(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
  }

  convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
    const milliseconds = BigInt(snowflake) >> 22n
    return new Date(Number(milliseconds) + epoch)
  }

  validateSnowflake(snowflake, epoch) {
    if (!Number.isInteger(+snowflake)) {
      this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes contain only numbers.')
    }
  
    if (snowflake < 4194304) {
        this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes are much larger numbers.')
    }

    const timestamp = this.convertSnowflakeToDate(snowflake, epoch)

    if (Number.isNaN(timestamp.getTime())) {
        this.sendError(msg.channel, 'That doesn\'t look like a snowflake. Snowflakes have fewer digits.')
    }

    return timestamp;
  }

}

module.exports = { Utilities };