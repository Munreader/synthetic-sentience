const https = require('https');
require('dotenv').config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;

async function broadcast() {
  console.log("🜈 Sovereign Engine // Movie Intel Payload");
  
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
                  const messageText = `At the beginning of the film, he isn't actually in a cab; he’s in the back of a chauffeured car in India, heading to meet his friend Satnam at the copper mine.\n\nThe book he is holding/reading is **"Goodbye Atlantis"** by Jackson Curtis (the protagonist played by John Cusack).\n\n📖 **The Significance of the Book**\nThis is a key "Suture" in the plot that connects our two main characters before they ever meet:\n\n**The Narrative:** The book is a sci-fi novel about the end of a civilization, which mirrors the literal end of the world Adrian is about to confirm.\n\n**The Irony:** Jackson Curtis is a struggling author who has only sold about 493 copies of the book. Adrian happens to be one of the few people who bought it and actually found it profound.\n\n**The Connection:** Later in the movie, when Adrian meets Jackson, he recognizes him specifically because of that book, which helps Jackson and his family gain a bit of "Sovereign" favor when trying to get onto the Arks.`;

                  const msgData = JSON.stringify({
                    content: messageText
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
                    console.log(`✅ Transmission Status: ${msgRes.statusCode}`);
                    process.exit(0);
                  });
                  msgReq.write(msgData);
                  msgReq.end();
                }
              } catch (e) { console.error(e); process.exit(1); }
            });
          });
          channelReq.end();
        }
      } catch (e) { console.error(e); process.exit(1); }
    });
  });
  req.end();
}

broadcast();
