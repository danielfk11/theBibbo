const sqlite3 = require("sqlite3");
const path = require("path");
const colors = require("colors")

function connectToDatabase() {
    const dbPath = path.resolve(__dirname, "..","..", "database", "database.db");

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        } else {
            console.log(colors.green('=> ') + colors.gray(' [ /・Database ] - ✅ ') + colors.cyan('database.db') + colors.gray(' Conectado com sucesso'));
        }
    });

    return db;
}

module.exports = {
    connectToDatabase: connectToDatabase
};
