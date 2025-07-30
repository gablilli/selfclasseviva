# 🏠 Self-Hosting SysRegister

Self-hosting SysRegister on your own server can bypass the API restrictions that affect hosted versions.

## 🎯 Why Self-Hosting Works

| **Hosted Version** | **Self-Hosted** |
|-------------------|-----------------|
| ❌ Shared hosting IP | ✅ Your own IP address |
| ❌ WAF restrictions | ✅ Direct server access |
| ❌ Geographic blocking | ✅ Your location |
| ❌ Rate limiting | ✅ Dedicated resources |

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose installed
- Git installed

### 1. Clone the Repository
```
git clone github.com/gablilli/selfclasseviva.git 
cd selfclasseviva
```

### 2. Run the Setup Script
```
chmod +x deploy.sh
./deploy.sh
```

### 3. Access the App
Open http://localhost:3000 in your browser

## 🔧 Manual Setup

### Option 1: Docker Compose
\`\`\`bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
\`\`\`

### Option 2: Node.js Development
\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or build for production
npm run build
npm start
\`\`\`

### Option 3: Docker Only
```
docker build -t sysregister .
```

# Run container
docker run -p 3000:3000 sysregister
\`\`\`

## 🌐 Network Configuration

### Local Network Access
To access from other devices on your network:

1. Find your local IP:
   \`\`\`bash
   # Linux/Mac
   ip addr show | grep inet
   
   # Windows
   ipconfig
   \`\`\`

2. Access via: `http://YOUR_LOCAL_IP:3000`

### Port Configuration
Change the port in `docker-compose.yml`:
\`\`\`yaml
ports:
  - "8080:3000"  # Access via port 8080
\`\`\`

## 🔐 Environment Variables

Create `.env.local` file to pre-fill the credentials - this is optional
```
CLASSEVIVA_USERNAME=your_username
CLASSEVIVA_PASSWORD=your_password
```

# App settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
\`\`\`

## 🔄 Updates

\`\`\`bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
\`\`\`

## 🐛 Troubleshooting

### Port Already in Use
\`\`\`bash
# Check what's using port 3000
lsof -i :3000

# Use different port
docker run -p 8080:3000 sysregister
\`\`\`

### API Still Blocked
If the API is still blocked even when self-hosted:

1. **Try different server locations** (VPS in different countries)
2. **Use a VPN** on your server
3. **Check firewall settings**
4. **Try running on localhost first**

### Container Won't Start
\`\`\`bash
# Check logs
docker-compose logs sysregister

# Rebuild from scratch
docker-compose down
docker system prune -a
docker-compose up -d --build
\`\`\`

## 📊 Monitoring

### View Logs
\`\`\`bash
# All logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100 -f
\`\`\`

### Container Status
\`\`\`bash
docker-compose ps
\`\`\`

## 🔒 Security Considerations

### Reverse Proxy (Recommended)
Use Nginx or Traefik for HTTPS:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
