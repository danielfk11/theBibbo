const { addCoins } = require("../functions/economy");

const messageCount = {};
const lastClaimTime = {};

const messagesRequired = 15; // Quantidade de mensagens necessárias para ganhar bibboCoin
const coinsPerClaim = 1; // Quantidade de bibboCoins ganhos por claim
const claimCooldown = 60 * 10; // 10 minutos

module.exports = async (client, message) => {
    const userId = message.author.id;
    const currentTime = Math.floor(Date.now() / 1000);

    if (message.author.bot) return;

    messageCount[userId] = (messageCount[userId] || 0) + 1;

    if (messageCount[userId] >= messagesRequired) {
        const lastClaim = lastClaimTime[userId] || 0;
        const timeSinceLastClaim = currentTime - lastClaim;

        if (timeSinceLastClaim >= claimCooldown) {
            await addCoins(userId, coinsPerClaim);
  
            message.reply({ content: `Você ganhou **${coinsPerClaim}** bibboCoin por ser ativo nos canais de texto!` });
            
            messageCount[userId] = 0;
            lastClaimTime[userId] = currentTime;
        }
    }
};
