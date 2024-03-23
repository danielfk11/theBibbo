const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds");
const { addCoins, getBalance, updateLastClaim, getLastClaim } = require("../../functions/economy");


//EDITAR DANNY(NAO TESTADO)

module.exports = {
    name: "trabalhar",
    description: "Trabalhar para ganhar bibboCoins",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        try {
            const balance = await getBalance(userId);
            const currentTime = Date.now();

            const lastClaim = await getLastClaim(userId); 
            if (lastClaim && (currentTime - lastClaim < 86400000)) {
                const timeLeft = new Date(86400000 - (currentTime - lastClaim));
                let hours = timeLeft.getUTCHours();
                let minutes = timeLeft.getUTCMinutes();
                let seconds = timeLeft.getUTCSeconds();

                let timeString = `${hours}h ${minutes}m ${seconds}s`;

                let cooldownEmbed = new EmbedBuilder()
                    .setDescription(`\`\`⏳\`\` **Você já trabalhou recentemente! Tente novamente em ${timeString}.**`)
                    .setColor(config.EmbedColor);

                await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                return;
            }

            const earnings = 100;

            await addCoins(userId, earnings);
            await updateLastClaim(userId);

            let embed = new EmbedBuilder()
                .setDescription(`\`\`💼\`\` **Você trabalhou e ganhou ${earnings / 100} bibboCoins!**`)
                .setColor(config.EmbedColor);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Erro ao processar comando "trabalhar":', error);
            let errorEmbed = new EmbedBuilder()
                .setDescription(`\`\`❌\`\` **Erro ao processar comando "trabalhar".**`)
                .setColor(config.EmbedColor);

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
