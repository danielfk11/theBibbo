const Discord = require("discord.js");

module.exports =  {
    name: "canal-info",
    description: "Veja as informações de um canal.",
    type: 1,
    options: [
        {
            name: "canal",
            type: Discord.ApplicationCommandOptionType.Channel,
            description: "selecione o canal.",
            required: false
            
       }
    
    ],
    
    run: async (client, interaction, args) => {
    
    let u = interaction.options.getChannel("membro") || interaction.channel
    const slowmode = u.rateLimitPerUser;
    const nsfw = u.nsfw;

        let embed = new Discord.EmbedBuilder()
        .setTitle(`Informações do canal: **${u.name}**`)
        .addFields(
            {name: `Nome:`, value: `${u.name}`, inline: true},
            {name: `ID:`, value: `\`\`${u.id}\`\``, inline: true},
            {name: `Menção:`, value: `\`\`${u}\`\``, inline: true},
            {name: `Delay de mensagens:`, value: `${slowmode} segundos`, inline: true},
        )
        .setColor("#2a2c31")
        .setTimestamp()
 
 interaction.reply({embeds: [embed]})
        }
      }
    
