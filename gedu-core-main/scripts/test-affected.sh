#!/bin/bash

# Test Affected Projects Detection Script
# Usage: ./scripts/test-affected.sh [base-sha] [head-sha]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get parameters
BASE_SHA=${1:-"HEAD~1"}
HEAD_SHA=${2:-"HEAD"}

log_info "Testing affected project detection..."
echo

echo "=== Configuration ==="
echo "Base SHA: $BASE_SHA"
echo "Head SHA: $HEAD_SHA"
echo "Nx Version: $(npx nx --version | grep -E 'Local|Global' | head -1)"
echo

# Verify commits exist
if ! git cat-file -e "$BASE_SHA" 2>/dev/null; then
    log_error "Base SHA not found: $BASE_SHA"
    exit 1
fi

if ! git cat-file -e "$HEAD_SHA" 2>/dev/null; then
    log_error "Head SHA not found: $HEAD_SHA"
    exit 1
fi

# Show commit range
echo "=== Commit Range ==="
echo "Commits in range $BASE_SHA..$HEAD_SHA:"
git log --oneline "$BASE_SHA..$HEAD_SHA" | head -10 || echo "No commits in range"
echo

# Show changed files
echo "=== Changed Files ==="
CHANGED_FILES=$(git diff --name-only "$BASE_SHA..$HEAD_SHA" || echo "")
if [ -n "$CHANGED_FILES" ]; then
    echo "$CHANGED_FILES" | head -20
else
    echo "No files changed"
fi
echo

# Test Nx commands
echo "=== Testing Nx Commands ==="

# Test all projects
log_info "All apps in workspace:"
npx nx show projects --type app || log_error "Failed to get apps"

log_info "All libs in workspace:"
npx nx show projects --type lib || log_error "Failed to get libs"
echo

# Test affected projects
log_info "Testing affected apps:"
AFFECTED_APPS=$(npx nx show projects --affected --base=$BASE_SHA --head=$HEAD_SHA --type=app --sep=, 2>/dev/null || echo "")
if [ -n "$AFFECTED_APPS" ]; then
    log_success "Affected apps: $AFFECTED_APPS"
else
    log_warning "No affected apps found"
fi

log_info "Testing affected libs:"
AFFECTED_LIBS_RAW=$(npx nx show projects --affected --base=$BASE_SHA --head=$HEAD_SHA --type=lib --sep=, 2>/dev/null || echo "")
# Filter out the root project name
AFFECTED_LIBS=$(echo "$AFFECTED_LIBS_RAW" | sed 's/eduhub,//g' | sed 's/,eduhub//g' | sed 's/^eduhub$//g' || echo "")
if [ -n "$AFFECTED_LIBS" ]; then
    log_success "Affected libs (filtered): $AFFECTED_LIBS"
else
    log_warning "No affected libs found (after filtering)"
fi
echo "Raw libs: $AFFECTED_LIBS_RAW"
echo

# Test Prisma changes
echo "=== Testing Prisma Changes ==="
PRISMA_CHANGED=$(git diff --name-only "$BASE_SHA..$HEAD_SHA" | grep -E "(libs/prisma/prisma/schema\.prisma|libs/prisma/prisma/migrations/)" || echo "")
if [ -n "$PRISMA_CHANGED" ]; then
    log_success "Prisma changes detected:"
    echo "$PRISMA_CHANGED"
else
    log_info "No Prisma schema changes detected"
fi
echo

# Fallback detection
echo "=== Fallback Detection ==="
if [ -z "$AFFECTED_APPS" ] && [ -z "$AFFECTED_LIBS" ]; then
    log_info "Testing fallback detection..."
    
    APPS_CHANGED=$(git diff --name-only "$BASE_SHA..$HEAD_SHA" | grep "^apps/" | cut -d'/' -f2 | sort -u | tr '\n' ',' | sed 's/,$//' || echo "")
    LIBS_CHANGED=$(git diff --name-only "$BASE_SHA..$HEAD_SHA" | grep "^libs/" | cut -d'/' -f2 | sort -u | tr '\n' ',' | sed 's/,$//' || echo "")
    
    if [ -n "$APPS_CHANGED" ]; then
        log_success "Apps changed (fallback): $APPS_CHANGED"
    fi
    
    if [ -n "$LIBS_CHANGED" ]; then
        log_success "Libs changed (fallback): $LIBS_CHANGED"
        # Filter out root project from fallback as well
        LIBS_FILTERED=$(echo "$LIBS_CHANGED" | sed 's/eduhub,//g' | sed 's/,eduhub//g' | sed 's/^eduhub$//g' || echo "")
        if [ -n "$LIBS_FILTERED" ]; then
            log_success "Libs changed (filtered): $LIBS_FILTERED"
        else
            log_info "Only root project changed, no real lib changes"
        fi
    fi
    
    if [ -z "$APPS_CHANGED" ] && [ -z "$LIBS_CHANGED" ]; then
        log_info "No changes detected in apps or libs directories"
    fi
fi

# Summary
echo "=== Summary ==="
HAS_CHANGES="false"
if [ -n "$AFFECTED_APPS" ] || [ -n "$AFFECTED_LIBS" ] || [ -n "$PRISMA_CHANGED" ]; then
    HAS_CHANGES="true"
fi

echo "Has changes: $HAS_CHANGES"
echo "Needs migration: $([ -n "$PRISMA_CHANGED" ] && echo "true" || echo "false")"
echo "Final affected apps: $AFFECTED_APPS"
echo "Final affected libs: $AFFECTED_LIBS"

if [ "$HAS_CHANGES" = "true" ]; then
    log_success "Deployment would proceed"
else
    log_info "Deployment would be skipped"
fi 