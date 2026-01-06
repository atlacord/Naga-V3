const { SapphireClient, container, LogLevel } = require('@sapphire/framework');
const { GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');

require('@sapphire/plugin-logger/register');
require('dotenv').config({ path: __dirname + '/.env' });

mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => container.logger.info(`Successfully connected to database!`))
  .catch((err) => console.error(err));

// Check for required environment variables

if (!process.env.TOKEN) {
  console.error('You need to have a bot token!');
  process.exit(1);
}

if (!process.env.DB_CONNECTION_STRING) {
  console.error('You need to have a database connection string!');
  process.exit(1);
}

// Set prefixes

container.prefix = process.env.PREFIX || 'n.';
container.devPrefix = process.env.DEV_PREFIX || '$';

// Set log level

let logLevel;
switch (process.env.LOG_LEVEL?.toLowerCase()) {
  case 'trace':
    logLevel = LogLevel.Trace;
    break;
  case 'debug':
    logLevel = LogLevel.Debug;
    break;
  case 'warn': 
    logLevel = LogLevel.Warn;
    break;
  case 'error':
    logLevel = LogLevel.Error;
    break;
  case 'fatal': 
    logLevel = LogLevel.Fatal;
    break;
  default:
    logLevel = LogLevel.Info;
    break;
}

// Create client

const client = new SapphireClient({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  loadMessageCommandListeners: true,
  fetchPrefix: (message) => {
    if (container.developers.includes(message.author.id)) return [container.devPrefix, container.prefix];
    return container.prefix;
  },
  logger: {
    level: logLevel
  }
});

client.login(process.env.TOKEN);