# CI/CD Workflow Documentation

This document explains how the GitHub Actions CI/CD workflow works for the GEdu monorepo, focusing on building only affected changes without using Nx Cloud.

## Overview

The CI/CD pipeline is designed to:
- ✅ Build only affected projects (apps/libs) to save time and resources
- ✅ Run database migrations when the Prisma schema changes
- ✅ Provide fast feedback on pull requests
- ✅ Deploy only changed services to production
- ❌ No Nx Cloud dependency (completely self-hosted)

## Workflow Files

### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### `setup` Job
- **Purpose**: Determines which projects are affected by the changes
- **Outputs**: 
  - `affected-apps`: List of affected applications
  - `affected-libs`: List of affected libraries
  - `has-affected`: Boolean indicating if any projects are affected
  - `should-migrate`: Boolean indicating if database migration is needed

#### `lint-and-test` Job
- **Purpose**: Runs linting and testing only on affected projects
- **Depends on**: `setup`
- **Runs when**: `has-affected == true`
- **Commands**:
  ```bash
  pnpm nx affected:lint --base=$BASE_SHA --parallel=3
  pnpm nx affected:test --base=$BASE_SHA --parallel=3 --coverage
  ```

#### `database-migration` Job
- **Purpose**: Runs database migrations when Prisma schema changes
- **Depends on**: `setup`
- **Runs when**: `should-migrate == true`
- **Services**: PostgreSQL 15 container
- **Commands**:
  ```bash
  pnpm nx run prisma:prisma:generate
  pnpm nx run prisma:prisma:migrate
  ```

#### `build` Job
- **Purpose**: Builds affected applications in parallel
- **Depends on**: `setup`, `lint-and-test`
- **Strategy**: Matrix build for each affected app
- **Artifacts**: Build outputs uploaded for Docker builds

#### `build-docker` Job
- **Purpose**: Creates Docker images for affected applications
- **Depends on**: `setup`, `build`
- **Runs when**: `has-affected == true` AND `main` branch
- **Output**: Docker images pushed to registry

#### `deploy` Job
- **Purpose**: Deploys affected services to staging/production
- **Depends on**: `setup`, `build-docker`, `database-migration`
- **Runs when**: `has-affected == true` AND `main` branch

### 2. PR Check Pipeline (`.github/workflows/pr-check.yml`)

**Triggers:**
- Pull request events (opened, synchronize, reopened)

**Features:**
- Lightweight checks for PRs
- Comments on PR with affected projects analysis
- No deployment, only validation

## How Affected Detection Works

### Base Commit Determination
```bash
# For pull requests
BASE_SHA="${{ github.event.pull_request.base.sha }}"

# For push events
BASE_SHA="${{ github.event.before }}"

# Fallback to main branch
if [ -z "$BASE_SHA" ] || [ "$BASE_SHA" == "0000000000000000000000000000000000000000" ]; then
  BASE_SHA="origin/main"
fi
```

### Nx Commands Used
```bash
# Get affected apps
pnpm nx print-affected --base=$BASE_SHA --select=projects --type=app

# Get affected libs
pnpm nx print-affected --base=$BASE_SHA --select=projects --type=lib

# Run commands on affected projects
pnpm nx affected:lint --base=$BASE_SHA --parallel=3
pnpm nx affected:test --base=$BASE_SHA --parallel=3
pnpm nx affected:build --base=$BASE_SHA --parallel=2
```

## Project Structure Impact

### Applications (`apps/`)
- `core` - Main API service
- `import` - Import processing service

### Libraries (`libs/`)
- `prisma` - Database schema and client
- `config` - Configuration management
- `http` - HTTP utilities
- `transport` - gRPC/Kafka transport
- `shared` - Shared utilities
- `email` - Email service
- `minio` - File storage

### Dependency Graph
```
apps/core → libs/prisma, libs/config, libs/http, libs/transport, libs/shared
apps/import → libs/prisma, libs/config, libs/transport, libs/email, libs/minio
```

## Database Migration Logic

The workflow automatically detects when database migrations are needed:

```bash
# Check if prisma lib is affected
if echo "$AFFECTED_LIBS" | grep -q "prisma"; then
  SHOULD_MIGRATE="true"
else
  SHOULD_MIGRATE="false"
fi
```

**Migration Process:**
1. Start PostgreSQL container
2. Generate Prisma client
3. Run migrations: `prisma migrate deploy`
4. Verify migration status

## Performance Optimizations

### Caching Strategy
- **pnpm store cache**: Cached based on `pnpm-lock.yaml` hash
- **Docker layer cache**: GitHub Actions cache for Docker builds
- **Nx computation cache**: Local caching (no cloud)

### Parallel Execution
- **Linting**: Up to 3 projects in parallel
- **Testing**: Up to 3 projects in parallel
- **Building**: Up to 2 projects in parallel (memory constraints)

### Conditional Execution
- Jobs only run when relevant changes are detected
- Docker builds only on `main` branch
- Deployments only for production-ready changes

## Local Development

### Helper Script
Use the provided script to analyze affected projects locally:

```bash
# Check affected projects against main
./scripts/affected-projects.sh

# Check against specific commit
./scripts/affected-projects.sh origin/develop

# Check against specific SHA
./scripts/affected-projects.sh abc123
```

### Manual Commands
```bash
# Check what's affected
pnpm nx print-affected --base=origin/main

# Run affected commands
pnpm nx affected:lint --base=origin/main
pnpm nx affected:test --base=origin/main
pnpm nx affected:build --base=origin/main

# Visualize dependency graph
pnpm nx graph --affected --base=origin/main
```

## Environment Variables

### Required Secrets
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password

### Environment Variables
- `NODE_VERSION`: Node.js version (default: '18')
- `PNPM_VERSION`: pnpm version (default: '8')
- `DATABASE_URL`: PostgreSQL connection string
- `KAFKA_BROKERS`: Kafka broker addresses

## Troubleshooting

### Common Issues

1. **No affected projects detected**
   - Check if changes are in tracked files
   - Verify base commit exists
   - Use `./scripts/affected-projects.sh` to debug

2. **Migration failures**
   - Check database connection
   - Verify Prisma schema syntax
   - Review migration files

3. **Build failures**
   - Check TypeScript compilation errors
   - Verify dependency versions
   - Review build logs

### Debug Commands
```bash
# Check affected projects
pnpm nx print-affected --base=origin/main --select=projects

# Show dependency graph
pnpm nx graph

# Check specific project dependencies
pnpm nx show project core --web
```

## Benefits

### Time Savings
- **Before**: Build all 9 projects (~15 minutes)
- **After**: Build only affected projects (~3-8 minutes)

### Resource Efficiency
- Only affected tests run
- Reduced CI/CD costs
- Faster feedback loops

### Reliability
- Database migrations run automatically
- Parallel execution reduces bottlenecks
- Comprehensive error handling

## Future Enhancements

- [ ] Add integration tests for affected services
- [ ] Implement blue-green deployments
- [ ] Add performance benchmarking
- [ ] Integrate with monitoring tools
- [ ] Add automatic rollback on failure 