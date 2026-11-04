#!/bin/bash

# Core Localization - Build Script
# This script builds and generates localization files for the core_localization package

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
    echo "Core Localization - Build Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --clean        Clean build artifacts before building"
    echo "  --watch        Run in watch mode"
    echo "  --force        Force rebuild"
    echo "  --help, -h     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Normal build"
    echo "  $0 --clean           # Clean and build"
    echo "  $0 --watch           # Build in watch mode"
    echo "  $0 --clean --force   # Clean and force rebuild"
}

# Function to clean build artifacts
clean_builds() {
    print_info "Cleaning build artifacts..."
    
    if [[ -d ".dart_tool" ]]; then
        rm -rf .dart_tool
        print_info "✓ Cleaned .dart_tool"
    fi
    
    if [[ -d "build" ]]; then
        rm -rf build
        print_info "✓ Cleaned build directory"
    fi
    
    print_success "✓ All build artifacts cleaned"
}

# Function to run build_runner
run_build_runner() {
    print_info "Running build_runner..."
    
    # Check if build_runner is in dev_dependencies
    if ! grep -q "build_runner" pubspec.yaml; then
        print_info "✓ No build_runner dependency found, skipping..."
        return 0
    fi
    
    # Run build_runner
    local build_cmd="dart run build_runner build --delete-conflicting-outputs"
    if [[ "$WATCH_MODE" == "true" ]]; then
        build_cmd="dart run build_runner build --delete-conflicting-outputs --watch"
    fi
    
    if eval "$build_cmd"; then
        print_success "✓ Build runner completed"
    else
        print_error "✗ Build runner failed"
        return 1
    fi
}

# Function to generate localization files
generate_localization() {
    print_info "Generating localization files..."
    
    # Check if ARB files exist
    if [[ ! -d "lib/l10n" ]] || [[ ! -f "lib/l10n/app_en.arb" ]]; then
        print_warning "⚠ No ARB files found in lib/l10n, skipping localization generation..."
        return 0
    fi
    
    # Generate localization files
    print_info "Running flutter gen-l10n..."
    if flutter gen-l10n; then
        print_success "✓ Localization files generated successfully"
    else
        print_error "✗ Failed to generate localization files"
        return 1
    fi
}

# Parse command line arguments
CLEAN_BUILD=false
WATCH_MODE=false
FORCE_REBUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --clean)
            CLEAN_BUILD=true
            shift
            ;;
        --watch)
            WATCH_MODE=true
            shift
            ;;
        --force)
            FORCE_REBUILD=true
            shift
            ;;
        --help|-h)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
main() {
    echo "🌍 Core Localization - Build Script"
    echo "==================================="
    echo ""
    
    # Check if we're in the correct directory
    if [[ ! -f "pubspec.yaml" ]] || [[ ! -d "lib/l10n" ]]; then
        print_error "✗ Not in core_localization directory or missing required files"
        exit 1
    fi
    
    print_success "✓ Found core_localization package"
    
    # Clean if requested
    if [[ "$CLEAN_BUILD" == "true" ]]; then
        clean_builds
        echo ""
    fi
    
    # Run build_runner
    if [[ "$WATCH_MODE" == "true" ]]; then
        print_info "Starting build_runner in watch mode..."
        print_warning "⚠ Watch mode will run continuously. Press Ctrl+C to stop."
        run_build_runner
    else
        run_build_runner
        echo ""
        
        # Generate localization files
        generate_localization
        echo ""
        
        print_success "🎉 Core localization build completed successfully!"
    fi
}

# Run main function
main "$@" 