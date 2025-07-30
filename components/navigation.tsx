"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LogOut,
  BookOpen,
  Calendar,
  User,
  Bell,
  GraduationCap,
  FileText,
  Home,
  Menu,
  X,
  Play,
  Download,
} from "lucide-react"

interface NavigationProps {
  currentView: string
  onViewChange: (view: string) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, token, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  if (!user) return null

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getUserTypeLabel = (usrType: string) => {
    switch (usrType) {
      case "S":
        return "Student"
      case "G":
        return "Parent"
      case "D":
        return "Teacher"
      default:
        return usrType
    }
  }

  const isDemoMode = user.firstName === "Mario" || user.firstName === "Giulia"

  const handleExportCalendar = async () => {
    if (!token || !user) return

    setExporting(true)
    try {
      const response = await fetch("/api/export/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          studentId: user.usrId,
          months: 6, // Export 6 months of data
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "classeviva-agenda.ics"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Export failed:", await response.text())
      }
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setExporting(false)
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "grades", label: "Grades", icon: BookOpen },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "lessons", label: "Lessons", icon: GraduationCap },
    { id: "absences", label: "Absences", icon: User },
    { id: "notices", label: "Notices", icon: Bell },
    { id: "subjects", label: "Subjects", icon: FileText },
  ]

  return (
    <header className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-foreground">SysRegister</h1>
              {isDemoMode && (
                <Badge variant="default" className="text-xs bg-primary">
                  <Play className="h-3 w-3 mr-1" />
                  Demo Mode - Full Features
                </Badge>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewChange(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Export Calendar Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCalendar}
              disabled={exporting || isDemoMode}
              className="hidden sm:flex bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Exporting..." : "Export Calendar"}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" className="text-xs">
                        {getUserTypeLabel(user.usrType)}
                      </Badge>
                      {isDemoMode && (
                        <Badge variant="outline" className="text-xs">
                          Demo
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isDemoMode && (
                  <DropdownMenuItem onClick={handleExportCalendar} disabled={exporting}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Calendar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <nav className="py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onViewChange(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
