const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType, PermissionFlagsBits, channelLink } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")

module.exports = {
  name: "unlock",
  description: "Desbloqueie um canal.",
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

        canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).then( () => {
        interaction.reply({ content: embeds.sucesso_embed, ephemeral: true})

        let embed = new EmbedBuilder()
        .setDescription(`\`\`🔓\`\` *Este canal de texto (<#${canal.id}>) foi desbloqueado por ${interaction.user}*`)
        .setColor(config.EmbedColor);

        canal.send({ embeds: [embed] })

        }).catch(e => {
            interaction.reply({ embeds: embeds.embed_erro, ephemeral: true })
        })
    }
    
  }
}