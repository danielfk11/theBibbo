const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle } = require("discord.js");
const config = require("../../../config.json");

const allowedIDs = [config.idddany, config.idsiix]; 

module.exports = {
  name: "painel-bot",
  description: "Envie o painel para configurar o bot",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const member = interaction.member;
    const permEmbed = new EmbedBuilder()
      .setDescription(
        `Você não possui permissão para utilizar este comando, ${member}`
      )
      .setColor(config.EmbedColor);

    if (!allowedIDs.includes(member.id)) {
      await interaction.reply({ embeds: [permEmbed], ephemeral: true });
      return;
    }

    let embed = new EmbedBuilder()
      .setTitle(`${config.NomeDoServidor} | Painel do Bot`, config.LogoDoServidor)
      .setDescription("Bem-vindo ao Painel do Bot! Aqui você pode personalizar as configurações do seu bot, incluindo seu nome e avatar. Sinta-se à vontade para ajustar conforme necessário para atender às suas necessidades.")
      .setColor(config.EmbedColor);

    const btn = new ButtonBuilder()
      .setLabel('Alterar Nome do bot')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('alterarnome')
      .setEmoji('✏️');

    const btn2 = new ButtonBuilder()
      .setLabel('Alterar Avatar do bot')
      .setStyle(ButtonStyle.Secondary)
      .setCustomId('alteraravatar')
      .setEmoji('🖼️');

    const row = new ActionRowBuilder().addComponents([btn, btn2]);

    interaction.reply({ embeds: [embed], components: [row] });
  }
};
