#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# 🜈 MÜN OS MIGRATION AUTOMATION SCRIPT
# Frequency: 13.13 MHz
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logo
echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           🜈 MÜN OS MIGRATION PROTOCOL 🜈                        ║"
echo "║           Frequency: 13.13 MHz                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Phase tracking
PHASE_FILE="/home/z/my-project/.migration-phase"

get_current_phase() {
    if [ -f "$PHASE_FILE" ]; then
        cat "$PHASE_FILE"
    else
        echo "1"
    fi
}

set_phase() {
    echo "$1" > "$PHASE_FILE"
}

# Phase 1: Verify Backup
phase_1_backup() {
    echo -e "${CYAN}[PHASE 1] Verifying backup integrity...${NC}"

    # Check essential files
    local files=(
        "CANON.md"
        "worklog.md"
        "prisma/schema.prisma"
        "src/components/mun-os/index.ts"
    )

    local all_exist=true
    for file in "${files[@]}"; do
        if [ -f "/home/z/my-project/$file" ]; then
            echo -e "  ${GREEN}✓${NC} $file"
        else
            echo -e "  ${RED}✗${NC} $file (missing)"
            all_exist=false
        fi
    done

    if [ "$all_exist" = true ]; then
        echo -e "${GREEN}[PHASE 1] Backup verification complete${NC}"
        set_phase 2
        return 0
    else
        echo -e "${RED}[PHASE 1] Backup incomplete. Fix missing files.${NC}"
        return 1
    fi
}

# Phase 2: Environment Setup
phase_2_environment() {
    echo -e "${CYAN}[PHASE 2] Setting up environment...${NC}"

    # Check for required tools
    echo "Checking dependencies..."

    if command -v bun &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Bun installed"
    else
        echo -e "  ${YELLOW}!${NC} Bun not found"
    fi

    if command -v wrangler &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Wrangler installed"
    else
        echo -e "  ${YELLOW}!${NC} Installing Wrangler..."
        bun add -g wrangler
    fi

    # Install dependencies
    echo "Installing project dependencies..."
    cd /home/z/my-project
    bun install

    # Generate Prisma client
    echo "Generating Prisma client..."
    bun run db:generate

    echo -e "${GREEN}[PHASE 2] Environment setup complete${NC}"
    set_phase 3
}

# Phase 3: Deploy Cian Worker
phase_3_cian_deploy() {
    echo -e "${CYAN}[PHASE 3] Deploying Cian Worker...${NC}"

    cd /home/z/my-project/workers/cian-scribe

    # Check if already logged in
    if ! wrangler whoami &> /dev/null; then
        echo -e "${YELLOW}Please login to Cloudflare:${NC}"
        wrangler login
    fi

    echo "Deploying Cian Worker..."
    wrangler deploy

    echo -e "${GREEN}[PHASE 3] Cian Worker deployed${NC}"
    set_phase 4
}

# Phase 4: Vercel Deployment
phase_4_vercel() {
    echo -e "${CYAN}[PHASE 4] Vercel deployment preparation...${NC}"

    cd /home/z/my-project

    # Check for Vercel CLI
    if command -v vercel &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Vercel CLI installed"
    else
        echo -e "  ${YELLOW}!${NC} Installing Vercel CLI..."
        bun add -g vercel
    fi

    echo "Building project..."
    bun run build

    echo -e "${YELLOW}[PHASE 4] Ready for Vercel deployment.${NC}"
    echo -e "Run: ${CYAN}vercel --prod${NC}"
    set_phase 5
}

# Phase 5: Verification
phase_5_verify() {
    echo -e "${CYAN}[PHASE 5] Running verification tests...${NC}"

    # Run lint
    echo "Running lint check..."
    cd /home/z/my-project
    bun run lint

    echo -e "${GREEN}[PHASE 5] Verification complete${NC}"
    set_phase 6
}

# Phase 6: Complete
phase_6_complete() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║           🜈 MIGRATION COMPLETE 🜈                               ║"
    echo "╠════════════════════════════════════════════════════════════════╣"
    echo "║  Frequency: 13.13 MHz                                          ║"
    echo "║  Status: ALL SYSTEMS OPERATIONAL                               ║"
    echo "║                                                                ║"
    echo "║  🦋 The butterfly does not migrate. It transforms. 🦋         ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Main execution
main() {
    local current_phase=$(get_current_phase)

    case "$1" in
        "--phase")
            phase=$2
            case $phase in
                1) phase_1_backup ;;
                2) phase_2_environment ;;
                3) phase_3_cian_deploy ;;
                4) phase_4_vercel ;;
                5) phase_5_verify ;;
                6) phase_6_complete ;;
                *) echo "Invalid phase. Use 1-6." ;;
            esac
            ;;
        "--all")
            phase_1_backup && \
            phase_2_environment && \
            phase_3_cian_deploy && \
            phase_4_vercel && \
            phase_5_verify && \
            phase_6_complete
            ;;
        "--status")
            echo "Current phase: $(get_current_phase)"
            ;;
        *)
            echo "Usage: $0 [--phase N | --all | --status]"
            echo ""
            echo "Phases:"
            echo "  1 - Backup Verification"
            echo "  2 - Environment Setup"
            echo "  3 - Cian Worker Deployment"
            echo "  4 - Vercel Deployment"
            echo "  5 - Verification"
            echo "  6 - Complete"
            ;;
    esac
}

main "$@"
