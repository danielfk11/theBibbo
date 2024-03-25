const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "..", "..", "database", "database.db");
const db = new sqlite3.Database(dbPath);

async function addCoins(userId, amount) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE economy SET money = COALESCE((SELECT money FROM economy WHERE user_id = ?), 0) + ? WHERE user_id = ?`,
            [userId, amount, userId],
            function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            }
        );
    });
}

async function addXp(userId, amount) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE xp SET total_xp = COALESCE((SELECT total_xp FROM xp WHERE user_id = ?), 0) + ? WHERE user_id = ?`,
            [userId, amount, userId],
            function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            }
        );
    });
}

async function removeCoins(userId, amount) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE economy SET money = COALESCE((SELECT money FROM economy WHERE user_id = ?), 0) - ? WHERE user_id = ?`,
            [userId, amount, userId],
            function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            }
        );
    });
}

/**
 * Função para obter o saldo de um usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise<number>} - Saldo do usuário
 */
function getBalance(userId) {
    return new Promise((resolve, reject) => {
        const query = "SELECT money FROM economy WHERE user_id = ?";
        
        db.get(query, [userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (row) {
                resolve(row.money);
            } else {
                resolve(0);
            }
        });
    });
}


async function getLastClaim(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT last_claim FROM economy WHERE user_id = ?`,
            [userId],
            (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row ? row.last_claim : null);
            }
        );
    });
}

/**
 * Atualiza o último momento em que um usuário utilizou o comando "trabalhar".
 * @param {string} userId - ID do usuário
 * @param {number} currentTime - Tempo atual
 * @returns {Promise<boolean>}
 */
async function updateLastClaim(userId, currentTime) {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE economy SET last_claim = ? WHERE user_id = ?`,
            [currentTime, userId],
            function (err) {
                if (err) {
                    console.error('Erro ao atualizar last_claim:', err);
                    reject(err);
                    return;
                }
                resolve(true);
            }
        );
    });
}





module.exports = {
    addCoins,
    removeCoins,
    getBalance,
    getLastClaim,
    updateLastClaim,
    addXp
};
