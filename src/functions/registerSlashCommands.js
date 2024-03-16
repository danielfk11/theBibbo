const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const colors = require("colors")

function loadCommands(directory, client) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            loadCommands(fullPath, client); // Se for um diretório, chama a função novamente
        } else if (file.endsWith('.js')) {
            const props = require(fullPath);
            const commandName = file.split('.')[0];
            client.interactions.set(commandName, {
                name: commandName,
                ...props
            });
            client.register_arr.push(props);
        }
    }
}

function registerSlashCommands(client) {
    client.interactions = new Discord.Collection();
    client.register_arr = [];

    // Caminho para o diretório 'commands'
    const commandsDir = path.join(__dirname, '..', '..', 'src', 'commands');


    loadCommands(commandsDir, client);

    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
            const command = client.interactions.get(interaction.commandName);
            if (!command) return interaction.reply({ content: "Algo deu errado・Talvez o comando não esteja registrado?", ephemeral: true,});
            command.run(client, interaction);
        }
    });

    const register = require("../utils/slashsync");
    client.on("ready", async () => {
        await register( client,
                client.register_arr.map((command) => ({
                name: command.name,
                description: command.description,
                options: command.options,
            })),
            { debug: true }
        );
  
        const commandNames = client.register_arr.map((command) => command.name);
        for (const name of commandNames) {
            console.log(`${colors.green("-> ")} ${colors.gray("[ /・Slash Command ] - ✅ ")} ${colors.cyan(name)}`);
        }
        
        console.log(colors.green('=> ') + colors.gray(' Status do Bot:') + colors.cyan(' TheBibbo INICIADO COM SUCESSO.'));
              
    });
}

module.exports = registerSlashCommands;
