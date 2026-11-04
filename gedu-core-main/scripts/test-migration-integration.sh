#!/bin/bash

# Test script for integrated migration system
# This script validates that the migration integration is working correctly

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

# Function to run test
run_test() {
    local test_name="$1"
    local command="$2"
    
    log "${BLUE}🧪 Running test: $test_name${NC}"
    
    if eval "$command"; then
        log "${GREEN}✅ Test passed: $test_name${NC}"
        return 0
    else
        log "${RED}❌ Test failed: $test_name${NC}"
        return 1
    fi
}

# Test 1: Check if scripts exist and are executable
test_scripts_exist() {
    log "${YELLOW}Checking if migration scripts exist and are executable...${NC}"
    
    if [ ! -f "docker-entrypoint.sh" ]; then
        log "${RED}docker-entrypoint.sh not found${NC}"
        return 1
    fi
    
    if [ ! -x "docker-entrypoint.sh" ]; then
        log "${RED}docker-entrypoint.sh is not executable${NC}"
        return 1
    fi
    
    if [ ! -f "scripts/check-migrations.sh" ]; then
        log "${RED}check-migrations.sh not found${NC}"
        return 1
    fi
    
    if [ ! -x "scripts/check-migrations.sh" ]; then
        log "${RED}check-migrations.sh is not executable${NC}"
        return 1
    fi
    
    log "${GREEN}All migration scripts exist and are executable${NC}"
    return 0
}

# Test 2: Check if Dockerfiles contain migration integration
test_dockerfile_integration() {
    log "${YELLOW}Checking Dockerfile integration...${NC}"
    
    local dockerfiles=(
        "apps/core/Dockerfile"
        "apps/core/Dockerfile.dev"
        "apps/import/Dockerfile"
        "apps/import/Dockerfile.dev"
    )
    
    for dockerfile in "${dockerfiles[@]}"; do
        if [ ! -f "$dockerfile" ]; then
            log "${RED}$dockerfile not found${NC}"
            return 1
        fi
        
        # Check for Prisma CLI installation
        if ! grep -q "npm install -g prisma" "$dockerfile"; then
            log "${RED}$dockerfile missing Prisma CLI installation${NC}"
            return 1
        fi
        
        # Check for entrypoint script copy
        if ! grep -q "docker-entrypoint.sh" "$dockerfile"; then
            log "${RED}$dockerfile missing entrypoint script${NC}"
            return 1
        fi
        
        # Check for ENTRYPOINT directive
        if ! grep -q "ENTRYPOINT.*docker-entrypoint.sh" "$dockerfile"; then
            log "${RED}$dockerfile missing ENTRYPOINT directive${NC}"
            return 1
        fi
        
        log "${GREEN}✅ $dockerfile contains migration integration${NC}"
    done
    
    return 0
}

# Test 3: Check docker-compose.yml updates
test_docker_compose() {
    log "${YELLOW}Checking docker-compose.yml updates...${NC}"
    
    if [ ! -f "docker-compose.yml" ]; then
        log "${RED}docker-compose.yml not found${NC}"
        return 1
    fi
    
    # Check that migrate service is removed
    if grep -q "migrate:" "docker-compose.yml"; then
        log "${RED}docker-compose.yml still contains migrate service${NC}"
        return 1
    fi
    
    # Check that depends_on migrate is removed
    if grep -q "depends_on:" "docker-compose.yml"; then
        if grep -A 3 "depends_on:" "docker-compose.yml" | grep -q "migrate:"; then
            log "${RED}docker-compose.yml still has migrate dependency${NC}"
            return 1
        fi
    fi
    
    # Check for SKIP_MIGRATIONS environment variable
    if ! grep -q "SKIP_MIGRATIONS" "docker-compose.yml"; then
        log "${RED}docker-compose.yml missing SKIP_MIGRATIONS environment variable${NC}"
        return 1
    fi
    
    log "${GREEN}✅ docker-compose.yml properly updated${NC}"
    return 0
}

# Test 4: Validate entrypoint script syntax
test_entrypoint_syntax() {
    log "${YELLOW}Validating entrypoint script syntax...${NC}"
    
    # Check bash syntax
    if ! bash -n "docker-entrypoint.sh"; then
        log "${RED}docker-entrypoint.sh has syntax errors${NC}"
        return 1
    fi
    
    if ! bash -n "scripts/check-migrations.sh"; then
        log "${RED}check-migrations.sh has syntax errors${NC}"
        return 1
    fi
    
    log "${GREEN}✅ All scripts have valid syntax${NC}"
    return 0
}

# Test 5: Check if Prisma schema and migrations exist
test_prisma_files() {
    log "${YELLOW}Checking Prisma files...${NC}"
    
    if [ ! -f "libs/prisma/prisma/schema.prisma" ]; then
        log "${RED}Prisma schema not found${NC}"
        return 1
    fi
    
    if [ ! -d "libs/prisma/prisma/migrations" ]; then
        log "${RED}Prisma migrations directory not found${NC}"
        return 1
    fi
    
    # Check if there are any migration files
    if [ -z "$(ls -A libs/prisma/prisma/migrations/)" ]; then
        log "${YELLOW}⚠️  No migration files found (this might be expected for new projects)${NC}"
    else
        log "${GREEN}✅ Migration files found${NC}"
    fi
    
    return 0
}

# Main test execution
main() {
    log "${BLUE}🚀 Starting migration integration tests${NC}"
    
    local tests_passed=0
    local tests_failed=0
    
    # Run all tests
    if run_test "Scripts exist and are executable" "test_scripts_exist"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    if run_test "Dockerfile integration" "test_dockerfile_integration"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    if run_test "Docker Compose updates" "test_docker_compose"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    if run_test "Script syntax validation" "test_entrypoint_syntax"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    if run_test "Prisma files exist" "test_prisma_files"; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi
    
    # Summary
    log "${BLUE}📊 Test Results Summary${NC}"
    log "${GREEN}✅ Tests passed: $tests_passed${NC}"
    log "${RED}❌ Tests failed: $tests_failed${NC}"
    
    if [ $tests_failed -eq 0 ]; then
        log "${GREEN}🎉 All tests passed! Migration integration is ready.${NC}"
        
        log "${BLUE}📝 Next steps:${NC}"
        log "  1. Build your Docker images with: docker build -t gedu/core:dev -f apps/core/Dockerfile.dev ."
        log "  2. Test with: docker-compose up"
        log "  3. Check logs for migration execution"
        log "  4. Optionally test with SKIP_MIGRATIONS=true"
        
        return 0
    else
        log "${RED}❌ Some tests failed. Please fix the issues before proceeding.${NC}"
        return 1
    fi
}

# Execute main function
main "$@"