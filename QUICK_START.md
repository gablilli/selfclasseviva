# 🚀 SysRegister Quick Start Guide

## 🎯 The Problem We're Solving

Your Node.js script works locally but the hosted version gets blocked by ClasseViva's WAF. **Self-hosting is the solution!**

## ⚡ Quick Start (Recommended)

### Development Mode (Recommended)
\`\`\`bash
chmod +x run-dev.sh
./run-dev.sh
\`\`\`

Or manually:
\`\`\`bash
npm install
npm run dev
\`\`\`

### Production Mode
\`\`\`bash
chmod +x run-local.sh
./run-local.sh
\`\`\`

### Docker
\`\`\`bash
docker compose up -d --build
\`\`\`

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized deployment)

## 🔧 Manual Setup

If the scripts don't work, here's the manual process:

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Create environment file (optional)
cp .env.example .env.local

# 3. Start development server
npm run dev

# OR build for production
npm run build
npm start
\`\`\`

## 🌐 Access the Application

Once running, open your browser and go to:
- **Development**: http://localhost:3000
- **Production**: http://localhost:3000
- **Docker**: http://localhost:3000

## 🔑 Login Options

### Real ClasseViva Account
1. Use your actual ClasseViva username and password
2. If it works → You have real data access! 🎉
3. If it fails → The API is still blocked, use demo mode

### Demo Mode
- Click "Try Demo Mode" to test the interface
- Uses realistic mock data
- Perfect for testing features

## 🐳 Docker Deployment

### Fixed Docker Setup
The Docker configuration has been updated to work properly:

\`\`\`bash
# Build and run
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down

# Restart
docker compose restart
\`\`\`

### Docker Troubleshooting
If Docker still fails:
1. Use the simple development server instead: `./run-dev.sh`
2. Check Docker logs: `docker compose logs -f sysregister`
3. Try rebuilding: `docker compose down && docker compose up -d --build`

## 🔍 Troubleshooting

### Common Issues

**"Node.js not found"**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)

**"Permission denied"**
\`\`\`bash
chmod +x run-dev.sh
chmod +x run-local.sh
\`\`\`

**"Port 3000 already in use"**
- Stop other applications using port 3000
- Or change the port in package.json

**"ClasseViva login fails"**
- Try demo mode first to test the interface
- Check if your Node.js script still works
- Consider VPN if you're in a restricted network

### API Access Issues

If ClasseViva API is still blocked:
1. **Use demo mode** to test the interface
2. **Try different networks** (mobile hotspot, VPN)
3. **Check your working Node.js script** from the same machine
4. **Consider different hosting locations**

## 🎯 Why Self-Hosting Works

| **Hosted Version** | **Self-Hosted** |
|-------------------|-----------------|
| ❌ WAF blocks requests | ✅ Your own environment |
| ❌ Shared IP restrictions | ✅ Your IP address |
| ❌ Hosting provider limits | ✅ Full control |
| ❌ Geographic restrictions | ✅ Your location |

## 📱 Features

- **📊 Grades**: View all your grades and averages
- **📅 Agenda**: See homework and assignments
- **📚 Lessons**: Track your class schedule
- **⏰ Absences**: Monitor attendance
- **📢 Notices**: Read school announcements
- **📖 Subjects**: Manage your courses
- **📥 Calendar Export**: Download ICS files
- **🌙 Dark Mode**: Eye-friendly interface

## 🔄 Updates

To update the application:
\`\`\`bash
git pull
npm install
npm run build
\`\`\`

For Docker:
\`\`\`bash
git pull
docker compose up -d --build
\`\`\`

## 🆘 Need Help?

1. **Check the logs** for error messages
2. **Try demo mode** to verify the app works
3. **Test your Node.js script** from the same machine
4. **Use development mode** for better error messages: `./run-dev.sh`

## 🎉 Success Indicators

✅ **App loads** → Basic setup works  
✅ **Demo mode works** → Interface is functional  
✅ **Real login works** → API access successful  
✅ **Data displays** → Full functionality achieved  

---

**Remember**: If your Node.js script works from this machine, the web app should work too! 🚀
