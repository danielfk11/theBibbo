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
            required: true
        }
    ],

    run: async (client, interaction) => {
        const member = interaction.member
        const quantidade = interaction.options.getNumber('quantidade')
        const canal = interaction.options.getChannel('canal')
  
        if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
        return;
      }
    
     const deletando = await canal.bulkDelete(quantidade)
     const qntd = deletando.size

      let embed = new EmbedBuilder()
      .setDescription(`\`\`🗑️\`\` *${interaction.user} deletou ${qntd} mensagens nesse canal de texto.*`)
      .setColor(config.EmbedColor);

     interaction.reply({ embeds: [embeds.op_sucesso], ephemeral: true })
     
     canal.send({ embeds: [embed] }).then(msg => {
        setTimeout(() => {
            msg.delete()
        }, 60_000);
    });

    }
}