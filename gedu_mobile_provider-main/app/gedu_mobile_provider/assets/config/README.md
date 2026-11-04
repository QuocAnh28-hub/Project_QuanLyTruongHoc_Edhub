# Flavor Configuration System

This directory contains JSON configuration files for different app flavors (development, staging, production).

## Configuration Files

- `dev_config.json` - Development environment configuration
- `staging_config.json` - Staging environment configuration  
- `prod_config.json` - Production environment configuration

## Configuration Structure

Each configuration file contains the following properties:

```json
{
  "flavor": "development",
  "appName": "Gedu Dev",
  "appId": "com.gedu.app.dev",
  "baseUrl": "https://demo.lazeout.com",
  "timeoutSeconds": 30,
  "enableLogging": true,
  "appIcon": "@mipmap/ic_launcher_dev",
  "appVersion": "1.0.0",
  "buildNumber": "1"
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `flavor` | string | Environment flavor (development, staging, production) |
| `appName` | string | Display name of the app |
| `appId` | string | Bundle identifier for the app |
| `baseUrl` | string | Base URL for API endpoints |
| `timeoutSeconds` | number | Request timeout in seconds |
| `enableLogging` | boolean | Whether to enable debug logging |
| `appIcon` | string | App icon resource identifier |
| `appVersion` | string | App version string |
| `buildNumber` | string | Build number string |

> **Note**: Default HTTP headers (`Content-Type`, `Accept`) are now managed centrally in `core_network` and applied to all environments automatically.

## Managing Configurations

### Using the Update Script

The `scripts/update_config.sh` script provides an easy way to update configuration values:

```bash
# View current configuration
./scripts/update_config.sh dev show

# Update a configuration value
./scripts/update_config.sh dev baseUrl https://new-dev-api.com
./scripts/update_config.sh staging timeoutSeconds 60
./scripts/update_config.sh prod enableLogging false
```

### Manual Editing

You can also edit the JSON files directly. Make sure to maintain valid JSON syntax.

## How It Works

1. **Loading**: The `FlavorConfig` class loads configuration from JSON files based on the current flavor
2. **Caching**: Configurations are cached after first load for better performance
3. **Fallback**: If JSON loading fails, the system falls back to hardcoded default values
4. **Integration**: The configuration is used throughout the app for API endpoints, logging, and app metadata

## Benefits

- **Easy Management**: Change configurations without touching code
- **Environment-Specific**: Different settings for each environment
- **Version Control**: Track configuration changes in git
- **Team Collaboration**: Non-developers can update configurations
- **CI/CD Friendly**: Easy to update configurations in automated builds

## Example Use Cases

- Change API endpoints for different environments
- Adjust timeout values for slower networks
- Enable/disable logging based on environment
- Update app metadata for different builds
- Configure app-specific settings per environment

## Default Headers

Default HTTP headers are now managed centrally in the `core_network` package:

```dart
// In NetworkConfig
final Map<String, String> defaultHeaders = const {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
```

These headers are automatically applied to all API requests across all environments, ensuring consistency and reducing configuration duplication. 