const sqlite3 = require("sqlite3");
const path = require("path");
const colors = require("colors");

function createDatabase() {
    const dbPath = path.resolve(__dirname, "..", "..", "database", "database.db");
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='servidores'", (err, row) => {
            if (err) {
                console.error(`${colors.red("-> ")} ${colors.gray("[ /・Database ] - ❌ ")} ${colors.cyan(`Erro ao verificar tabela: ${err.message}`)}`);
                return;
            }

            if (row) {
                console.log(`${colors.green("-> ")} ${colors.gray("[ /・Database ] - ✅ ")} ${colors.cyan(`Tabela "SERVIDORES" já existe`)}`);
                return;
            }

            db.run(`CREATE TABLE servidores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT,
                dono_id TEXT,
                canal_logs_id TEXT
            )`, function(err) {
                if (err) {
                    console.error(`${colors.red("-> ")} ${colors.gray("[ /・Database ] - ❌ ")} ${colors.cyan(`Erro ao criar tabela: ${err.message}`)}`);
                } else {
                    console.log(`${colors.green("-> ")} ${colors.gray("[ /・Database ] - ✅ ")} ${colors.grey(`Tabela "SERVIDORES" criada com sucesso`)}`);
                }
            });
        });
    });
}

module.exports = { createDatabase: createDatabase };
