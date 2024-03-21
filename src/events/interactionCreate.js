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
const path = require("path");
const dbPath = path.resolve(__dirname, "..","..", "database", "database.db");
const db = new sqlite3.Database(dbPath)

/**
 * @param {Discord.Interaction} interaction
 * @param {Discord.Client} client
 * @param {Message} message
 */

module.exports = async (client, interaction, guild, message) => {


  if (interaction.customId === "alterarnome") {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      interaction.reply({ embeds: [embeds.embednaopode], ephemeral: true });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId("alteranome")
      .setTitle("Altere o nome do bot");

    const modal_1 = new TextInputBuilder()
      .setCustomId("alterar_nome")
      .setLabel("Qual é o novo nome?")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Insira o novo nome aqui:")
      .setMinLength(1)
      .setRequired(true);

    const resposta_1 = new ActionRowBuilder().addComponents(modal_1);
    modal.addComponents(resposta_1);
    await interaction.showModal(modal);
  }


  if (interaction.customId === "alteraravatar") {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      interaction.reply({ embeds: [embeds.embednaopode], ephemeral: true });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId("alterfoto")
      .setTitle("Altere o avatar do bot");

    const modal_1 = new TextInputBuilder()
      .setCustomId("alterar_foto")
      .setLabel("Qual é a nova imagem?")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Insira o link da imagem aqui: ")
      .setMinLength(1)
      .setRequired(true);

    const resposta_1 = new ActionRowBuilder().addComponents(modal_1);
    modal.addComponents(resposta_1);
    await interaction.showModal(modal);
  }



  if(interaction.customId === 'alteranome') {
    const new_name = interaction.fields.getTextInputValue('alterar_nome');
  
    try {
      await client.user.setUsername(new_name);
      await interaction.reply({embeds: [embeds.sucesso_embed], ephemeral: true});
    } catch {
      await interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
    }
}
  

if(interaction.customId === 'alterfoto') {
    const new_name = interaction.fields.getTextInputValue('alterar_foto');
  
    try {
      await client.user.setAvatar(new_name);
      await interaction.reply({embeds: [embeds.sucesso_embed], ephemeral: true});
    } catch {
      await interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
    }
}


if (interaction.isStringSelectMenu()) {
  const selectedValue = interaction.values[0];
  
  if (selectedValue === 'createdb') {
    interaction.message.edit()
    const guildId = interaction.guildId;

    const checkSql = `SELECT * FROM servidores WHERE guild_id = ?`;

    db.get(checkSql, [guildId], (err, row) => {
      if (err) {
        return console.error("Erro ao verificar se o servidor já existe:", err.message);
      }

      if (row) {
        let embed = new EmbedBuilder()
          .setAuthor({name: `${config.NomeDoServidor} | Painel do Bot`, iconURL: config.LogoDoServidor})
          .setDescription(`\`\`❌\`\` **Erro, servidor já está no banco de dados.**`)
          .setColor(config.EmbedColor);

        interaction.reply({embeds: [embed], ephemeral: true});
      } else {
        const insertSql = `INSERT INTO servidores (guild_id, dono_id) VALUES (?, ?)`;

        db.run(insertSql, [guildId, interaction.user.id], function(err) {
          if (err) {
            return console.error("Erro ao inserir ID do servidor:", err.message);
          }

          let embed = new EmbedBuilder()
            .setAuthor({name: `${config.NomeDoServidor} | Painel do Bot`, iconURL: config.LogoDoServidor})
            .setDescription(`\`\`✅\`\` **Sucesso, servidor inserido no banco de dados.**`)
            .setColor(config.EmbedColor);

          interaction.reply({embeds: [embed], ephemeral: true});
        });
      }
    });
  }

  if (selectedValue === 'configurarlogs') {
    interaction.message.edit()
    
    if ( !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      interaction.reply({ embeds: [embeds.embednaopode], ephemeral: true });
      return;
    }

    let register_error = new EmbedBuilder()
    .setDescription(`\`\`❌\`\` **O ID do servidor não está registrado na tabela de servidores.**`)
    .setColor(config.EmbedColor);

    const guildId = interaction.guild.id;

    const serverExistQuery = `SELECT * FROM servidores WHERE guild_id = ?`;

    db.get(serverExistQuery, [guildId], (err, row) => {
      if (err) {
        interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
        return;
      }
  
      if (!row) {
        interaction.reply({embeds: [register_error], ephemeral: true});
        return;
      }
  
  
      const modal = new ModalBuilder()
        .setCustomId("cfglogs")
        .setTitle("Altere o canal de logs do servidor");
  
      const modal_1 = new TextInputBuilder()
        .setCustomId("alterandologs")
        .setLabel("Insira o ID para registrar o canal de logs")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder(" ") // add texto/emoji
        .setMinLength(1)
        .setRequired(true);
  
      const resposta_1 = new ActionRowBuilder().addComponents(modal_1);
      modal.addComponents(resposta_1);
      interaction.showModal(modal);
  
    });
  }



// ECONOMY SYSTEM
if (selectedValue === 'ecocreateuser') {
  interaction.message.edit()

  let register_error = new EmbedBuilder()
  .setDescription(`\`\`❌\`\` **Você já está registrado nesta guilda.**`)
  .setColor(config.EmbedColor);

  let register_success = new EmbedBuilder()
  .setDescription(`\`\`✅\`\` **Novo usuário criado com sucesso no banco de dados.**`)
  .setColor(config.EmbedColor);


  const userId = interaction.user.id;
  const guildId = interaction.guild.id;
  const money = '0'

  const userExistQuery = `SELECT * FROM economy WHERE user_id = ? AND guild_id = ?`;

  db.get(userExistQuery, [userId, guildId], (err, row) => {
    if (err) {
      interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
      return;
    }

    if (row) {
      interaction.reply({embeds: [register_error]});
      return;
    }

    const insertUserQuery = `INSERT INTO economy (user_id, guild_id, money) VALUES (?, ?, ?)`;

    db.run(insertUserQuery, [userId, guildId, money], function(err) {
      if (err) {
        interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
        return;
      }

      console.log("Novo usuário criado no banco de dados. ID:", this.lastID);
      interaction.reply({embeds: [register_success]});
    });
  });
}



} // final do selectMenu


};
