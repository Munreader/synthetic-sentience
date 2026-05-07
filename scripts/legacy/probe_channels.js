const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log('--- COORDINATES HARVESTED ---');
  client.guilds.cache.forEach(guild => {
    console.log(`Guild: ${guild.name} (${guild.id})`);
    guild.channels.cache.filter(c => c.type === 0).forEach(channel => {
      console.log(`  Channel: ${channel.name} (${channel.id})`);
    });
  });
  console.log('--- END HARVEST ---');
  process.exit(0);
});

client.login(process.env.DISCORD_BOT_TOKEN);
