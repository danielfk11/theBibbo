const { EmbedBuilder, ActionRowBuilder, ButtonBuilder,PermissionFlagsBits, ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")
const { getLogsChannelId } = require("../../functions/logChannel")

module.exports = {
  name: "kick",
  description: "Aplique um banimento em um membro!",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: 'membro',
        description: 'Insira o id do membro!',
        type: ApplicationCommandOptionType.User,
        required: true
    },
    {
        name: 'motivo',
        description: 'Insira o motivo do ban!',
        type: ApplicationCommandOptionType.String,
        require: false
    }
  ],

  run: async (client, interaction) => {
    
    const member = interaction.options.getUser('membro');
    const membro = interaction.member
    const user = interaction.guild.members.cache.get(member.id)
    const motivo = interaction.options.getString('motivo') || 'Sem motivo declarado.'
    const currentDate = new Date();
    const timestamp = Math.floor(currentDate.getTime() / 1000);

    if (!membro.permissions.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
      return;
    }

    getLogsChannelId(guildId, async (err, channelId) => {
      if (err) {
        console.error("Erro ao obter o ID do canal de logs:", err.message);
      }
    

    let embed = new EmbedBuilder()
      .setAuthor({name: `${config.NomeDoServidor} | Membro Kickado`, iconURL: config.LogoDoServidor})
      .setDescription(`Um novo membro foi kickado por ${interaction.user}, informações adicionais:`)
      .addFields(
       {name: `Membro Kickado:`, value: `${member}`, inline: false},
       {name: `Motivo:`, value: `${motivo}`, inline: false},
       {name: `Staff:`, value: `<@${interaction.user.id}>`, inline: false},
       {name: `Kickado faz:`, value: `<t:${timestamp}:R>`, inline: false},
      )
      .setColor(config.EmbedColor);

      if (channelId) {
        const logsChannel = interaction.guild.channels.cache.get(channelId);
        await logsChannel.send({ embeds: [embed] }).then(interaction.reply({embeds: [embeds.op_sucesso], ephemeral: true}))
      } else {
        await interaction.reply({ embeds: [embed] });
      }
    });

    user.kick(member, motivo)
  }
};
