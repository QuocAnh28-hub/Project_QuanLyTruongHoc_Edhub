# RKE Deploy Role

This Ansible role deploys RKE (Rancher Kubernetes Engine) on CentOS/RHEL nodes. It handles the complete setup including Docker installation, system configuration, and RKE binary installation.

## Requirements

- CentOS/RHEL 8 or 9
- Ansible 2.9+
- Root or sudo access

## Role Variables

### Default Variables

```yaml
# RKE installation settings
rke_install_dir: /opt/rke
rke_download_url: https://github.com/rancher/rke/releases/download/v1.8.4/rke_linux-amd64

# Docker configuration
docker_daemon_config:
  exec_opts: ["native.cgroupdriver=systemd"]
  log_driver: "json-file"
  log_opts:
    max_size: "100m"
  storage_driver: "overlay2"

# System configuration
sysctl_params:
  net.bridge.bridge-nf-call-iptables: 1
  net.ipv4.ip_forward: 1
  net.bridge.bridge-nf-call-ip6tables: 1

# Kernel modules to load
kernel_modules:
  - overlay
  - br_netfilter
```

### Override Variables

You can override any of these variables in your playbook or inventory:

```yaml
# Example: Use a different RKE version
rke_download_url: https://github.com/rancher/rke/releases/download/v1.8.4/rke_linux-amd64

# Example: Change installation directory
rke_install_dir: /usr/local/rke
```

## Dependencies

None

## Example Playbook

```yaml
---
- name: Deploy RKE on All Nodes
  hosts: new_nodes
  become: true
  gather_facts: false

  vars:
    ansible_python_interpreter: /usr/bin/python3
    ansible_user: ansible_user
    ansible_ssh_private_key_file: ~/.ssh/id_rsa_geduhub

  roles:
    - rke_deploy
```

## What This Role Does

### System Preparation
- Updates package cache
- Installs required packages (yum-utils, device-mapper-persistent-data, lvm2, wget, curl)
- Adds Docker repository
- Removes conflicting runc package

### Docker Installation
- Installs Docker CE, Docker CLI, and containerd
- Starts and enables Docker service
- Adds ansible_user to docker group
- Configures Docker daemon with Kubernetes-compatible settings
- Restarts Docker service

### RKE Installation
- Creates RKE installation directory
- Downloads RKE binary
- Makes binary executable and creates symlink
- Verifies RKE installation

### System Configuration
- Configures sysctl parameters for Kubernetes
- Disables swap
- Loads required kernel modules (overlay, br_netfilter)
- Makes kernel modules persistent

### Verification
- Verifies Docker is running
- Displays Docker status
- Shows RKE version

## License

MIT

## Author Information

GEDU Infrastructure Team 