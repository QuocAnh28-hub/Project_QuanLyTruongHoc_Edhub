# HAProxy and Keepalived Role

This Ansible role deploys HAProxy for Kubernetes API load balancing and Keepalived for high availability on RKE cluster master nodes.

## Overview

This role provides:
- **HAProxy**: Load balancer for Kubernetes API server (port 6443)
- **Keepalived**: High availability with virtual IP failover
- **Health checks**: Automatic failover when services are down

## Requirements

- CentOS/RHEL 8 or 9
- Ansible 2.9+
- At least 2 master nodes for high availability
- Root or sudo access

## Role Variables

### Default Variables

```yaml
# HAProxy Configuration
haproxy_config_dir: /etc/haproxy
haproxy_config_file: haproxy.cfg
haproxy_user: haproxy
haproxy_group: haproxy

# Kubernetes API Configuration
kube_api_port: 6443
kube_api_backend_name: kubernetes-api
kube_api_frontend_name: kubernetes-api-frontend

# Keepalived Configuration
keepalived_config_dir: /etc/keepalived
keepalived_config_file: keepalived.conf
keepalived_vrrp_instance: VI_1
keepalived_interface: eth0
keepalived_virtual_router_id: 51
keepalived_priority: 100
keepalived_virtual_ip: "10.47.197.30"
```

### Override Variables

You can override these in your playbook:

```yaml
# Example: Change virtual IP
keepalived_virtual_ip: "10.47.197.31"

# Example: Change network interface
keepalived_interface: "ens192"

# Example: Set different priorities for master nodes
keepalived_priority: "{{ 100 + (inventory_hostname | regex_replace('k8s_master_', '') | int) }}"
```

## Dependencies

None

## Example Playbook

```yaml
---
- name: Deploy HAProxy and Keepalived
  hosts: masters
  become: true
  gather_facts: false

  vars:
    keepalived_virtual_ip: "10.47.197.30"
    keepalived_interface: "eth0"

  roles:
    - haproxy_keepalived
```

## What This Role Does

### HAProxy Installation
- Installs HAProxy package
- Creates configuration directory
- Backs up existing configuration

### Keepalived Installation
- Installs Keepalived package
- Creates configuration directory
- Backs up existing configuration

### Configuration
- Configures HAProxy for Kubernetes API load balancing
- Configures Keepalived for high availability
- Sets up health checks and failover
- Enables and starts services

### Verification
- Checks service status
- Validates configuration
- Verifies virtual IP assignment

## Architecture

```
Client Request → Virtual IP (10.47.197.30) → HAProxy → Master Nodes
                                                      ├── Master 1 (10.47.197.32)
                                                      └── Master 2 (future)
```

## High Availability

- **Primary Node**: Highest priority (e.g., 102 for k8s_master_02)
- **Backup Node**: Lower priority (e.g., 101 for k8s_master_01)
- **Failover**: Automatic when primary node fails
- **Health Checks**: HAProxy process monitoring

## Usage After Deployment

1. **Update kubeconfig** to use the virtual IP:
   ```bash
   # Instead of individual master IPs, use:
   server: https://10.47.197.30:6443
   ```

2. **Test failover**:
   ```bash
   # Stop HAProxy on primary node
   systemctl stop haproxy
   
   # Check virtual IP moves to backup node
   ip addr show | grep 10.47.197.30
   ```

## License

MIT

## Author Information

GEDU Infrastructure Team 