#!/bin/bash

# Android Studio Setup Verification Script
# This script helps verify that your Android Studio flavor setup is correct

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

echo "🔍 Android Studio Flavor Setup Verification"
echo "=========================================="
echo ""

# Check if we're in the correct directory
if [[ ! -f "pubspec.yaml" ]]; then
    print_error "pubspec.yaml not found. Please run this script from the project root."
    exit 1
fi

print_success "✓ Found pubspec.yaml - correct directory"

# Check if app directory exists
if [[ ! -d "app" ]]; then
    print_error "app directory not found. Project structure may be incorrect."
    exit 1
fi

print_success "✓ Found app directory"

# Check if main files exist
main_files=(
    "lib/main_development.dart"
    "lib/main_staging.dart"
    "lib/main_production.dart"
)

for file in "${main_files[@]}"; do
    if [[ -f "$file" ]]; then
        print_success "✓ Found $file"
    else
        print_error "✗ Missing $file"
    fi
done

# Check if Android configuration exists
if [[ ! -f "android/app/build.gradle.kts" ]]; then
    print_error "Android build.gradle.kts not found"
else
    print_success "✓ Found Android build.gradle.kts"
fi

# Check if iOS configuration exists
if [[ ! -d "ios" ]]; then
    print_error "iOS directory not found"
else
    print_success "✓ Found iOS directory"
fi

# Check Flutter setup
print_info "Checking Flutter setup..."
if command -v flutter &> /dev/null; then
    print_success "✓ Flutter is installed"
    
    # Check Flutter doctor
    print_info "Running flutter doctor..."
    flutter doctor --android-licenses > /dev/null 2>&1
    if [[ $? -eq 0 ]]; then
        print_success "✓ Android licenses accepted"
    else
        print_warning "⚠ Android licenses may need to be accepted"
    fi
else
    print_error "✗ Flutter is not installed or not in PATH"
fi

# Check available devices
print_info "Checking available devices..."
flutter devices > /dev/null 2>&1
if [[ $? -eq 0 ]]; then
    print_success "✓ Flutter devices command works"
    echo ""
    print_info "Available devices:"
    flutter devices
else
    print_error "✗ Flutter devices command failed"
fi

echo ""
echo "📋 Android Studio Configuration Checklist"
echo "========================================"
echo ""

echo "1. Open Android Studio"
echo "2. Open project: $(pwd)"
echo "3. Go to Run → Edit Configurations..."
echo "4. Create the following configurations:"
echo ""

echo "🔧 Development Configuration:"
echo "   - Name: Development Debug"
echo "   - Dart entrypoint: lib/main_development.dart"
echo "   - Additional run args: --flavor development"
echo "   - Build flavor: development"
echo ""

echo "🔧 Staging Configuration:"
echo "   - Name: Staging Debug"
echo "   - Dart entrypoint: lib/main_staging.dart"
echo "   - Additional run args: --flavor staging"
echo "   - Build flavor: staging"
echo ""

echo "🔧 Production Configuration:"
echo "   - Name: Production Debug"
echo "   - Dart entrypoint: lib/main_production.dart"
echo "   - Additional run args: --flavor production"
echo "   - Build flavor: production"
echo ""

echo "🚀 Quick Test Commands:"
echo "======================"
echo ""

echo "Test development flavor:"
echo "  flutter run --flavor development -t lib/main_development.dart"
echo ""

echo "Test staging flavor:"
echo "  flutter run --flavor staging -t lib/main_staging.dart"
echo ""

echo "Test production flavor:"
echo "  flutter run --flavor production -t lib/main_production.dart"
echo ""

echo "Or use the flavor runner script:"
echo "  ./run_flavor.sh development"
echo "  ./run_flavor.sh staging"
echo "  ./run_flavor.sh production"
echo ""

print_info "For detailed setup instructions, see ANDROID_STUDIO_SETUP_GUIDE.md"
print_info "For running instructions, see FLAVOR_RUNNING_GUIDE.md"

echo ""
echo "✅ Verification complete!" 