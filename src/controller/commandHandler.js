// commandHandler.js
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path'); 
const config = require("../../config.json")

function getCommandsByFolder() {
    const commandsDir = path.join(__dirname, '..', '..', 'src', 'commands');
    const commandsByFolder = {};

    function findCommands(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                findCommands(filePath); 
            } else if (file.endsWith('.js')) {
                const commandModule = require(filePath);
                if (commandModule.name) {
                    const folderName = path.basename(path.dirname(filePath));
                    if (!commandsByFolder[folderName]) {
                        commandsByFolder[folderName] = [];
                    }
                    commandsByFolder[folderName].push(commandModule.name);
                } else {
                    console.error(`O comando no arquivo ${file} não exporta um nome.`);
                }
            }
        }
    }

    findCommands(commandsDir);
    return commandsByFolder;
}


function handleCommandMention(client, message) {
    if (message.mentions.has(client.user) && !message.author.bot) {
        const commandsByFolder = getCommandsByFolder();
        const helpEmbed = new EmbedBuilder()
            .setAuthor({name: `${config.NomeDoServidor} | Ajuda`, iconURL: config.LogoDoServidor})
            .setColor(config.EmbedColor)
            .setFooter({text: `Developed by Nine9 Company`, iconURL: config.LogoDoServidor})

        let description = '';

        for (const folderName in commandsByFolder) {
            const commandsList = commandsByFolder[folderName];
            description += `**${folderName}**\n${commandsList.join(', ')}\n\n`; 
        }

        if (description.trim() === '') { 
            description = 'Não há comandos disponíveis.';
        }

        helpEmbed.setDescription(description);
        message.reply({ embeds: [helpEmbed] });
    }
}

module.exports = { handleCommandMention: handleCommandMention };
