"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Download, CheckCircle, Zap, Globe, Shield } from "lucide-react"

export function SelfHostingInfo() {
  const handleDownloadInstructions = () => {
    const instructions = `# 🏠 SysRegister Self-Hosting Guide

## Quick Start
1. Install Docker & Docker Compose
2. Clone the repository
3. Run: chmod +x deploy.sh && ./deploy.sh
4. Open: http://localhost:3000

## Why Self-Hosting Works
✅ Your own server environment (like your Node.js script)
✅ No WAF restrictions from hosting providers
✅ Same network conditions as your working script
✅ Full control over configuration

## Commands
- Start: docker-compose up -d
- Stop: docker-compose down  
- Logs: docker-compose logs -f
- Update: git pull && docker-compose up -d --build

## Troubleshooting
- Try localhost first: npm run dev
- Check logs for API responses
- Ensure same network as your Node.js script
- Consider VPS in different location if needed

Your Node.js script works, so self-hosting should too! 🚀`

    const blob = new Blob([instructions], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sysregister-self-hosting-guide.md"
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-5 w-5 text-primary" />
          <span>Self-Hosting Solution</span>
        </CardTitle>
        <CardDescription>Run SysRegister on your own server to bypass API restrictions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong className="text-green-800 dark:text-green-200">Your Node.js script works!</strong>
            <br />
            Self-hosting this app should work the same way since it uses your server environment.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span>Benefits</span>
            </h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Same network as your script</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>No hosting restrictions</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Full API access</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Calendar export works</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span>Options</span>
            </h4>
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-start">
                🏠 Local machine (localhost)
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                ☁️ VPS (DigitalOcean, Linode)
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                🐳 Docker container
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                📱 Home server/NAS
              </Badge>
            </div>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Quick Test:</strong> Try running <code className="bg-muted px-1 rounded">npm run dev</code> locally
            first. If the API works on localhost, then self-hosting will definitely work!
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={handleDownloadInstructions} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Setup Guide
          </Button>
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
              <Server className="h-4 w-4 mr-2" />
              View Repository
            </a>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p className="font-medium">💡 Pro Tip</p>
          <p>
            Since your Node.js script works, running this on the same machine should bypass all API restrictions and
            give you the full web interface!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
