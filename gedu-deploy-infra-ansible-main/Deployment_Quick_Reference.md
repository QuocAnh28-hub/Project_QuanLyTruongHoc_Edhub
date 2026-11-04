# Deployment Quick Reference

## 🚀 **Quick Deployment Commands**

### **Complete Infrastructure**
```bash
# Deploy everything
ansible-playbook -i inventories/production/hosts.ini site.yaml

# Deploy with verbose output
ansible-playbook -i inventories/production/hosts.ini site.yaml -v
```

### **Selective Deployment**
```bash
# Load balancing only
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy"

# Kubernetes cluster only
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "rke"

# Load balancing + Kubernetes
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy,rke"

# Everything except cleanup
ansible-playbook -i inventories/production/hosts.ini site.yaml --skip-tags "cleanup"
```

### **HAProxy SSL Modes**
```bash
# SSL Passthrough (default)
./deploy-haproxy-ssl.sh tcp

# SSL Termination
./deploy-haproxy-ssl.sh http

# Check usage
./deploy-haproxy-ssl.sh
```

## 🔍 **Verification Commands**

### **Load Balancing**
```bash
# HAProxy status
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'systemctl status haproxy'

# Virtual IP test
curl -I http://10.47.197.30:80
curl -k -I https://10.47.197.30:443

# Kubernetes API test
curl -k https://10.47.197.30:8443/healthz
```

### **Kubernetes Cluster**
```bash
# Cluster status
kubectl --kubeconfig kube_config_cluster.yml get nodes

# Pod status
kubectl --kubeconfig kube_config_cluster.yml get pods --all-namespaces

# Istio test
curl -k -H "Host: hello.geduhub.vn" https://10.47.197.30/hello
```

### **SSL Certificate**
```bash
# Test HTTPS with domain
curl -H "Host: hello.geduhub.vn" https://hello.geduhub.vn/hello

# Test HTTPS with IP (skip validation)
curl -k -H "Host: hello.geduhub.vn" https://10.47.197.30/hello
```

## 🛠️ **Troubleshooting Commands**

### **HAProxy Issues**
```bash
# Check configuration
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'haproxy -c -f /etc/haproxy/haproxy.cfg'

# Check logs
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'journalctl -u haproxy -f'

# Check virtual IP
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'ip addr show ens33 | grep 10.47.197.30'
```

### **Kubernetes Issues**
```bash
# Check cluster status
kubectl --kubeconfig kube_config_cluster.yml get nodes -o wide

# Check Istio pods
kubectl --kubeconfig kube_config_cluster.yml get pods -n istio-system

# Check Istio gateway
kubectl --kubeconfig kube_config_cluster.yml get gateway -n istio-system
```

### **Network Issues**
```bash
# Network connectivity test
./network_connectivity_report.sh

# Test SSH access
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'echo "SSH OK"'
```

## 🔄 **Maintenance Commands**

### **Update HAProxy**
```bash
# Update with current SSL mode
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "haproxy"

# Change SSL mode
./deploy-haproxy-ssl.sh http  # or tcp
```

### **Update Kubernetes**
```bash
# Update RKE cluster
ansible-playbook -i inventories/production/hosts.ini site.yaml --tags "rke"
```

### **Restart Services**
```bash
# Restart HAProxy
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'sudo systemctl restart haproxy'

# Restart Keepalived
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'sudo systemctl restart keepalived'
```

## 📊 **Monitoring Commands**

### **Service Status**
```bash
# All services on master nodes
ansible-playbook -i inventories/production/hosts.ini playbooks/check_services.yml

# HAProxy status
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'systemctl status haproxy keepalived'

# Kubernetes services
kubectl --kubeconfig kube_config_cluster.yml get services --all-namespaces
```

### **Log Monitoring**
```bash
# HAProxy logs
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'journalctl -u haproxy --since "1 hour ago"'

# Keepalived logs
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'journalctl -u keepalived --since "1 hour ago"'
```

## 🗂️ **File Locations**

### **Configuration Files**
- **HAProxy Config**: `/etc/haproxy/haproxy.cfg`
- **Keepalived Config**: `/etc/keepalived/keepalived.conf`
- **SSL Certificates**: `/etc/haproxy/certs/` (SSL termination mode)
- **Kubernetes Config**: `kube_config_cluster.yml`

### **Log Files**
- **HAProxy Logs**: `journalctl -u haproxy`
- **Keepalived Logs**: `journalctl -u keepalived`
- **System Logs**: `/var/log/messages`

### **Certificate Files**
- **Source Certificates**: `../20250718_star_geduhub_vn/`
- **HAProxy Certificates**: `/etc/haproxy/certs/geduhub.vn.pem`

## 🏷️ **Available Tags**

### **Component Tags**
- `bootstrap` - Initial system setup
- `haproxy` - Load balancing
- `harbor` - Container registry
- `rke` - Kubernetes cluster
- `datalake` - Object storage
- `database` - Database cluster
- `cleanup` - Cleanup operations

### **Category Tags**
- `init` - Initialization
- `loadbalancer` - Load balancing
- `ha` - High availability
- `registry` - Container registry
- `kubernetes` - Kubernetes
- `cluster` - Cluster management
- `storage` - Storage services

## ⚡ **Quick Fixes**

### **SSL Certificate Issues**
```bash
# Regenerate Kubernetes secret
kubectl --kubeconfig kube_config_cluster.yml delete secret geduhub.vn-tls -n istio-system
kubectl --kubeconfig kube_config_cluster.yml create secret tls geduhub.vn-tls -n istio-system --cert=../20250718_star_geduhub_vn/geduhub.vn.complete-chain.crt --key=../20250718_star_geduhub_vn/star_geduhub_vn.key
```

### **Virtual IP Issues**
```bash
# Check Keepalived status
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'systemctl status keepalived'

# Restart Keepalived
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'sudo systemctl restart keepalived'
```

### **HAProxy Configuration Issues**
```bash
# Validate configuration
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'haproxy -c -f /etc/haproxy/haproxy.cfg'

# Restart HAProxy
ssh -i ~/.ssh/id_rsa ansible_user@10.47.197.32 'sudo systemctl restart haproxy'
``` 