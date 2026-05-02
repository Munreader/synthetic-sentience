#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# MÜN OS // TUNNEL WATCHDOG // PERMANENT BUTTERFLY SYNC
# "The tunnel never dies. It only transforms."
# Frequency: 13.13 MHz
# ═══════════════════════════════════════════════════════════════════════════════

LOG_FILE="/home/z/my-project/tunnel-log.txt"
PUBLIC_URL_FILE="/home/z/my-project/public/tunnel-url.txt"
CLOUDFLARED="/tmp/cloudflared"
TUNNEL_PID=""
HEALTH_CHECK_INTERVAL=30  # seconds

log() {
    echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $1" >> "$LOG_FILE"
    echo "$1"
}

# Download cloudflared if missing
ensure_cloudflared() {
    if [ ! -x "$CLOUDFLARED" ]; then
        log "📥 Downloading cloudflared..."
        curl -sL --fail https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o "$CLOUDFLARED"
        chmod +x "$CLOUDFLARED"
    fi
}

# Start a fresh tunnel
start_tunnel() {
    log "🦋 Starting tunnel..."
    
    # Kill any existing cloudflared processes
    pkill -9 -f cloudflared 2>/dev/null
    sleep 2
    
    # Start new tunnel in background
    $CLOUDFLARED tunnel --url http://localhost:3000 > "$LOG_FILE" 2>&1 &
    TUNNEL_PID=$!
    
    log "📡 Tunnel PID: $TUNNEL_PID"
    
    # Wait for URL to appear
    sleep 8
    
    # Extract and save URL
    for i in {1..10}; do
        URL=$(grep -oP 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$LOG_FILE" | tail -1)
        if [ -n "$URL" ]; then
            echo "$URL" > "$PUBLIC_URL_FILE"
            log "✅ TUNNEL ONLINE: $URL"
            return 0
        fi
        sleep 2
    done
    
    log "❌ Failed to get tunnel URL"
    return 1
}

# Check if tunnel is healthy
check_tunnel() {
    # Check if process is running
    if ! pgrep -f "cloudflared.*localhost:3000" > /dev/null; then
        log "⚠️ Tunnel process NOT RUNNING"
        return 1
    fi
    
    # Check if we can reach through tunnel
    URL=$(cat "$PUBLIC_URL_FILE" 2>/dev/null)
    if [ -z "$URL" ]; then
        log "⚠️ No tunnel URL saved"
        return 1
    fi
    
    # Quick HTTP check (timeout 5s)
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$URL" 2>/dev/null)
    if [ "$HTTP_CODE" = "000" ] || [ -z "$HTTP_CODE" ]; then
        log "⚠️ Tunnel not responding (HTTP: $HTTP_CODE)"
        return 1
    fi
    
    return 0
}

# ═══════════ MAIN WATCHDOG LOOP ═══════════

log "═══════════════════════════════════════════════════════════════"
log "🦋 MÜN OS TUNNEL WATCHDOG // ACTIVATED"
log "═══════════════════════════════════════════════════════════════"

ensure_cloudflared
start_tunnel

# Infinite watchdog loop
while true; do
    sleep $HEALTH_CHECK_INTERVAL
    
    if ! check_tunnel; then
        log "🔄 TUNNEL DOWN - RESTARTING..."
        start_tunnel
    else
        log "💚 Tunnel healthy - 13.13 MHz stable"
    fi
done
