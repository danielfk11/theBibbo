const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")

module.exports = {
  name: "lock",
  description: "Bloqueie um canal.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal",
        description: "Mencione um canal para o bloquear o chat.",
        type: ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {
    const member = interaction.member

      if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
      return;
    } else {
        const canal = interaction.options.getChannel("canal")

        canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).then( () => {
            interaction.reply({ content: `O canal de texto ${canal} foi bloqueado por ${interaction.user} para nenhum membro do servidor enviar mensagem.` })

            if (canal.id !== interaction.channel.id) return canal.send({ content: `Este canal de texto foi bloqueado por ${interaction.user} para nenhum membro do servidor enviar mensagem.` })

        }).catch(e => {
            interaction.reply({ content: `❌ Ops, algo deu errado.` })
        })
    }
    
  }
}