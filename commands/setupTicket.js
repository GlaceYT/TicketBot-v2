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
const { setTicketSetup } = require('../models/ticketSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Configure the ticket system for this server')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the ticket creation button')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('admin-roles')
                .setDescription('Comma-separated list of admin role IDs who can manage tickets')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('enabled')
                .setDescription('Enable or disable the ticket system')
                .setRequired(true)
        ),

    async execute(interaction) {
       
        await interaction.deferReply({ ephemeral: true });

        try {
            const channel = interaction.options.getChannel('channel');
            const adminRoles = interaction.options.getString('admin-roles').split(',');
            const enabled = interaction.options.getBoolean('enabled');

         
            await setTicketSetup(interaction.guildId, channel.id, adminRoles, enabled);

          
            await interaction.followUp({
                content: `Ticket system configuration saved! Ticket system is now **${enabled ? 'enabled' : 'disabled'}**.`,
                ephemeral: true
            });
        } catch (error) {
            console.error(error);

         
            await interaction.followUp({
                content: `An error occurred while saving the ticket system configuration. Please try again.`,
                ephemeral: true
            });
        }
    }
};
