#!/bin/bash
set -e

# Configuration
SSH_KEY=~/.ssh/id_rsa
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ Error: SSH key file $SSH_KEY not found!"
    exit 1
fi

MASTER_NODES=("10.47.197.32" "10.47.197.33")
CERT_SOURCE="../20250718_star_geduhub_vn/star_geduhub_fullchain.pem"
KEY_SOURCE="../20250718_star_geduhub_vn/star_geduhub_vn.key"

# Function to show usage
show_usage() {
    echo "Usage: $0 [tcp|http]"
    echo ""
    echo "SSL Modes:"
    echo "  tcp   - SSL Passthrough (current setup, SSL termination at Istio)"
    echo "  http  - SSL Termination at HAProxy (requires certificates)"
    echo ""
    echo "Examples:"
    echo "  $0 tcp   # Deploy with SSL passthrough (default)"
    echo "  $0 http  # Deploy with SSL termination at HAProxy"
    echo ""
}

# Check arguments
if [ $# -eq 0 ]; then
    SSL_MODE="tcp"
    echo "🔧 No SSL mode specified, using default: SSL Passthrough (tcp)"
elif [ "$1" = "tcp" ]; then
    SSL_MODE="tcp"
    echo "🔧 Deploying with SSL Passthrough mode"
elif [ "$1" = "http" ]; then
    SSL_MODE="http"
    echo "🔧 Deploying with SSL Termination mode"
    
    # Check if certificate files exist
    if [ ! -f "$CERT_SOURCE" ]; then
        echo "❌ Error: Certificate file $CERT_SOURCE not found!"
        echo "Please ensure the certificate files are available before deploying SSL termination mode."
        exit 1
    fi
    
    if [ ! -f "$KEY_SOURCE" ]; then
        echo "❌ Error: Private key file $KEY_SOURCE not found!"
        echo "Please ensure the private key file is available before deploying SSL termination mode."
        exit 1
    fi
else
    echo "❌ Error: Invalid SSL mode '$1'"
    show_usage
    exit 1
fi

echo ""
echo "🚀 Starting HAProxy deployment with SSL mode: $SSL_MODE"
echo "📋 Master nodes: ${MASTER_NODES[*]}"
echo ""

# Create temporary playbook with SSL mode
TEMP_PLAYBOOK="/tmp/deploy_haproxy_ssl.yml"

cat > "$TEMP_PLAYBOOK" << EOF
---
- name: Deploy HAProxy and Keepalived with SSL Mode
  hosts: k8s_master_02,k8s_master_03
  become: true
  gather_facts: false

  vars:
    ansible_python_interpreter: /usr/bin/python3
    ansible_user: ansible_user
    ansible_ssh_private_key_file: ~/.ssh/id_rsa
    ansible_connection: ssh
    
    # HAProxy and Keepalived configuration
    keepalived_virtual_ip: "10.47.197.30"
    keepalived_interface: "ens33"
    keepalived_priority: "255"
    
    # Kubernetes API configuration
    kube_api_port: 8443
    kube_api_backend_name: kubernetes-api
    kube_api_frontend_name: kubernetes-api-frontend
    
    # Istio Ingress Gateway configuration
    istio_ingress_port: 80
    istio_ingress_nodeport: 32001
    istio_ingress_backend_name: istio-ingressgateway
    istio_ingress_frontend_name: istio-ingress-frontend
    istio_ingress_healthcheck_nodeport: 30105
    
    # Istio Ingress Gateway HTTPS configuration
    istio_ingress_https_port: 443
    istio_ingress_https_backend_name: istio-ingressgateway-https
    istio_ingress_https_frontend_name: istio-ingress-https-frontend
    istio_ingress_https_nodeport: 32002
    
    # SSL Configuration
    haproxy_ssl_mode: "$SSL_MODE"
    ssl_cert_path: "/etc/haproxy/certs/geduhub.vn.pem"
    ssl_cert_source: "$CERT_SOURCE"
    ssl_key_source: "$KEY_SOURCE"
    
    # HAProxy service configuration
    haproxy_user: haproxy
    haproxy_group: haproxy
    haproxy_config_dir: /etc/haproxy
    haproxy_config_file: haproxy.cfg
    
    # Keepalived configuration
    keepalived_config_dir: /etc/keepalived
    keepalived_config_file: keepalived.conf
    keepalived_vrrp_instance: VI_1
    keepalived_virtual_router_id: 51

  roles:
    - haproxy_keepalived
EOF

echo "📄 Created temporary playbook: $TEMP_PLAYBOOK"
echo ""

# Run the playbook
echo "🔧 Running Ansible playbook..."
ansible-playbook -i inventories/production/hosts.ini "$TEMP_PLAYBOOK"

# Clean up
rm -f "$TEMP_PLAYBOOK"

echo ""
echo "✅ HAProxy deployment completed!"
echo ""
echo "📝 SSL Mode: $SSL_MODE"
if [ "$SSL_MODE" = "tcp" ]; then
    echo "🔗 Traffic Flow: Public → HAProxy VIP:443 (TCP) → Istio Gateway:32002 → SSL Termination at Istio"
    echo "🧪 Test Command: curl -k -H 'Host: hello.geduhub.vn' https://10.47.197.30/hello"
else
    echo "🔗 Traffic Flow: Public → HAProxy VIP:443 (SSL Termination) → Istio Gateway:32001 (HTTP)"
    echo "🧪 Test Command: curl -H 'Host: hello.geduhub.vn' https://10.47.197.30/hello"
fi
echo ""
echo "📊 Check HAProxy status:"
echo "   ssh -i $SSH_KEY ansible_user@10.47.197.32 'systemctl status haproxy'"
echo "   ssh -i $SSH_KEY ansible_user@10.47.197.33 'systemctl status haproxy'" 