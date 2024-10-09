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


const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show-tickets')
        .setDescription('Show all active tickets for this server'),
    async execute(interaction) {
        const activeTickets = interaction.guild.channels.cache.filter(c => c.name.startsWith('ticket-'));
        if (activeTickets.size === 0) {
            return interaction.reply({ content: 'There are no active tickets.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Active Tickets')
            .setColor('#FFFF00')
            .setDescription(activeTickets.map(c => `• <#${c.id}> - Created by ${c.name.split('-')[1]}`).join('\n'));

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
