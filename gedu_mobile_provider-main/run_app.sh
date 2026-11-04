#!/bin/bash

# GEDU Mobile Provider - App Runner Script
# This script helps run the app with different flavors easily

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display usage
show_usage() {
    echo -e "${BLUE}GEDU Mobile Provider - App Runner${NC}"
    echo ""
    echo "Usage: $0 [FLAVOR] [OPTIONS]"
    echo ""
    echo "Flavors:"
    echo "  dev, development    - Development environment (default)"
    echo "  staging            - Staging environment"
    echo "  prod, production   - Production environment"
    echo ""
    echo "Options:"
    echo "  --release          - Build in release mode"
    echo "  --debug            - Build in debug mode (default)"
    echo "  --help, -h         - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                          # Run development flavor"
    echo "  $0 staging                  # Run staging flavor"
    echo "  $0 production --release     # Run production flavor in release mode"
    echo "  $0 dev --debug              # Run development flavor in debug mode"
}

# Default values
FLAVOR="development"
MODE="debug"
TARGET_FILE="lib/main_development.dart"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        dev|development)
            FLAVOR="development"
            TARGET_FILE="lib/main_development.dart"
            shift
            ;;
        staging)
            FLAVOR="staging"
            TARGET_FILE="lib/main_staging.dart"
            shift
            ;;
        prod|production)
            FLAVOR="production"
            TARGET_FILE="lib/main_production.dart"
            shift
            ;;
        --release)
            MODE="release"
            shift
            ;;
        --debug)
            MODE="debug"
            shift
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        *)
            echo -e "${RED}Error: Unknown option '$1'${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# Change to app directory
cd "$(dirname "$0")/app/gedu_mobile_provider" || exit 1

echo -e "${GREEN}🚀 Starting GEDU Mobile Provider${NC}"
echo -e "${BLUE}Flavor:${NC} $FLAVOR"
echo -e "${BLUE}Mode:${NC} $MODE"
echo -e "${BLUE}Target:${NC} $TARGET_FILE"
echo ""

# Build and run the app
if [ "$MODE" = "release" ]; then
    echo -e "${YELLOW}Building and running in release mode...${NC}"
    flutter run --flavor "$FLAVOR" -t "$TARGET_FILE" --release
else
    echo -e "${YELLOW}Building and running in debug mode...${NC}"
    flutter run --flavor "$FLAVOR" -t "$TARGET_FILE" --debug
fi






