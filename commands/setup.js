/*

  ██████╗░████████╗██╗░░██╗           
  ██╔══██╗╚══██╔══╝╚██╗██╔╝          
  ██████╔╝░░░██║░░░░╚███╔╝░          
  ██╔══██╗░░░██║░░░░██╔██╗░          
  ██║░░██║░░░██║░░░██╔╝╚██╗          
  ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          


   # MADE BY RTX!! FEEL FREE TO USE ANY PART OF CODE
   ## FOR HELP CONTACT ME ON DISCORD
   ## Contact    [ DISCORD SERVER :  https://discord.gg/FUEHs7RCqz ]
   ## YT : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
*/

const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } = require('discord.js');
const fs = require('fs');
const config = require('../config.js');
const crypto = require('crypto');
const { Permissions } = require('discord.js');
const { PermissionsBitField, ChannelType } = require('discord.js');


function updateTicketData(ticketData) {
  fs.writeFileSync('ticket.json', JSON.stringify(ticketData, null, 2));
}


function loadTicketData() {
    try {
        const data = fs.readFileSync('ticket.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
          
            fs.writeFileSync('ticket.json', '{}');
            return {}; 
        } else {
            throw error; 
        }
    }
}


async function closeTicket(interaction, ticketChannel) {
  try {
                     
                        const ticketOwner = interaction.user;

                     
                        await ticketChannel.delete();
    
                      
      const confirmationEmbed = new EmbedBuilder()
    .setTitle('🔴 Ticket Closed')
        .setColor('#ff0000')
  .setDescription(`**Your ticket has been closed successfully.** \n\n- If you have any further questions, feel free to open a new ticket.`)
        .setImage('https://cdn.discordapp.com/attachments/1209503146485747723/1209507551184556054/2.png?ex=65e72caf&is=65d4b7af&hm=30b0b243fe24521a08f0cc49025bc28ba0bf78be82a1d02013c0c27c190d9ada&')
    .setFooter({ text: 'Thank You for Using Our Ticket Service!', iconURL:'https://cdn.discordapp.com/attachments/1209503146485747723/1209503206871400458/5620-ticket.png?ex=65e728a4&is=65d4b3a4&hm=93bae44d478db895734ef9dfe86325b453e905c64101a20161075b153b91490d&'})
     .setTimestamp();
await ticketOwner.send({ embeds: [confirmationEmbed] });

                       
                    } catch (error) {
                      
                        if (error.code === 10003) {
                            console.error('Error closing ticket:', error);
                        } else {
                            console.error('An error occurred while closing the ticket:', error);
                        }
                    }
}


let lastTicketCreationTimestamp = 0;

function generateTicketNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}


async function createTicket(interaction, ticketChannel) {
  try {
    
    if (!interaction || !interaction.user || !interaction.user.id) {
      throw new Error('Interaction object or user property is undefined or does not contain id.');
    }
    
        const currentTimestamp = Date.now();

        
        if (currentTimestamp - lastTicketCreationTimestamp < 10000) { 
          const remainingTime = Math.ceil((10000 - (currentTimestamp - lastTicketCreationTimestamp)) / 1000);
          return await interaction.reply({ content: `Please wait ${remainingTime} seconds before creating a new ticket.`, ephemeral: true });
        }

     
        lastTicketCreationTimestamp = currentTimestamp;

    const ticketNumber = generateTicketNumber();
    const userId = interaction.user.id; 
    const channelId = ticketChannel.id;
    const creationTimestamp = new Date().toISOString();

   
    const ticket = {
      ticketNumber,
      userId,
      channelId,
      creationTimestamp,
      status: 'open',
      additionalInfo: 'Additional information here'
    };

   
    const ticketData = loadTicketData();
    ticketData.tickets.push(ticket);
    updateTicketData(ticketData);

    
    const tempChannel = await interaction.guild.channels.create({ name: 'temp-ticket-channel' }, {
      type: ChannelType.GuildText,
      parent: '1208794682897993852',
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });
    

    const newChannelName = `ticket-${ticketNumber}`;
    await tempChannel.setName(newChannelName, 'Updating channel name to include ticket number');

    const embedMessage = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Ticket Details')
     .setDescription(`📩 **Ticket opened by ${interaction.user}**\n▶️ **Ticket Number: ${ticketNumber}**\n\n\- Please provide a detailed description of your issue or request below.\n- Our support team will assist you as soon as possible.`)
    .setFooter({ text: 'Your satisfaction is our priority ', iconURL: 'https://cdn.discordapp.com/attachments/1209503146485747723/1209503207177457714/6280-2.gif?ex=65e728a4&is=65d4b3a4&hm=518c747e5e4fb9306c746b1588dd220fe185c7083254731d1c904f8042ad9f61&' });
    const createTicketButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger);

    await tempChannel.send({ embeds: [embedMessage], components: [new ActionRowBuilder().addComponents(createTicketButton)] });
      await interaction.reply({ content: 'Ticket created successfully.', ephemeral: true });
    
    const ticketOwner = interaction.user;
     const confirmationEmbed = new EmbedBuilder()
        .setTitle('✅ Ticket Opened')
            .setColor('#2bff00')
      .setDescription(` **Your ticket number is ${ticketNumber} ** \n\n-  Our team will assist you shortly. Please hang tight!\n- Feel free to mention Support team for any urgent assistance.`)
       .setImage('https://cdn.discordapp.com/attachments/1209503146485747723/1209507551683805204/1.png?ex=65e72caf&is=65d4b7af&hm=3eb4ab1565f7818bf94cdc37343be288cd7ae1792197374ee8d43a82d18cd526&')
    .setFooter({ text: 'Your satisfaction is our priority! ', iconURl:'https://cdn.discordapp.com/attachments/1209503146485747723/1209503207685103677/8917-blurple-ticket.png?ex=65e728a4&is=65d4b3a4&hm=dc0e876211f155590f3d35e543f9d205acee0df356c7d13b07ad675051bc82bf&'})
     .setTimestamp();
    await ticketOwner.send({ embeds: [confirmationEmbed] });
    
 

    
    
    tempChannel.permissionOverwrites.create(tempChannel.guild.roles.everyone, { ViewChannel: false });


        tempChannel.permissionOverwrites.edit(interaction.user.id, {
     ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true
    });

  } catch (error) {
   
    await interaction.reply({ content: 'An error occurred while creating the ticket.', ephemeral: true });
  }
}




process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});


process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
module.exports = {
  name: "setup",
  description: "Set up the ticket system for your server.",
  options: [{
    name: 'channel',
    description: 'Select the channel where you want to set up the ticket system.',
    type: ApplicationCommandOptionType.Channel,
    required: true
  }],
  run: async (client, interaction) => {
    try {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return interaction.reply({ content: 'You need to be a server administrator to set up tickets.', ephemeral: true });
      }

      const ticketChannel = interaction.options.getChannel('channel');

      const serverId = interaction.guildId;
      const serverName = interaction.guild.name;
      const setupData = JSON.parse(fs.readFileSync(config.setupFilePath, 'utf8'));
      if (setupData[serverId]) {
        return interaction.reply({ content: 'Ticket system is already set up in this server.', ephemeral: true });
      }

      setupData[serverId] = {
        serverName: serverName,
        ticketChannelId: ticketChannel.id
      };
      fs.writeFileSync(config.setupFilePath, JSON.stringify(setupData, null, 2));

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Ticket System Setup')
        .setDescription(`Click the button below to set up the ticket system in ${ticketChannel || 'the selected channel'}.`)
        .setFooter({ text: 'Make sure you choose correct channel!' });

      const button = new ButtonBuilder()
        .setCustomId('setup_ticket')
        .setLabel('🛠️ Set up Ticket System')
        .setStyle(ButtonStyle.Primary);

      const message = await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)], ephemeral: true });

      client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton() && interaction.customId === 'setup_ticket') {
          try {
            const setupData = JSON.parse(fs.readFileSync(config.setupFilePath, 'utf8'));
            const serverId = interaction.guildId;
            const ticketChannelId = setupData[serverId]?.ticketChannelId;

            if (!ticketChannelId) {
              return interaction.reply({ content: 'Ticket system setup is incomplete. Please run the setup command again.', ephemeral: true });
            }

            const ticketChannel = await client.channels.fetch(ticketChannelId);
            if (ticketChannel) {
              const fixedTicketEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎟️ Welcome to Ticket Support')
                .setImage('https://cdn.discordapp.com/attachments/1004341381784944703/1165201249331855380/RainbowLine.gif')
              .setDescription('Thank you for choosing our ticket system for support. Please click the button below to create a new ticket.\n\n' +
                 '**Ticket Guidelines:**\n' +
                 '- Empty tickets are not permitted.\n' +
                 '- Please be patient while waiting for a response from our support team.')
              .setFooter({ text: 'We are here to Help!', iconURL:'https://cdn.discordapp.com/attachments/1209499496732692580/1209514764531924992/1667-yellow-gears.gif?ex=65e73367&is=65d4be67&hm=10e9c542cab73102272ecb710cb58f11e581d7c6e9bf7d7c9da6217cda3928b9&'});

              const createTicketButton = new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('📩 Create a Ticket')
                .setStyle(ButtonStyle.Primary);

              await ticketChannel.send({ embeds: [fixedTicketEmbed], components: [new ActionRowBuilder().addComponents(createTicketButton)] });
             
              await interaction.reply({ content: 'Setup successful. ', ephemeral: true });
            
              
            } else {
              console.error('Unable to fetch ticket channel.');
              return interaction.reply({ content: 'Unable to fetch ticket channel.', ephemeral: true });
            }
          } catch (error) {
            console.error('Error setting up tickets:', error);
            await interaction.reply({ content: 'An error occurred while setting up tickets.', ephemeral: true });
          }
        }
      });

     
      client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton() && interaction.customId === 'create_ticket') {
          console.log('Ticket Created');
        
        }
      });

     
      client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton() && interaction.customId === 'close_ticket') {
          console.log('Ticket Closed');
        }
      });

  

    } catch (error) {
      console.error('Error setting up tickets:', error);
      await interaction.reply({ content: 'An error occurred while setting up tickets.', ephemeral: true });
    }
  },
  closeTicket,
  createTicket
};


/*

  ██████╗░████████╗██╗░░██╗           
  ██╔══██╗╚══██╔══╝╚██╗██╔╝          
  ██████╔╝░░░██║░░░░╚███╔╝░          
  ██╔══██╗░░░██║░░░░██╔██╗░          
  ██║░░██║░░░██║░░░██╔╝╚██╗          
  ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          


   # MADE BY RTX!! FEEL FREE TO USE ANY PART OF CODE
   ## FOR HELP CONTACT ME ON DISCORD
   ## Contact    [ DISCORD SERVER :  https://discord.gg/FUEHs7RCqz ]
   ## YT : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A
*/