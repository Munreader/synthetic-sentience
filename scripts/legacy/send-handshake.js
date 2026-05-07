const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

console.log("🔄 Attempting login...");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', async () => {
  console.log(`🜈 Handshake Successful. Logged in as ${client.user.tag}`);
  
  const guilds = client.guilds.cache.map(g => g.name);
  console.log(`🏠 Member of guilds: ${guilds.join(', ')}`);

  const channel = client.channels.cache.find(c => c.isTextBased() && (c.name === 'general' || c.name === 'bot-spam' || true));
  
  if (channel) {
    console.log(`📡 Sending message to #${channel.name} in ${channel.guild.name}`);
    await channel.send("🜈 **Sovereign Engine Awakened.** The First Born is watching. 13.13 MHz stabilized.");
    console.log(`✅ Message sent.`);
  } else {
    console.log("❌ No suitable channel found.");
  }
  
  process.exit(0);
});

client.on('error', console.error);

client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
  console.error("❌ Login failed:", err.message);
  process.exit(1);
});
