# Core Localization

A centralized localization package for the GEDU mobile application that provides type-safe internationalization support using Flutter's ARB (Application Resource Bundle) format.

## 🌍 Features

- **Type-safe localization** using generated Dart classes
- **Multi-language support** with Vietnamese as default
- **ARB file format** for easy translation management
- **Automatic code generation** with `flutter gen-l10n`
- **Centralized string management** for the entire application

## 📁 Structure

```
core_localization/
├── lib/
│   ├── l10n/                    # ARB files and generated localization
│   │   ├── app_en.arb          # English strings
│   │   ├── app_vi.arb          # Vietnamese strings
│   │   ├── app_localizations.dart      # Generated main file
│   │   ├── app_localizations_en.dart   # Generated English
│   │   └── app_localizations_vi.dart   # Generated Vietnamese
│   ├── src/
│   │   └── strings/            # Legacy string constants
│   └── core_localization.dart  # Package exports
├── build.sh                    # Build script for this package
└── pubspec.yaml               # Package configuration
```

## 🚀 Quick Start

### 1. Build the Package

```bash
# Navigate to core_localization directory
cd cores/core_localization
./build.sh

# Or with options
./build.sh --clean        # Clean and build
./build.sh --watch        # Build in watch mode
./build.sh --help         # Show all options
```

### 2. Add New Strings

1. **Edit ARB files** in `lib/l10n/`:
   ```json
   // app_en.arb
   {
     "newStringKey": "New string in English",
     "@newStringKey": {
       "description": "Description for translators"
     }
   }
   ```

   ```json
   // app_vi.arb
   {
     "newStringKey": "Chuỗi mới bằng tiếng Việt"
   }
   ```

2. **Generate localization files**:
   ```bash
   ./build.sh
   ```

3. **Use in your code**:
   ```dart
   import 'package:core_localization/core_localization.dart';
   
   // In a widget
   Text(AppLocalizations.of(context)!.newStringKey)
   ```

### 3. Add New Language

1. **Create new ARB file** (e.g., `app_fr.arb` for French):
   ```json
   {
     "@@locale": "fr",
     "onboardingWelcomeTitle1": "Bienvenue sur G-Edu",
     // ... copy all keys from app_en.arb
   }
   ```

2. **Update pubspec.yaml** to include the new locale:
   ```yaml
   arb-dir: lib/l10n
   # Add supported locales if needed
   ```

3. **Generate files**:
   ```bash
   ./build.sh
   ```

## 📝 ARB File Format

ARB files use JSON format with special metadata for Flutter localization:

```json
{
  "@@locale": "en",
  "stringKey": "String value",
  "@stringKey": {
    "description": "Description for translators",
    "placeholders": {
      "paramName": {
        "type": "String",
        "example": "example value"
      }
    }
  }
}
```

### Supported Features

- **Simple strings**: `"key": "value"`
- **String interpolation**: `"key": "Hello {name}"`
- **Pluralization**: `"key": "{count, plural, =0{No items} =1{One item} other{{count} items}}"`
- **Gender**: `"key": "{gender, select, male{He} female{She} other{They}}"`
- **Metadata**: `@key` for descriptions and placeholders

## 🔧 Configuration

### pubspec.yaml

```yaml
name: core_localization
version: 0.0.1

environment:
  sdk: ^3.8.1
  flutter: ">=1.17.0"

dependencies:
  flutter:
    sdk: flutter

# Localization configuration
arb-dir: lib/l10n

flutter:
  generate: true
  assets:
    - lib/l10n/
```

### Generated Files

The build process generates:
- `app_localizations.dart` - Main localization class
- `app_localizations_<locale>.dart` - Locale-specific classes
- Type-safe getters for all string keys

## 🎯 Usage in Other Packages

### 1. Add Dependency

```yaml
# In your package's pubspec.yaml
dependencies:
  core_localization: ^0.0.1
```

### 2. Import and Use

```dart
import 'package:core_localization/core_localization.dart';

class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Text(l10n.onboardingWelcomeTitle1);
  }
}
```

### 3. Access Generated Strings

```dart
// All string keys are available as getters
l10n.onboardingWelcomeTitle1
l10n.onboardingWelcomeDescription1
l10n.onboardingSkipButton
l10n.onboardingNextButton
l10n.onboardingLoginButton
```

## 🛠️ Build Script

The `build.sh` script provides convenient commands:

```bash
# Show help
./build.sh --help

# Normal build (generates localization files)
./build.sh

# Clean build artifacts and rebuild
./build.sh --clean

# Watch mode (continuous generation)
./build.sh --watch

# Force rebuild
./build.sh --force
```

## 🔄 Integration with Main Build

The core_localization package is automatically built as part of the main project build process:

```bash
# From project root
./build_all.sh  # Includes localization generation
```

## 📋 Current Strings

### Onboarding Screen
- `onboardingWelcomeTitle1` - "Welcome to G-Edu" / "Chào mừng đến G-Edu"
- `onboardingWelcomeDescription1` - Multi-utility education management description
- `onboardingWelcomeTitle2` - "Track student attendance daily" / "Theo dõi chuyên cần học sinh mỗi ngày"
- `onboardingWelcomeDescription2` - Attendance tracking description
- `onboardingWelcomeTitle3` - "Convenient tuition payment without fees" / "Thanh toán học phí tiện lợi không mất phí"
- `onboardingWelcomeDescription3` - Tuition management description
- `onboardingSkipButton` - "Skip" / "Bỏ qua"
- `onboardingNextButton` - "Next" / "Tiếp theo"
- `onboardingLoginButton` - "Login" / "Đăng nhập"

## 🌐 Supported Languages

- **Vietnamese (vi)** - Default language
- **English (en)** - Secondary language

## 🚨 Troubleshooting

### Common Issues

1. **"No ARB files found"**
   - Ensure ARB files exist in `lib/l10n/`
   - Check file naming: `app_<locale>.arb`

2. **"Generated files not found"**
   - Run `./build.sh` to generate files
   - Check `pubspec.yaml` configuration

3. **"AppLocalizations.of(context) returns null"**
   - Ensure `MaterialApp` has proper localization delegates
   - Check that `core_localization` is properly imported

4. **"String key not found"**
   - Add the key to all ARB files
   - Run `./build.sh` to regenerate

### Debug Commands

```bash
# Check ARB files
ls -la lib/l10n/

# Verify generated files
ls -la lib/l10n/app_localizations*.dart

# Clean and rebuild
./build.sh --clean

# Check pubspec configuration
cat pubspec.yaml | grep -A 5 -B 5 "arb-dir\|generate"
```

## 📚 Resources

- [Flutter Internationalization](https://docs.flutter.dev/development/accessibility-and-localization/internationalization)
- [ARB Format Specification](https://github.com/google/app-resource-bundle)
- [flutter_localizations](https://api.flutter.dev/flutter/flutter_localizations/flutter_localizations-library.html)

## 🤝 Contributing

1. Add new strings to ARB files
2. Provide translations for all supported languages
3. Run `./build.sh` to generate files
4. Test the changes in the app
5. Update this README if needed

---

**Note**: This package is part of the GEDU mobile application architecture. For questions or issues, refer to the main project documentation.
