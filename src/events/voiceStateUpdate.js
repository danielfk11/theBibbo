const { EmbedBuilder } = require("discord.js");
const path = require("path");
const sqlite3 = require("sqlite3");
const dbPath = path.resolve(__dirname, "..", "..", "database", "database.db");
const db = new sqlite3.Database(dbPath);
const { addCoins, getBalance, getLastClaim, updateLastClaim, addXp } = require("../functions/economy");

module.exports = async (client, newState, oldSatate) => {

    const usersInVoice = new Map()
  
    const userId = newState.member.user.id;
    const userChannel = newState.channel;

    if (userChannel) {
      usersInVoice.set(userId, Date.now());
    } else {
      if (usersInVoice.has(userId)) {

        const startTime = usersInVoice.get(userId);
        const elapsedTime = Date.now() - startTime;
        const timeInMinutes = Math.floor(elapsedTime / 60000);

        const xpGanho = timeInMinutes * 10;

        addCoins(userId, xpGanho);
        usersInVoice.delete(userId);
        const user = newState.member.user;

        if (timeInMinutes <= 0) {
          return;
        } else {
          let embed0 = new EmbedBuilder()
            .setTitle(`***PARABÉNS***`)
            .setColor(`#2f3136`)
            .setDescription(`Você ganhou **${coinsGanhos}** coins por ficar **${timeInMinutes}** minuto(s) em uma chamada de voz!`)

          user.send({ embeds: [embed0] }).catch(error => {

            if (error.code === 50007) {
              return;
            } else {
              return;
            }
          })

        }
      }
    }
  }
