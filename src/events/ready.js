const Discord = require('discord.js')
const config = require("../../config.json")

/**
 * @param {Discord.Client} client 
 */

module.exports = async (client, message) => {

    let activities = [
        `www.nine9company.com.br`,
        `🤖 Operando | ${config.NomeDoServidor}`,
        `💻 Monitorando | ${client.guilds.cache.size}`,
    ];
        i = 0;
    setInterval(() => client.user.setActivity({
        name: `${activities[i++ % activities.length]}`,
        type: Discord.ActivityType.Watching
    }), 10000);

    client.user.setStatus("online");
}