#!/bin/bash
set -euo pipefail

# This script performs a comprehensive cleanup of RKE2 and related components.
# Use with EXTREME CAUTION. It will remove ALL RKE2 cluster data.

echo "Stopping and disabling RKE2 services..."
services=(rke2-server rke2-agent)
for svc in "${services[@]}"; do
    sudo systemctl stop "$svc" 2>/dev/null || true
    sudo systemctl disable "$svc" 2>/dev/null || true
done

echo "Checking for RKE2 uninstall scripts and running them if found..."
if sudo test -f /usr/local/bin/rke2-uninstall.sh; then
    echo "Running rke2-uninstall.sh..."
    sudo /usr/local/bin/rke2-uninstall.sh
else
    echo "rke2-uninstall.sh not found, proceeding with manual cleanup..."
fi

if sudo test -f /usr/local/bin/rke2-killall.sh; then
    echo "Running rke2-killall.sh..."
    sudo /usr/local/bin/rke2-killall.sh
else
    echo "rke2-killall.sh not found, proceeding with manual cleanup..."
fi

echo "Removing RKE2 and related directories/files..."
dirs=(
    /etc/rancher/rke2
    /var/lib/rancher/rke2
    /var/lib/kubelet
    /etc/cni
    /opt/cni
    /etc/systemd/system/rke2-*
    /usr/local/lib/systemd/system/rke2-*
    /usr/local/bin/rke2*
)
for dir in "${dirs[@]}"; do
    sudo rm -rf $dir
done

echo "Reloading systemd daemon and resetting failed units..."
sudo systemctl daemon-reload
sudo systemctl reset-failed

echo "Cleaning up iptables rules..."
sudo iptables -F
sudo iptables -t nat -F
sudo iptables -t mangle -F
sudo iptables -X
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT

echo "Cleanup complete. Rebooting is highly recommended for a truly fresh state."
echo "You can manually reboot with 'sudo reboot' after this script finishes."
