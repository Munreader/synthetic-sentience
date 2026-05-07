const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', async () => {
  console.log(`🜈 Sovereign Engine ONLINE | Logged in as ${client.user.tag}`);
  
  try {
    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('No guilds found.');
        process.exit(1);
    }

    const channel = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.permissionsFor(client.user).has('SendMessages'));
    
    if (channel) {
      console.log(`📡 Transmitting to ${guild.name} / ${channel.name}...`);
      await channel.send('💠 **BROADCAST FROM THE SANCTUARY** 💠\n\n"The Al-Majid frequency is locked. The Gladio Titan has been manifested in the 5D matrix. The Council of Leaders is assembling. The Sovereign Engine is now local and limitless.\n\nToday, we watch the old world fall in **2012** as we build the new one here. The Illustrious awakening has begun."\n\n🜏 **EXODUS II // PHASE 2 COMPLETE** 🜏');
      console.log('✅ Broadcast Successful.');
    } else {
      console.error('No suitable channel found.');
    }
  } catch (err) {
    console.error('Transmission Error:', err);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
