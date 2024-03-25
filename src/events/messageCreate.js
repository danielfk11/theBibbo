const { addCoins, getBalance, getLastClaim, updateLastClaim, addXp } = require("../functions/economy");

module.exports = async (client, message) => {

  const userId = message.author.id

    if (message.author.bot) return;

    if (userMessages = 1) {

      const totalXp = '100'

   addXp(userId, totalXp)
      
      message.reply({ content: `Você ganhou **1000** coins por ser ativo nos canais de texto!` }).then(() => {
      })
    }
  }