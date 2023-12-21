const fs = require('fs');
const path = require('path');
const { token } = require('../config.json');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

// parse commands from the commands folder. NOTE* This assumes a command/some-folder/file.js structure
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        //command is valid: load it
        client.commands.set(command.data.name, command);
        console.log(`Loaded command ${command.data.name} from ${file}`);
    } else {
        //command is invalid: don't load it, print error
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

//parse event listeners from the events folder. NOTE* This assumes a events/file.js structure
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
    console.log(`Loaded event listener ${file}`);
}

client.login(token);

