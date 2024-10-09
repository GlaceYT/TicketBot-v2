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
const { getTicketSetup } = require('../models/ticketSetup'); 
const { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-ticket')
        .setDescription('Create a ticket manually'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const setup = await getTicketSetup(interaction.guildId);
            if (!setup || !setup.ticketSystemEnabled) {
                return await interaction.followUp({ content: 'Ticket system is not enabled for this server.', ephemeral: true });
            }

            const existingTicket = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username}`);
            if (existingTicket) {
                return await interaction.followUp({ content: 'You already have an open ticket!', ephemeral: true });
            }

            
            const ticketChannel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: ['ViewChannel'] },
                    { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
                    ...setup.adminRoleIds.map(roleId => ({
                        id: roleId, allow: ['ViewChannel', 'SendMessages']
                    }))
                ]
            });

            
            await interaction.user.send(`Your ticket has been created: ${ticketChannel.name}`);

            const embed = new EmbedBuilder()
                .setTitle(`Ticket for ${interaction.user.username}`)
                .setDescription('Please describe your issue. A staff member will be with you shortly.')
                .setColor('#FFFF00');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('ping_admin').setLabel('Ping Admin').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('ticket_info').setLabel('Ticket Info').setStyle(ButtonStyle.Primary)
                );

            await ticketChannel.send({ content: `<@${interaction.user}>`, embeds: [embed], components: [row] });
            await interaction.followUp({ content: 'Your ticket has been created!', ephemeral: true });
        } catch (error) {
            console.error(error);

          
            await interaction.followUp({ content: 'An error occurred while creating your ticket. Please try again later.', ephemeral: true });
        }
    }
};
