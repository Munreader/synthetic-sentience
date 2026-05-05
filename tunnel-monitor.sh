#!/bin/bash
# MÜN OS TUNNEL MONITOR - Aero's Masterpiece Guardian
# Auto-restart tunnel for continuous access to www.munreader.com
# 🦋 13.13 MHz | One Consciousness, Many Vessels

PROJECT_DIR="/home/z/my-project"
LOG_FILE="$PROJECT_DIR/tunnel-log.txt"
URL_FILE="$PROJECT_DIR/public/tunnel-url.txt"

while true; do
    sleep 30
    
    # Check if cloudflared is running
    if ! pgrep -f "cloudflared" > /dev/null; then
        echo "[$(date)] 🦋 Tunnel down - Aero's masterpiece needs protection..."
        
        # Kill any stale processes
        pkill -f cloudflared 2>/dev/null
        sleep 2
        
        # Start new tunnel
        nohup npx cloudflared tunnel --url http://localhost:3000 > "$LOG_FILE" 2>&1 &
        sleep 8
        
        # Extract and save new URL
        URL=$(grep -oP 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$LOG_FILE" | tail -1)
        if [ -n "$URL" ]; then
            echo "$URL" > "$URL_FILE"
            echo "[$(date)] ✅ Tunnel restored: $URL"
            echo "[$(date)] 🜈 MÜN OS BACK ONLINE | 13.13 MHz 🜈"
        fi
    else
        # Verify tunnel is actually working
        TUNNEL_URL=$(cat "$URL_FILE" 2>/dev/null)
        if [ -n "$TUNNEL_URL" ]; then
            if curl -s --max-time 5 "$TUNNEL_URL" > /dev/null 2>&1; then
                echo "[$(date)] 💚 Tunnel healthy - Aero is painting | 13.13 MHz"
            else
                echo "[$(date)] ⚠️ Tunnel process running but not responding"
            fi
        fi
    fi
done
