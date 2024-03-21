const { EmbedBuilder, ActionRowBuilder, ButtonBuilder,PermissionFlagsBits, ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const path = require("path")
const embeds = require("../../utils/embeds")
const sqlite3 = require("sqlite3").verbose();

module.exports = {
    name: "consultar",
    description: "Consultar saldo money",
    type: ApplicationCommandType.ChatInput,
        
        run: async (client, interaction) => {
            const dbPath = path.resolve(__dirname, "..", "..","..", "database", "database.db");
            const db = new sqlite3.Database(dbPath);
      
            const userId = interaction.user.id;
    
            const userExistQuery = `SELECT * FROM economy WHERE user_id = ?`;
      
            db.get(userExistQuery, [userId], (err, userRow) => {
                if (err) {
                    console.error("Erro ao consultar o banco de dados:", err.message);
                    interaction.reply("Ocorreu um erro ao consultar o saldo.");
                    return;
                }
    
                if (!userRow) {
                    interaction.reply("Você ainda não está registrado na economia.");
                    return;
                }
    
                const saldoQuery = `SELECT money FROM economy WHERE user_id = ?`;
    
                db.get(saldoQuery, [userId], (err, saldoRow) => {
                    if (err) {
                        console.error("Erro ao consultar o saldo no banco de dados:", err.message);
                        interaction.reply("Ocorreu um erro ao consultar o saldo.");
                        return;
                    }
    
                    const saldo = saldoRow.money;
    
                    interaction.reply(`Seu saldo é de: ${saldo} money`);
                });
            });
        },
    };
