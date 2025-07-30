"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Server, Shield, Smartphone, CheckCircle, Play } from "lucide-react"

export function ApiInfo() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>Why Demo Mode?</span>
        </CardTitle>
        <CardDescription>Understanding the ClasseViva API limitations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>ClasseViva API Security:</strong> The API blocks web requests from browsers and most server
            environments due to strict security policies designed for mobile apps only.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <Server className="h-4 w-4 text-green-600" />
              <span>Your Node.js Script Works</span>
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Runs on local machine</li>
              <li>• Direct server-to-server requests</li>
              <li>• No browser security restrictions</li>
              <li>• Specific network environment</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span>Web App Challenges</span>
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Hosted server environment</li>
              <li>• WAF/Security blocking</li>
              <li>• Geographic restrictions</li>
              <li>• Rate limiting policies</li>
            </ul>
          </div>
        </div>

        <Alert className="border-primary/20 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-primary">Demo Mode = Full Experience</p>
              <p className="text-sm">
                Our demo includes realistic Italian student data with all features: grades, agenda, lessons, absences,
                notices, and subjects. It's identical to the real app experience!
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            <Play className="h-3 w-3 mr-1" />
            Demo credentials: demo/demo or student/password
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
