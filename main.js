const dotenv = require('dotenv');
const Discord = require("discord.js");
const eventos = require('./src/base/events')
const commandHandler = require('./src/controller/commandHandler.js');
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
connectToDatabase();

client.on('messageCreate', (message) => {
  commandHandler.handleCommandMention(client, message);
});

process.on('multipleResolutions', (type, reason, promise) => {
  console.log(`🚫 Erro Detectado em multipleResolutions:\n\n`, reason.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(`🚫 Erro Detectado em unhandledRejection:\n\n`, reason.stack);
});

process.on('uncaughtException', (error, origin) => {
  console.log(`🚫 Erro Detectado em uncaughtException:\n\n`, error.stack);
});

process.on('uncaughtExceptionMonitor', (error, origin) => {
  console.log(`🚫 Erro Detectado em uncaughtExceptionMonitor:\n\n`, error.stack);
});

client.login(process.env.DISCORD_TOKEN);