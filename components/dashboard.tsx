"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { classeVivaAPI } from "@/lib/classeviva-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Calendar, User, Bell, GraduationCap, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalGrades: number
  averageGrade: number
  totalAbsences: number
  upcomingEvents: number
  todayLessons: number
}

export function Dashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user) return

      try {
        setLoading(true)

        // Fetch all data in parallel
        const [grades, absences, lessons] = await Promise.allSettled([
          classeVivaAPI.getGrades(token, user.usrId),
          classeVivaAPI.getAbsences(token, user.usrId),
          classeVivaAPI.getLessonsToday(token, user.usrId),
        ])

        const gradesData = grades.status === "fulfilled" ? grades.value : []
        const absencesData = absences.status === "fulfilled" ? absences.value : []
        const lessonsData = lessons.status === "fulfilled" ? lessons.value : []

        // Calculate average grade
        const validGrades = gradesData.filter((g) => !g.canceled && g.decimalValue > 0)
        const averageGrade =
          validGrades.length > 0
            ? validGrades.reduce((sum, grade) => sum + grade.decimalValue, 0) / validGrades.length
            : 0

        setStats({
          totalGrades: gradesData.length,
          averageGrade,
          totalAbsences: absencesData.length,
          upcomingEvents: 0, // Would need agenda data
          todayLessons: lessonsData.length,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token, user])

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h2>
        <p className="text-gray-600">Here's your ClasseViva overview for today.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalGrades || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">All subjects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.averageGrade ? stats.averageGrade.toFixed(1) : "--"}</div>
            )}
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Lessons</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.todayLessons || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Scheduled today</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absences</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalAbsences || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access your most used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">View Grades</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Check Agenda</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Today's Lessons</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
              <Bell className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Notices</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
