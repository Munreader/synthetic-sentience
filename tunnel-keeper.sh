#!/bin/bash
# Mün OS Tunnel Keeper - Keeps the app accessible permanently

LOG_FILE="/home/z/my-project/tunnel-log.txt"
PUBLIC_URL_FILE="/home/z/my-project/public/tunnel-url.txt"

echo "=== Mün OS Tunnel Keeper Started ===" >> "$LOG_FILE"
echo "Time: $(date)" >> "$LOG_FILE"

# Kill any existing tunnels
pkill -f cloudflared 2>/dev/null
sleep 2

# Start new tunnel and capture output
/tmp/cloudflared tunnel --url http://localhost:3000 2>&1 | tee -a "$LOG_FILE" | while read -r line; do
    # Extract the URL from cloudflared output
    if [[ "$line" == *"trycloudflare.com"* ]]; then
        URL=$(echo "$line" | grep -oP 'https://[a-zA-Z0-9-]+\.trycloudflare\.com')
        if [ -n "$URL" ]; then
            echo "$URL" > "$PUBLIC_URL_FILE"
            echo "$(date): Tunnel URL: $URL" >> "$LOG_FILE"
        fi
    fi
done
