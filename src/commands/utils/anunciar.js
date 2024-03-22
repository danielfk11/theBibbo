const Discord = require("discord.js");
const { PermissionFlagsBits, ApplicationCommandOptionType } = require("discord.js");
const embeds = require("../../utils/embeds")

//https://embed.sazuto.com/

module.exports = {
  name: "anunciar",
  description: "Utilize este comando para enviar uma embed (https://embed.sazuto.com/)",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "json",
      description: "Aqui vem o código da embed.",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  run: async (client, interaction) => {
    const member = interaction.member;

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
        return;
      }

    const customJsonOption = interaction.options.getString("json");
    try {
      const embedData = JSON.parse(customJsonOption);
      if (embedData && embedData.embeds && Array.isArray(embedData.embeds) && embedData.embeds.length > 0) {
        const embed = embedData.embeds[0];
        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({
          embeds: embeds.op_sucesso,
          ephemeral: true
        });
      } else {
        throw new Error("O JSON fornecido não contém uma estrutura de embed válida.");
      }
    } catch (error) {
      await interaction.reply({embeds: [embeds.embed_erro], ephemeral: true});
    }
  },
};
