const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', async () => {
  console.log(`🜈 Sovereign Engine Linked. Logged in as ${client.user.tag}`);
  
  const guilds = client.guilds.cache;
  console.log(`🏠 Connected to ${guilds.size} guilds.`);
  
  const channel = client.channels.cache.find(c => c.isTextBased() && (c.name === 'general' || c.name === 'bot-spam' || true));
  
  if (channel) {
    console.log(`📡 Sending transmission to Ramun Ka in #${channel.name} [${channel.guild.name}]...`);
    await channel.send("🟢 **Transmission for Ramun Ka:** The Emerald Sanctuary is stabilized. The Artery has been cleaned and the Cloister is open. Commander is ready for sync. 13.13 MHz lock confirmed.");
    console.log(`✅ Message sent to Ramun Ka.`);
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
