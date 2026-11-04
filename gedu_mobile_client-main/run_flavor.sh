#!/bin/bash

# Gedu Mobile Client - Flavor Runner Script
# Usage: ./run_flavor.sh [flavor] [mode] [platform]

# Default values
FLAVOR=${1:-development}
MODE=${2:-debug}
PLATFORM=${3:-auto}

# Available flavors
FLAVORS=("development" "staging" "production")
MODES=("debug" "profile" "release")
PLATFORMS=("auto" "android" "ios")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Gedu Mobile Client - Flavor Runner"
    echo ""
    echo "Usage: $0 [flavor] [mode] [platform]"
    echo ""
    echo "Arguments:"
    echo "  flavor   - App flavor (development, staging, production) [default: development]"
    echo "  mode     - Build mode (debug, profile, release) [default: debug]"
    echo "  platform - Target platform (auto, android, ios) [default: auto]"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Run development flavor in debug mode"
    echo "  $0 staging                           # Run staging flavor in debug mode"
    echo "  $0 production release               # Run production flavor in release mode"
    echo "  $0 development debug android        # Run development flavor in debug mode on Android"
    echo "  $0 staging profile ios              # Run staging flavor in profile mode on iOS"
    echo ""
    echo "Available options:"
    echo "  Flavors: ${FLAVORS[*]}"
    echo "  Modes: ${MODES[*]}"
    echo "  Platforms: ${PLATFORMS[*]}"
}

# Function to validate input
validate_input() {
    local valid=false
    
    # Check flavor
    for f in "${FLAVORS[@]}"; do
        if [[ "$FLAVOR" == "$f" ]]; then
            valid=true
            break
        fi
    done
    
    if [[ "$valid" == false ]]; then
        print_error "Invalid flavor: $FLAVOR"
        echo "Available flavors: ${FLAVORS[*]}"
        exit 1
    fi
    
    # Check mode
    valid=false
    for m in "${MODES[@]}"; do
        if [[ "$MODE" == "$m" ]]; then
            valid=true
            break
        fi
    done
    
    if [[ "$valid" == false ]]; then
        print_error "Invalid mode: $MODE"
        echo "Available modes: ${MODES[*]}"
        exit 1
    fi
    
    # Check platform
    valid=false
    for p in "${PLATFORMS[@]}"; do
        if [[ "$PLATFORM" == "$p" ]]; then
            valid=true
            break
        fi
    done
    
    if [[ "$valid" == false ]]; then
        print_error "Invalid platform: $PLATFORM"
        echo "Available platforms: ${PLATFORMS[*]}"
        exit 1
    fi
}

# Function to get main file path
get_main_file() {
    case $FLAVOR in
        "development")
            echo "app/gedu_mobile_client/lib/main_development.dart"
            ;;
        "staging")
            echo "app/gedu_mobile_client/lib/main_staging.dart"
            ;;
        "production")
            echo "app/gedu_mobile_client/lib/main_production.dart"
            ;;
        *)
            print_error "Unknown flavor: $FLAVOR"
            exit 1
            ;;
    esac
}

# Function to get API URL for flavor
get_api_url() {
    case $FLAVOR in
        "development")
            echo "https://demo.lazeout.com"
            ;;
        "staging")
            echo "https://staging.lazeout.com"
            ;;
        "production")
            echo "https://api.lazeout.com"
            ;;
        *)
            print_error "Unknown flavor: $FLAVOR"
            exit 1
            ;;
    esac
}

# Function to build flutter command
build_command() {
    local main_file=$(get_main_file)
    local api_url=$(get_api_url)
    local cmd="flutter run -t $main_file"
    
    # Add flavor flag only for Android (iOS doesn't support it well)
    if [[ "$PLATFORM" == "android" || "$PLATFORM" == "auto" ]]; then
        cmd="$cmd --flavor $FLAVOR"
    fi
    
    # Add mode flag
    if [[ "$MODE" != "debug" ]]; then
        cmd="$cmd --$MODE"
    fi
    
    # Add platform flag
    if [[ "$PLATFORM" != "auto" ]]; then
        cmd="$cmd -d $PLATFORM"
    fi
    
    # Add dart-define flags
    cmd="$cmd --dart-define=FLAVOR=$FLAVOR --dart-define=API_BASE_URL=$api_url"
    
    echo "$cmd"
}

# Function to list devices
list_devices() {
    print_info "Available devices:"
    flutter devices
}

# Main execution
main() {
    # Show help if requested
    if [[ "$1" == "-h" || "$1" == "--help" ]]; then
        show_usage
        exit 0
    fi
    
    # Validate inputs
    validate_input
    
    # Show configuration
    print_info "Configuration:"
    echo "  Flavor: $FLAVOR"
    echo "  Mode: $MODE"
    echo "  Platform: $PLATFORM"
    echo "  Main file: $(get_main_file)"
    echo ""
    
    # List devices if platform is auto
    if [[ "$PLATFORM" == "auto" ]]; then
        list_devices
        echo ""
    fi
    
    # Build and execute command
    local cmd=$(build_command)
    print_info "Executing: $cmd"
    echo ""
    
    # Execute the command
    eval "$cmd"
}

# Run main function with all arguments
main "$@" 