# Docker Harbor Role

This Ansible role installs Docker and configures it to trust the Harbor registry certificates.

## Purpose

- Install Docker CE, Docker CLI, and containerd
- Configure Docker to trust Harbor registry certificates
- Set up Docker daemon with proper configuration for Kubernetes
- Enable secure communication with private Harbor registry

## Requirements

- CentOS/RHEL 8 or 9
- Ansible 2.9+
- Root or sudo access
- Harbor CA certificate (`files/ca.crt`)

## Role Variables

### Default Variables

```yaml
# Harbor configuration
harbor_hostname: "registry.eduhub.com"
harbor_ip: "10.47.198.51"
harbor_enable_cert: true

# Docker configuration
docker_daemon_config:
  exec_opts: ["native.cgroupdriver=systemd"]
  log_driver: "json-file"
  log_opts:
    max_size: "100m"
  storage_driver: "overlay2"
```

### Override Variables

You can override these variables in your playbook or inventory:

```yaml
# Example: Use a different Harbor hostname
harbor_hostname: "my-registry.company.com"

# Example: Disable certificate configuration
harbor_enable_cert: false
```

## Dependencies

None

## Example Usage

### Basic Usage

```yaml
---
- name: Deploy Docker with Harbor Trust
  hosts: k8s_cluster
  become: true
  roles:
    - docker
```

### With Custom Variables

```yaml
---
- name: Deploy Docker with Custom Harbor
  hosts: all
  become: true
  vars:
    harbor_hostname: "registry.mycompany.com"
    harbor_ip: "192.168.1.100"
  roles:
    - docker
```

### Using the Dedicated Playbook

```bash
# Deploy to all nodes
ansible-playbook -i inventories/production/hosts.ini playbooks/deploy_docker_harbor.yml

# Deploy to specific hosts
ansible-playbook -i inventories/production/hosts.ini playbooks/deploy_docker_harbor.yml -e "target_hosts=k8s_cluster"
```

## What This Role Does

### Docker Installation
- Updates package cache
- Installs required packages (yum-utils, device-mapper-persistent-data, lvm2, wget, curl)
- Adds Docker repository
- Removes conflicting runc package
- Installs Docker CE, Docker CLI, and containerd
- Starts and enables Docker service
- Adds ansible_user to docker group

### Harbor Certificate Configuration
- Creates Docker certificates directory
- Copies Harbor CA certificate to Docker trust store
- Creates system CA certificates directory
- Copies Harbor CA certificate to system trust store
- Updates system CA certificates
- Configures Docker daemon with Harbor registry settings
- Restarts Docker and containerd services

## Files

- `tasks/main.yml` - Main task file
- `tasks/install.yml` - Docker installation tasks
- `tasks/harbor_certificates.yml` - Harbor certificate configuration tasks
- `defaults/main.yml` - Default variables
- `files/ca.crt` - Harbor CA certificate

## Integration with RKE Deploy

This role is now a dependency of the `rke_deploy` role, which means:
- RKE deployment automatically includes Docker + Harbor configuration
- Docker installation is modular and can be used independently
- Harbor certificate trust is consistently applied across all deployments

## Troubleshooting

### Certificate Issues
- Verify `files/ca.crt` exists and is valid
- Check that `harbor_enable_cert` is set to `true`
- Ensure Docker service is restarted after certificate changes

### Docker Installation Issues
- Check that the target system is CentOS/RHEL 8 or 9
- Verify network connectivity to Docker repository
- Ensure sufficient disk space for Docker installation 