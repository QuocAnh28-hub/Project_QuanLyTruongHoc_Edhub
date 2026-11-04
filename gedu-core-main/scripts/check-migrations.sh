#!/bin/bash

# Migration status checker script
# This script checks if database migrations are needed before running them

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log with timestamp
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if database is accessible
check_database_connection() {
    log "${YELLOW}Checking database connection...${NC}"
    
    # Wait for database to be ready (max 30 seconds)
    for i in {1..30}; do
        if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
            log "${GREEN}✅ Database connection successful${NC}"
            return 0
        fi
        log "${YELLOW}⏳ Waiting for database... (attempt $i/30)${NC}"
        sleep 1
    done
    
    log "${RED}❌ Database connection failed after 30 seconds${NC}"
    return 1
}

# Function to check migration status
check_migration_status() {
    log "${YELLOW}Checking migration status...${NC}"
    
    # Get migration status using Prisma
    MIGRATION_STATUS=$(npx prisma migrate status --schema=./libs/prisma/prisma/schema.prisma 2>&1 || echo "ERROR")
    
    if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
        log "${GREEN}✅ Database schema is up to date - no migrations needed${NC}"
        return 1 # No migrations needed
    elif echo "$MIGRATION_STATUS" | grep -q "following migration.*have not yet been applied"; then
        log "${YELLOW}⚠️  Pending migrations detected${NC}"
        echo "$MIGRATION_STATUS" | grep -A 10 "following migration"
        return 0 # Migrations needed
    elif echo "$MIGRATION_STATUS" | grep -q "ERROR"; then
        # If migration status check fails, assume migrations might be needed
        log "${YELLOW}⚠️  Cannot determine migration status - will attempt migration${NC}"
        return 0 # Migrations needed (safe default)
    else
        log "${YELLOW}⚠️  Unknown migration status - will attempt migration${NC}"
        return 0 # Migrations needed (safe default)
    fi
}

# Function to run migrations
run_migrations() {
    log "${YELLOW}Running database migrations...${NC}"
    
    # Generate Prisma client first
    log "${YELLOW}Generating Prisma client...${NC}"
    npx prisma generate --schema=./libs/prisma/prisma/schema.prisma
    
    # Run migrations
    log "${YELLOW}Applying migrations...${NC}"
    npx prisma migrate deploy --schema=./libs/prisma/prisma/schema.prisma
    
    log "${GREEN}✅ Migrations completed successfully${NC}"
}

# Main execution
main() {
    log "${GREEN}🚀 Starting migration check process${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "libs/prisma/prisma/schema.prisma" ]; then
        log "${RED}❌ Prisma schema not found. Make sure you're in the project root.${NC}"
        exit 1
    fi
    
    # Check database connection
    if ! check_database_connection; then
        log "${RED}❌ Cannot connect to database${NC}"
        exit 1
    fi
    
    # Check if migrations are needed
    if check_migration_status; then
        log "${YELLOW}📦 Migrations are needed - proceeding with migration${NC}"
        
        # Run migrations
        if run_migrations; then
            log "${GREEN}✅ Migration process completed successfully${NC}"
        else
            log "${RED}❌ Migration process failed${NC}"
            exit 1
        fi
    else
        log "${GREEN}✅ No migrations needed - database is up to date${NC}"
    fi
    
    log "${GREEN}🎉 Migration check process completed${NC}"
}

# Execute main function
main "$@"