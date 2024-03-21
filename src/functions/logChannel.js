const sqlite3 = require("sqlite3");
const path = require("path");

function getLogsChannelId(guildId, callback) {
    const dbPath = path.resolve(__dirname, "..", "..", "database", "database.db");
    const db = new sqlite3.Database(dbPath);

    const getLogsChannelQuery = `SELECT canal_logs_id FROM servidores WHERE guild_id = ?`;

    db.get(getLogsChannelQuery, [guildId], (err, row) => {
        if (err) {
            console.error("Erro ao obter o ID do canal de logs do servidor:", err.message);
            callback(err, null);
            return;
        }

        if (row && row.canal_logs_id) {
            callback(null, row.canal_logs_id);
        } else {
            callback(null, null);
        }
    });
}

module.exports = { getLogsChannelId: getLogsChannelId };
