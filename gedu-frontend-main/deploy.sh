#!/bin/bash

# GEdu Frontend Deployment Script
# Usage: ./deploy.sh [start|stop|restart|status|logs|update]

set -e

CONTAINER_NAME="gedu-frontend"
IMAGE_NAME="gedu-frontend:latest"
PORT="5001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

case "$1" in
    start)
        log_info "Starting $CONTAINER_NAME..."
        
        # Check if image exists
        if ! docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
            log_error "Image $IMAGE_NAME not found"
            exit 1
        fi
        
        # Check if container already exists
        if docker ps -a --format 'table {{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
            log_warning "Container $CONTAINER_NAME already exists, removing it first"
            docker rm -f $CONTAINER_NAME >/dev/null 2>&1 || true
        fi
        
        docker run -d \
            --name $CONTAINER_NAME \
            --restart unless-stopped \
            -p $PORT:80 \
            -e NODE_ENV=production \
            $IMAGE_NAME
        
        log_success "Container started successfully"
        log_info "Application available at http://localhost:$PORT"
        
        # Wait for container to be ready
        log_info "Waiting for container to be ready..."
        sleep 5
        
        # Check if container is running
        if docker ps --format 'table {{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
            log_success "Container is running"
        else
            log_error "Container failed to start"
            docker logs $CONTAINER_NAME
            exit 1
        fi
        ;;
    stop)
        log_info "Stopping $CONTAINER_NAME..."
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
        log_success "Container stopped and removed"
        ;;
    restart)
        log_info "Restarting $CONTAINER_NAME..."
        ./deploy.sh stop
        sleep 2
        ./deploy.sh start
        ;;
    status)
        log_info "Container status:"
        docker ps -a --filter name=$CONTAINER_NAME
        ;;
    logs)
        log_info "Container logs:"
        docker logs $CONTAINER_NAME
        ;;
    update)
        log_info "Updating container..."
        
        # Stop existing container
        ./deploy.sh stop
        
        # Remove old image
        log_info "Removing old image..."
        docker rmi $IMAGE_NAME || true
        
        # Check if new image file exists
        if [ ! -f "gedu-frontend.tar.gz" ]; then
            log_error "No gedu-frontend.tar.gz found in current directory"
            exit 1
        fi
        
        # Load new image
        log_info "Loading new image..."
        gunzip -c gedu-frontend.tar.gz | docker load
        
        # Verify image was loaded
        if ! docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
            log_error "Failed to load image $IMAGE_NAME"
            exit 1
        fi
        
        log_success "Image loaded successfully"
        
        # Clean up tar file
        rm -f gedu-frontend.tar.gz
        
        # Start container
        ./deploy.sh start
        ;;
    health)
        log_info "Checking container health..."
        if docker ps --format 'table {{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
            if curl -f http://localhost:$PORT/health >/dev/null 2>&1; then
                log_success "Health check passed"
            else
                log_warning "Health check failed, but container is running"
            fi
        else
            log_error "Container is not running"
            exit 1
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|update|health}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the container"
        echo "  stop    - Stop and remove the container"
        echo "  restart - Restart the container"
        echo "  status  - Show container status"
        echo "  logs    - Show container logs"
        echo "  update  - Update container with new image"
        echo "  health  - Check container health"
        exit 1
        ;;
esac 