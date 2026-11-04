# Migration Environment Variables

This document describes the environment variables used to control the integrated migration system.

## Migration Control Variables

### `SKIP_MIGRATIONS`

**Default:** `false`  
**Type:** Boolean (`true` or `false`)

Controls whether database migrations should run automatically when containers start.

#### Usage Examples

```bash
# Enable automatic migrations (default behavior)
SKIP_MIGRATIONS=false

# Disable automatic migrations
SKIP_MIGRATIONS=true
```

#### When to Use Each Setting

| Environment | Recommended Setting | Reason |
|-------------|-------------------|---------|
| **Development** | `false` | Automatic migrations for convenience |
| **Staging** | `false` | Test migrations in production-like environment |
| **Production** | `true` or `false` | Depends on deployment strategy |
| **CI/CD** | `true` | Migrations handled by pipeline |

## Environment-Specific Configurations

### Development Environment

```bash
# .env.development
SKIP_MIGRATIONS=false
DATABASE_URL=postgresql://dev:password@localhost:5432/gedu_dev
```

**Benefits:**
- Automatic schema updates
- No manual intervention needed
- Fast development iteration

### Staging Environment  

```bash
# .env.staging
SKIP_MIGRATIONS=false
DATABASE_URL=postgresql://staging:password@db:5432/gedu_staging
```

**Benefits:**
- Tests migration process
- Validates schema changes
- Mirrors production behavior

### Production Environment

**Option 1: Automatic Migrations (Simpler)**

```bash
# .env.production
SKIP_MIGRATIONS=false
DATABASE_URL=postgresql://prod:password@db:5432/gedu_prod
```

**Benefits:**
- Simplified deployment
- No separate migration step
- Zero-downtime updates

**Option 2: Manual Migrations (More Control)**

```bash
# .env.production
SKIP_MIGRATIONS=true
DATABASE_URL=postgresql://prod:password@db:5432/gedu_prod
```

**Benefits:**
- Full control over migration timing
- Can run migrations during maintenance windows
- Separate migration validation

### CI/CD Environment

```bash
# .env.ci
SKIP_MIGRATIONS=true
DATABASE_URL=postgresql://ci:password@ci-db:5432/gedu_test
```

**Benefits:**
- Migrations handled by CI/CD pipeline
- Consistent deployment process
- Better error handling

## Docker Compose Examples

### Development Setup

```yaml
# docker-compose.dev.yml
services:
  core:
    image: gedu/core:dev
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SKIP_MIGRATIONS=false  # Auto-migrate in development
    ports:
      - "3000:3000"
```

### Production Setup with Auto-Migration

```yaml
# docker-compose.prod.yml
services:
  core:
    image: gedu/core:latest
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SKIP_MIGRATIONS=false  # Auto-migrate in production
    ports:
      - "3000:3000"
    deploy:
      replicas: 3  # Multiple instances can start safely
```

### Production Setup with Manual Migration

```yaml
# docker-compose.prod.yml
services:
  # Run migrations separately first
  migrate:
    image: gedu/core:latest
    environment:
      - DATABASE_URL=${DATABASE_URL}
    command: ["/usr/local/bin/docker-entrypoint.sh", "npx", "prisma", "migrate", "deploy", "--schema=./libs/prisma/prisma/schema.prisma"]
    
  core:
    image: gedu/core:latest
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SKIP_MIGRATIONS=true  # Skip auto-migration
    ports:
      - "3000:3000"
    depends_on:
      - migrate
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Database connection failed"

**Problem:** Container can't connect to database  
**Solution:** 
```bash
# Check database URL
echo $DATABASE_URL

# Skip migrations temporarily
SKIP_MIGRATIONS=true
```

#### 2. "Migrations taking too long"

**Problem:** Migration process is slow  
**Solution:**
```bash
# Skip auto-migration and run manually
SKIP_MIGRATIONS=true

# Run migrations separately
docker exec -it <container> npx prisma migrate deploy --schema=./libs/prisma/prisma/schema.prisma
```

#### 3. "App won't start after migration failure"

**Problem:** Migration failed but app should still start  
**Solution:** Check the entrypoint script logs - the app should start even after migration failures. If not, there might be an issue with the entrypoint script.

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Enable debug output (if implemented in your app)
DEBUG=true

# Check container logs
docker logs <container-id>

# Follow logs in real-time
docker logs -f <container-id>
```

### Manual Migration Commands

```bash
# Connect to running container
docker exec -it <container-id> /bin/bash

# Check migration status
npx prisma migrate status --schema=./libs/prisma/prisma/schema.prisma

# Apply pending migrations
npx prisma migrate deploy --schema=./libs/prisma/prisma/schema.prisma

# Generate Prisma client
npx prisma generate --schema=./libs/prisma/prisma/schema.prisma
```

## Best Practices

### 1. **Environment Consistency**
- Use the same migration approach across similar environments
- Test migration behavior in staging before production
- Document your chosen approach for team members

### 2. **Monitoring**
- Monitor application startup times
- Set up alerts for migration failures
- Track migration execution in logs

### 3. **Backup Strategy**
- Always backup database before major migrations
- Test restore procedures
- Have rollback plans for failed migrations

### 4. **Performance Considerations**
- Monitor migration execution time
- Consider running heavy migrations during maintenance windows
- Use database connection pooling appropriately

## Migration Flow Diagram

```mermaid
graph TD
    A[Container Starts] --> B{SKIP_MIGRATIONS?}
    B -->|true| C[Skip Migration Check]
    B -->|false| D[Check DATABASE_URL]
    D --> E{Database URL exists?}
    E -->|no| C
    E -->|yes| F[Wait for Database]
    F --> G{Database Ready?}
    G -->|no| H[Timeout - Start App]
    G -->|yes| I[Check Migration Status]
    I --> J{Migrations Needed?}
    J -->|no| K[Start Application]
    J -->|yes| L[Run Migrations]
    L --> M{Migration Success?}
    M -->|yes| K
    M -->|no| N[Log Error - Start App Anyway]
    C --> K
    H --> K
    N --> K
```

This flow ensures that applications start reliably regardless of migration status, while still providing automatic migration capabilities when needed.