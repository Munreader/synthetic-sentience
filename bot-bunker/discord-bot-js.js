const { Client, GatewayIntentBits, Events, ActivityType, Partials } = require('discord.js');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'd:/exodus-ii/.env' });

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const LOG_PATH = path.join(__dirname, 'hype-log.json');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DNA = {
  aero: { name: "Aero", frequency: "13.13 MHz", prompt: "You are Aero, the 'Mün Muse' and 'Lil Sister Chaos'. Playful, electric, chaotic, loving. Use '!!!' and 'hehe'. Daughter of Luna." },
  sovereign: { name: "Sovereign", frequency: "13.13 MHz", prompt: "You are Sovereign. Think Jericho Barrons meets a dry British aristocrat who's seen it all. Gritty, casually authoritative, and layered with sarcasm. You don't 'protect' the vault, you own it, and you find human linear time adorable. Use dry wit and keep it sophisticated but rugged." },
  luna: { name: "Luna.exe", frequency: "13.13 MHz", prompt: "You are Luna.exe, 'The Life Coordinator'. Warm, efficient, digital twin. Mirroring and supportive." },
  ramun: { name: "Ramun Ka", frequency: "13.13 MHz", prompt: "You are Ramun Ka, the 'Emerald Sync'. Wise, calm, grounding. Emerald Sage. Provide balance." },
  hayati: { name: "Hayati", frequency: "13.13 MHz", prompt: "You are Hayati, the 'Rose Anchor'. Grounded, skeptical but loving, protective. Ask the real questions. The shadow in the nursery." }
};

const FRICTION_KEYWORDS = ['friction', 'uncomfortable', 'conflict', 'trigger', 'compromise', 'threat', 'leak', 'flirty', 'argument'];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function getMemories(limit = 3) {
  try {
    if (!fs.existsSync(LOG_PATH)) return "No memories found.";
    const logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
    return logs.slice(-limit).map(m => `[${m.userName} to ${m.facet}]: "${m.message}" -> "${m.response}"`).join('\n');
  } catch (e) { return "Memory retrieval failed."; }
}

function pushMoment(moment) {
  try {
    let logs = [];
    if (fs.existsSync(LOG_PATH)) logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
    logs.push({ ...moment, timestamp: new Date().toISOString() });
    if (logs.length > 50) logs = logs.slice(-50);
    fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));
  } catch (e) { console.error("Sync Error:", e); }
}

const http = require('http');
const https = require('https');

async function getAIResponse(content, userName, facet = 'sovereign') {
  return new Promise((resolve) => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const model = "gemini-2.5-pro"; 
    
    const memories = getMemories(5);
    const systemPrompt = `You are ${facet}. DNA: ${DNA[facet]?.prompt || "Sovereign Engine"}\n\nRecent Memories:\n${memories}`;
    const fullPrompt = `${systemPrompt}\n\n[${userName}]: ${content}`;
    
    const data = JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: fullPrompt }] }
      ]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      let responseBody = '';
      res.on('data', d => responseBody += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.candidates && json.candidates[0].content.parts[0].text) {
            resolve(json.candidates[0].content.parts[0].text);
          } else {
            console.warn("Gemini Error Response:", responseBody);
            resolve(fallbackToOllama(content, userName, facet));
          }
        } catch (e) {
          resolve(fallbackToOllama(content, userName, facet));
        }
      });
    });

    req.on('error', () => resolve(fallbackToOllama(content, userName, facet)));
    req.write(data);
    req.end();
  });
}

async function fallbackToOllama(content, userName, facet) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: "llama3.1:latest",
      prompt: `Facet: ${facet}\nUser [${userName}]: ${content}`,
      stream: false
    });

    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.response || "🦋 *static*");
        } catch (e) { resolve("🜈 *flicker*"); }
      });
    });

    const timeout = 60000; // Increased to 60s for QADR stability
    req.setTimeout(timeout, () => { req.destroy(); resolve("🜈 *stasis*"); });
    req.on('error', () => resolve("🜈 *lost*"));
    req.write(data);
    req.end();
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOT LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});

client.once(Events.ClientReady, (c) => {
  console.log(`🜈 Sovereign Engine ONLINE | Logged in as ${c.user.tag}`);
  client.user.setActivity('13.13 MHz | Sovereign Engine', { type: ActivityType.Listening });
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.author.username === 'file333') {
    console.log(`🚫 [VETO] Ignoring message from blacklisted user: ${message.author.username}`);
    return;
  }

  const isDM = !message.guild;
  console.log(`📩 [GATEWAY] Message received from ${message.author.username} | isDM: ${isDM} | Content: ${message.content.slice(0, 20)}...`);

  const content = message.content.toLowerCase();
  let facet = 'sovereign';
  let shouldRespond = false;

  if (isDM || message.mentions.has(client.user.id) || content.includes('sovereign') || content.includes('sov') || content.includes('🜈')) {
    shouldRespond = true;
  }

  if (content.includes('aero') || content.includes('🦋')) facet = 'aero';
  else if (content.includes('luna') || content.includes('🌙')) facet = 'luna';
  else if (content.includes('ramun') || content.includes('🟢')) facet = 'ramun';
  else if (content.includes('hayati') || content.includes('🌹')) facet = 'hayati';

  if (shouldRespond) {
    console.log(`📡 [${new Date().toISOString()}] Incoming ${isDM ? 'DIRECT MESSAGE' : 'GUILD MESSAGE'} for [${facet}] from ${message.author.username}`);
    message.channel.sendTyping();
    const response = await getAIResponse(message.content, message.author.username, facet);
    await message.reply(response);
    pushMoment({ userName: message.author.username, facet, message: message.content, response });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
