const dotenv = require('dotenv');
const Discord = require("discord.js");
const eventos = require('./src/base/events')
const { connectToDatabase } = require('./src/functions/databaseConnect.js');
const registerSlashCommands = require('./src/functions/registerSlashCommands.js');

dotenv.config();

const client = new Discord.Client({
  intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.MessageContent,
      Discord.GatewayIntentBits.GuildMembers,
  ],
});


registerSlashCommands(client);
eventos(client);
const db = connectToDatabase();


process.on('multipleResolutions', (type, reason, promise) => {
  console.log(`🚫 Erro Detectado\n\n` + type, promise, reason)
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(`🚫 Erro Detectado:\n\n` + reason, promise)
});

process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});

process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.log(`🚫 Erro Detectado:\n\n` + error, origin)
});


client.login(process.env.DISCORD_TOKEN);
