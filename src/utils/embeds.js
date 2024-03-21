const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

const embednaopode = new EmbedBuilder()
  .setDescription(`\`\`❌\`\` **Você não tem permissão para isso.**`)
  .setColor(config.EmbedColor);

const embed_erro = new EmbedBuilder()
  .setDescription(`\`\`❌\`\` **Erro ao tentar realizar procedimento.**`)
  .setColor(config.EmbedColor);

const sucesso_embed = new EmbedBuilder()
  .setDescription(`\`\`✅\`\` **Sucesso, alteração concluída.**`)
  .setColor(config.EmbedColor);

const permEmbed = new EmbedBuilder()
  .setDescription(`\`\`❌\`\` **Você não possui permissão para utilizar este comando.**`)
  .setColor(config.EmbedColor);

const op_sucesso = new EmbedBuilder()
  .setDescription(`\`\`✅\`\` **Sucesso, operação concluída.**`)
  .setColor(config.EmbedColor);

module.exports = { embednaopode, embed_erro, sucesso_embed, permEmbed, op_sucesso };
