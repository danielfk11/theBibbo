const Discord = require('discord.js')
const config = require("../../config.json")
const sqlite3 = require('sqlite3').verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "..","..", "database", "database.db");
const db = new sqlite3.Database(dbPath)

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

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS servidores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guild_id TEXT,
            dono_id TEXT,
            canal_logs_id TEXT
        )`);
    });
}