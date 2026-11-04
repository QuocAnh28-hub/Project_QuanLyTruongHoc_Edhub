# CI/CD Setup for GEdu Frontend

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. Test Build Workflow (`test-build.yml`)

**Trigger**: Pull requests to `dev` branch

**Purpose**: Validates that the Docker build works correctly and the application starts properly.

**What it does**:
- Builds Docker image with test API endpoint
- Starts container and verifies it runs
- Tests health endpoint and main page accessibility
- Verifies build artifacts are present
- Cleans up test containers

### 2. Build and Deploy Workflow (`build.yml`)

**Trigger**: Push to `dev` branch

**Purpose**: Builds production Docker image and deploys to server.

**What it does**:
- Builds Docker image with production API endpoint from `API_PATH` variable
- Saves image as artifact
- Deploys to server using SSH
- Runs health checks

## Required GitHub Secrets

Set these in your repository's Settings > Secrets and variables > Actions:

### Secrets
- `SERVER_HOST`: IP address or hostname of your deployment server
- `SERVER_USER`: SSH username for the server
- `SERVER_SSH_PRIVATE_KEY`: Private SSH key for server access

### Variables
- `API_PATH`: The API endpoint URL (e.g., `https://api.yourapp.com`)
- `APP_IMAGE_DIR`: Directory on server where app files are stored (e.g., `/opt/gedu-frontend`)

## Server Requirements

Your deployment server needs:

1. **Docker**: Installed and running
2. **SSH Access**: Configured with the provided SSH key
3. **Port 5001**: Available for the application
4. **curl**: For health checks (usually pre-installed)

## Deployment Process

1. **Build Stage**:
   - Builds Docker image with `VITE_API_ENDPOINT` from `API_PATH`
   - Saves image as compressed tar file
   - Uploads as GitHub artifact

2. **Deploy Stage**:
   - Downloads image artifact
   - Connects to server via SSH
   - Stops and removes existing container
   - Uploads new image and deployment script
   - Loads image and starts container
   - Performs health checks

## Environment Variables

### Build Time
- `VITE_API_ENDPOINT`: Set from GitHub variable `API_PATH`
- `NODE_ENV`: Set to `production` in container

### Runtime
- `NODE_ENV=production`: Set in container environment

## Troubleshooting

### Build Failures

1. **Check GitHub Variables**:
   - Ensure `API_PATH` is set correctly
   - Verify `APP_IMAGE_DIR` exists and is writable

2. **Check Server Access**:
   - Verify SSH key is correct
   - Ensure server is accessible
   - Check user permissions

3. **Check Docker on Server**:
   ```bash
   # On server
   docker --version
   docker ps
   ```

### Container Issues

1. **Check Container Logs**:
   ```bash
   # On server
   cd /opt/gedu-frontend  # or your APP_IMAGE_DIR
   ./deploy.sh logs
   ```

2. **Check Container Status**:
   ```bash
   ./deploy.sh status
   ```

3. **Manual Health Check**:
   ```bash
   curl http://localhost:5001/health
   ```

### Common Issues

1. **Port Already in Use**:
   - Check if another service is using port 5001
   - Modify port in `deploy.sh` if needed

2. **Permission Denied**:
   - Ensure deployment script is executable: `chmod +x deploy.sh`
   - Check file ownership and permissions

3. **Image Load Failures**:
   - Verify `gedu-frontend.tar.gz` exists and is not corrupted
   - Check available disk space on server

## Manual Deployment

If you need to deploy manually:

```bash
# On your local machine
docker build --build-arg VITE_API_ENDPOINT=https://your-api.com -t gedu-frontend:latest .
docker save gedu-frontend:latest | gzip > gedu-frontend.tar.gz

# Copy to server
scp gedu-frontend.tar.gz deploy.sh user@server:/opt/gedu-frontend/

# On server
cd /opt/gedu-frontend
chmod +x deploy.sh
./deploy.sh update
```

## Monitoring

### Health Checks
- Endpoint: `http://your-server:5001/health`
- Returns: `healthy` with 200 status code

### Logs
```bash
# View container logs
./deploy.sh logs

# Follow logs in real-time
docker logs -f gedu-frontend
```

### Status
```bash
# Check container status
./deploy.sh status

# Check container health
./deploy.sh health
```

## Security Considerations

1. **SSH Keys**: Use dedicated deployment keys, not personal keys
2. **Firewall**: Only open necessary ports (22 for SSH, 5001 for app)
3. **Updates**: Keep server and Docker updated
4. **Monitoring**: Set up alerts for container failures

## Performance Optimization

1. **Image Size**: Multi-stage build reduces final image size
2. **Caching**: Docker layer caching speeds up builds
3. **Compression**: Gzip compression for static assets
4. **CDN**: Consider using a CDN for static assets in production

## Rollback

To rollback to a previous version:

```bash
# On server
cd /opt/gedu-frontend

# Stop current container
./deploy.sh stop

# Load previous image (if you have it)
gunzip -c gedu-frontend-backup.tar.gz | docker load

# Start with previous image
./deploy.sh start
```

## Backup Strategy

1. **Image Backups**: Save images before updates
2. **Configuration**: Backup nginx.conf and deploy.sh
3. **Data**: If you add persistent data, implement proper backup strategy 