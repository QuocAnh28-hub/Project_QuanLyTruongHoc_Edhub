#!/bin/bash

# Docker entrypoint script
# This script runs migrations if needed, then starts the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log with timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if migrations should run
should_run_migrations() {
    # Skip migrations if explicitly disabled
    if [ "$SKIP_MIGRATIONS" = "true" ]; then
        log "${YELLOW}⏭️  Migrations skipped (SKIP_MIGRATIONS=true)${NC}"
        return 1
    fi
    
    # Skip migrations if no DATABASE_URL is provided
    if [ -z "$DATABASE_URL" ]; then
        log "${YELLOW}⏭️  No DATABASE_URL provided - skipping migrations${NC}"
        return 1
    fi
    
    # Skip migrations if Prisma schema is not found
    if [ ! -f "libs/prisma/prisma/schema.prisma" ]; then
        log "${YELLOW}⏭️  Prisma schema not found - skipping migrations${NC}"
        return 1
    fi
    
    return 0
}

# Function to wait for database
wait_for_database() {
    log "--------------------------------"
    log "DATABASE_URL: $DATABASE_URL"
    log "--------------------------------"
    log "${YELLOW}⏳ Waiting for database to be ready...${NC}"
    
    # Wait for database connection (max 60 seconds)
    for i in {1..60}; do
        if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
            log "${GREEN}✅ Database is ready${NC}"
            return 0
        fi
        log "${YELLOW}⏳ Database not ready yet... (attempt $i/60)${NC}"
        sleep 1
    done
    
    log "${RED}❌ Database connection timeout after 60 seconds${NC}"
    return 1
}

# Function to run migrations safely
run_migrations_safe() {
    log "${BLUE}🔍 Checking if migrations are needed...${NC}"
    
    # Change to app directory if we're not already there
    cd /app
    
    # Check migration status
    MIGRATION_STATUS=$(npx prisma migrate status --schema=./libs/prisma/prisma 2>&1 || echo "ERROR")

    log "MIGRATION_STATUS: $MIGRATION_STATUS"
    
    if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
        log "${GREEN}✅ Database schema is up to date${NC}"
        return 0
    elif echo "$MIGRATION_STATUS" | grep -q "migrations have not yet been applied"; then
        log "${YELLOW}📦 Pending migrations detected - applying...${NC}"
        
        # Generate Prisma client
        log "${YELLOW}🔧 Generating Prisma client...${NC}"
        npx prisma generate --schema=./libs/prisma/prisma
        
        # Apply migrations
        log "${YELLOW}🚀 Applying database migrations...${NC}"
        npx prisma migrate deploy --schema=./libs/prisma/prisma
        
        log "${GREEN}✅ Migrations applied successfully${NC}"
        return 0
    else
        # If we can't determine status, try to apply migrations anyway (safe default)
        log "${YELLOW}⚠️  Cannot determine migration status - attempting migration...${NC}"
        
        # Generate Prisma client
        npx prisma generate --schema=./libs/prisma/prisma || log "${YELLOW}⚠️  Prisma generate failed, continuing...${NC}"
        
        # Try to apply migrations
        npx prisma migrate deploy --schema=./libs/prisma/prisma || log "${YELLOW}⚠️  Migration deploy failed, continuing...${NC}"
        
        return 0
    fi
}

# Function to start the application
start_application() {
    log "${GREEN}🚀 Starting application...${NC}"
    
    # Execute the original command passed to docker run
    exec "$@"
}

# Main execution
main() {
    log "${BLUE}🐳 Docker entrypoint started${NC}"
    log "${BLUE}📋 Command: $*${NC}"
    
    # Check if we should run migrations
    if should_run_migrations; then
        log "${BLUE}🔄 Migration check enabled${NC}"
        log "--------------------------------"
        log "DATABASE_URL: $DATABASE_URL"
        log "--------------------------------"
        log "Running migrations safe..."
        log "--------------------------------"
        # Wait for database to be ready
        # if wait_for_database; then
            # Run migrations if needed
            run_migrations_safe
        # else
            # log "${RED}❌ Database not available - starting application anyway${NC}"
        # fi
    else
        log "${BLUE}⏭️  Migration check disabled${NC}"
    fi
    
    # Start the application
    start_application "$@"
}

# Execute main function with all arguments
main "$@"