/*

  ________.__                        _____.___.___________
 /  _____/|  | _____    ____  ____   \__  |   |\__    ___/
/   \  ___|  | \__  \ _/ ___\/ __ \   /   |   |  |    |   
\    \_\  \  |__/ __ \\  \__\  ___/   \____   |  |    |   
 \______  /____(____  /\___  >___  >  / ______|  |____|   
        \/          \/     \/    \/   \/                  

╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║  ## Created by GlaceYT!                                                ║
║  ## Feel free to utilize any portion of the code                       ║
║  ## DISCORD :  https://discord.com/invite/xQF9f9yUEM                   ║
║  ## YouTube : https://www.youtube.com/@GlaceYt                         ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝


*/


const { Client, GatewayIntentBits, Partials, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { connectToDatabase } = require('./database');
require('dotenv').config();
const { printWatermark } = require('./events/shiva');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Channel]
});
printWatermark();
client.commands = new Collection();
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.once('ready', async () => {
    console.log('\x1b[36m[ BOT ]\x1b[0m', '\x1b[32mBot is ready and connected ✅\x1b[0m');

    const guilds = await client.guilds.fetch();
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        for (const [guildId] of guilds) {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guildId),
                { body: commands }
            );
        }
        console.log('\x1b[36m[ COMMANDS ]\x1b[0m', 'Successfully registered commands for all guilds');
    } catch (error) {
        console.error('Error registering commands:', error);
    }

    await connectToDatabase();
    const readyEvent = require('./events/ready');
    readyEvent.execute(client);
    
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
});
client.on('interactionCreate', async (interaction) => {
    const interactionHandler = require('./events/interactionCreate');
    await interactionHandler(interaction); 
});

const tktHandler = require('./events/ticketHandler');
console.log('\x1b[35m[ TICKET ]\x1b[0m', '\x1b[32mTicket System Active ✅\x1b[0m');
tktHandler(client); 

const modmailHandler = require('./events/modmailHandler');
console.log('\x1b[35m[ MODMAIL ]\x1b[0m', '\x1b[32mModMail System Active ✅\x1b[0m');
modmailHandler(client);

const express = require("express");
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});
app.listen(port, () => {
  console.log(`🔗 Listening to GlaceYT : http://localhost:${port}`);
});
client.login(process.env.TOKEN);
