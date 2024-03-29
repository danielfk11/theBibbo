const { MessageEmbed, ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "role-info",
    description: "Veja informações sobre um cargo!",
   type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "cargo",
        description: "Escolha o cargo.",
        type: ApplicationCommandOptionType.Role,
        required: true,
      }
    ],
  
    run: async (client, interaction) => {
        const role = interaction.options.getRole('cargo');
        await interaction.guild.members.fetch()

        const embed = new EmbedBuilder()
            .setTitle(`Informações do cargo`)
            .addFields(
                { name: `Nome do cargo:`, value: `${role.name}`, inline: false },
                { name: 'ID do cargo:', value: `\`\`\`${role.id}\`\`\``, inline: true },
                { name: 'hexColor:', value: `\`\`\`${role.hexColor}\`\`\``, inline: false },
                { name: 'Informações:', value: `\`\`\`Mencionável: ${role.mentionable ? 'Sim' : 'Não'}\nExibe separadamente: ${role.hoist ? 'Sim' : 'Não'}\`\`\``, inline: true },
                { name: 'Membros com o cargo:', value: `\`\`\`${role.members.size}\`\`\``, inline: false },
                { name: 'Permissões:', value: `\`\`${role.permissions.toArray().join(', ')}\`\``, inline: false },
            )
            .setColor("#2a2c31")

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
