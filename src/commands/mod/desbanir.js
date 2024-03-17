const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType,PermissionFlagsBits, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")

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
    const membro = interaction.member
    const motivo = interaction.options.getString('motivo') || 'Sem motivo declarado.'
    const currentDate = new Date();
    const timestamp = Math.floor(currentDate.getTime() / 1000);

      if (!membro.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
      return;
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

    interaction.reply({ embeds: [embed]});
    interaction.guild.members.unban(member, motivo);
  }
};
