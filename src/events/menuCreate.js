const Discord = require("discord.js");
const config = require("../../config.json");
const sqlite3 = require("sqlite3").verbose();
const embeds = require("../utils/embeds");
const {
  GatewayIntentBits,
  ModalBuilder,
  EmbedBuilder,
  PermissionsBitField,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");

/**
 * @param {Discord.Interaction} interaction
 * @param {Discord.Client} client
 * @param {Message} message
 */

module.exports = async (client, interaction, guild, message) => {
  if (interaction.isSelectMenu()) {
    const selectedValue = interaction.values[0]; 

    if (selectedValue === "createdb") {
      interaction.message.edit();

        if (
          !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
        ) {
          interaction.reply({ embeds: [embeds.embednaopode], ephemeral: true });
          return;
        }
    
        const modal = new ModalBuilder()
          .setCustomId("configurando_logs")
          .setTitle("Altere o canal de logs do servidor.");
    
        const modal_1 = new TextInputBuilder()
          .setCustomId("alterar_foto")
          .setLabel("Qual é a nova imagem?")
          .setStyle(TextInputStyle.Short)
          .setPlaceholder("Insira o id do canal: ")
          .setMinLength(1)
          .setRequired(true);
    
        const resposta_1 = new ActionRowBuilder().addComponents(modal_1);
        modal.addComponents(resposta_1);
        await interaction.showModal(modal);
    
    }


} //final selectMenu



    if(interaction.customId === 'alteranome') {
      const new_name = interaction.fields.getTextInputValue('alterar_nome');
    
      try {
        await interaction.reply({embeds: [embeds.sucesso_embed], ephemeral: true});
        await client.user.setUsername(new_name);
      } catch {
        await interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
      }
  }


}