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


const status = "AUTOMATIC";
const botName = "🎟️ TICKET BOT";
const Text = "GlaceYT";
const version = "Latest@ v1.0"; 
const startTime = Date.now();

function printWatermark() {
  const uptimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\x1b[1m\x1b[36m╔════════════════════════════════════════════╗');
  console.log('\x1b[1m\x1b[36m║                                            ║');
  console.log(`\x1b[1m\x1b[36m            ${botName}     `);
  console.log(`\x1b[1m\x1b[36m            👑 Authorization : ${status}    `);
  console.log(`\x1b[1m\x1b[36m            💡 Version: ${version}`);
  console.log(`\x1b[1m\x1b[36m            📅 Uptime: ${uptimeInSeconds}s`);
  console.log(`\x1b[1m\x1b[36m            🚀 Powered by ${Text}`);
  console.log('\x1b[1m\x1b[36m║                                            ║');
  console.log('\x1b[1m\x1b[36m╚════════════════════════════════════════════╝\x1b[0m');
}
module.exports = {
  printWatermark,
};