#!/bin/bash

# Script to update HAProxy configuration with correct NodePort
# This script updates the HAProxy configuration on the master nodes

set -e

MASTER_NODES=("10.47.197.32" "10.47.197.33")
CORRECT_NODEPORT="32001"
SSH_KEY="~/.ssh/id_rsa"

echo "Updating HAProxy configuration with correct NodePort: $CORRECT_NODEPORT"

for node in "${MASTER_NODES[@]}"; do
    echo "Updating HAProxy on $node..."
    
    # Create the new HAProxy configuration
    ssh -i $SSH_KEY ansible_user@$node "sudo tee /etc/haproxy/haproxy.cfg > /dev/null" << 'EOF'
global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

# Kubernetes API Load Balancing
frontend kubernetes-api-frontend
    bind *:8443
    mode tcp
    option tcplog
    default_backend kubernetes-api

backend kubernetes-api
    mode tcp
    option tcp-check
    balance roundrobin
    option httpchk GET /healthz
    http-check expect status 200
    server k8s_master_02 10.47.197.32:8443 check
    server k8s_master_03 10.47.197.33:8443 check

# Istio Ingress Gateway Load Balancing (HTTP)
frontend istio-ingress-frontend
    bind *:80
    mode http
    option httplog
    option forwardfor
    option http-server-close
    default_backend istio-ingressgateway

backend istio-ingressgateway
    mode http
    balance roundrobin
    option forwardfor
    option http-server-close
    server k8s_worker_01 10.47.197.33:32001 check
    server k8s_worker_02 10.47.197.34:32001 check
    server k8s_worker_03 10.47.197.35:32001 check
    server k8s_worker_04 10.47.197.36:32001 check
EOF

    # Validate the configuration
    ssh -i $SSH_KEY ansible_user@$node "sudo haproxy -c -f /etc/haproxy/haproxy.cfg"
    
    # Restart HAProxy
    echo "Restarting HAProxy on $node..."
    ssh -i $SSH_KEY ansible_user@$node "sudo systemctl restart haproxy"
    
    echo "✅ HAProxy updated on $node"
done

echo "🎉 HAProxy configuration updated on all master nodes!"
echo ""
echo "Testing connectivity..."
echo "Try: curl http://10.47.197.30/healthz/ready"