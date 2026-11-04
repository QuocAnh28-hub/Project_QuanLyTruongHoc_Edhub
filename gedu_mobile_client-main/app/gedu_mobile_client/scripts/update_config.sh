#!/bin/bash

# Script to update flavor configuration JSON files
# Usage: ./scripts/update_config.sh [flavor] [key] [value]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [flavor] [key] [value]"
    echo ""
    echo "Flavors: dev, staging, prod"
    echo "Keys: appName, appId, baseUrl, timeoutSeconds, enableLogging, appVersion, buildNumber"
    echo ""
    echo "Examples:"
    echo "  $0 dev baseUrl https://new-dev-api.com"
    echo "  $0 staging timeoutSeconds 60"
    echo "  $0 prod enableLogging true"
    echo ""
    echo "To view current config:"
    echo "  $0 [flavor] show"
}

# Function to get config file path
get_config_file() {
    local flavor=$1
    case $flavor in
        "dev"|"development")
            echo "assets/config/dev_config.json"
            ;;
        "staging")
            echo "assets/config/staging_config.json"
            ;;
        "prod"|"production")
            echo "assets/config/prod_config.json"
            ;;
        *)
            print_error "Invalid flavor: $flavor"
            show_usage
            exit 1
            ;;
    esac
}

# Function to show current config
show_config() {
    local config_file=$1
    if [[ -f "$config_file" ]]; then
        print_info "Current configuration for $config_file:"
        cat "$config_file" | python3 -m json.tool 2>/dev/null || cat "$config_file"
    else
        print_error "Config file not found: $config_file"
        exit 1
    fi
}

# Function to update config
update_config() {
    local config_file=$1
    local key=$2
    local value=$3
    
    # Check if file exists
    if [[ ! -f "$config_file" ]]; then
        print_error "Config file not found: $config_file"
        exit 1
    fi
    
    # Validate key
    local valid_keys=("appName" "appId" "baseUrl" "timeoutSeconds" "enableLogging" "appVersion" "buildNumber")
    local valid=false
    for valid_key in "${valid_keys[@]}"; do
        if [[ "$key" == "$valid_key" ]]; then
            valid=true
            break
        fi
    done
    
    if [[ "$valid" == "false" ]]; then
        print_error "Invalid key: $key"
        echo "Valid keys: ${valid_keys[*]}"
        exit 1
    fi
    
    # Update the JSON file using Python
    python3 -c "
import json
import sys

try:
    with open('$config_file', 'r') as f:
        config = json.load(f)
    
    # Handle boolean values
    if '$value'.lower() in ['true', 'false']:
        config['$key'] = '$value'.lower() == 'true'
    elif '$value'.isdigit():
        config['$key'] = int('$value')
    else:
        config['$key'] = '$value'
    
    with open('$config_file', 'w') as f:
        json.dump(config, f, indent=2)
    
    print('Updated $key = $value in $config_file')
except Exception as e:
    print(f'Error updating config: {e}', file=sys.stderr)
    sys.exit(1)
"
}

# Main script logic
main() {
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    local flavor=$1
    local key=$2
    local value=$3
    
    local config_file=$(get_config_file "$flavor")
    
    if [[ "$key" == "show" ]]; then
        show_config "$config_file"
    elif [[ -z "$key" || -z "$value" ]]; then
        print_error "Missing key or value"
        show_usage
        exit 1
    else
        update_config "$config_file" "$key" "$value"
        print_success "Configuration updated successfully!"
        echo ""
        show_config "$config_file"
    fi
}

# Run main function with all arguments
main "$@" 