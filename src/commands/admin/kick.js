const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const config = require("../../../config.json");

const allowedIDs = [config.idddany, config.idsiix]; 

function parseTimeToMs(timeString) {
    const regex = /(\d+)\s*(ms|m|s|h|d)?/g;
    const matches = Array.from(timeString.matchAll(regex));
    let totalTimeMs = 0;
    for (const match of matches) {
        const [, value, unit] = match;
        const numericValue = parseInt(value, 10);
        let timeInMs = numericValue;
        if (unit) {
            switch (unit) {
                case 'ms':
                    timeInMs = numericValue;
                    break;
                case 's':
                    timeInMs = numericValue * 1000;
                    break;
                case 'min':
                    timeInMs = numericValue * 60000;
                    break;
                case 'h':
                    timeInMs = numericValue * 3600000;
                    break;
                case 'd':
                    timeInMs = numericValue * 86400000;
                    break;
            }
        }
        totalTimeMs += timeInMs;
    }
    return totalTimeMs;
}

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
        const membro = interaction.user
        
        const permEmbed = new EmbedBuilder()
        .setDescription(
          `Você não possui permissão para utilizar este comando, ${membro}`
        )
        .setColor(config.EmbedColor);
  
      if (!allowedIDs.includes(membro.id)) {
        await interaction.reply({ embeds: [permEmbed], ephemeral: true });
        return;
      }
    
        const memberId = interaction.options.getUser('membro').id;
        const member = await interaction.guild.members.fetch(memberId);

        const reason = interaction.options.getString('motivo') || 'Sem motivo declarado.'

        member.kick(reason)

        let embed = new EmbedBuilder()
        .setTitle(`${config.NomeDoServidor} | Membro expulso`, config.LogoDoServidor)
        .setDescription(`Um novo membro foi expulso por ${interaction.user}, informações adicionais:`)
        .addFields(
         {name: `Membro expulso:`, value: `<@${member}>`, inline: false},
         {name: `Motivo:`, value: `${motivo}`, inline: false},
         {name: `Staff:`, value: `<@${interaction.user.id}>`, inline: false},
         {name: `Expulso por:`, value: `${tempoString}`, inline: false},
        )
        .setColor(config.EmbedColor);

        interaction.reply({embeds: [embed]})
    }
}