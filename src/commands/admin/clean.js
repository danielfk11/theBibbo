const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const config = require("../../../config.json");

const allowedIDs = [config.idddany, config.idsiix]; 

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
        const member = interaction.user
        const quantidade = interaction.options.getNumber('quantidade')
        const canal = interaction.options.getChannel('canal') || interaction.channel

        const permEmbed = new EmbedBuilder()
        .setDescription(
          `Você não possui permissão para utilizar este comando, ${member}`
        )
        .setColor(config.EmbedColor);
  
      if (!allowedIDs.includes(member.id)) {
        await interaction.reply({ embeds: [permEmbed], ephemeral: true });
        return;
      }
    
     const deletando = await canal.bulkDelete(quantidade)
     const qntd = deletando.size

     canal.send({content: `O canal teve ${qntd} mensagens deletas por ${interaction.user}.`})

    }
}