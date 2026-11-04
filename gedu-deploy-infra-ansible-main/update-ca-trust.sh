#!/bin/bash
set -e

# Configuration
CERT_SOURCE="../20250718_star_geduhub_vn/star_geduhub_fullchain.pem"
CERT_NAME="geduhub-vn-ca.crt"
SSH_KEY="~/.ssh/id_rsa"

# Get all Kubernetes nodes from hosts.ini
MASTER_NODES=("10.47.197.29" "10.47.197.32" "10.47.197.33")
WORKER_NODES=("10.47.197.33" "10.47.197.34" "10.47.197.35" "10.47.197.36")

# Combine all nodes (remove duplicates)
ALL_NODES=("${MASTER_NODES[@]}" "${WORKER_NODES[@]}")
UNIQUE_NODES=($(printf "%s\n" "${ALL_NODES[@]}" | sort -u))

echo "🔐 Updating CA trust store with geduhub.vn certificate chain..."
echo "📋 Nodes to update: ${UNIQUE_NODES[*]}"
echo "📄 Certificate source: $CERT_SOURCE"
echo ""

# Check if certificate file exists
if [ ! -f "$CERT_SOURCE" ]; then
    echo "❌ Error: Certificate file $CERT_SOURCE not found!"
    exit 1
fi

# Function to update CA trust on a node
update_ca_trust_on_node() {
    local node=$1
    echo "🔄 Updating CA trust on $node..."
    
    # Copy certificate to the node
    scp -i "$SSH_KEY" "$CERT_SOURCE" "ansible_user@$node:/tmp/$CERT_NAME"
    
    # Execute commands on the node
    ssh -i "$SSH_KEY" "ansible_user@$node" << EOF
        set -e
        
        # Copy certificate to CA trust directory
        sudo cp /tmp/$CERT_NAME /usr/local/share/ca-certificates/
        
        # Update CA trust store
        sudo update-ca-certificates
        
        # Verify the certificate was added
        if [ -f "/usr/local/share/ca-certificates/$CERT_NAME" ]; then
            echo "✅ Certificate copied to CA trust store on $node"
        else
            echo "❌ Failed to copy certificate on $node"
            exit 1
        fi
        
        # Clean up temporary file
        rm -f /tmp/$CERT_NAME
        
        # Test certificate validation (optional)
        echo "🔍 Testing certificate validation..."
        if command -v openssl >/dev/null 2>&1; then
            openssl verify /usr/local/share/ca-certificates/$CERT_NAME || echo "⚠️  Certificate validation warning (this may be normal for intermediate certificates)"
        fi
EOF
    
    echo "✅ CA trust updated on $node"
}

# Update CA trust on all nodes
for node in "${UNIQUE_NODES[@]}"; do
    if update_ca_trust_on_node "$node"; then
        echo "✅ Successfully updated $node"
    else
        echo "❌ Failed to update $node"
        exit 1
    fi
    echo ""
done

echo "🎉 CA trust update completed on all nodes!"
echo ""
echo "📝 Next steps:"
echo "1. Test HTTPS connection: curl -H 'Host: hello.geduhub.vn' https://10.47.197.30/hello"
echo "2. If still getting certificate errors, you may need to restart services or clear browser cache"
echo "3. For HAProxy nodes, you may need to restart HAProxy: sudo systemctl restart haproxy" 