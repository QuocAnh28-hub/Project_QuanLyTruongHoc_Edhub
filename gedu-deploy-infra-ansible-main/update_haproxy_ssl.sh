#!/bin/bash

# Script to update HAProxy configuration with SSL termination
# This script updates the HAProxy configuration on the master nodes

set -e

MASTER_NODES=("10.47.197.32" "10.47.197.33")
SSH_KEY="~/.ssh/id_rsa"

echo "Updating HAProxy configuration with SSL termination..."

for node in "${MASTER_NODES[@]}"; do
    echo "Updating HAProxy on $node..."
    
    # Create certificates directory
    ssh -i $SSH_KEY ansible_user@$node "sudo mkdir -p /etc/haproxy/certs"
    
    # Copy certificate files to proper location
    ssh -i $SSH_KEY ansible_user@$node "sudo cp /tmp/geduhub.vn.crt /etc/haproxy/certs/"
    ssh -i $SSH_KEY ansible_user@$node "sudo cp /tmp/geduhub.vn.key /etc/haproxy/certs/"
    
    # Create combined certificate file (cert + key) for HAProxy
    ssh -i $SSH_KEY ansible_user@$node "sudo cat /etc/haproxy/certs/geduhub.vn.crt /etc/haproxy/certs/geduhub.vn.key > /tmp/geduhub.vn.pem"
    ssh -i $SSH_KEY ansible_user@$node "sudo mv /tmp/geduhub.vn.pem /etc/haproxy/certs/"
    
    # Set proper permissions
    ssh -i $SSH_KEY ansible_user@$node "sudo chown haproxy:haproxy /etc/haproxy/certs/*"
    ssh -i $SSH_KEY ansible_user@$node "sudo chmod 600 /etc/haproxy/certs/*"
    
    # Create the new HAProxy configuration
    ssh -i $SSH_KEY ansible_user@$node "sudo tee /etc/haproxy/haproxy.cfg > /dev/null" << 'INNER_EOF'
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
    server k8s_master_01 10.47.197.29:8443 check
    server k8s_master_02 10.47.197.32:8443 check
    server k8s_master_03 10.47.197.33:8443 check

# Istio Ingress Gateway Load Balancing (HTTPS - SSL termination at HAProxy)
frontend istio-ingress-https-frontend
    bind *:443 ssl crt /etc/haproxy/certs/geduhub.vn.pem
    mode http
    option httplog
    option forwardfor
    option http-server-close
    default_backend istio-ingressgateway-https

backend istio-ingressgateway-https
    mode http
    balance roundrobin
    option forwardfor
    option http-server-close
    server k8s_worker_02 10.47.197.33:32001 check
    server k8s_worker_03 10.47.197.34:32001 check
    server k8s_worker_04 10.47.197.35:32001 check
    server k8s_worker_05 10.47.197.36:32001 check

# Istio Ingress Gateway Load Balancing (HTTP - for internal traffic)
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
    option httpchk GET /healthz/ready
    http-check expect status 200
    option forwardfor
    option http-server-close
    server k8s_worker_02 10.47.197.33:30105 check
    server k8s_worker_03 10.47.197.34:30105 check
    server k8s_worker_04 10.47.197.35:30105 check
    server k8s_worker_05 10.47.197.36:30105 check
INNER_EOF

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
echo "Try: curl -k https://10.47.197.30/hello"
