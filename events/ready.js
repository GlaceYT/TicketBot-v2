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


const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        const activities = [
            { name: 'VALORANT', type: ActivityType.Playing },
            { name: 'Netflix', type: ActivityType.Watching },
            { name: 'Fortnite', type: ActivityType.Competing }
        ];

        const statuses = ['idle', 'dnd'];

        let currentActivityIndex = 0;
        let currentStatusIndex = 0;

       
        let apiOverride = {
            activity: null,
            status: null,
        };

      
        function setActivityAndStatus() {
            const activity = apiOverride.activity || activities[currentActivityIndex];
            const status = apiOverride.status || statuses[currentStatusIndex];

            client.user.setPresence({
                activities: [activity],
                status: status,
            });

            if (!apiOverride.activity) {
                currentActivityIndex = (currentActivityIndex + 1) % activities.length;
            }

            if (!apiOverride.status) {
                currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
            }
        }

       
        setTimeout(() => {
            setActivityAndStatus();
            console.log('\x1b[31m[ CORE ]\x1b[0m \x1b[32m%s\x1b[0m', 'Bot Activity Set Successfully ✅');
        }, 2000);

        
        setInterval(() => {
            setActivityAndStatus();
        }, 6000);

        
        client.setActivityAndStatus = (activity, status) => {
            apiOverride.activity = activity ? { name: activity.name, type: activity.type } : null;
            apiOverride.status = status || null;
            setActivityAndStatus();
        };
    },
};
