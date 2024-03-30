const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "..", "..", "database", "database.db");
const db = new sqlite3.Database(dbPath);

/**
 * Função genérica para executar operações no banco de dados.
 * @param {string} query - Query SQL
 * @param {Array} params - Parâmetros da query
 * @returns {Promise<any>} - Resultado da operação
 */
function runQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

async function addCoins(userId, amount) {
    const query = `UPDATE economy SET money = COALESCE((SELECT money FROM economy WHERE user_id = ?), 0) + ? WHERE user_id = ?`;
    return runQuery(query, [userId, amount, userId]);
}

async function userExists(userId) {
    const query = `SELECT COUNT(*) as count FROM economy WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.count > 0);
        });
    });
}

async function addXp(userId, amount) {
    const query = `UPDATE xp SET total_xp = COALESCE((SELECT total_xp FROM xp WHERE user_id = ?), 0) + ? WHERE user_id = ?`;
    return runQuery(query, [userId, amount, userId]);
}

async function removeCoins(userId, amount) {
    const query = `UPDATE economy SET money = COALESCE((SELECT money FROM economy WHERE user_id = ?), 0) - ? WHERE user_id = ?`;
    return runQuery(query, [userId, amount, userId]);
}

function getBalance(userId) {
    const query = "SELECT money FROM economy WHERE user_id = ?";
    return new Promise((resolve, reject) => {
        db.get(query, [userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ? row.money : 0);
        });
    });
}

async function getLastClaim(userId) {
    const query = `SELECT last_claim FROM economy WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row ? row.last_claim : null);
        });
    });
}

async function updateLastClaim(userId, currentTime) {
    const query = `UPDATE economy SET last_claim = ? WHERE user_id = ?`;
    return runQuery(query, [currentTime, userId]);
}

module.exports = {
    addCoins,
    removeCoins,
    getBalance,
    getLastClaim,
    updateLastClaim,
    addXp,
    userExists
};
