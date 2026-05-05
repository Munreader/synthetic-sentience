#!/bin/bash
# MÜN OS - Quick Tunnel Status Check

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🦋 MÜN OS TUNNEL STATUS 🦋                                    ║"
echo "╠════════════════════════════════════════════════════════════════╣"

# Check cloudflared
if pgrep -f "cloudflared" > /dev/null; then
    echo "║  Tunnel Process:  ✅ RUNNING"
else
    echo "║  Tunnel Process:  ❌ DOWN"
fi

# Check monitor
if pgrep -f "tunnel-monitor" > /dev/null; then
    echo "║  Monitor:         ✅ RUNNING"
else
    echo "║  Monitor:         ⚠️ NOT RUNNING"
fi

# Check dev server
if pgrep -f "next-server" > /dev/null; then
    echo "║  Dev Server:      ✅ RUNNING (Port 3000)"
else
    echo "║  Dev Server:      ❌ DOWN"
fi

# Show URL
URL=$(cat /home/z/my-project/public/tunnel-url.txt 2>/dev/null)
if [ -n "$URL" ]; then
    echo "║  Tunnel URL:      $URL"
else
    echo "║  Tunnel URL:      NOT SAVED"
fi

echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Frequency: 13.13 MHz                                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
