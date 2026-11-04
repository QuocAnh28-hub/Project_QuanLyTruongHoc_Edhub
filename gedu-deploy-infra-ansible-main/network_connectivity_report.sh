#!/bin/bash

# Network Connectivity Test Script for RKE Cluster
# Run this script to document network connectivity issues

echo "=== RKE Cluster Network Connectivity Test Report ==="
echo "Date: $(date)"
echo ""

# Test nodes
NODES=("10.47.197.31" "10.47.197.32" "10.47.197.33" "10.47.197.34" "10.47.197.35" "10.47.197.36")
ETCD_NODES=("10.47.197.31" "10.47.197.32" "10.47.197.33")

echo "=== Node Information ==="
for node in "${NODES[@]}"; do
    echo "Testing node: $node"
    ssh -i ~/.ssh/id_rsa -l ansible_user "$node" "hostname -I | head -1" 2>/dev/null || echo "Cannot connect to $node"
    echo ""
done

echo "=== Ping Connectivity Matrix ==="
echo "From\To:"
printf "%12s" ""
for target in "${NODES[@]}"; do
    printf "%12s" "$target"
done
echo ""

for source in "${NODES[@]}"; do
    printf "%12s" "$source"
    for target in "${NODES[@]}"; do
        if ssh -i ~/.ssh/id_rsa -l ansible_user "$source" "ping -c 1 -W 3 $target >/dev/null 2>&1" 2>/dev/null; then
            printf "%12s" "✓"
        else
            printf "%12s" "✗"
        fi
    done
    echo ""
done

echo ""
echo "=== Etcd Port Connectivity Test ==="
for source in "${ETCD_NODES[@]}"; do
    echo "From $source to etcd ports:"
    for target in "${ETCD_NODES[@]}"; do
        echo "  Testing $target:2379"
        if ssh -i ~/.ssh/id_rsa -l ansible_user "$source" "timeout 5 bash -c '</dev/tcp/$target/2379' 2>/dev/null"; then
            echo "    ✓ Port 2379 open"
        else
            echo "    ✗ Port 2379 closed"
        fi
        
        echo "  Testing $target:2380"
        if ssh -i ~/.ssh/id_rsa -l ansible_user "$source" "timeout 5 bash -c '</dev/tcp/$target/2380' 2>/dev/null"; then
            echo "    ✓ Port 2380 open"
        else
            echo "    ✗ Port 2380 closed"
        fi
    done
    echo ""
done

echo "=== Network Configuration ==="
for node in "${NODES[@]}"; do
    echo "Node: $node"
    ssh -i ~/.ssh/id_rsa -l ansible_user "$node" "ip route show | head -5" 2>/dev/null || echo "Cannot get routing info"
    echo ""
done

echo "=== Summary ==="
echo "ISSUE IDENTIFIED:"
echo "- Node 10.47.197.31 cannot reach other nodes (one-way connectivity issue)"
echo "- All other nodes can reach node 10.47.197.31"
echo "- This prevents etcd cluster formation in RKE"
echo ""
echo "RECOMMENDED ACTIONS:"
echo "1. Check network policies/security groups for node 10.47.197.31"
echo "2. Verify outbound traffic rules for the 10.47.197.0/24 subnet"
echo "3. Check if there are any VLAN or network segmentation issues"
echo "4. Ensure all nodes can communicate bidirectionally on ports 2379, 2380, 6443, 10250"
echo ""
echo "=== End Report ===" 