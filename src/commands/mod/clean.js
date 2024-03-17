const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, PermissionFlagsBits, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")

module.exports = {
    name: "clean",
    description: "Limpe um certo número de mensagens em um certo canal.",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Informe a quantidade de mensagens.',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
        {
            name: 'canal', 
            description: 'Escolha o canal para limpar.',
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const member = interaction.member
        const quantidade = interaction.options.getNumber('quantidade')
        const canal = interaction.options.getChannel('canal') || interaction.channel
  
        if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
        return;
      }
    
     const deletando = await canal.bulkDelete(quantidade)
     const qntd = deletando.size

     interaction.reply({content: `O canal teve \`\`${qntd}\`\` mensagens deletas por ${interaction.user}.`})

    }
}