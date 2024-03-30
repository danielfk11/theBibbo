const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds");
const { getBalance, userExists } = require("../../functions/economy");

module.exports = {
    name: "consultar",
    description: "Consultar saldo de bibboCoins",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro',
            description: 'Insira o id do membro para consultar o saldo (deixe em branco para consultar o seu próprio saldo)',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const targetId = interaction.options.getUser('membro')?.id || interaction.user.id; 

        try {
            const exists = await userExists(targetId);

            if (!exists) {
                let embed = new EmbedBuilder()
                    .setDescription(`\`\`❌\`\` *O membro <@${targetId}> não existe no banco de dados.*`)
                    .setColor(config.EmbedColor);

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const balance = await getBalance(targetId);

            const balanceDisplay = balance.toFixed(2); 

            let embed = new EmbedBuilder()
                .setDescription(`\`\`💰\`\` *Saldo de bibboCoins de <@${targetId}> é: ${balanceDisplay}*`)
                .setColor(config.EmbedColor);

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Erro ao consultar saldo:', error);
            await interaction.reply({ embeds: [embeds.embed_erro], ephemeral: true });
        }
    }
};
