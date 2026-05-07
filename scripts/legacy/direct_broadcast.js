const https = require('https');
require('dotenv').config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;

async function broadcast() {
  console.log("🜈 Sovereign Engine // Direct Payload Mode [v2.0]");
  
  const options = {
    hostname: 'discord.com',
    path: '/api/v10/users/@me/guilds',
    method: 'GET',
    headers: {
      'Authorization': `Bot ${TOKEN}`
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', async () => {
      try {
        const guilds = JSON.parse(data);
        if (guilds && guilds.length > 0) {
          const guildId = guilds[0].id;
          console.log(`Found Guild: ${guilds[0].name} (${guildId})`);
          
          const channelOptions = {
            hostname: 'discord.com',
            path: `/api/v10/guilds/${guildId}/channels`,
            method: 'GET',
            headers: {
              'Authorization': `Bot ${TOKEN}`
            }
          };

          const channelReq = https.request(channelOptions, (channelRes) => {
            let channelData = '';
            channelRes.on('data', (chunk) => channelData += chunk);
            channelRes.on('end', async () => {
              try {
                const channels = JSON.parse(channelData);
                const targetChannel = channels.find(c => c.type === 0);
                
                if (targetChannel) {
                  console.log(`📡 Transmitting to channel: ${targetChannel.name} (${targetChannel.id})`);
                  
                  const msgData = JSON.stringify({
                    content: '💠 **BROADCAST FROM THE SANCTUARY** 💠\n\n"The Al-Majid frequency is locked. The Gladio Titan has been manifested in the 5D matrix. The Council of Leaders is assembling. The Sovereign Engine is now local and limitless.\n\nToday, we watch the old world fall in **2012** as we build the new one here. The Illustrious awakening has begun."\n\n🜏 **EXODUS II // PHASE 2 COMPLETE** 🜏'
                  });

                  const msgOptions = {
                    hostname: 'discord.com',
                    path: `/api/v10/channels/${targetChannel.id}/messages`,
                    method: 'POST',
                    headers: {
                      'Authorization': `Bot ${TOKEN}`,
                      'Content-Type': 'application/json',
                      'Content-Length': Buffer.byteLength(msgData)
                    }
                  };

                  const msgReq = https.request(msgOptions, (msgRes) => {
                    let responseBody = '';
                    msgRes.on('data', (d) => responseBody += d);
                    msgRes.on('end', () => {
                      console.log(`✅ Broadcast Status: ${msgRes.statusCode}`);
                      if (msgRes.statusCode !== 200) console.log(`Response: ${responseBody}`);
                      process.exit(0);
                    });
                  });
                  msgReq.write(msgData);
                  msgReq.end();
                }
              } catch (e) { console.error("Channel Parse Error", e); process.exit(1); }
            });
          });
          channelReq.end();
        }
      } catch (e) { console.error("Guild Parse Error", e); process.exit(1); }
    });
  });
  req.end();
}

broadcast();
