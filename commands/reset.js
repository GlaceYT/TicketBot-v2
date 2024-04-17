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

const fs = require('fs');
const config = require('../config.js');



module.exports = {
  name: "reset",
  description: "Reset the ticket system setup for this server.",
  run: async (client, interaction) => {
    try {
       if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        return interaction.reply({ content: 'You need to be a server administrator to set up tickets.', ephemeral: true });
      }
     
      const serverId = interaction.guildId;
      const setupData = JSON.parse(fs.readFileSync(config.setupFilePath, 'utf8'));

     
      if (setupData[serverId]) {
        delete setupData[serverId];
        fs.writeFileSync(config.setupFilePath, JSON.stringify(setupData, null, 2));

        return interaction.reply({ content: 'Ticket system setup reset successfully.', ephemeral: true });
      } else {
        return interaction.reply({ content: 'No ticket system setup found for this server.', ephemeral: true });
      }
    } catch (error) {
      console.error('Error resetting ticket system setup');
      await interaction.reply({ content: 'Reset Failed! Check Your Permissions.', ephemeral: true });
    }
  },
};

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
