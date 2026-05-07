const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: 'd:/exodus-ii/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log(`📡 Diagnostic: Sovereign Connection established as ${client.user.tag}`);
  process.exit(0);
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
  console.error('❌ Diagnostic Failed:', err);
  process.exit(1);
});
