const { EmbedBuilder, ActionRowBuilder, ApplicationCommandType,PermissionFlagsBits, SelectMenuBuilder } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")

module.exports = {
  name: "config",
  description: "Envie o painel para configurar o bot",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const member = interaction.member;

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
      return;
    }

    let embed = new EmbedBuilder()
      .setAuthor({name: `${config.NomeDoServidor} | Config Bot`, iconURL: config.LogoDoServidor})
      .setDescription("Bem-vindo ao Painel do Bot! Aqui você pode personalizar as configurações do seu bot, como canais de logs e algumas outras informações. Sinta-se à vontade para ajustar conforme necessário para atender às suas necessidades.")
      .setColor(config.EmbedColor);

    const selectMenuOptions = [
      { label: 'Configurar Canal de Logs', value: 'configurarlogs', emoji: '📜' },
      { label: 'Criar Banco de Dados', value: 'createdb', emoji: '🗂️' },
    ];

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('selectmenu')
      .setPlaceholder('Selecione uma opção')
      .addOptions(selectMenuOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    interaction.reply({ embeds: [embed], components: [row] });
  }
};
