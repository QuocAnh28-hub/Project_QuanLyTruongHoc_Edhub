# GEDU RKE Infrastructure

This repository contains Ansible playbooks and roles for deploying a high-availability RKE (Rancher Kubernetes Engine) cluster with HAProxy load balancing and Keepalived for failover.

## 🏗️ Architecture Overview

```
Client Request → Virtual IP (10.47.197.30:8443) → HAProxy → Master Nodes
                                                             ├── Master 1 (10.47.197.32:6443) - Primary
                                                             └── Master 2 (10.47.197.33:6443) - Backup
```

## 📋 Prerequisites

- **Ansible**: 2.9+
- **Target OS**: CentOS/RHEL 8 or 9
- **SSH Access**: Key-based authentication
- **Network**: All nodes must be able to communicate with each other

## 🗂️ Project Structure

```
ansible-gedu-infra/
├── inventories/
│   └── production/
│       ├── hosts.ini                 # Host inventory
│       ├── group_vars/               # Group variables
│       └── host_vars/                # Host-specific variables
├── playbooks/
│   ├── rke_cluster.yml              # Deploy RKE on all nodes
│   └── deploy_haproxy_keepalived.yml # Deploy HA/load balancing
├── roles/
│   ├── rke_deploy/                  # RKE installation role
│   └── haproxy_keepalived/          # HAProxy & Keepalived role
└── kube_config_cluster.yml          # Kubernetes config file
```

## 🖥️ Infrastructure Components

### **Master Nodes**
- **k8s_master_02**: `10.47.197.32` (Primary)
- **k8s_master_03**: `10.47.197.33` (Backup)

### **Worker Nodes**
- **k8s_worker_02**: `10.47.197.33` (Also has controlplane role)
- **k8s_worker_03**: `10.47.197.34`
- **k8s_worker_04**: `10.47.197.35`
- **k8s_worker_05**: `10.47.197.36`

### **Load Balancing**
- **Virtual IP**: `10.47.197.30`
- **HAProxy Port**: `8443`
- **Kubernetes API Port**: `6443`

## 🚀 Quick Start

### 1. **Deploy RKE on All Nodes**
```bash
ansible-playbook playbooks/rke_cluster.yml -i inventories/production/hosts.ini
```

### 2. **Deploy HAProxy and Keepalived**
```bash
ansible-playbook playbooks/deploy_haproxy_keepalived.yml -i inventories/production/hosts.ini
```

### 3. **Access Your Cluster**
```bash
export KUBECONFIG=./kube_config_cluster.yml
kubectl --insecure-skip-tls-verify get nodes
```

## 📖 Detailed Configuration

### **RKE Cluster Configuration**

The cluster is configured with the following components:

#### **Network Plugin**
- **Canal**: Combines Calico and Flannel
- **Pod Network**: 10.42.0.0/16
- **Service Network**: 10.43.0.0/16

#### **Add-ons**
- **CoreDNS**: Cluster DNS resolution
- **Metrics Server**: Kubernetes metrics
- **Ingress Controller**: NGINX ingress

#### **High Availability**
- **etcd**: Distributed key-value store
- **Control Plane**: API server, scheduler, controller manager
- **Load Balancing**: HAProxy with Keepalived

### **HAProxy Configuration**

```haproxy
frontend kubernetes-api-frontend
    bind *:8443
    mode tcp
    default_backend kubernetes-api

backend kubernetes-api
    mode tcp
    balance roundrobin
    server k8s_master_02 10.47.197.32:6443 check
    server k8s_master_03 10.47.197.33:6443 check
```

### **Keepalived Configuration**

```keepalived
vrrp_instance VI_1 {
    state MASTER
    interface ens33
    virtual_router_id 51
    priority 255
    advert_int 1
    nopreempt
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        10.47.197.30
    }
    track_script {
        check_haproxy
    }
}
```

## 🔧 Role Details

### **rke_deploy Role**

**Purpose**: Installs and configures RKE on CentOS/RHEL nodes

**Tasks**:
1. **System Preparation**
   - Update package cache
   - Install required packages
   - Add Docker repository
   - Remove conflicting packages

2. **Docker Installation**
   - Install Docker CE, CLI, and containerd
   - Configure Docker daemon for Kubernetes
   - Start and enable Docker service

3. **RKE Installation**
   - Download RKE binary (v1.8.4)
   - Make executable and create symlink
   - Verify installation

4. **System Configuration**
   - Configure sysctl parameters
   - Disable swap
   - Load kernel modules
   - Make modules persistent

5. **Verification**
   - Check Docker status
   - Verify RKE installation

**Variables**:
```yaml
rke_install_dir: /opt/rke
rke_download_url: https://github.com/rancher/rke/releases/download/v1.8.4/rke_linux-amd64
kube_api_port: 8443
```

### **haproxy_keepalived Role**

**Purpose**: Deploys HAProxy for load balancing and Keepalived for high availability

**Tasks**:
1. **HAProxy Installation**
   - Install HAProxy package
   - Create configuration directories
   - Configure load balancing

2. **Keepalived Installation**
   - Install Keepalived package
   - Configure VRRP for failover
   - Set up virtual IP

3. **Service Management**
   - Enable and start services
   - Configure health checks
   - Set up automatic failover

**Variables**:
```yaml
keepalived_virtual_ip: "10.47.197.30"
keepalived_interface: "ens33"
keepalived_priority: "255"
kube_api_port: 8443
```

## 🔍 Troubleshooting

### **Common Issues**

#### **1. TLS Certificate Validation**
**Problem**: `tls: failed to verify certificate: x509: certificate is valid for 10.47.197.32, not 10.47.197.30`

**Solution**: Use `--insecure-skip-tls-verify` flag:
```bash
kubectl --insecure-skip-tls-verify get nodes
```

#### **2. Network Plugin Job Failure**
**Problem**: `rke-network-plugin-deploy-job` fails with ClusterRoleBinding errors

**Solution**: Delete the problematic ClusterRoleBinding:
```bash
kubectl delete clusterrolebinding canal-calico
```

#### **3. HAProxy Service Won't Start**
**Problem**: HAProxy fails to start due to missing directories

**Solution**: Ensure runtime directories exist:
```bash
mkdir -p /run/haproxy /var/lib/haproxy
chown haproxy:haproxy /run/haproxy /var/lib/haproxy
```

### **Health Checks**

#### **Check Cluster Status**
```bash
export KUBECONFIG=./kube_config_cluster.yml
kubectl --insecure-skip-tls-verify get nodes
kubectl --insecure-skip-tls-verify get pods -n kube-system
```

#### **Check HAProxy Status**
```bash
systemctl status haproxy
curl -k https://10.47.197.30:8443/healthz
```

#### **Check Keepalived Status**
```bash
systemctl status keepalived
ip addr show | grep 10.47.197.30
```

## 🔄 Maintenance

### **Updating RKE Version**

1. **Update the download URL** in `roles/rke_deploy/defaults/main.yml`:
   ```yaml
   rke_download_url: https://github.com/rancher/rke/releases/download/v1.8.4/rke_linux-amd64
   ```

2. **Redeploy the role**:
   ```bash
   ansible-playbook playbooks/rke_cluster.yml -i inventories/production/hosts.ini
   ```

### **Adding New Nodes**

1. **Add to inventory** in `inventories/production/hosts.ini`
2. **Deploy RKE**:
   ```bash
   ansible-playbook playbooks/rke_cluster.yml -i inventories/production/hosts.ini --limit new_node
   ```
3. **Update RKE cluster configuration** to include the new node
4. **Redeploy cluster** using RKE

### **Backup and Recovery**

#### **etcd Backup**
```bash
# Create backup
rke etcd snapshot-save --name backup-$(date +%Y%m%d-%H%M%S)

# Restore from backup
rke etcd snapshot-restore --name backup-20250706-120000
```

## 📊 Monitoring

### **Cluster Metrics**
```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -A

# Check cluster events
kubectl get events --sort-by='.lastTimestamp'
```

### **Service Monitoring**
```bash
# Check HAProxy stats
curl -s http://localhost:9000/stats

# Check Keepalived status
ipvsadm -L
```

## 🔐 Security Considerations

### **Network Security**
- **Firewall**: Ensure ports 6443, 8443, 2379-2380 are open between nodes
- **SELinux**: Configure appropriate policies for HAProxy and Keepalived
- **Network Policies**: Implement Kubernetes network policies for pod-to-pod communication

### **Access Control**
- **RBAC**: Configure appropriate roles and bindings
- **Service Accounts**: Use dedicated service accounts for applications
- **Secrets Management**: Use Kubernetes secrets or external secret management

## 📝 Configuration Files

### **Inventory Structure**
```ini
[masters]
k8s_master_02 ansible_host=10.47.197.32
k8s_master_03 ansible_host=10.47.197.33

[workers]
k8s_worker_02 ansible_host=10.47.197.33
k8s_worker_03 ansible_host=10.47.197.34
k8s_worker_04 ansible_host=10.47.197.35
k8s_worker_05 ansible_host=10.47.197.36

[k8s_cluster:children]
masters
workers
```

### **Kubernetes Config**
The `kube_config_cluster.yml` file contains:
- **API Server**: `https://10.47.197.30:8443`
- **Certificate Authority**: Base64 encoded CA certificate
- **Client Certificate**: Base64 encoded client certificate
- **Client Key**: Base64 encoded client private key

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

**GEDU Infrastructure Team**

---

**Last Updated**: July 6, 2025  
**Version**: 1.8.4  
**Status**: Production Ready ✅ 
