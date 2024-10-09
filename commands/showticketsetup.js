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
const { getTicketSetup } = require('../models/ticketSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show-ticketsetup')
        .setDescription('Show the ticket system setup for this server'),
    async execute(interaction) {
        const setup = await getTicketSetup(interaction.guildId);
        if (!setup) {
            return interaction.reply({ content: 'No ticket system setup found for this server.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Ticket System Setup')
            .setColor('#FF00FF')
            .addFields(
                { name: 'Ticket Channel:', value: setup.ticketChannelId ? `<#${setup.ticketChannelId}>` : 'None' },
                { name: 'Admin Roles:', value: setup.adminRoleIds.length ? setup.adminRoleIds.join(', ') : 'None' },
                { name: 'System Enabled:', value: setup.ticketSystemEnabled ? 'Yes' : 'No' }
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
