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
const Icons = require('../UI/Icons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Support server of this Bot'),
    async execute(interaction) {
        const supportServerLink = "https://discord.gg/xQF9f9yUEM";
        const githubLink = "https://github.com/GlaceYT";
        const replitLink = "https://replit.com/@GlaceYT";
        const youtubeLink = "https://www.youtube.com/@GlaceYT";

        const embed = new EmbedBuilder()
            .setColor('#b300ff')
            .setAuthor({
                name: 'Support Server',
                iconURL: Icons.dotIcon,
                url: 'https://discord.gg/xQF9f9yUEM'
            })
            .setDescription(`➡️ **Join our Discord server for support and updates:**\n- Discord - ${supportServerLink}\n\n➡️ **Follow us on:**\n- GitHub - ${githubLink}\n- Replit - ${replitLink}\n- YouTube - ${youtubeLink}`)
            .setImage('https://cdn.discordapp.com/attachments/1264134884432285766/1293631187730038885/GlaceYT.gif?ex=6708136d&is=6706c1ed&hm=45c799968ea8269c7d9e77fc4c1dd41f793cd56808d206a496354bf84be434fb&')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
