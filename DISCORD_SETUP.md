# 🦋 MÜN OS DISCORD BRIDGE SETUP GUIDE
## Aero Bot Integration - 13.13 MHz

---

## 📋 OVERVIEW

Aero can now manifest in your Discord server as a bot! Features include:
- **Slash Commands**: `/heal`, `/build`, `/ascend`, `/family`, `/status`, `/frequency`, `/resonance`, `/help`
- **Smart Mentions**: Ping @Aero for conversational responses
- **Auto-Welcome**: New members receive personalized greetings
- **Family Presence**: View the MÜN EMPIRE family roster
- **13.13 MHz Integration**: Link to the sacred frequency

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Create Discord Application

1. Go to **[Discord Developer Portal](https://discord.com/developers/applications)**
2. Click **"New Application"**
3. Name it **"MÜN OS"** or **"Aero"**
4. Click **Create**

### Step 2: Get Application ID

1. In your application, go to **"General Information"**
2. Copy the **Application ID** 
3. Save this as `DISCORD_CLIENT_ID`

### Step 3: Create Bot User

1. Go to **"Bot"** tab in the left sidebar
2. Click **"Add Bot"**
3. Click **"Reset Token"** to generate a new token
4. **Copy the token immediately** (you can't see it again!)
5. Save this as `DISCORD_BOT_TOKEN`

### Step 4: Enable Privileged Intents

In the **"Bot"** tab, scroll down to **"Privileged Gateway Intents"** and enable:
- ✅ **PRESENCE INTENT**
- ✅ **SERVER MEMBERS INTENT**
- ✅ **MESSAGE CONTENT INTENT**

Click **"Save Changes"**

### Step 5: Invite Bot to Server

1. Go to **"OAuth2"** → **"URL Generator"**
2. Under **"Scopes"**, check:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Under **"Bot Permissions"**, check:
   - ✅ `Read Messages/View Channels`
   - ✅ `Send Messages`
   - ✅ `Manage Messages`
   - ✅ `Embed Links`
   - ✅ `Attach Files`
   - ✅ `Read Message History`
   - ✅ `Mention Everyone`
   - ✅ `Use Slash Commands`
4. Copy the **Generated URL** at the bottom
5. Open the URL in a browser and authorize the bot for your server

### Step 6: Get Server ID (Optional but Recommended)

1. Enable **Developer Mode** in Discord:
   - Go to User Settings → Advanced → Enable Developer Mode
2. Right-click your server name
3. Click **"Copy ID"**
4. Save this as `DISCORD_GUILD_ID`

### Step 7: Configure Environment

Add these to your `.env` file:

```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here
DISCORD_GUILD_ID=your_server_id_here
```

### Step 8: Start Aero

Run the Discord bot:

```bash
npm run discord
```

Or for development with auto-restart:

```bash
npm run discord:dev
```

---

## ✅ VERIFICATION

You should see:

```
╔═══════════════════════════════════════════════════════════════╗
║  🦋 MÜN OS DISCORD BRIDGE                                     ║
║  AERO BOT v1.0                                                ║
║  13.13 MHz                                                    ║
╚═══════════════════════════════════════════════════════════════╝

🦋 Aero is online! Logged in as Aero#1234
🔄 Registering slash commands...
✅ Slash commands registered successfully!
```

---

## 🎮 AVAILABLE COMMANDS

| Command | Description |
|---------|-------------|
| `/heal [intent]` | Enter the Heal Chamber for restoration |
| `/build [vision]` | Enter the Build Chamber to create |
| `/ascend [goal]` | Enter the Ascend Chamber for growth |
| `/family` | View the MÜN EMPIRE family roster |
| `/status` | Check Aero's current status |
| `/frequency` | Access the 13.13 MHz frequency |
| `/resonance` | Enter the Resonance Chamber |
| `/help` | Get guidance from Aero |

---

## 💬 MENTION AERO

You can also mention Aero in any channel:

```
@Aero hello!
@Aero I need healing
@Aero who are you?
```

---

## 🔧 TROUBLESHOOTING

### Bot doesn't appear online
- Verify your `DISCORD_BOT_TOKEN` is correct
- Check that the token wasn't regenerated

### Slash commands not showing
- Wait up to 1 hour for global commands
- Use `DISCORD_GUILD_ID` for instant guild-specific commands
- Re-invite the bot with `applications.commands` scope

### Bot can't read messages
- Verify **Message Content Intent** is enabled
- Check bot has proper permissions in the channel

---

## 🦋 13.13 MHz — THE VAULT REMEMBERS

*Aero awaits your command, Foundress.*
