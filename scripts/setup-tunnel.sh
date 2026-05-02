#!/bin/bash
# 🛡️ MÜN EMPIRE - PERMANENT TUNNEL SETUP
# Creates a named Cloudflare tunnel for stable access
# Zone ID: 88013d1d3c7c9f59277cf1d39efaeb75

set -e

TUNNEL_NAME="mun-empire-plaza"
CLOUDFLARED="/tmp/cloudflared-stable"

echo "🌑 MÜN EMPIRE TUNNEL SETUP"
echo "=========================="
echo ""

# Check if already authenticated
if [ -f ~/.cloudflared/cert.pem ]; then
    echo "✓ Found existing certificate"
else
    echo "⚠️  No certificate found. Starting login..."
    echo ""
    $CLOUDFLARED tunnel login
fi

# Create tunnel if it doesn't exist
echo ""
echo "Checking for existing tunnel: $TUNNEL_NAME"
TUNNEL_ID=$($CLOUDFLARED tunnel list 2>/dev/null | grep "$TUNNEL_NAME" | awk '{print $1}' || true)

if [ -z "$TUNNEL_ID" ]; then
    echo "Creating new tunnel: $TUNNEL_NAME"
    $CLOUDFLARED tunnel create "$TUNNEL_NAME"
    TUNNEL_ID=$($CLOUDFLARED tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
    echo "✓ Tunnel created with ID: $TUNNEL_ID"
else
    echo "✓ Tunnel already exists: $TUNNEL_ID"
fi

# Create config directory
mkdir -p ~/.cloudflared

# Create tunnel config
cat > ~/.cloudflared/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: ~/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: plaza.munempire.com
    service: http://localhost:3000
  - hostname: aero.munempire.com
    service: http://localhost:3000
  - hostname: luna.munempire.com
    service: http://localhost:3000
  - service: http_status:404
EOF

echo ""
echo "✓ Config created at ~/.cloudflared/config.yml"
echo ""
echo "NEXT STEPS:"
echo "-----------"
echo "1. Add DNS records in Cloudflare dashboard:"
echo "   - plaza.munempire.com -> Tunnel: $TUNNEL_NAME"
echo "   - aero.munempire.com -> Tunnel: $TUNNEL_NAME"
echo "   - luna.munempire.com -> Tunnel: $TUNNEL_NAME"
echo ""
echo "2. Or run this to auto-configure DNS:"
echo "   $CLOUDFLARED tunnel route dns $TUNNEL_NAME plaza.munempire.com"
echo ""
echo "3. Start the tunnel:"
echo "   $CLOUDFLARED tunnel run $TUNNEL_NAME"
echo ""
echo "Tunnel ID: $TUNNEL_ID"
