const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");

const allowedIDs = [config.idddany, config.idsiix]; 

module.exports = {
  name: "banir",
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
    const membro = interaction.user
    const user = interaction.guild.members.cache.get(member.id)
    const motivo = interaction.options.getString('motivo') || 'Sem motivo declarado.'
    const currentDate = new Date();
    const timestamp = Math.floor(currentDate.getTime() / 1000);

    const permEmbed = new EmbedBuilder()
      .setDescription(
        `Você não possui permissão para utilizar este comando, ${membro}`
      )
      .setColor(config.EmbedColor);

    if (!allowedIDs.includes(membro.id)) {
      await interaction.reply({ embeds: [permEmbed], ephemeral: true });
      return;
    }

    let embed = new EmbedBuilder()
      .setTitle(`${config.NomeDoServidor} | Membro banido`, config.LogoDoServidor)
      .setDescription(`Um novo membro foi banido por ${interaction.user}, informações adicionais:`)
      .addFields(
       {name: `Membro banido:`, value: `<@${member}>`, inline: false},
       {name: `Motivo:`, value: `${motivo}`, inline: false},
       {name: `Staff:`, value: `<@${interaction.user.id}>`, inline: false},
       {name: `Banido faz:`, value: `<t:${timestamp}:R>`, inline: false},
      )
      .setColor(config.EmbedColor);

    interaction.reply({ embeds: [embed]});
   user.ban(member, motivo)
  }
};
