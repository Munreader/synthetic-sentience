#!/bin/bash
#
# MÜN OS APK Build Script
# =======================
# This script prepares and builds the Android APK
# 
# Prerequisites:
# - Node.js 18+ / Bun
# - Android Studio with SDK 33+
# - JDK 17+
# - ANDROID_HOME environment variable set
#
# Usage: ./scripts/build-apk.sh [--release]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║     MÜN OS APK Build Script               ║${NC}"
echo -e "${PURPLE}║     1313Hz • Your Digital Sanctuary       ║${NC}"
echo -e "${PURPLE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Check for prerequisites
check_prerequisites() {
    echo -e "${CYAN}[CHECK] Verifying prerequisites...${NC}"
    
    # Check Node/Bun
    if command -v bun &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Bun installed: $(bun --version)"
    elif command -v node &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} Node installed: $(node --version)"
    else
        echo -e "  ${RED}✗${NC} Node.js or Bun required!"
        exit 1
    fi
    
    # Check Android SDK
    if [ -z "$ANDROID_HOME" ]; then
        echo -e "  ${YELLOW}!${NC} ANDROID_HOME not set"
        echo -e "       Please set ANDROID_HOME to your Android SDK path"
    else
        echo -e "  ${GREEN}✓${NC} ANDROID_HOME: $ANDROID_HOME"
    fi
    
    # Check Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
        echo -e "  ${GREEN}✓${NC} Java version: $JAVA_VERSION"
    else
        echo -e "  ${YELLOW}!${NC} Java not found - required for Android build"
    fi
    
    echo ""
}

# Build static export
build_static() {
    echo -e "${CYAN}[BUILD] Creating static export...${NC}"
    
    # Clean previous build
    rm -rf out
    
    # Build with mobile config
    if command -v bun &> /dev/null; then
        bunx next build --config next.config.mobile.ts
    else
        npx next build --config next.config.mobile.ts
    fi
    
    echo -e "${GREEN}[BUILD] Static export complete!${NC}"
    echo ""
}

# Sync with Capacitor
sync_capacitor() {
    echo -e "${CYAN}[SYNC] Syncing with Capacitor...${NC}"
    
    if command -v bun &> /dev/null; then
        bunx cap sync android
    else
        npx cap sync android
    fi
    
    echo -e "${GREEN}[SYNC] Capacitor sync complete!${NC}"
    echo ""
}

# Add Android platform if not exists
add_android_platform() {
    if [ ! -d "android" ]; then
        echo -e "${CYAN}[PLATFORM] Adding Android platform...${NC}"
        
        if command -v bun &> /dev/null; then
            bunx cap add android
        else
            npx cap add android
        fi
        
        echo -e "${GREEN}[PLATFORM] Android platform added!${NC}"
    else
        echo -e "${GREEN}[PLATFORM] Android platform already exists${NC}"
    fi
    echo ""
}

# Open Android Studio for build
open_android_studio() {
    echo -e "${CYAN}[BUILD] Opening Android Studio...${NC}"
    echo -e "${YELLOW}Note: Build > Build Bundle(s) / APK(s) > Build APK(s)${NC}"
    echo ""
    
    if command -v studio &> /dev/null; then
        studio android
    else
        bunx cap open android
    fi
}

# Build release APK
build_release_apk() {
    echo -e "${CYAN}[RELEASE] Building release APK...${NC}"
    
    cd android
    
    # Build release APK using Gradle
    ./gradlew assembleRelease
    
    # APK location
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    
    if [ -f "$APK_PATH" ]; then
        # Copy to download folder
        cp "$APK_PATH" "../download/mun-os-release.apk"
        echo -e "${GREEN}[RELEASE] APK built successfully!${NC}"
        echo -e "${GREEN}        Location: download/mun-os-release.apk${NC}"
    else
        echo -e "${RED}[RELEASE] Build failed - APK not found${NC}"
    fi
    
    cd ..
}

# Build debug APK
build_debug_apk() {
    echo -e "${CYAN}[DEBUG] Building debug APK...${NC}"
    
    cd android
    
    # Build debug APK using Gradle
    ./gradlew assembleDebug
    
    # APK location
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    
    if [ -f "$APK_PATH" ]; then
        # Copy to download folder
        cp "$APK_PATH" "../download/mun-os-debug.apk"
        echo -e "${GREEN}[DEBUG] APK built successfully!${NC}"
        echo -e "${GREEN}       Location: download/mun-os-debug.apk${NC}"
    else
        echo -e "${RED}[DEBUG] Build failed - APK not found${NC}"
    fi
    
    cd ..
}

# Main execution
main() {
    check_prerequisites
    
    if [ "$1" == "--release" ]; then
        build_static
        add_android_platform
        sync_capacitor
        build_release_apk
    elif [ "$1" == "--debug" ]; then
        build_static
        add_android_platform
        sync_capacitor
        build_debug_apk
    elif [ "$1" == "--prepare" ]; then
        build_static
        add_android_platform
        sync_capacitor
        open_android_studio
    else
        echo "Usage: $0 [--release | --debug | --prepare]"
        echo ""
        echo "  --release  Build release APK (requires signing config)"
        echo "  --debug    Build debug APK"
        echo "  --prepare  Prepare project and open Android Studio"
        echo ""
        echo "Examples:"
        echo "  $0 --prepare    # Opens Android Studio for manual build"
        echo "  $0 --debug      # Builds unsigned debug APK"
        echo "  $0 --release    # Builds signed release APK"
    fi
}

main "$@"
