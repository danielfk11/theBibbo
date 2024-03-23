const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType,PermissionFlagsBits, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")
const { getLogsChannelId } = require("../../functions/logChannel")

module.exports = {
  name: "desbanir",
  description: "Remova o banimento de um membro banido!",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: 'membro',
        description: 'Insira o id do membro!',
        type: ApplicationCommandOptionType.String,
        required: true
    },
    {
        name: 'motivo',
        description: 'Insira o motivo do desban!',
        type: ApplicationCommandOptionType.String,
        require: false
    }
  ],

  run: async (client, interaction) => {
    const member = interaction.options.getString('membro');
    const guildId = interaction.guild.id
    const membro = interaction.member
    const motivo = interaction.options.getString('motivo') || 'Sem motivo declarado.'
    const currentDate = new Date();
    const timestamp = Math.floor(currentDate.getTime() / 1000);

      if (!membro.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
      return;
    }

    getLogsChannelId(guildId, async (err, channelId) => {
      if (err) {
        console.error("Erro ao obter o ID do canal de logs:", err.message);
      }
    
      let embed = new EmbedBuilder()
      .setAuthor({name: `${config.NomeDoServidor} | Membro desbanido`, iconURL: config.LogoDoServidor})
      .setDescription(`Um novo membro foi desbanido por ${interaction.user}, informações adicionais:`)
      .addFields(
       {name: `Membro Desbanido:`, value: `<@${member}>`, inline: false},
       {name: `Motivo:`, value: `${motivo}`, inline: false},
       {name: `Staff:`, value: `<@${interaction.user.id}>`, inline: false},
       {name: `Desbanido faz:`, value: `<t:${timestamp}:R>`, inline: false},
      )
      .setColor(config.EmbedColor);
    
      if (channelId) {
        const logsChannel = interaction.guild.channels.cache.get(channelId);
        await logsChannel.send({ embeds: [embed] }).then(interaction.reply({embeds: [embeds.op_sucesso], ephemeral: true}))
      } else {
        await interaction.reply({ embeds: [embed] });
      }
    });
    interaction.guild.members.unban(member, { reason: motivo }).catch(error => console.error("Erro ao desbanir o usuário:", error))
  }
};
