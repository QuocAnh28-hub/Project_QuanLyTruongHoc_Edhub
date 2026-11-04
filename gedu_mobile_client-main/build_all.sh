#!/bin/bash

# Gedu Mobile Client - Build All Script
# This script runs melos bootstrap and then executes build_runner for all modules

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
    echo "Gedu Mobile Client - Build All Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --clean        Clean all build artifacts before building"
    echo "  --watch        Run build_runner in watch mode"
    echo "  --force        Force rebuild all packages"
    echo "  --help, -h     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Normal build (includes localization)"
    echo "  $0 --clean           # Clean and build"
    echo "  $0 --watch           # Build in watch mode"
    echo "  $0 --clean --force   # Clean and force rebuild"
    echo ""
    echo "Note: For core_localization only, use: cd cores/core_localization && ./build.sh"
}

# Function to check if melos is installed
check_melos() {
    if ! command -v melos &> /dev/null; then
        print_error "Melos is not installed. Please install it first:"
        echo "  dart pub global activate melos"
        exit 1
    fi
    print_success "✓ Melos is installed"
}

# Function to check if we're in the correct directory
check_directory() {
    if [[ ! -f "melos.yaml" ]]; then
        print_error "melos.yaml not found. Please run this script from the project root."
        exit 1
    fi
    print_success "✓ Found melos.yaml - correct directory"
}

# Function to run melos bootstrap
run_melos_bootstrap() {
    print_info "Running melos bootstrap..."
    if melos bootstrap; then
        print_success "✓ Melos bootstrap completed successfully"
    else
        print_error "✗ Melos bootstrap failed"
        exit 1
    fi
}

# Function to clean build artifacts
clean_builds() {
    print_info "Cleaning build artifacts..."
    
    # Clean root project
    if [[ -d ".dart_tool" ]]; then
        rm -rf .dart_tool
        print_info "✓ Cleaned root .dart_tool"
    fi
    
    # Clean app project
    if [[ -d "app/gedu_mobile_client/.dart_tool" ]]; then
        rm -rf app/gedu_mobile_client/.dart_tool
        print_info "✓ Cleaned app .dart_tool"
    fi
    
    # Clean libraries
    for lib in libraries/*/; do
        if [[ -d "${lib}.dart_tool" ]]; then
            rm -rf "${lib}.dart_tool"
            print_info "✓ Cleaned ${lib}.dart_tool"
        fi
    done
    
    # Clean cores
    for core in cores/*/; do
        if [[ -d "${core}.dart_tool" ]]; then
            rm -rf "${core}.dart_tool"
            print_info "✓ Cleaned ${core}.dart_tool"
        fi
    done
    
    print_success "✓ All build artifacts cleaned"
}

# Function to run build_runner for a specific package
run_build_runner() {
    local package_path=$1
    local package_name=$(basename "$package_path")
    
    print_info "Running build_runner for $package_name..."
    
    if [[ ! -f "$package_path/pubspec.yaml" ]]; then
        print_warning "⚠ No pubspec.yaml found in $package_path, skipping..."
        return 0
    fi
    
    cd "$package_path" || {
        print_error "✗ Failed to change directory to $package_path"
        return 1
    }
    
    # Check if build_runner is in dev_dependencies
    if ! grep -q "build_runner" pubspec.yaml; then
        print_info "✓ $package_name has no build_runner dependency, skipping..."
        cd - > /dev/null || exit 1
        return 0
    fi
    
    # Run build_runner
    local build_cmd="dart run build_runner build --delete-conflicting-outputs"
    if [[ "$WATCH_MODE" == "true" ]]; then
        build_cmd="dart run build_runner build --delete-conflicting-outputs --watch"
    fi
    
    if eval "$build_cmd"; then
        print_success "✓ Build runner completed for $package_name"
    else
        print_error "✗ Build runner failed for $package_name"
        cd - > /dev/null || exit 1
        return 1
    fi
    
    cd - > /dev/null || exit 1
}

# Function to generate localization files
generate_localization() {
    print_info "Generating localization files..."
    
    # Check if core_localization directory exists
    if [[ ! -d "cores/core_localization" ]]; then
        print_error "✗ core_localization directory not found"
        return 1
    fi
    
    cd cores/core_localization || {
        print_error "✗ Failed to change directory to cores/core_localization"
        return 1
    }
    
    # Check if ARB files exist
    if [[ ! -d "lib/l10n" ]] || [[ ! -f "lib/l10n/app_en.arb" ]]; then
        print_warning "⚠ No ARB files found in lib/l10n, skipping localization generation..."
        cd - > /dev/null || exit 1
        return 0
    fi
    
    # Generate localization files
    print_info "Running flutter gen-l10n..."
    if flutter gen-l10n; then
        print_success "✓ Localization files generated successfully"
    else
        print_error "✗ Failed to generate localization files"
        cd - > /dev/null || exit 1
        return 1
    fi
    
    cd - > /dev/null || exit 1
}

# Function to run build_runner for all packages
run_build_runner_all() {
    print_info "Running build_runner for all packages..."
    
    # Build order: libraries first, then cores, then app
    local packages=(
        "libraries/lib_base"
        "libraries/lib_utils"
        "libraries/lib_design_system"
        "cores/core_network"
        "cores/core_localization"
        "app/gedu_mobile_client"  # App package
    )
    
    local failed_packages=()
    
    for package in "${packages[@]}"; do
        if [[ -d "$package" ]]; then
            if ! run_build_runner "$package"; then
                failed_packages+=("$package")
            fi
        else
            print_warning "⚠ Package directory $package not found, skipping..."
        fi
    done
    
    # Report results
    if [[ ${#failed_packages[@]} -eq 0 ]]; then
        print_success "✓ All packages built successfully!"
    else
        print_error "✗ Some packages failed to build:"
        for package in "${failed_packages[@]}"; do
            echo "  - $package"
        done
        exit 1
    fi
}

# Function to run in watch mode
run_watch_mode() {
    print_info "Starting build_runner in watch mode..."
    print_warning "⚠ Watch mode will run continuously. Press Ctrl+C to stop."
    
    # Start build_runner in watch mode for the app package
    cd app/gedu_mobile_client || {
        print_error "✗ Failed to change directory to app/gedu_mobile_client"
        exit 1
    }
    
    print_info "Watching for changes in app package..."
    dart run build_runner build --delete-conflicting-outputs --watch
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
    echo "🔨 Gedu Mobile Client - Build All Script"
    echo "========================================"
    echo ""
    
    # Check prerequisites
    check_melos
    check_directory
    
    # Clean if requested
    if [[ "$CLEAN_BUILD" == "true" ]]; then
        clean_builds
        echo ""
    fi
    
    # Run melos bootstrap
    run_melos_bootstrap
    echo ""
    
    # Run build_runner
    if [[ "$WATCH_MODE" == "true" ]]; then
        run_watch_mode
    else
        run_build_runner_all
        echo ""
        
        # Always generate localization
        generate_localization
        echo ""
        
        print_success "🎉 All builds completed successfully!"
    fi
}

# Run main function
main "$@" 