const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const config = require("../../../config.json");
const embeds = require("../../utils/embeds");
const { parseTimeToMs } = require('../../functions/parseTimeToMs');
const { getLogsChannelId } = require("../../functions/logChannel")

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
        
        const guildId = interaction.guild.id
        const memberId = interaction.options.getUser('membro').id;
        const member = await interaction.guild.members.fetch(memberId);
        const motivo = interaction.options.getString('motivo') || 'Sem motivo declarado.';
        const tempoString = interaction.options.getString('tempo');

        let tempoMs = 0;
        if (tempoString) {
            tempoMs = parseTimeToMs(tempoString);
        }

        getLogsChannelId(guildId, async (err, channelId) => {
            if (err) {
              console.error("Erro ao obter o ID do canal de logs:", err.message);
            }
          
            let embed = new EmbedBuilder()
            .setAuthor({name: `${config.NomeDoServidor} | Membro castigado`, iconURL: config.LogoDoServidor})
            .setDescription(`Um novo membro foi castigado por ${interaction.user}, informações adicionais:`)
            .addFields(
                {name: `Membro castigado:`, value: `${member}`, inline: false},
                {name: `Motivo:`, value: `${motivo}`, inline: false},
                {name: `Staff:`, value: `<@${interaction.user.id}>`, inline: false},
                {name: `Castigado por:`, value: `${tempoString}`, inline: false},
            )
            .setColor(config.EmbedColor);
          
            if (channelId) {
              const logsChannel = interaction.guild.channels.cache.get(channelId);
              await logsChannel.send({ embeds: [embed] }).then(interaction.reply({embeds: [embeds.op_sucesso], ephemeral: true}))
            } else {
              await interaction.reply({ embeds: [embed] });
            }
          });

          member.timeout(tempoMs, { reason: motivo }).catch(error => console.error("Erro ao mutar o usuário:", error))

    }
};
