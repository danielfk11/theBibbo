const { EmbedBuilder, ActionRowBuilder, ApplicationCommandType, SelectMenuBuilder } = require("discord.js");
const config = require("../../../config.json");

const allowedIDs = [config.idddany, config.idsiix]; 

module.exports = {
  name: "config",
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
      .setTitle(`${config.NomeDoServidor} | Config Bot`, config.LogoDoServidor)
      .setDescription("Bem-vindo ao Painel do Bot! Aqui você pode personalizar as configurações do seu bot, como canais de logs e algumas outras informações. Sinta-se à vontade para ajustar conforme necessário para atender às suas necessidades.")
      .setColor(config.EmbedColor);

    const selectMenuOptions = [
      { label: 'Configurar Canal de Logs', value: 'configurarlogs', emoji: '📜' },
      { label: 'Criar Banco de Dados', value: 'createdb', emoji: '🗂️' },
      // Adicione outras opções conforme necessário
    ];

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('selectmenu')
      .setPlaceholder('Selecione uma opção')
      .addOptions(selectMenuOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    interaction.reply({ embeds: [embed], components: [row] });
  }
};
