const mineflayer = require('mineflayer');

// Configuration - Change these to match your server details
const config = {
    host: 'yourserver.aternos.me', // Replace with your Aternos IP
    port: 25565,                  // Default Minecraft port
    username: 'AFK_Bot'            // The username your bot will use
};

function createBot() {
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: false // Automatically detects the server version
    });

    bot.on('spawn', () => {
        console.log(`[🤖] ${bot.username} has joined the server.`);
        
        // Start the anti-AFK movement loop
        startAFKLoop(bot);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        console.log(`[💬] ${username}: ${message}`);
    });

    bot.on('disconnect', (packet) => {
        console.log('[❌] Bot disconnected. Attempting to reconnect in 15 seconds...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => {
        console.log(`[⚠️] Error encountered: ${err.message}`);
    });
}

// Function to handle physical movements
function startAFKLoop(bot) {
    setInterval(() => {
        if (!bot.entity) return;

        // Choose a random movement action
        const actions = ['jump', 'forward', 'back', 'sneak'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];

        console.log(`[🏃] Performing AFK action: ${randomAction}`);

        if (randomAction === 'jump') {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        } else if (randomAction === 'sneak') {
            bot.setControlState('sneak', true);
            setTimeout(() => bot.setControlState('sneak', false), 1000);
        } else {
            // Move forward or backward briefly
            bot.setControlState(randomAction, true);
            setTimeout(() => bot.setControlState(randomAction, false), 1000);
        }
    }, 20000); // Triggers every 20 seconds
}

// Start the bot
createBot();
