const Discord = require("discord.js")
const config = require("../../../config.json");

const allowedIDs = [config.idddany, config.idsiix]; 

module.exports = {
  name: "lock",
  description: "Bloqueie um canal.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal",
        description: "Mencione um canal para o bloquear o chat.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {
    const member = interaction.user
    const permEmbed = new EmbedBuilder()
      .setDescription(
        `Você não possui permissão para utilizar este comando, ${member}`
      )
      .setColor(config.EmbedColor);

    if (!allowedIDs.includes(member.id)) {
      await interaction.reply({ embeds: [permEmbed], ephemeral: true });
      return;
    } else {
        const canal = interaction.options.getChannel("canal")

        canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).then( () => {
            interaction.reply({ content: `O canal de texto ${canal} foi bloqueado por  ${interaction.user} para nenhum membro do servidor enviar mensagem.` })

            if (canal.id !== interaction.channel.id) return canal.send({ content: `Este canal de texto foi bloqueado por ${interaction.user} para nenhum membro do servidor enviar mensagem.` })

        }).catch(e => {
            interaction.reply({ content: `❌ Ops, algo deu errado.` })
        })
    }
    
  }
}