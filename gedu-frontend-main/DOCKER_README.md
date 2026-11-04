# Docker Setup for GEdu Frontend

This project includes a complete Docker setup for both development and production environments.

## Quick Start

### Production Deployment
```bash
# Build and run production container
docker-compose --profile production up -d

# Access the application at http://localhost:3000
```

### Development with Hot Reload
```bash
# Start development environment with hot reload
docker-compose --profile development up

# Access the development server at http://localhost:5173
```

### Build Only (for CI/CD)
```bash
# Build the application without running it
docker-compose --profile build-only up

# Built files will be available in ./dist directory
```

## Docker Configuration

### Multi-Stage Build (Dockerfile)
- **Builder Stage**: Compiles the React application
- **Production Stage**: Serves the built files using Nginx

### Services

#### 1. Production Service (`gedu-frontend`)
- **Port**: 3000 (mapped to container port 80)
- **Health Check**: Available at `/health`
- **Restart Policy**: `unless-stopped`
- **Profile**: `production`

#### 2. Development Service (`gedu-frontend-dev`)
- **Port**: 5173 (Vite dev server)
- **Hot Reload**: Enabled with volume mounting
- **Profile**: `development`

#### 3. Build Service (`gedu-frontend-builder`)
- **Purpose**: Build only, no runtime
- **Output**: Files copied to `./dist`
- **Profile**: `build-only`

## Nginx Configuration

The production setup includes a custom Nginx configuration (`nginx.conf`) with:

- **SPA Routing**: All routes serve `index.html` for React Router
- **Static Asset Caching**: 1-year cache for static files
- **Gzip Compression**: Enabled for better performance
- **Security Headers**: XSS protection, content type options, etc.
- **API Proxy**: Ready for backend integration (commented out)

## Environment Variables

### Production
- `NODE_ENV=production`

### Development
- `NODE_ENV=development`

## API Integration

To connect to a backend API, uncomment and modify the API proxy section in `nginx.conf`:

```nginx
location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Then add your backend service to `docker-compose.yml`:

```yaml
backend:
  image: your-backend-image
  ports:
    - "3001:3000"
  networks:
    - gedu-network
```

## Useful Commands

### View Logs
```bash
# Production logs
docker-compose --profile production logs -f gedu-frontend

# Development logs
docker-compose --profile development logs -f gedu-frontend-dev
```

### Rebuild Images
```bash
# Rebuild production image
docker-compose --profile production build --no-cache

# Rebuild development image
docker-compose --profile development build --no-cache
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove volumes
docker-compose down -v
```

### Shell Access
```bash
# Access production container
docker-compose --profile production exec gedu-frontend sh

# Access development container
docker-compose --profile development exec gedu-frontend-dev sh
```

## Performance Optimizations

1. **Multi-stage Build**: Reduces final image size
2. **Layer Caching**: Package.json copied first for better caching
3. **Static Asset Caching**: 1-year cache headers for static files
4. **Gzip Compression**: Reduces transfer sizes
5. **Nginx Optimization**: Sendfile, tcp_nopush, keepalive settings

## Security Features

- Security headers (XSS protection, content type options)
- No root user in containers
- Minimal base images (alpine)
- Health checks for monitoring

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 3000 to 8080
```

### Build Failures
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure API endpoints in nginx.conf
- [ ] Set up SSL certificates (if needed)
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Test health check endpoint
- [ ] Verify static asset caching
- [ ] Test React Router functionality 