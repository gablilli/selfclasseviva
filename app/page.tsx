"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"
import { Dashboard } from "@/components/dashboard"
import { Grades } from "@/components/grades"
import { Agenda } from "@/components/agenda"
import { Lessons } from "@/components/lessons"
import { Absences } from "@/components/absences"
import { Notices } from "@/components/notices"
import { Subjects } from "@/components/subjects"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState("dashboard")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />
      case "grades":
        return <Grades />
      case "agenda":
        return <Agenda />
      case "lessons":
        return <Lessons />
      case "absences":
        return <Absences />
      case "notices":
        return <Notices />
      case "subjects":
        return <Subjects />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderCurrentView()}</main>
    </div>
  )
}
