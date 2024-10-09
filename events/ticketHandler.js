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


const { getTicketSetup } = require('../models/ticketSetup');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ChannelType, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Icons = require('../UI/Icons');
module.exports = async (client) => {
    client.on('ready', () => {
        setInterval(async () => {
            const guilds = client.guilds.cache;

            for (const guild of guilds.values()) {
                try {
                    const setup = await getTicketSetup(guild.id);
                    if (!setup || !setup.ticketSystemEnabled) continue;

                    const channel = guild.channels.cache.get(setup.ticketChannelId);
                    if (!channel) {
                        //console.warn(`No channel found for ID ${setup.ticketChannelId} in guild ${guild.id}`);
                        continue;
                    }

                    if (channel.type !== ChannelType.GuildText) {
                        //console.warn(`Channel ${channel.id} is not a text channel.`);
                        continue;
                    }

                    const existingMessages = await channel.messages.fetch({ limit: 1 });
                    if (existingMessages.size === 0) {
                        const embed = new EmbedBuilder()
                        .setAuthor({
                            name: "Ticket System",
                            iconURL: Icons.ticketIcon,
                            url: "https://discord.gg/xQF9f9yUEM"
                        })
                        .setDescription('- Please click the button below to create a new ticket.\n\n' +
                            '**Ticket Rules:**\n' +
                            '- Fill in all the fields accurately.\n' +
                            '- Be patient while waiting for a response from our support team.')
                        .setFooter({ text: 'At your service!', iconURL: Icons.modIcon })
                        .setColor('#00FF00'); 
                        

                        const button = new ButtonBuilder()
                            .setCustomId('create_ticket')
                            .setLabel('Open Ticket')
                            .setStyle(ButtonStyle.Primary);

                        const row = new ActionRowBuilder().addComponents(button);

                        try {
                            await channel.send({ embeds: [embed], components: [row] });
                            //console.log(`Sent ticket setup message in channel ${channel.id} of guild ${guild.id}`);
                        } catch (sendError) {
                            //console.error(`Error sending message in channel ${channel.id} of guild ${guild.id}:`, sendError);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing guild ${guild.id}:`, error);
                }
            }
        }, 10000);
    });

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId === 'create_ticket') {
                const modal = new ModalBuilder()
                    .setCustomId('ticket_modal')
                    .setTitle('Create a Support Ticket');

                const subjectInput = new TextInputBuilder()
                    .setCustomId('ticket_subject')
                    .setLabel('Subject of your Ticket')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const descriptionInput = new TextInputBuilder()
                    .setCustomId('ticket_description')
                    .setLabel('Description of your Issue')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const firstActionRow = new ActionRowBuilder().addComponents(subjectInput);
                const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);

                modal.addComponents(firstActionRow, secondActionRow);

                // Show the modal to the user
                await interaction.showModal(modal);
            }
        }

      
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ticket_modal') {
     
                const subject = interaction.fields.getTextInputValue('ticket_subject');
                const description = interaction.fields.getTextInputValue('ticket_description');

               
                const setup = await getTicketSetup(interaction.guildId);
                const existingTicket = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username}`);
                if (existingTicket) {
                    return await interaction.reply({ content: 'You already have an open ticket! If not please contact staff.', ephemeral: true });
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

                
                    const OpenEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: "Ticket Created Sucessfully",
                        iconURL: Icons.tickIcon,
                        url: "https://discord.gg/xQF9f9yUEM"
                    })
                    .setDescription(`Your ticket channel : ${ticketChannel.url}`)
                    .setFooter({ text: 'Ticket Bot V2!', iconURL: Icons.modIcon })
                    .setColor('#00FF00'); 

               
                await interaction.user.send({ embeds: [OpenEmbed] });


                
                const embed = new EmbedBuilder()
                    .setTitle(`Sub: ${subject}`)
                    .setDescription(description)
                    .setColor('#FFFF00')
                    .setFooter({ text: `Created by ${interaction.user.username}` });

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger),
                        new ButtonBuilder().setCustomId('ping_admin').setLabel('Ping Admin').setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder().setCustomId('ticket_info').setLabel('Ticket Info').setStyle(ButtonStyle.Primary)
                    );

               
                await ticketChannel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });

                
                await interaction.reply({ content: 'Your ticket has been created!', ephemeral: true });
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'close_ticket') {
                if (!interaction.channel.name.startsWith('ticket-')) {
                    return await interaction.reply({ content: 'You can only use this command in a ticket channel.', ephemeral: true });
                }

                await interaction.reply({ content: 'Closing the ticket...' });
                await interaction.channel.delete();
            } else if (interaction.customId === 'ping_admin') {
                const setup = await getTicketSetup(interaction.guildId);
                const adminRoleMentions = setup.adminRoleIds.map(roleId => `<@&${roleId}>`).join(', ');
                await interaction.channel.send(`- Attention ${adminRoleMentions}! A user has requested assistance in this ticket.`);
                await interaction.reply({ content: 'Admins have been notified.', ephemeral: true });
            } else if (interaction.customId === 'ticket_info') {
                const embed = new EmbedBuilder()
                    .setTitle(`Ticket Information`)
                    .setDescription(`Ticket created by: <@${interaction.user.id}>`)
                    .addFields({ name: 'Ticket Channel:', value: interaction.channel.name })
                    .setColor('#00FF00');

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    });
};
