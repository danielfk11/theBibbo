const { EmbedBuilder, ActionRowBuilder, ButtonBuilder,PermissionFlagsBits, ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")

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

    let embed = new EmbedBuilder()
      .setTitle(`${config.NomeDoServidor} | Membro Kickado`, config.LogoDoServidor)
      .setDescription(`Um novo membro foi kickado por ${interaction.user}, informações adicionais:`)
      .addFields(
       {name: `Membro Kickado:`, value: `<@${member}>`, inline: false},
       {name: `Motivo:`, value: `${motivo}`, inline: false},
       {name: `Staff:`, value: `<@${interaction.user.id}>`, inline: false},
       {name: `Kickado faz:`, value: `<t:${timestamp}:R>`, inline: false},
      )
      .setColor(config.EmbedColor);

    interaction.reply({ embeds: [embed]});
   user.ban(member, motivo)
  }
};
