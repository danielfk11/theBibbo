const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds");
const { parseTimeToMs } = require('../../functions/parseTimeToMs');

module.exports = {
    name: "mutar",
    description: "Bloqueie um membro de falar no servidor",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'membro', 
            description: 'Escolha o membro para mutar.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'tempo',
            description: 'Informe o tempo do timeout. (1s,1min)',
            type: ApplicationCommandOptionType.String ,
            required: true
        }, {
            name: 'motivo',
            description: 'Informe o motivo do timeout.',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const membro = interaction.member

        if (!membro.permissions.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true });
            return;
        }
    
        const memberId = interaction.options.getUser('membro').id;
        const member = await interaction.guild.members.fetch(memberId);
        const motivo = interaction.options.getString('motivo') || 'Sem motivo declarado.'; // Corrigido para motivo
        const tempoString = interaction.options.getString('tempo');

        let tempoMs = 0;
        if (tempoString) {
            tempoMs = parseTimeToMs(tempoString);
        }

        member.timeout(tempoMs, motivo);

        let embed = new EmbedBuilder()
            .setTitle(`${config.NomeDoServidor} | Membro castigado`, config.LogoDoServidor)
            .setDescription(`Um novo membro foi castigado por ${interaction.user}, informações adicionais:`)
            .addFields(
                {name: `Membro castigado:`, value: `${member}`, inline: false},
                {name: `Motivo:`, value: `${motivo}`, inline: false},
                {name: `Staff:`, value: `<@${interaction.user.id}>`, inline: false},
                {name: `Castigado por:`, value: `${tempoString}`, inline: false},
            )
            .setColor(config.EmbedColor);
        interaction.reply({embeds: [embed]});
    }
};
