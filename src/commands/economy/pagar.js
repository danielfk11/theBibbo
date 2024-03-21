const { EmbedBuilder, ActionRowBuilder, ButtonBuilder,PermissionFlagsBits, ApplicationCommandType, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds")

module.exports = {
  name: "pagar", //NAME
  description: "pagar", //DESC
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

  }
};
