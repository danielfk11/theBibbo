const moment = require('moment')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonStyle } = require("discord.js");
const config = require("../../../config.json")
const embeds = require("../../utils/embeds");

module.exports = {
    name: 'ban',
    description: 'Banir um membro do servidor',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'usuário',
            type: ApplicationCommandOptionType.User,
            description: 'Mencione um usuário.',
            required: true,
        },
        {
            name: 'motivo',
            type: ApplicationCommandOptionType.String,
            description: 'Digite o motivo.',
            required: false,
        }
    ],
    run: async (client, interaction, options) => {
        let user = interaction.options.getUser("usuário");
        let motivo = interaction.options.getString("motivo") || `Motivo não informado`;

        let channel = client.channels.cache.get(config.Mod.canal_logs_geral)

        if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
            await interaction.reply({ embeds: [embeds.permEmbed], ephemeral: true })
            return;
          }

        if (user.id === interaction.user.id) return interaction.reply({
            content: `\\❌ **| Você não pode se proprio banir.**`,
            ephemeral: true
        })
        if (user.id === client.user.id) return interaction.reply({
            content: `\\❌ **| Você não pode me banir.**`,
            ephemeral: true
        })
        if (user.id === interaction.guild.ownerId) return interaction.reply({
            content: `\\❌ **| Você não pode banir o dono do servidor.**`,
            ephemeral: true
        })

        interaction.guild.members.ban(user, { reason: [motivo] }).then(() => {
            interaction.reply({ embeds: [MemberEmbed] })
            channel.send({ embeds: [embedbann] })
        }).catch(e => {
            interaction.reply({ content: `\\❌ | **Não foi possivel Banir ${user}(\`${user.id}\`) do servidor**`, ephemeral: true })
        })

        let MemberEmbed = new EmbedBuilder()
            .setColor('RED')
            .setDescription(`**${user.tag} foi banido com sucesso! Quem mandou quebrar as regras?!**`)
            .addFields(
                { name: `<:suporteetr:1017136982926839808> - Motivo:`, value: `\`${motivo}\`` },
                { name: `<:twitch_money_1017137885641707611:1017137916587282523> - Servidor:`, value: ` \`${interaction.guild.name}\`` },
                { name: `<:emoji_5:1017129500351418448> - Usuário Banido:`, value: `${user.tag} - (${user.id})` },
                { name: `:incoming_envelope: - Autor do banimento:`, value: `${interaction.user} - (${interaction.user.id})` },
                { name: `<:loading_1017138852944683019:1017139665112936583> - Horário`, value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`, }
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })


        const embedbann = new EmbedBuilder()
            .setColor('')
            .setThumbnail(user.displayAvatarURL({ dinamyc: true, size: 2048, format: 'png'}))
            .setTitle(`📢 | Novo banimento.`)
            .setFooter({ text: `Banido Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
            .addFields(
                {
                    name: `👤 - Usuário banido:`,
                    value: `⭐ - Menção:\n${user}`,
                },
                {
                    name: `🏷️ - TAG:`,
                    value: `(${user.tag})`,
                },
                {
                    name: `🆔 - ID:`,
                    value: `(${user.id})`,
                },
                {
                    name: `🏠 - Servidor:`,
                    value: `(${interaction.guild.name})`,
                },
                {
                    name: `💻 - Autor do banimento:`,
                    value: ` ${interaction.user} - (${interaction.user.id})`,
                },
                {
                    name: `📜 - Motivo`,
                    value: `( ${motivo} )`,
                },
                {
                    name: `⏰ - Horário`,
                    value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`,
                }
            )

    }
}