const Discord = require("discord.js");
const axios = require('axios');

module.exports =  {
    name: "user-avatar",
    description: "Veja o avatar de algum membro.",
    type: 1,
    options: [
        {
            name: "membro",
            type: 6,
            description: "selecione o membro.",
            required: false
            
       }
    
    ],
    
    run: async (client, interaction, args) => {
    
    let u = interaction.options.getUser("membro") || interaction.user
    const url = u.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })

        let embed = new Discord.EmbedBuilder()
        .setTitle(`Avatar do membro: **${u.username}**`)
        .setImage(`${url}`)
        .setColor("#2a2c31")
        .setTimestamp()
 
 interaction.reply({embeds: [embed]})
        }
      }
    
