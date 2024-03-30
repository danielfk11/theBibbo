const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds");
const { addCoins, removeCoins, getBalance, userExists } = require("../../functions/economy");
const { getLogsChannelId } = require("../../functions/logChannel");

module.exports = {
    name: "doar",
    description: "Doar bibboCoins para outro membro",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro',
            description: 'Insira o id do membro!',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'quantidade',
            description: 'Insira a quantidade de bibboCoins que quer enviar',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],

    run: async (client, interaction) => {
        const senderId = interaction.user.id;
        const receiverId = interaction.options.getUser('membro').id;
        const amount = interaction.options.getNumber('quantidade'); 
        const amountDisplay = amount.toFixed(2); 

        const guildId = interaction.guild.id;

        getLogsChannelId(guildId, async (err, channelId) => {
            if (err) {
                console.error("Erro ao obter o ID do canal de logs:", err.message);
            }

            let embed = new EmbedBuilder()
                .setDescription(`\`\`✅\`\` *Sucesso, <@${senderId}> doou ${amountDisplay} bibboCoins para <@${receiverId}> com sucesso.*`)
                .setColor(config.EmbedColor);

            const qntInv = new EmbedBuilder()
                .setDescription(`\`\`❌\`\` *Quantidade inválida de bibboCoins.*`)
                .setColor(config.EmbedColor);

            const semQnt = new EmbedBuilder()
                .setDescription(`\`\`❌\`\` *Você não possui bibboCoins suficientes.*`)
                .setColor(config.EmbedColor);

            const userNotInDB = new EmbedBuilder()
                .setDescription(`\`\`❌\`\` *O usuário <@${receiverId}> não está registrado no banco de dados.*`)
                .setColor(config.EmbedColor);

            const cantTransferToSelf = new EmbedBuilder()
                .setDescription(`\`\`❌\`\` *Você não pode transferir bibboCoins para si mesmo.*`)
                .setColor(config.EmbedColor);

            if (senderId === receiverId) {
                await interaction.reply({ embeds: [cantTransferToSelf], ephemeral: true });
                return;
            }

            if (amount <= 0) {
                await interaction.reply({ embeds: [qntInv], ephemeral: true });
                return;
            }

            try {
                const senderBalance = await getBalance(senderId);

                if (senderBalance < amount) {
                    await interaction.reply({ embeds: [semQnt], ephemeral: true });
                    return;
                }

                const receiverExists = await userExists(receiverId);

                if (!receiverExists) {
                    await interaction.reply({ embeds: [userNotInDB], ephemeral: true });
                    return;
                }

                await removeCoins(senderId, amount);
                await addCoins(receiverId, amount);

                if (channelId) {
                    const logsChannel = interaction.guild.channels.cache.get(channelId);
                    await logsChannel.send({ embeds: [embed] }).then(() => interaction.reply({embeds: [embeds.op_sucesso], ephemeral: true}));
                } else {
                    console.error('Erro ao processar doação:', error);
                    await interaction.reply({ embeds: [embeds.embed_erro], ephemeral: true });
                }
            } catch (error) {
                console.error('Erro ao processar doação:', error);
                await interaction.reply({ embeds: [embeds.embed_erro], ephemeral: true });
            }
        });
    }
};
