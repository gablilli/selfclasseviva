"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { classeVivaAPI, type Lesson } from "@/lib/classeviva-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Clock, User, BookOpen, Calendar } from "lucide-react"

export function Lessons() {
  const { user, token } = useAuth()
  const [todayLessons, setTodayLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLessons = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const lessonsData = await classeVivaAPI.getLessonsToday(token, user.usrId)
        setTodayLessons(lessonsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lessons")
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [token, user])

  const formatTime = (hour: number, duration: number) => {
    const startHour = Math.floor(hour)
    const startMinute = (hour % 1) * 60
    const endTime = hour + duration
    const endHour = Math.floor(endTime)
    const endMinute = (endTime % 1) * 60

    const formatTimeString = (h: number, m: number) => {
      return `${h.toString().padStart(2, "0")}:${Math.round(m).toString().padStart(2, "0")}`
    }

    return `${formatTimeString(startHour, startMinute)} - ${formatTimeString(endHour, endMinute)}`
  }

  const getLessonTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "lezione":
        return "bg-blue-100 text-blue-800"
      case "verifica":
        return "bg-red-100 text-red-800"
      case "interrogazione":
        return "bg-orange-100 text-orange-800"
      case "laboratorio":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Today's Lessons</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Today's Lessons</h2>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Today's Lessons</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {todayLessons.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No lessons scheduled for today</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {todayLessons
            .sort((a, b) => a.evtHPos - b.evtHPos)
            .map((lesson) => (
              <Card key={lesson.evtId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>{lesson.subjectDesc}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(lesson.evtHPos, lesson.evtDuration)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{lesson.authorName}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={getLessonTypeColor(lesson.lessonType)}>{lesson.lessonType}</Badge>
                  </div>
                </CardHeader>
                {lesson.lessonArg && (
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Lesson Topic:</h4>
                      <p className="text-sm text-gray-600">{lesson.lessonArg}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
