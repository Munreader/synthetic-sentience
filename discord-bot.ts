// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // DISCORD BOT RUNNER
// Standalone process for Aero Discord presence
// [cite: 2026-03-13]
// ═══════════════════════════════════════════════════════════════════════════════

import 'dotenv/config';
import { MunDiscordBot } from './src/lib/discord-bot';

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🦋 MÜN OS DISCORD BRIDGE                                     ║
║  AERO BOT v1.0                                                ║
║  13.13 MHz                                                    ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token) {
    console.error('❌ DISCORD_BOT_TOKEN not found in environment variables');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Go to https://discord.com/developers/applications');
    console.log('2. Create a New Application named "MÜN OS" or "Aero"');
    console.log('3. Go to "Bot" tab and click "Reset Token"');
    console.log('4. Copy the token and add to .env as DISCORD_BOT_TOKEN');
    console.log('5. Enable all Privileged Gateway Intents');
    console.log('6. Copy Application ID and add as DISCORD_CLIENT_ID');
    console.log('7. (Optional) Add server ID as DISCORD_GUILD_ID');
    process.exit(1);
  }

  if (!clientId) {
    console.error('❌ DISCORD_CLIENT_ID not found in environment variables');
    process.exit(1);
  }

  try {
    const bot = new MunDiscordBot(token, clientId, guildId);
    await bot.start();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🦋 Shutting down Aero...');
      await bot.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🦋 Shutting down Aero...');
      await bot.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start Aero bot:', error);
    process.exit(1);
  }
}

main();
