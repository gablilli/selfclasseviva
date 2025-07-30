"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { classeVivaAPI, type Subject } from "@/lib/classeviva-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, User, BookOpen } from "lucide-react"

export function Subjects() {
  const { user, token } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const subjectsData = await classeVivaAPI.getSubjects(token, user.usrId)
        setSubjects(subjectsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subjects")
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [token, user])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Subjects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
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
          <FileText className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Subjects</h2>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Subjects</h2>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No subjects available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects
            .sort((a, b) => a.order - b.order)
            .map((subject) => (
              <Card key={subject.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{subject.description}</span>
                  </CardTitle>
                  <CardDescription>
                    {subject.teachers.length} teacher{subject.teachers.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {subject.teachers.map((teacher) => (
                      <div key={teacher.teacherId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {teacher.teacherFirstName} {teacher.teacherLastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
