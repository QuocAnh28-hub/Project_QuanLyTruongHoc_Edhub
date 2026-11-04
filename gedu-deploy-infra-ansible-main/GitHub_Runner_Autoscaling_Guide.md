# GitHub Runner Autoscaling Guide

## Overview

This guide explains how to implement and manage autoscaling for GitHub Actions runners in your infrastructure. The autoscaling system automatically scales runners up and down based on GitHub Actions queue demand.

## Features

- **Automatic Scaling**: Scales runners up when jobs are queued and down when idle
- **Configurable Thresholds**: Customizable scaling rules and cooldown periods
- **Resource Management**: Prevents resource exhaustion with min/max limits
- **Monitoring**: Built-in logging and status monitoring
- **Systemd Integration**: Runs as a system service with automatic restarts

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub API    │◄──►│  Autoscaler      │◄──►│  Docker Host    │
│                 │    │  Service         │    │                 │
│ - Queue Status  │    │ - Monitor Queue  │    │ - Runner        │
│ - Runner List   │    │ - Scale Up/Down  │    │   Containers    │
│ - Registration  │    │ - Health Check   │    │ - Resource Mgmt │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Configuration

### Token Management

**Important**: You need two different types of tokens:

1. **GitHub Access Token** (`github_access_token`):
   - Used for API access to monitor queues and runners
   - Requires `repo` and `admin:org` scopes
   - Long-lived token for continuous monitoring

2. **Runner Registration Token** (`github_runner_token`):
   - Used specifically for registering self-hosted runners
   - Short-lived token (expires in 1 hour)
   - Generated from GitHub organization/repository settings

#### Getting the Runner Registration Token:

```bash
# For organization-level runners
curl -X POST -H "Authorization: token YOUR_ACCESS_TOKEN" \
  https://api.github.com/orgs/YOUR_ORG/actions/runners/registration-token

# For repository-level runners
curl -X POST -H "Authorization: token YOUR_ACCESS_TOKEN" \
  https://api.github.com/repos/YOUR_ORG/YOUR_REPO/actions/runners/registration-token
```

### Inventory Configuration

Update your `inventories/production/hosts.ini`:

```ini
[github_runner:vars]
# GitHub Configuration
github_org=gedu-hub
github_repo=  # Empty for organization-level runners
github_access_token=YOUR_GITHUB_ACCESS_TOKEN
github_runner_token=YOUR_RUNNER_REGISTRATION_TOKEN
github_runner_labels=self-hosted,ubuntu-runner,gedu-runner,docker-runner
github_runner_group=docker-runners

# Enable autoscaling
github_runner_auto_scaling=true
github_runner_min_runners=1
github_runner_max_runners=5
```

### Autoscaler Configuration

The autoscaler uses `/home/ansible_user/actions-runner/autoscale-config.yml`:

```yaml
# GitHub Configuration
github_org: gedu-hub
github_repo:  # Empty for organization-level runners
github_token: YOUR_GITHUB_ACCESS_TOKEN

# Scaling Configuration
min_runners: 1
max_runners: 5

# Scaling Rules
scaling_rules:
  scale_up:
    queue_length_threshold: 1
    scale_up_delay: 30  # seconds
  
  scale_down:
    idle_time_threshold: 300  # seconds
    scale_down_delay: 60  # seconds

# Monitoring Configuration
monitoring:
  check_interval: 60  # seconds
  max_concurrent_scaling: 2
  graceful_shutdown_timeout: 300  # seconds
```

## Deployment

### 1. Deploy with Autoscaling Enabled

```bash
# Deploy GitHub runner with autoscaling
ansible-playbook -i inventories/production/hosts.ini playbooks/github_runner.yml
```

### 2. Verify Deployment

```bash
# Check autoscaler status
ssh ansible_user@10.47.198.51 "/home/ansible_user/actions-runner/check-autoscaler-status.sh"

# Check service status
ssh ansible_user@10.47.198.51 "systemctl status github-runner-autoscaler"

# View logs
ssh ansible_user@10.47.198.51 "tail -f /var/log/github-runner-autoscaler.log"
```

## Scaling Logic

### Scale Up Conditions
- Queue length > `queue_length_threshold` (default: 1)
- Current runners < `max_runners`
- Cooldown period elapsed since last scale up

### Scale Down Conditions
- No queued jobs
- Idle runners exist (idle for > `idle_time_threshold`)
- Current runners > `min_runners`
- Cooldown period elapsed since last scale down

## Monitoring and Management

### Service Management

```bash
# Start autoscaler
sudo systemctl start github-runner-autoscaler

# Stop autoscaler
sudo systemctl stop github-runner-autoscaler

# Restart autoscaler
sudo systemctl restart github-runner-autoscaler

# Enable autoscaler (start on boot)
sudo systemctl enable github-runner-autoscaler

# Check status
sudo systemctl status github-runner-autoscaler
```

### Log Monitoring

```bash
# View real-time logs
tail -f /var/log/github-runner-autoscaler.log

# View recent logs
tail -100 /var/log/github-runner-autoscaler.log

# Search for scaling events
grep -E "(Scaling up|Scaling down)" /var/log/github-runner-autoscaler.log
```

### Runner Status

```bash
# Check current runners
docker ps --filter "name=github-runner"

# Check GitHub API for runner status
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/gedu-hub/gedu-deploy-services/actions/runners
```

## Troubleshooting

### Common Issues

1. **Autoscaler not starting**
   ```bash
   # Check service status
   systemctl status github-runner-autoscaler
   
   # Check logs
   journalctl -u github-runner-autoscaler -f
   
   # Fix permission issues (if needed)
   sudo chown ansible_user:ansible_user /home/ansible_user/actions-runner/github-runner-autoscaler.py
   sudo chmod +x /home/ansible_user/actions-runner/github-runner-autoscaler.py
   sudo systemctl restart github-runner-autoscaler
   ```

2. **Authentication errors**
   ```bash
   # Verify GitHub token
   curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/user
   ```

3. **Scaling not working**
   ```bash
   # Check configuration
   cat /home/ansible_user/actions-runner/autoscale-config.yml
   
   # Check queue status
   curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/repos/gedu-hub/gedu-deploy-services/actions/runs?status=queued
   ```

### Debug Mode

Enable debug logging by modifying the autoscaler script:

```python
logging.basicConfig(
    level=logging.DEBUG,  # Change from INFO to DEBUG
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)
```

## Performance Tuning

### Scaling Thresholds

Adjust based on your workload:

- **High-traffic repos**: Lower `queue_length_threshold` (1-2)
- **Low-traffic repos**: Higher `queue_length_threshold` (3-5)
- **Fast jobs**: Lower `idle_time_threshold` (60-180 seconds)
- **Slow jobs**: Higher `idle_time_threshold` (300-600 seconds)

### Resource Limits

Monitor system resources:

```bash
# Check CPU and memory usage
htop

# Check disk usage
df -h

# Check Docker resource usage
docker stats
```

## Security Considerations

1. **Token Security**: Store GitHub tokens securely
2. **Network Security**: Restrict access to autoscaler service
3. **Resource Limits**: Set appropriate Docker resource limits
4. **Log Rotation**: Configure log rotation to prevent disk space issues

## Best Practices

1. **Start Small**: Begin with conservative scaling thresholds
2. **Monitor Closely**: Watch logs and metrics during initial deployment
3. **Test Scaling**: Trigger test workflows to verify scaling behavior
4. **Backup Configuration**: Keep configuration backups
5. **Regular Updates**: Update autoscaler and runner versions regularly

## Support

For issues or questions:
1. Check the logs: `/var/log/github-runner-autoscaler.log`
2. Verify configuration: `/home/ansible_user/actions-runner/autoscale-config.yml`
3. Test GitHub API connectivity
4. Review system resources and Docker status 