# Notification Microservice

A unified notification microservice that handles email notifications and can be extended to support multiple notification types.

## Architecture

This microservice is designed as a single app that can handle multiple notification types:

```
src/
├── email/              # Email-specific functionality
│   ├── email.controller.ts
│   ├── email.service.ts
│   └── email.module.ts
├── notification/       # Multi-type notification handler
│   ├── notification.controller.ts
│   ├── notification.service.ts
│   └── notification.module.ts
├── templates/          # Handlebars email templates
│   └── notification.hbs
├── config/            # Configuration files
│   ├── kafka.config.ts
│   └── mailer.config.ts
├── mocks/             # Mock files for dependencies
│   └── css-inline.mock.js
└── app.module.ts      # Main app module
```

## Features

### Email Notifications
- **Kafka Topic**: `gedu.notification.send.email`
- **Payload**:
  ```typescript
  {
    to: string | string[],
    subject: string,
    template?: string, // defaults to 'notification'
    context?: Record<string, any>
  }
  ```

### Multi-Type Notifications
- **Kafka Topic**: `gedu.notification.send`
- **Payload**:
  ```typescript
  {
    type: 'email' | 'sms' | 'push' | 'in_app',
    to: string | string[],
    subject: string,
    message?: string,
    template?: string,
    metadata?: Record<string, any>
  }
  ```

## Email Templates

### Available Templates
- `notification.hbs` - Default notification template with header, content, and footer

### Template Variables
All templates support these variables:
- `subject` - Email subject line
- `message` - Main message content (HTML supported)
- Any additional variables passed in `context` or `metadata`

### Template Structure
```handlebars
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{subject}}</title>
    <style>
        /* Embedded CSS styles */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{subject}}</h1>
        </div>
        <div class="content">
            {{{message}}}
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
```

## Configuration

### Environment Variables

The following environment variables need to be configured for the service to work properly:

```env
# SMTP Configuration
SMTP_HOST=smtp.mailersend.net        # SMTP server host
SMTP_PORT=587                        # SMTP server port
SMTP_SECURE=false                    # Use TLS (true/false)
SMTP_USER=your-smtp-username         # SMTP username
SMTP_PASS=your-smtp-password         # SMTP password
SMTP_CIPHERS=SSLv3                  # Optional: SMTP cipher configuration

# Microsoft Graph Configuration (for Microsoft 365 email integration)
MS_GRAPH_TENANT_ID=your-tenant-id           # Microsoft 365 tenant ID
MS_GRAPH_CLIENT_ID=your-client-id           # Microsoft Graph API client ID
MS_GRAPH_CLIENT_SECRET=your-client-secret   # Microsoft Graph API client secret

# Mail Configuration
MAIL_FROM="Hỗ Trợ - Gedu <no-reply@gedu.vn>"  # Default sender email address

# Web Configuration
WEB_ACCESS_LINK=https://gedu.vn           # Main application URL
WEB_SUPPORT_EMAIL=hotro@gedu.vn           # Support email address
WEB_SUPPORT_PHONE=0931441213                 # Support phone number

# Infrastructure Configuration
KAFKA_BROKERS=localhost:9092                 # Comma-separated list of Kafka brokers
REDIS_URL=localhost:6379                     # Redis connection URL
```

#### SMTP Configuration Details
- `SMTP_HOST`: The SMTP server host (e.g., smtp.mailersend.net, smtp.gmail.com)
- `SMTP_PORT`: The SMTP server port (common ports: 587 for TLS, 465 for SSL)
- `SMTP_SECURE`: Whether to use SSL/TLS (set to true for port 465)
- `SMTP_USER`: Your SMTP server username/email
- `SMTP_PASS`: Your SMTP server password or app-specific password
- `SMTP_CIPHERS`: Optional cipher configuration for SSL/TLS

#### Microsoft Graph Configuration (Optional)
If you want to use Microsoft 365 for sending emails:
- `MS_GRAPH_TENANT_ID`: Your Microsoft 365 tenant ID
- `MS_GRAPH_CLIENT_ID`: Application (client) ID from Azure AD app registration
- `MS_GRAPH_CLIENT_SECRET`: Client secret from Azure AD app registration

#### Mail Configuration
- `MAIL_FROM`: The default sender email address and name shown to recipients

#### Web Configuration
- `WEB_ACCESS_LINK`: The main application URL for email links
- `WEB_SUPPORT_EMAIL`: Support email address shown in emails
- `WEB_SUPPORT_PHONE`: Support phone number shown in emails

#### Infrastructure Configuration
- `KAFKA_BROKERS`: Comma-separated list of Kafka broker addresses
- `REDIS_URL`: Redis connection URL for caching and rate limiting

### Kafka Settings

#### Client Configuration
- **Client ID**: `email-service`
- **Group ID**: `email-consumer-group`
- **Brokers**: Configurable via `KAFKA_BROKERS` environment variable

#### Consumer Groups
- **email-consumer-group**: Handles email-specific messages
- Auto-commit: Enabled
- Session timeout: 30 seconds (default)

#### Topics
- `gedu.notification.send.email` - Direct email notifications
- `gedu.notification.send` - Multi-type notifications

## Technical Details

### CSS Inline Handling
The service uses a custom mock for CSS inline functionality to avoid native binary dependencies:
- Templates are rendered with Handlebars
- CSS inlining is disabled to prevent native binary issues
- Styles are embedded directly in templates

### Webpack Configuration
- Ignores optional microservice dependencies (gRPC, MQTT, NATS, Redis, RabbitMQ)
- Uses custom mock for `@css-inline/css-inline`
- Handles `.node` files with ignore-loader

## Usage

### Start the Service
```bash
cd apps/email
npm run serve
```

### Send Email Notification
Publish to Kafka topic `gedu.notification.send.email`:
```json
{
  "to": "user@example.com",
  "subject": "Welcome to Our Platform!",
  "template": "notification",
  "context": {
    "message": "<p>Welcome! Your account has been created successfully.</p>",
    "username": "john.doe"
  }
}
```

### Send Multi-Type Notification
Publish to Kafka topic `gedu.notification.send`:
```json
{
  "type": "email",
  "to": ["user1@example.com", "user2@example.com"],
  "subject": "System Maintenance Notice",
  "template": "notification",
  "metadata": {
    "message": "<p>System maintenance is scheduled for tonight.</p>",
    "maintenanceTime": "2024-01-15 02:00 UTC"
  }
}
```

## Development

### Adding New Templates
1. Create a new `.hbs` file in `src/templates/`
2. Use Handlebars syntax for variables: `{{variable}}`
3. Use triple braces for HTML content: `{{{htmlContent}}}`
4. Templates are automatically available by filename (without extension)

### Testing
```bash
# Build the service
npm run build

# Run in development mode
npm run serve

# Test with Kafka messages
# Use your preferred Kafka client to send test messages
```

## Why Single App?

1. **Cohesive Domain**: Notifications are a single business domain
2. **Shared Infrastructure**: Common Kafka consumers, templates, configs
3. **Easier Maintenance**: Single deployment, monitoring, and scaling
4. **Resource Efficiency**: Lower overhead than multiple microservices

## When to Split?

Consider splitting when:
- Different teams own different notification types
- Different scaling requirements
- Independent deployment needs
- Service becomes too complex (>10k lines)

## Monitoring

### Health Checks
- Service logs startup confirmation
- Kafka connection status
- SMTP connection validation

### Metrics
- Email send success/failure rates
- Kafka message processing times
- Template rendering performance