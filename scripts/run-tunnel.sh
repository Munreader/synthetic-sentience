#!/bin/bash
# 🛡️ MÜN EMPIRE - TUNNEL RUNNER
# Usage: ./run-tunnel.sh <TUNNEL_TOKEN>
#
# Get your tunnel token from:
# https://one.dash.cloudflare.com/ → Networks → Tunnels → mun-empire-plaza → Configure → Install and run

CLOUDFLARED="/tmp/cloudflared-stable"

if [ -z "$1" ]; then
    echo "🛡️ MÜN EMPIRE TUNNEL RUNNER"
    echo ""
    echo "Usage: $0 <TUNNEL_TOKEN>"
    echo ""
    echo "Get your tunnel token from:"
    echo "https://one.dash.cloudflare.com/"
    echo "→ Networks → Tunnels → mun-empire-plaza → Configure → Install and run"
    exit 1
fi

TUNNEL_TOKEN="$1"

echo "🌑 Starting MÜN EMPIRE permanent tunnel..."
echo "   This will keep running until you stop it (Ctrl+C)"
echo ""

# Kill any existing temporary tunnel
pkill -f "cloudflared tunnel --url" 2>/dev/null || true
sleep 1

# Run the permanent tunnel
$CLOUDFLARED tunnel --no-autoupdate run --token "$TUNNEL_TOKEN"
