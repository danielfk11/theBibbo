const { ActionRowBuilder, EmbedBuilder, ButtonBuilder  } = require("discord.js");
const moment = require('moment');
const axios = require('axios').default;
moment.locale("pt-BR");

module.exports = {
    name: "user-info",
    description: "Informações de um Usuário",
    type: 1,
    options: [{
        name: 'membro',
        description: 'selecione o membro.',
        type: 6,
        required: true
    }],
    permissions: {},
    run: async (client, interaction, args) => { 

        const membro = interaction.options.getUser("usuário");
        const member = interaction.guild.members.cache.get(membro.id) || interaction.member;

        try {
            await axios.get(`https://api.meshapis.cc/user/${membro.id}`).then(function (db) {

                const flags = {
                    ActiveDeveloper: "<:BadgeActiveDeveloper:1219443127257923674>", // Active Developer
                    PremiumEarlySupporter: "<:Sv_GoldenPig:1219443222397587496>", // Pig
                    VerifiedDeveloper: "<:devrico:1199429680701382687>", //Developer
                    Partner: "<a:PartnerBadge:1219443410398609518>", //Partner (Dono de servidor parceiro)
                    HypeSquadOnlineHouse1: "<:BraveryBadge:1219443465943912519>", //Hypesquad Bravery (Roxo)
                    Hypesquad: "<:HypeEventsBadge:1219443521275301938>", //Hypesquad Events (Amarela)
                    HypeSquadOnlineHouse2: "<:BrillianceBadge:1219443608709758996>", //Hypesquad Brilliance (Laranja)
                    HypeSquadOnlineHouse3: "<:BalanceBadge:1219443654956154911>", //Hypesquad Balance (Verde)
                    Nitro: "<a:9wumpusnitro:1219443717082185772>", //Nitro
                    guild_booster_lvl1: "<:1192181337906487379:1219472384105648250>", // Boost 1
                    guild_booster_lvl2: "<:1192181353056305288:1219472387125542933>", // Boost 2
                    guild_booster_lvl3: "<:1192181362980040795:1219472390698962964>", // Boost 3
                    guild_booster_lvl4: "<:1192181374166237264:1219472393861468261>", // Boost 4
                    guild_booster_lvl5: "<:1192181384530378762:1219472396776374352>", // Boost 5
                    guild_booster_lvl6: "<:1192181396278624386:1219472399242625064>", // Boost 6
                    guild_booster_lvl7: "<:1192181406445600910:1219472403802099732>", // Boost 7
                    guild_booster_lvl8: "<:1192181416402886656:1219472406905618514>", // Boost 8
                    guild_booster_lvl9: "<:1192181428025298965:1219472409078534175>", // Boost 9
                };

                const userBadges = db.data.badges;
                let badges = userBadges.map((badge) => flags[badge]).join(" ");

                if (!badges) badges = "`Nenhuma insígnia.`";

                const button = new ButtonBuilder()
                .setLabel("Avatar")
                .setStyle(5)
                .setURL(
                  membro.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })
                );
          
                const row = new ActionRowBuilder().addComponents(button);
           
                let avatar = membro.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })

                let embed = new EmbedBuilder()
                    .setColor("#2a2c31")
                    .setTitle(`${badges} ${db.data.user.global_name}`)
                    .setThumbnail(db.data.user.avatarUrl)
                    .setTimestamp()
                    .setFields(
                        {
                            name: "Nome de Usuário\n",
                            value: `\`@${db.data.user.username}\`\n\n`,
                            inline: true,
                        },
                        {
                            name: "Discord ID\n",
                            value: `\`${db.data.user.id}\`\n\n`,
                            inline: true,
                        },
                        {
                            name: "Entrou no Discord em\n",
                            value: `${moment(db.data.user.createdAt).format("D [de] MMMM [de] YYYY, [às] HH:mm")} (**${moment(db.data.user.createdAt).startOf('day').fromNow()}**)\n\n`,
                            inline: false,
                        },
                        {
                            name: "Impulsionando servidor desde\n",
                            value: `${moment(db.data.boost.boostDate).format("D [de] MMMM [de] YYYY, [às] HH:mm")} (**${moment(db.data.boost.boostDate).startOf('day').fromNow()}**)\n\n`,
                            inline: false,
                        },
                        {
                            name: `${flags[db.data.boost && db.data.boost.boost]} Impulso\n`,
                            value: `\`${moment(db.data.boost.boostDate).format("D [de] MMMM [de] YYYY, [às] HH:mm")}\`\n\n`,
                            inline: true,
                        },
                        {
                            name: `${flags[db.data.boost && db.data.boost.nextBoost]} Próximo Up\n`,
                            value: `\`${moment(db.data.boost.nextBoostDate).format("D [de] MMMM [de] YYYY, [às] HH:mm")}\`\n\n`,
                            inline: true,
                        }
                    );
                interaction.reply({ embeds: [embed], components: [row] });
            });

        } catch (error) {
            console.error(error);
        }
    }
};