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
  SelectMenuBuilder
} = require("discord.js");
const embed = require("../utils/embeds")
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
          .setDescription(`\`\`❌\`\` *Erro, servidor já está no banco de dados.*`)
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
            .setDescription(`\`\`✅\`\` *Sucesso, servidor inserido no banco de dados.*`)
            .setColor(config.EmbedColor);

          interaction.reply({embeds: [embed], ephemeral: true});
        });
      }
    });
  }

  if(selectedValue === 'configtickets') {
    interaction.message.edit()

    if ( !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      interaction.reply({ embeds: [embeds.embednaopode], ephemeral: true });
      return;
    }

    let register_error = new EmbedBuilder()
    .setDescription(`\`\`❌\`\` *O ID do servidor não está registrado na tabela de servidores.*`)
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

      const selectMenuOptions = [
        { label: 'Configurar Cargos', value: 'tktroles', emoji: '🔧', description: 'Configure os cargos para gerenciar tickets.' },
        { label: 'Configurar Categoria', value: 'tktcat', emoji: '🗂️', description: 'Configure a categoria padrão para novos tickets.' },
        { label: 'Configurar Ranking', value: 'tktrank', emoji: '🏆', description: 'Configure o ranking de prioridade para tickets.' },
        { label: 'Configurar Logs Ticket', value: 'tktlogst', emoji: '📝', description: 'Configure o canal para logs de tickets.' },
    ];

    const selectMenu = new SelectMenuBuilder()
        .setCustomId('selectmenu')
        .setPlaceholder('Selecione uma opção')
        .addOptions(selectMenuOptions);

    const row_builder = new ActionRowBuilder().addComponents(selectMenu);

    interaction.reply({components: [row_builder], ephemeral: true })


    })
  }

//tickets

if(selectedValue === 'tktroles') {
  interaction.message.edit()

  if ( !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    interaction.reply({ embeds: [embeds.embednaopode], ephemeral: true });
    return;
  }

  const modal = new ModalBuilder()
  .setCustomId("tktcfgroles")
  .setTitle("Insira o cargo para adicionar");

  const modal_1 = new TextInputBuilder()
  .setCustomId("tkt_addrole")
  .setLabel("Qual o ID do Cargo?")
  .setStyle(TextInputStyle.Short)
  .setPlaceholder("Insira o ID do Cargo aqui: ")
  .setMinLength(1)
  .setRequired(true);

  const resposta_1 = new ActionRowBuilder().addComponents(modal_1);
  modal.addComponents(resposta_1);
  await interaction.showModal(modal);

}



  if (selectedValue === 'configurarlogs') {
    interaction.message.edit()

    if ( !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      interaction.reply({ embeds: [embeds.embednaopode], ephemeral: true });
      return;
    }

    let register_error = new EmbedBuilder()
    .setDescription(`\`\`❌\`\` *O ID do servidor não está registrado na tabela de servidores.*`)
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
        .setPlaceholder("✍️ Insira aqui o id do canal: ")
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
  .setDescription(`\`\`❌\`\` *Você já está registrado.*`)
  .setColor(config.EmbedColor);

  let register_success = new EmbedBuilder()
  .setDescription(`\`\`✅\`\` *Novo usuário criado com sucesso no banco de dados.*`)
  .setColor(config.EmbedColor);

  const userId = interaction.user.id;
  const money = '0'

  const userExistQuery = `SELECT * FROM economy WHERE user_id = ?`;

  db.get(userExistQuery, [userId], (err, row) => {
    if (err) {
      interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
      return;
    }

    if (row) {
      interaction.reply({embeds: [register_error], ephemeral: true});
      return;
    }

    const insertUserQuery = `INSERT INTO economy (user_id,  money) VALUES (?, ?)`;

    db.run(insertUserQuery, [userId, money], function(err) {
      if (err) {
        interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
        return;
      }

      interaction.reply({embeds: [register_success], ephemeral: true});
    });
  });
}


if(selectedValue === 'ecogerenusers') {
  interaction.message.edit()
  const member = interaction.member;
  const allowedIDs = [config.idddany, config.idsiix];

  if (!allowedIDs.includes(member.id)) {
    await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
    return;
  }

  const selectMenuOptions = [
    { label: 'Adicionar bibboCoins', value: 'addbibboc', emoji: '👍', description: 'Adicione bibboCoins à conta do usuário.' },
    { label: 'Remover bibboCoins', value: 'rembibboc', emoji: '👎', description: 'Remova bibboCoins da conta do usuário.' },
    { label: 'Setar bibboCoins', value: 'setbibboc', emoji: '✅', description: 'Configure a quantidade de bibboCoins na conta do usuário.' },
    { label: 'Adicionar Usuario', value: 'adduserb', emoji: '👤', description: 'Adicione um novo usuário ao banco de dados.' },
    { label: 'Excluir Usuario', value: 'remuserb', emoji: '🗑️', description: 'Exclua o usuário do banco de dados.' },
  ];

  const selectMenu = new SelectMenuBuilder()
      .setCustomId('selectmenu')
      .setPlaceholder('Selecione uma opção')
      .addOptions(selectMenuOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    interaction.reply({components: [row], ephemeral: true });
}





} // final do selectMenu


// CONFIG CANAL LOGS SYSTEM
if (interaction.customId === 'cfglogs') {
  const cfg_channel_id = interaction.fields.getTextInputValue('alterandologs');

  const guildId = interaction.guild.id;

  const updateLogsQuery = `UPDATE servidores SET canal_logs_id = ? WHERE guild_id = ?`;

  db.run(updateLogsQuery, [cfg_channel_id, guildId], function(err) {
    if (err) {
      interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
      return;
    }

    interaction.reply({embeds: [embeds.sucesso_embed], ephemeral: true});
  });
}


if(interaction.customId === 'tktcfgroles') {
  const cfg_roles_tkt = interaction.fields.getTextInputValue('tkt_addrole');



}


};
