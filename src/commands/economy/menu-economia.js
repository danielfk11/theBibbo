const { EmbedBuilder, ActionRowBuilder, ButtonBuilder,PermissionFlagsBits,SelectMenuBuilder,  ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")
const sqlite3 = require("sqlite3").verbose();
const path = require("path")

const dbPath = path.resolve(__dirname, "..", "..","..", "database", "database.db");
const db = new sqlite3.Database(dbPath);

module.exports = {
  name: "menu-economia",
  description: "Abrir menu para gerenciar a economia.",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const member = interaction.member;

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
      return;
    }

    let embed = new EmbedBuilder()
      .setAuthor({name: `${config.NomeDoServidor} | Menu Economia`, iconURL: config.LogoDoServidor})
      .setDescription(
        "Bem-vindo ao Menu de Economia! Aqui você pode gerenciar sua economia e verificar o saldo do seu dinheiro.\n\n" +
        "Comandos Disponíveis:\n" +
        "• `/consultar` - Consulta o saldo do seu dinheiro.\n" +
        "• `/comprar <item>` - Compra um item da loja.\n" +
        "• `/vender <item>` - Vende um item da loja.\n" +
        "• `/trabalhar` - Trabalha para ganhar dinheiro.\n" +
        "• `/doar <usuário> <quantidade>` - Doa dinheiro para outro usuário.\n"
      )
      .setColor(config.EmbedColor);

    const selectMenuOptions = [
      { label: 'Criar usuario', value: 'ecocreateuser', emoji: '💂' },
      { label: 'Visualizar rank', value: 'ecovisurank', emoji: '📜' },
      { label: 'Gerenciar usuarios (Admin config)', value: 'ecogerenusers', emoji: '🖋️' },
    ];

    const selectMenu = new SelectMenuBuilder()
      .setCustomId('selectmenu')
      .setPlaceholder('Selecione uma opção')
      .addOptions(selectMenuOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    interaction.reply({ embeds: [embed], components: [row] });


  }
};


// ECONOMIA

// fazer painel usuario 
// fazer painel para editar infos do usuario
// add comandos para economia
