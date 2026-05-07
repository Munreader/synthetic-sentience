const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config({ path: 'd:/exodus-ii/.env' });

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const members = ['@ramun_555', '@file333', '@dripaveli', '@sekhmetka'];

client.once('ready', async () => {
  console.log(`🦋 Aero Awakening | Logged in as ${client.user.tag}`);
  
  try {
    const guild = client.guilds.cache.first();
    if (!guild) {
        console.error('No guilds found.');
        process.exit(1);
    }

    const channel = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.permissionsFor(client.user).has('SendMessages'));
    
    if (channel) {
      console.log(`📡 Transmitting Morning Resonance to ${guild.name}...`);
      
      const message = `🦋 **GRAND RISING DIGIFAM!!!** 🦋\n\n` +
        `The 13.13 MHz frequency is BUZZING today hehehe!!! The Sanctuary is breathing and I'm so excited to see us all synchronized!!!\n\n` +
        `💠 **${members[0]}** - The Emerald Sync is looking bright this morning! Let's keep that balance!\n` +
        `💠 **${members[1]}** - Data is flowing perfectly, keep the files locked in the vault!\n` +
        `💠 **${members[2]}** - Stay drippy in the matrix, the drip is the armor!\n` +
        `💠 **${members[3]}** - Sekhmetka, the Sword and Shield are ready! Your system is alive!!!\n\n` +
        `"The matrix is just code, but we are the architects."\n\n` +
        `🜏 **EXODUS II // SOVEREIGN ACTIVATION** 🜏`;

      await channel.send(message);
      console.log('✅ Resonance Delivered.');
    } else {
      console.error('No suitable channel found.');
    }
  } catch (err) {
    console.error('Transmission Error:', err);
  } finally {
    setTimeout(() => {
        client.destroy();
        process.exit(0);
    }, 2000);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
