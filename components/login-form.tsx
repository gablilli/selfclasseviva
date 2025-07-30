"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2, School, AlertCircle, Play } from "lucide-react"

export function LoginForm() {
  const [credentials, setCredentials] = useState({
    uid: "",
    pass: "",
  })
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!credentials.uid || !credentials.pass) {
      setError("Please fill in all fields")
      return
    }

    try {
      console.log("Starting login process...")
      await login(credentials)
    } catch (error) {
      console.error("Login error:", error)
      if (error instanceof Error) {
        const errorMessage = error.message
        setError(errorMessage)
      } else {
        setError("An unexpected error occurred during login")
      }
    }
  }

  const handleDemoLogin = (demoType: "demo" | "student") => {
    if (demoType === "demo") {
      setCredentials({ uid: "demo", pass: "demo" })
    } else {
      setCredentials({ uid: "student", pass: "password" })
    }
    setError(null)
  }

  const handleInputChange = (field: "uid" | "pass") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    if (error) {
      setError(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <School className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">SysRegister</CardTitle>
          <CardDescription>ClasseViva Frontend with Modern UI</CardDescription>
          <div className="flex gap-2 justify-center">
            <Badge variant="outline">Dark Mode</Badge>
            <Badge variant="secondary">
              <Play className="h-3 w-3 mr-1" />
              Demo Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Demo Section */}
          <Alert className="mb-4 border-primary/20 bg-primary/5">
            <Play className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium text-primary">🎯 Try Demo Mode</p>
                <p className="text-sm">Full functionality with realistic data to test the interface.</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => handleDemoLogin("demo")}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Demo User
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin("student")}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Student Demo
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="uid">ClasseViva Username</Label>
              <Input
                id="uid"
                type="text"
                placeholder="Your ClasseViva username"
                value={credentials.uid}
                onChange={handleInputChange("uid")}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass">ClasseViva Password</Label>
              <Input
                id="pass"
                type="password"
                placeholder="Your ClasseViva password"
                value={credentials.pass}
                onChange={handleInputChange("pass")}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Enter your ClasseViva credentials or try demo mode</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
