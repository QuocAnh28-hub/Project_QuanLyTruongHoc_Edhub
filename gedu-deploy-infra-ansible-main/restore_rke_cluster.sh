#!/bin/bash

# RKE Cluster Restore Script
# This script restores your RKE cluster from a backup

set -e

# Configuration
CLUSTER_CONFIG="cluster.yml"
BACKUP_DIR="rke-backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

# Check if RKE is available
check_rke() {
    if ! command -v rke &> /dev/null; then
        log_error "RKE command not found. Please install RKE first."
        exit 1
    fi
}

# List available backups
list_backups() {
    log_info "Available backups:"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        log_error "Backup directory '$BACKUP_DIR' not found."
        exit 1
    fi
    
    local backups=()
    for backup in "$BACKUP_DIR"/backup-*; do
        if [ -d "$backup" ]; then
            backups+=("$(basename "$backup")")
        fi
    done
    
    if [ ${#backups[@]} -eq 0 ]; then
        log_error "No backups found in '$BACKUP_DIR'"
        exit 1
    fi
    
    for i in "${!backups[@]}"; do
        echo "  $((i+1)). ${backups[$i]}"
    done
    
    echo "${backups[@]}"
}

# Validate backup
validate_backup() {
    local backup_name="$1"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    if [ ! -d "$backup_path" ]; then
        log_error "Backup directory '$backup_path' not found."
        exit 1
    fi
    
    # Check for required files
    local required_files=("cluster.yml" "backup-manifest.txt")
    for file in "${required_files[@]}"; do
        if [ ! -f "$backup_path/$file" ]; then
            log_warning "Required file '$file' not found in backup"
        fi
    done
    
    log_success "Backup validation completed"
}

# Show backup details
show_backup_details() {
    local backup_name="$1"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log_info "Backup details for: $backup_name"
    echo "================================"
    
    if [ -f "$backup_path/backup-manifest.txt" ]; then
        cat "$backup_path/backup-manifest.txt"
    else
        log_warning "Backup manifest not found"
    fi
    
    echo ""
    log_info "Backup contents:"
    ls -la "$backup_path"
}

# Confirm restore
confirm_restore() {
    local backup_name="$1"
    
    echo ""
    log_warning "WARNING: This will completely restore your cluster from backup: $backup_name"
    log_warning "This operation will:"
    log_warning "  1. Stop the current cluster"
    log_warning "  2. Remove all current data"
    log_warning "  3. Restore from the backup"
    log_warning "  4. Restart the cluster"
    echo ""
    
    read -p "Are you sure you want to proceed? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_info "Restore cancelled by user"
        exit 0
    fi
    
    log_info "Proceeding with restore..."
}

# Stop cluster
stop_cluster() {
    log_info "Stopping RKE cluster..."
    
    if rke remove --config "$CLUSTER_CONFIG"; then
        log_success "Cluster stopped successfully"
    else
        log_warning "Cluster stop command completed (this is normal if cluster was already stopped)"
    fi
}

# Restore configuration files
restore_config_files() {
    local backup_name="$1"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log_info "Restoring configuration files..."
    
    # Restore cluster.yml
    if [ -f "$backup_path/cluster.yml" ]; then
        cp "$backup_path/cluster.yml" .
        log_success "Restored cluster.yml"
    else
        log_error "cluster.yml not found in backup"
        exit 1
    fi
    
    # Restore cluster.rkestate if exists
    if [ -f "$backup_path/cluster.rkestate" ]; then
        cp "$backup_path/cluster.rkestate" .
        log_success "Restored cluster.rkestate"
    else
        log_warning "cluster.rkestate not found in backup"
    fi
    
    # Restore kubeconfig if exists
    if [ -f "$backup_path/kube_config_cluster.yml" ]; then
        cp "$backup_path/kube_config_cluster.yml" .
        log_success "Restored kube_config_cluster.yml"
    else
        log_warning "kube_config_cluster.yml not found in backup"
    fi
}

# Restore etcd snapshot
restore_etcd() {
    local backup_name="$1"
    
    log_info "Restoring etcd snapshot: $backup_name"
    
    if rke etcd snapshot-restore --config "$CLUSTER_CONFIG" --name "$backup_name"; then
        log_success "ETCD snapshot restored successfully"
    else
        log_error "Failed to restore etcd snapshot"
        exit 1
    fi
}

# Start cluster
start_cluster() {
    log_info "Starting RKE cluster..."
    
    if rke up --config "$CLUSTER_CONFIG"; then
        log_success "Cluster started successfully"
    else
        log_error "Failed to start cluster"
        exit 1
    fi
}

# Verify restore
verify_restore() {
    log_info "Verifying cluster restore..."
    
    # Wait a moment for cluster to stabilize
    sleep 10
    
    # Export kubeconfig
    export KUBECONFIG="kube_config_cluster.yml"
    
    # Check nodes
    if kubectl get nodes; then
        log_success "Cluster nodes are accessible"
    else
        log_warning "Could not verify cluster nodes"
    fi
    
    # Check pods
    if kubectl get pods --all-namespaces; then
        log_success "Cluster pods are running"
    else
        log_warning "Could not verify cluster pods"
    fi
}

# Main restore function
perform_restore() {
    local backup_name="$1"
    
    log_info "Starting RKE cluster restore from: $backup_name"
    
    # Pre-flight checks
    check_rke
    validate_backup "$backup_name"
    show_backup_details "$backup_name"
    confirm_restore "$backup_name"
    
    # Perform restore
    stop_cluster
    restore_config_files "$backup_name"
    restore_etcd "$backup_name"
    start_cluster
    verify_restore
    
    log_success "Restore completed successfully!"
    log_info "Your cluster has been restored from backup: $backup_name"
}

# Show usage
show_usage() {
    cat << EOF
RKE Cluster Restore Script

Usage: $0 [OPTIONS]

Options:
    [backup_name]        Restore from specified backup name
    list                 List available backups
    help                 Show this help message

Examples:
    $0 backup-20241220-143022    # Restore from specific backup
    $0 list                      # List available backups

Note: If no backup name is provided, you will be prompted to select one.

EOF
}

# Interactive backup selection
select_backup() {
    local backups=($(list_backups))
    
    echo ""
    read -p "Enter the number of the backup to restore (or 'q' to quit): " selection
    
    if [ "$selection" = "q" ]; then
        log_info "Restore cancelled by user"
        exit 0
    fi
    
    if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le ${#backups[@]} ]; then
        local selected_backup="${backups[$((selection-1))]}"
        perform_restore "$selected_backup"
    else
        log_error "Invalid selection"
        exit 1
    fi
}

# Main script logic
case "${1:-}" in
    "list")
        list_backups
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    "")
        select_backup
        ;;
    *)
        perform_restore "$1"
        ;;
esac 