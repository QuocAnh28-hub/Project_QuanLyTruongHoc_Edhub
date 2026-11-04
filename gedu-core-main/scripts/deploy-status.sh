#!/bin/bash

# Deployment Status and Troubleshooting Script
# Usage: ./scripts/deploy-status.sh [action]
# Actions: status, logs, restart, rollback

set -e

# Configuration
COMPOSE_FILE="docker-compose.dev.yml"
SERVICES=("core" "import" "migrate")

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

# Check if docker-compose file exists
check_compose_file() {
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker compose file not found: $COMPOSE_FILE"
        exit 1
    fi
}

# Show service status
show_status() {
    log_info "Checking service status..."
    echo
    
    # Overall status
    echo "=== Service Status ==="
    docker compose -f "$COMPOSE_FILE" ps --format table
    echo
    
    # Detailed status for each service
    for service in "${SERVICES[@]}"; do
        echo "=== $service Service Details ==="
        
        # Check if service is running
        if docker compose -f "$COMPOSE_FILE" ps "$service" --format json | grep -q "running"; then
            log_success "$service is running"
        else
            log_warning "$service is not running"
        fi
        
        # Show resource usage
        container_id=$(docker compose -f "$COMPOSE_FILE" ps -q "$service" 2>/dev/null || echo "")
        if [ -n "$container_id" ]; then
            echo "Resource usage:"
            docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" "$container_id"
        fi
        
        echo
    done
    
    # Show recent events
    echo "=== Recent Docker Events ==="
    docker events --since 10m --until now --format "{{.Time}} {{.Action}} {{.Actor.Attributes.name}}" | grep -E "(core|import|migrate)" | tail -10 || echo "No recent events"
    echo
}

# Show logs for services
show_logs() {
    local service=${1:-""}
    local lines=${2:-50}
    
    if [ -n "$service" ]; then
        log_info "Showing logs for $service (last $lines lines)..."
        docker compose -f "$COMPOSE_FILE" logs --tail="$lines" "$service"
    else
        log_info "Showing logs for all services (last $lines lines)..."
        docker compose -f "$COMPOSE_FILE" logs --tail="$lines"
    fi
}

# Restart services
restart_services() {
    local service=${1:-""}
    
    if [ -n "$service" ]; then
        log_info "Restarting $service service..."
        docker compose -f "$COMPOSE_FILE" restart "$service"
        log_success "$service restarted"
    else
        log_info "Restarting all services..."
        docker compose -f "$COMPOSE_FILE" restart
        log_success "All services restarted"
    fi
}

# Health check
health_check() {
    log_info "Running health checks..."
    echo
    
    # Check database connectivity
    echo "=== Database Health ==="
    if docker compose -f "$COMPOSE_FILE" exec core npx prisma db ping 2>/dev/null; then
        log_success "Database connection: OK"
    else
        log_error "Database connection: FAILED"
    fi
    
    # Check service endpoints
    echo
    echo "=== Service Endpoints ==="
    
    # Check core service
    if curl -s -f http://localhost:3000/health >/dev/null 2>&1; then
        log_success "Core service endpoint: OK"
    else
        log_warning "Core service endpoint: Not responding"
    fi
    
    # Check import service (if it has a health endpoint)
    # Add your import service health check here
    
    echo
}

# Show deployment history
show_history() {
    log_info "Showing deployment history..."
    echo
    
    # Show running container creation times
    echo "=== Container Creation Times ==="
    for service in "${SERVICES[@]}"; do
        container_id=$(docker compose -f "$COMPOSE_FILE" ps -q "$service" 2>/dev/null || echo "")
        if [ -n "$container_id" ]; then
            created=$(docker inspect --format='{{.Created}}' "$container_id")
            echo "$service: $created"
        fi
    done
    echo
    
    # Show image tags
    echo "=== Current Image Tags ==="
    docker compose -f "$COMPOSE_FILE" images
    echo
}

# Rollback to previous version
rollback() {
    log_warning "Rollback functionality requires implementation based on your deployment strategy"
    log_info "Manual rollback steps:"
    echo "1. Stop current services: docker compose -f $COMPOSE_FILE down"
    echo "2. Pull previous image tags"
    echo "3. Start services with previous images"
    echo "4. Run any necessary database rollbacks"
}

# Show help
show_help() {
    echo "Deployment Status and Troubleshooting Script"
    echo
    echo "Usage: $0 [action] [options]"
    echo
    echo "Actions:"
    echo "  status                 Show service status (default)"
    echo "  logs [service] [lines] Show logs for service (default: all services, 50 lines)"
    echo "  restart [service]      Restart service (default: all services)"
    echo "  health                 Run health checks"
    echo "  history                Show deployment history"
    echo "  rollback               Show rollback instructions"
    echo "  help                   Show this help message"
    echo
    echo "Examples:"
    echo "  $0                     # Show status"
    echo "  $0 logs core 100       # Show last 100 lines of core service logs"
    echo "  $0 restart import      # Restart import service"
    echo "  $0 health              # Run health checks"
}

# Main execution
main() {
    local action=${1:-"status"}
    
    # Check requirements
    check_compose_file
    
    case "$action" in
        "status")
            show_status
            ;;
        "logs")
            show_logs "$2" "$3"
            ;;
        "restart")
            restart_services "$2"
            ;;
        "health")
            health_check
            ;;
        "history")
            show_history
            ;;
        "rollback")
            rollback
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Unknown action: $action"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 