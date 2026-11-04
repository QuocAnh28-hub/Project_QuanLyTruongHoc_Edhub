#!/bin/bash

# Helper script to analyze affected projects in the monorepo
# Usage: ./scripts/affected-projects.sh [base-commit]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default base commit
BASE_COMMIT=${1:-"origin/main"}

echo -e "${BLUE}🔍 Analyzing affected projects against: ${BASE_COMMIT}${NC}"
echo "=================================================="

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check if base commit exists
if ! git rev-parse --verify "$BASE_COMMIT" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Base commit '$BASE_COMMIT' not found${NC}"
    exit 1
fi

# Get affected projects
echo -e "${YELLOW}📱 Affected Applications:${NC}"
AFFECTED_APPS=$(pnpm nx print-affected --base="$BASE_COMMIT" --select=projects --type=app 2>/dev/null || echo "")
if [ -n "$AFFECTED_APPS" ]; then
    echo "$AFFECTED_APPS" | while read -r app; do
        [ -n "$app" ] && echo -e "  ${GREEN}✓${NC} $app"
    done
else
    echo -e "  ${YELLOW}ℹ️ No affected applications${NC}"
fi

echo ""
echo -e "${YELLOW}📚 Affected Libraries:${NC}"
AFFECTED_LIBS=$(pnpm nx print-affected --base="$BASE_COMMIT" --select=projects --type=lib 2>/dev/null || echo "")
if [ -n "$AFFECTED_LIBS" ]; then
    echo "$AFFECTED_LIBS" | while read -r lib; do
        [ -n "$lib" ] && echo -e "  ${GREEN}✓${NC} $lib"
    done
else
    echo -e "  ${YELLOW}ℹ️ No affected libraries${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Available Commands:${NC}"
echo "=================================================="

# Check if there are any affected projects
if [ -n "$AFFECTED_APPS" ] || [ -n "$AFFECTED_LIBS" ]; then
    echo -e "${GREEN}Lint affected projects:${NC}"
    echo "  pnpm nx affected:lint --base=$BASE_COMMIT"
    echo ""
    echo -e "${GREEN}Test affected projects:${NC}"
    echo "  pnpm nx affected:test --base=$BASE_COMMIT"
    echo ""
    echo -e "${GREEN}Build affected projects:${NC}"
    echo "  pnpm nx affected:build --base=$BASE_COMMIT"
    echo ""
    echo -e "${GREEN}Show dependency graph:${NC}"
    echo "  pnpm nx graph --affected --base=$BASE_COMMIT"
    echo ""
    
    # Check if database migration is needed
    if echo "$AFFECTED_LIBS" | grep -q "prisma"; then
        echo -e "${RED}⚠️  Database migration required (prisma lib affected)${NC}"
        echo -e "${GREEN}Run migration:${NC}"
        echo "  pnpm nx run prisma:prisma:generate"
        echo "  pnpm nx run prisma:prisma:migrate"
        echo ""
    fi
    
    # Show what files changed
    echo -e "${YELLOW}📝 Changed files:${NC}"
    git diff --name-only "$BASE_COMMIT"..HEAD | head -10 | while read -r file; do
        echo -e "  ${BLUE}•${NC} $file"
    done
    
    TOTAL_CHANGED=$(git diff --name-only "$BASE_COMMIT"..HEAD | wc -l)
    if [ "$TOTAL_CHANGED" -gt 10 ]; then
        echo -e "  ${YELLOW}... and $((TOTAL_CHANGED - 10)) more files${NC}"
    fi
else
    echo -e "${GREEN}✅ No affected projects found${NC}"
    echo -e "${YELLOW}ℹ️  This means your changes don't affect any buildable projects${NC}"
fi

echo ""
echo -e "${BLUE}💡 Tips:${NC}"
echo "  • Use 'pnpm nx graph' to visualize project dependencies"
echo "  • Use 'pnpm nx affected:graph --base=$BASE_COMMIT' to see affected project graph"
echo "  • Use 'git diff $BASE_COMMIT..HEAD --name-only' to see all changed files" 