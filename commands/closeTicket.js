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


const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-ticket')
        .setDescription('Close the current ticket'),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: 'You can only use this command in a ticket channel.',
                ephemeral: true,
            });
        }

        await interaction.reply({ content: 'Closing the ticket...' });
        await interaction.channel.delete();  
    },
};
