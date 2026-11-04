# GEDU Infrastructure Deployment Guide

## 🎯 **Overview**

This guide covers the complete deployment of the GEDU infrastructure using the updated `site.yaml` file, which orchestrates all components including load balancing, Kubernetes cluster, and supporting services.

## 🏗️ **Infrastructure Components**

### **1. Bootstrap (Initial Setup)**
- **Playbook**: `playbooks/bootstrap.yml`
- **Purpose**: Initial system preparation and package installation
- **Tags**: `bootstrap`, `init`

### **2. Load Balancing (HAProxy + Keepalived)**
- **Playbook**: `playbooks/deploy_haproxy_keepalived.yml`
- **Purpose**: High availability load balancing with SSL support
- **Tags**: `haproxy`, `loadbalancer`, `ha`
- **Features**: 
  - SSL passthrough and SSL termination modes
  - Virtual IP management with Keepalived
  - Kubernetes API load balancing

### **3. Container Registry (Harbor)**
- **Playbook**: `playbooks/deploy_harbor.yml`
- **Purpose**: Private container image registry
- **Tags**: `harbor`, `registry`

### **4. Kubernetes Cluster (RKE)**
- **Playbook**: `playbooks/rke_cluster.yml`
- **Purpose**: Rancher Kubernetes Engine cluster deployment
- **Tags**: `rke`, `kubernetes`, `cluster`

### **5. Data Lake (MinIO)**
- **Playbook**: `playbooks/data-lake.yaml`
- **Purpose**: Object storage for data lake functionality
- **Tags**: `datalake`, `minio`, `storage`

### **6. Database Cluster**
- **Playbook**: `playbooks/db-cluster.yml`
- **Purpose**: Database cluster deployment
- **Tags**: `database`, `db`

### **7. Cleanup Operations**
- **Playbook**: `playbooks/cleanup_rke_nodes.yml`
- **Purpose**: Optional cleanup of RKE nodes
- **Tags**: `rke-cleanup`, `cleanup`

## 🚀 **Deployment Options**

### **Option 1: Complete Infrastructure Deployment**

```bash
# Deploy complete infrastructure
ansible-playbook -i inventories/production/hosts.ini site.yaml

# Deploy with verbose output
ansible-playbook -i inventories/production/hosts.ini site.yaml -v

# Deploy with extra verbose output
ansible-playbook -i inventories/production/hosts.ini site.yaml -vvv
```

### **Option 2: Selective Component Deployment**

```bash
# Deploy only load balancing
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy"

# Deploy only Kubernetes cluster
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "rke"

# Deploy load balancing and Kubernetes
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy,rke"

# Deploy everything except cleanup
ansible-playbook -i inventories/production/hosts.ini site.yaml --skip-tags "cleanup"
```

### **Option 3: HAProxy with SSL Mode Selection**

```bash
# Deploy HAProxy with SSL passthrough (default)
./deploy-haproxy-ssl.sh tcp

# Deploy HAProxy with SSL termination
./deploy-haproxy-ssl.sh http

# Deploy HAProxy as part of complete infrastructure
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy"
```

## 📋 **Deployment Order and Dependencies**

### **Recommended Deployment Order:**

1. **Bootstrap** → System preparation
2. **HAProxy + Keepalived** → Load balancing infrastructure
3. **Harbor** → Container registry
4. **RKE Cluster** → Kubernetes cluster
5. **Data Lake** → Object storage
6. **Database Cluster** → Database services
7. **Cleanup** → Optional cleanup operations

### **Dependencies:**
- **HAProxy** depends on **Bootstrap** (system packages)
- **RKE** depends on **HAProxy** (load balancing)
- **Data Lake** and **Database** can be deployed independently

## 🔧 **Configuration Management**

### **Environment-Specific Variables**

Create environment-specific variable files:

```bash
# Production environment
ansible-playbook -i inventories/production/hosts.ini site.yaml -e @group_vars/production.yml

# Non-production environment
ansible-playbook -i inventories/production/hosts.ini site.yaml -e @group_vars/nonprod.yml
```

### **SSL Configuration**

For HAProxy SSL termination mode, ensure certificates are available:

```bash
# Check certificate availability
ls -la ../20250718_star_geduhub_vn/star_geduhub_fullchain.pem
ls -la ../20250718_star_geduhub_vn/star_geduhub_vn.key

# Deploy with SSL termination
./deploy-haproxy-ssl.sh http
```

## 🧪 **Verification and Testing**

### **1. Load Balancing Verification**

```bash
# Check HAProxy status
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'systemctl status haproxy'
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.33 'systemctl status haproxy'

# Test virtual IP
curl -I http://10.47.197.30:80
curl -k -I https://10.47.197.30:443

# Test Kubernetes API
curl -k https://10.47.197.30:8443/healthz
```

### **2. Kubernetes Cluster Verification**

```bash
# Check cluster status
kubectl --kubeconfig kube_config_cluster.yml get nodes
kubectl --kubeconfig kube_config_cluster.yml get pods --all-namespaces

# Test Istio ingress
curl -k -H "Host: hello.geduhub.vn" https://10.47.197.30/hello
```

### **3. Harbor Registry Verification**

```bash
# Check Harbor status
ssh -i ~/.ssh/id_rsa ansible_user@10.47.198.51 'docker ps | grep harbor'

# Test Harbor access
curl -I http://10.47.198.51:8080
```

## 📊 **Monitoring and Troubleshooting**

### **Common Issues and Solutions**

#### **1. HAProxy SSL Issues**
```bash
# Check HAProxy configuration
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'haproxy -c -f /etc/haproxy/haproxy.cfg'

# Check HAProxy logs
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'journalctl -u haproxy -f'
```

#### **2. Kubernetes Cluster Issues**
```bash
# Check RKE cluster status
kubectl --kubeconfig kube_config_cluster.yml get nodes -o wide

# Check cluster logs
kubectl --kubeconfig kube_config_cluster.yml logs -n kube-system deployment/coredns
```

#### **3. Network Connectivity Issues**
```bash
# Test network connectivity
./network_connectivity_report.sh

# Check firewall rules
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'iptables -L'
```

### **Log Collection**

```bash
# Collect logs from all nodes
ansible-playbook -i inventories/production/hosts.ini playbooks/collect_logs.yml

# Check specific service logs
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'journalctl -u haproxy --since "1 hour ago"'
```

## 🔄 **Maintenance and Updates**

### **Updating HAProxy Configuration**

```bash
# Update HAProxy with new SSL mode
./deploy-haproxy-ssl.sh http

# Update HAProxy as part of infrastructure
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy"
```

### **Updating Kubernetes Cluster**

```bash
# Update RKE cluster
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "rke"
```

### **Rolling Back Changes**

```bash
# Rollback HAProxy to previous configuration
git checkout HEAD~1 -- playbooks/deploy_haproxy_keepalived.yml
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy"
```

## 📝 **File Structure**

```
gedu-deploy-infra/
├── site.yaml                                    # Main deployment orchestration
├── inventories/
│   └── production/
│       ├── hosts.ini                           # Host inventory
│       ├── group_vars/                         # Group variables
│       └── host_vars/                          # Host-specific variables
├── playbooks/
│   ├── bootstrap.yml                           # Initial system setup
│   ├── deploy_haproxy_keepalived.yml          # Load balancing
│   ├── deploy_harbor.yml                      # Container registry
│   ├── rke_cluster.yml                        # Kubernetes cluster
│   ├── data-lake.yaml                         # Object storage
│   ├── db-cluster.yml                         # Database cluster
│   └── cleanup_rke_nodes.yml                  # Cleanup operations
├── roles/
│   └── haproxy_keepalived/                    # HAProxy and Keepalived role
├── deploy-haproxy-ssl.sh                      # HAProxy SSL deployment script
├── HAProxy_SSL_Deployment_Guide.md           # HAProxy specific guide
└── Infrastructure_Deployment_Guide.md        # This guide
```

## ✅ **Deployment Checklist**

### **Pre-Deployment**
- [ ] **Inventory Verification**: Confirm all hosts are accessible
- [ ] **SSH Keys**: Verify SSH key access to all nodes
- [ ] **Network Connectivity**: Test network connectivity between nodes
- [ ] **SSL Certificates**: Ensure certificates are available (if using SSL termination)
- [ ] **Ansible Version**: Confirm Ansible version compatibility

### **Deployment**
- [ ] **Bootstrap**: Run initial system preparation
- [ ] **Load Balancing**: Deploy HAProxy and Keepalived
- [ ] **Container Registry**: Deploy Harbor
- [ ] **Kubernetes**: Deploy RKE cluster
- [ ] **Storage**: Deploy data lake and database
- [ ] **Verification**: Test all components

### **Post-Deployment**
- [ ] **Service Status**: Verify all services are running
- [ ] **Network Testing**: Test load balancing and connectivity
- [ ] **SSL Testing**: Verify SSL configuration (if applicable)
- [ ] **Monitoring**: Set up monitoring and alerting
- [ ] **Documentation**: Update deployment documentation

## 🎉 **Conclusion**

The updated `site.yaml` file provides a comprehensive orchestration for deploying the complete GEDU infrastructure. The modular design allows for selective deployment of components while maintaining proper dependencies and order.

**Key Benefits:**
- **Modular Deployment**: Deploy individual components or complete infrastructure
- **SSL Flexibility**: Support for both SSL passthrough and termination modes
- **High Availability**: Load balancing with Keepalived for virtual IP management
- **Comprehensive Monitoring**: Built-in verification and troubleshooting tools

**Next Steps:**
1. Review the deployment checklist
2. Choose your deployment strategy (complete or selective)
3. Execute the deployment using the provided commands
4. Verify all components are working correctly
5. Set up monitoring and maintenance procedures 