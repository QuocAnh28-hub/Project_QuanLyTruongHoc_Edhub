# HAProxy HTTP to HTTPS Redirect Deployment Guide

This guide explains how to deploy HAProxy with HTTP to HTTPS redirection using Ansible playbooks.

## 📋 Overview

The deployment implements automatic redirection of all HTTP traffic (port 80) to HTTPS (port 443) while maintaining backward compatibility for internal HTTP traffic.

## 🏗️ Architecture

```
Internet → HAProxy (Port 80) → Redirect to HTTPS (Port 443) → Istio Ingress Gateway
         ↓
    Internal HTTP (Port 8080) → Direct to Istio Ingress Gateway
```

## 🔧 Configuration Changes

### 1. HAProxy Configuration Template (`haproxy.cfg.j2`)

**Added HTTP to HTTPS Redirect Frontend:**
```haproxy
# HTTP to HTTPS Redirect
frontend http-redirect
    bind *:{{ istio_ingress_port }}
    mode http
    option httplog
    option forwardfor
    option http-server-close
    redirect scheme https code 301 if !{ ssl_fc }
```

**Modified Internal HTTP Frontend:**
```haproxy
# Istio Ingress Gateway Load Balancing (HTTP - for internal traffic)
frontend {{ istio_ingress_frontend_name }}
    bind *:{{ istio_ingress_internal_port }}
    mode http
    option httplog
    option forwardfor
    option http-server-close
    default_backend {{ istio_ingress_backend_name }}
```

### 2. Ansible Variables (`defaults/main.yml`)

**Added new variable:**
```yaml
istio_ingress_internal_port: 8080  # Internal HTTP port for non-redirected traffic
```

### 3. Playbook Variables (`deploy_haproxy_keepalived.yml`)

**Added to playbook:**
```yaml
istio_ingress_internal_port: 8080  # Internal HTTP port for non-redirected traffic
```

## 🚀 Deployment Methods

### Method 1: Using the Deployment Script (Recommended)

```bash
# Navigate to the scripts directory
cd gedu-deploy-infra/scripts

# Deploy with default settings
./deploy_haproxy_ssl_redirect.sh

# Deploy with verbose output
./deploy_haproxy_ssl_redirect.sh -v

# Dry run to see what would be executed
./deploy_haproxy_ssl_redirect.sh --dry-run

# Check configuration only
./deploy_haproxy_ssl_redirect.sh --check-only
```

### Method 2: Direct Ansible Playbook Execution

```bash
# Navigate to the infrastructure directory
cd gedu-deploy-infra

# Deploy HAProxy with SSL redirect
ansible-playbook playbooks/deploy_haproxy_keepalived.yml -i inventories/production/hosts.ini

# Deploy with verbose output
ansible-playbook playbooks/deploy_haproxy_keepalived.yml -i inventories/production/hosts.ini -v

# Dry run
ansible-playbook playbooks/deploy_haproxy_keepalived.yml -i inventories/production/hosts.ini --check --diff
```

### Method 3: Using the Main Site Playbook

```bash
# Navigate to the infrastructure directory
cd gedu-deploy-infra

# Deploy only HAProxy and Keepalived
ansible-playbook site.yaml --tags haproxy,loadbalancer,ha -i inventories/production/hosts.ini

# Deploy complete infrastructure
ansible-playbook site.yaml -i inventories/production/hosts.ini
```

## 🎯 Target Hosts

The deployment targets the following hosts:
- **k8s_master_02**: `10.47.197.32` (Primary HAProxy)
- **k8s_master_03**: `10.47.197.33` (Backup HAProxy)

## 📊 Port Configuration

| Port | Purpose | Traffic Flow |
|------|---------|--------------|
| 80 | HTTP to HTTPS redirect | All HTTP traffic redirected to HTTPS |
| 443 | HTTPS termination | SSL-terminated traffic to Istio |
| 8080 | Internal HTTP | Direct HTTP traffic (no redirect) |
| 8443 | Kubernetes API | Load balanced API access |

## 🔍 Verification

### 1. Check HAProxy Status

```bash
# Check if HAProxy is running
sudo systemctl status haproxy

# Check HAProxy configuration
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

# View HAProxy logs
sudo journalctl -u haproxy -f
```

### 2. Test HTTP to HTTPS Redirection

```bash
# Test HTTP redirection (should return 301)
curl -I http://10.47.197.30

# Test HTTPS access (should work normally)
curl -I https://10.47.197.30

# Test internal HTTP port (should work without redirect)
curl -I http://10.47.197.30:8080
```

### 3. Check Port Listening

```bash
# Check which ports HAProxy is listening on
sudo netstat -tlnp | grep haproxy

# Or using ss command
sudo ss -tlnp | grep haproxy
```

## 🔧 Configuration Details

### HTTP to HTTPS Redirect Logic

The redirect is implemented using HAProxy's `redirect` directive:

```haproxy
redirect scheme https code 301 if !{ ssl_fc }
```

- **`scheme https`**: Redirects to HTTPS protocol
- **`code 301`**: Uses permanent redirect (good for SEO)
- **`if !{ ssl_fc }`**: Only redirects non-SSL traffic

### SSL Termination Configuration

SSL termination is handled at HAProxy level:

```haproxy
frontend istio-ingress-https-frontend
    bind *:443 ssl crt /etc/haproxy/certs/geduhub.vn.pem
    mode http
    # ... other options
```

### Load Balancing

Round-robin load balancing is used for backend servers:

```haproxy
backend istio-ingressgateway-https
    mode http
    balance roundrobin
    # ... server definitions
```

## 🛠️ Troubleshooting

### Common Issues

1. **HAProxy won't start**
   ```bash
   # Check configuration syntax
   sudo haproxy -c -f /etc/haproxy/haproxy.cfg
   
   # Check for port conflicts
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :443
   ```

2. **SSL certificate issues**
   ```bash
   # Check certificate file
   sudo ls -la /etc/haproxy/certs/
   
   # Verify certificate
   openssl x509 -in /etc/haproxy/certs/geduhub.vn.pem -text -noout
   ```

3. **Redirection not working**
   ```bash
   # Check HAProxy logs
   sudo journalctl -u haproxy -f
   
   # Test with curl
   curl -v http://10.47.197.30
   ```

### Log Analysis

```bash
# View real-time HAProxy logs
sudo journalctl -u haproxy -f

# View specific log entries
sudo journalctl -u haproxy --since "10 minutes ago"

# Check for errors
sudo journalctl -u haproxy -p err
```

## 🔄 Rolling Back Changes

If you need to rollback the changes:

1. **Restore original configuration:**
   ```bash
   # Edit the template to remove redirect frontend
   # and change internal port back to 80
   ```

2. **Redeploy:**
   ```bash
   ./deploy_haproxy_ssl_redirect.sh
   ```

## 📈 Monitoring

### Health Checks

HAProxy performs health checks on backend servers:

```haproxy
option httpchk GET /healthz/ready
http-check expect status 200
```

### Metrics

Monitor HAProxy performance:

```bash
# Check HAProxy stats (if enabled)
curl http://localhost:9000/stats

# Monitor connection counts
sudo ss -s | grep haproxy
```

## 🔐 Security Considerations

1. **SSL/TLS Configuration**: Ensure proper SSL configuration
2. **Access Control**: Restrict access to HAProxy management interface
3. **Logging**: Monitor logs for suspicious activity
4. **Updates**: Keep HAProxy updated for security patches

## 📚 Additional Resources

- [HAProxy Documentation](https://www.haproxy.org/download/2.4/doc/intro.txt)
- [Ansible HAProxy Module](https://docs.ansible.com/ansible/latest/collections/community/haproxy/)
- [HTTP to HTTPS Redirect Best Practices](https://www.haproxy.com/blog/redirect-http-to-https/)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review HAProxy logs
3. Verify network connectivity
4. Test with simple curl commands 