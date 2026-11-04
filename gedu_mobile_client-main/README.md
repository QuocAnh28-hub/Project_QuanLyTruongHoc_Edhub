# Gedu Mobile Client

A Flutter mobile application with a modular architecture using Melos for monorepo management.

## 🚀 Quick Start

### Prerequisites

- Flutter SDK (>=3.8.1)
- Dart SDK (>=3.8.1)
- Melos (for monorepo management)

### Setup

1. **Install Melos** (if not already installed):
   ```bash
   dart pub global activate melos
   ```

2. **Bootstrap the project**:
   ```bash
   melos bootstrap
   ```

3. **Generate configuration**:
   ```bash
   make gen
   ```

4. **Build all packages**:
   ```bash
   ./build_all.sh
   ```

## 📱 Running the App

### Development
```bash
cd app/gedu_mobile_client
flutter run -t lib/main_development.dart --dart-define=FLAVOR=development --dart-define=API_BASE_URL=https://demo.lazeout.com
```

### Staging
```bash
cd app/gedu_mobile_client
flutter run -t lib/main_staging.dart --dart-define=FLAVOR=staging --dart-define=API_BASE_URL=https://staging.lazeout.com
```

### Production
```bash
cd app/gedu_mobile_client
flutter run -t lib/main_production.dart --dart-define=FLAVOR=production --dart-define=API_BASE_URL=https://api.lazeout.com
```

## 🏗️ Project Structure

```
gedu_mobile_client/
├── app/gedu_mobile_client/     # Main Flutter application
├── cores/                      # Core modules (network, localization)
├── libraries/                  # Shared libraries (base, utils, design system)
├── tools/                      # Development tools
└── melos.yaml                  # Melos workspace configuration
```

## 🔧 Development

### Creating a Core Module
```bash
cd cores
flutter create --template=package core_[your_module_name]
```

### Creating a Library Module
```bash
cd libraries
flutter create --template=package lib_[your_module_name]
```

### Building Generated Code
```bash
./build_all.sh
```

### Watch Mode (for development)
```bash
./build_all.sh --watch
```

## 📦 Available Scripts

- `./build_all.sh` - Build all packages with code generation
- `./run_flavor.sh` - Run the app with different flavors
- `make gen` - Generate configuration files
