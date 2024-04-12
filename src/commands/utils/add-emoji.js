const { EmbedBuilder, ApplicationCommandOptionType, Attachment } = require("discord.js");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
    name: "add-emoji",
    description: "Adicione um emoji ao seu servidor.",
    type: 1,
    options: [
        {
            name: "emoji",
            type: ApplicationCommandOptionType.String,
            description: "Emoji que você deseja adicionar (por exemplo, :emoji: ou :emoji_name:emoji_id).",
            required: true
        }
    ],
    
    run: async (client, interaction, args) => {
        const emojiArg = interaction.options.getString("emoji");

        const match = emojiArg.match(/<a?:[a-zA-Z0-9_]+:(\d+)>/);
        
        if (!match) {
            return interaction.reply({ content: "Por favor, forneça um emoji válido do próprio servidor ou um emoji padrão do Discord.", ephemeral: true });
        }

        const emojiID = match[1];
        const emojiName = emojiArg.split(":")[1];
        const isAnimated = emojiArg.startsWith("<a:");

        try {
            const response = await axios.get(`https://cdn.discordapp.com/emojis/${emojiID}.${isAnimated ? 'gif' : 'png'}`, {
                responseType: 'arraybuffer'
            });

            const emojiBuffer = Buffer.from(response.data, 'binary');

            const tempDir = path.join(__dirname, '..', '..', 'temp');
            const tempFilePath = path.join(tempDir, `${emojiID}.${isAnimated ? 'gif' : 'png'}`);

            await fs.mkdir(tempDir, { recursive: true });
            await fs.writeFile(tempFilePath, emojiBuffer);

            const emojiFile = await fs.readFile(tempFilePath);

            const emoji = await interaction.guild.emojis.create({attachment: emojiFile, name: emojiName});

            const emojiFormat = emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`;

            let embed = new EmbedBuilder()
                .setTitle("Emoji adicionado com sucesso!")
                .addFields(
                    {name : "Infos", value: `\`\`${emojiFormat}\`\``, inline: true},
                    { name: "Nome:", value: `${emoji.name}`, inline: true },
                    { name: "ID:", value: `\`\`${emoji.id}\`\``, inline: true },
                    { name: "Animado:", value: `${emoji.animated ? "Sim" : "Não"}`, inline: true },
                    { name: "URL:", value: `${emoji.url}`, inline: true }
                )
                .setColor("#2a2c31")
                .setTimestamp();

            interaction.reply({ content: `Emoji adicionado: ${emojiFormat}`, embeds: [embed] });

            await fs.unlink(tempFilePath);
        } catch (error) {
            interaction.reply({ content: "Ocorreu um erro ao adicionar o emoji.", ephemeral: true });
            console.error(error);
        }
    }
}
