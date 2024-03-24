const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds");
const { addCoins, getBalance, getLastClaim, updateLastClaim } = require("../../functions/economy");

module.exports = {
    name: "trabalhar",
    description: "Trabalhar para ganhar bibboCoins",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const userId = interaction.user.id;
        
        try {
            const balance = await getBalance(userId);
            const currentTime = Date.now();
    
            const lastClaim = await getLastClaim(userId);
    
            if (lastClaim && currentTime - lastClaim < 24 * 60 * 60 * 1000) {
                const remainingTime = 24 * 60 * 60 * 1000 - (currentTime - lastClaim);
                const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
                const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
                
                const errorEmbed = new EmbedBuilder()
                    .setDescription(`\`\`⏳\`\` *Você só pode executar este comando novamente em ${remainingHours} horas e ${remainingMinutes} minutos.*`)
                    .setColor(config.EmbedColor);
    
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
    
            const earnings = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
    
            await addCoins(userId, earnings);
            await updateLastClaim(userId, currentTime);
    
            const embed = new EmbedBuilder()
                .setDescription(`\`\`💼\`\` *Você trabalhou e ganhou ${earnings} bibboCoins!*`)
                .setColor(config.EmbedColor);
    
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Erro ao processar comando "trabalhar":', error);
            await interaction.reply({ embeds: [embeds.embed_erro], ephemeral: true });
        }
    }
};
