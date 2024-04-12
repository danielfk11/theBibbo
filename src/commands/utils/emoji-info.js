const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "emoji-info",
    description: "Veja as informações de um emoji.",
    type: 1,
    options: [
        {
            name: "emoji",
            type: ApplicationCommandOptionType.String,
            description: "Escolha o emoji.",
            required: true
        }
    ],
    
    run: async (client, interaction, args) => {
        const emojiName = interaction.options.getString("emoji");
        const guild = interaction.guild;
        
        let emoji = guild.emojis.cache.find(e => e.name === emojiName || e.toString() === emojiName);
        
        if (!emoji) {
            return interaction.reply({ content: "Emoji não encontrado.", ephemeral: true });
        }

        const emojiFormat = emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`;
        
        let embed = new EmbedBuilder()
            .setDescription(`:${emoji.name}:`)
            .addFields(
                {name : "Infos", value: `\`\`${emojiFormat}\`\``, inline: true},
                { name: "Nome:", value: `${emoji.name}`, inline: true },
                { name: "ID:", value: `\`\`${emoji.id}\`\``, inline: true },
                { name: "Animado:", value: `${emoji.animated ? "Sim" : "Não"}`, inline: true },
                { name: "URL:", value: `${emoji.url}`, inline: true }
            )
            .setColor("#2a2c31")
            .setTimestamp();
 
        interaction.reply({ embeds: [embed] });
    }
}
