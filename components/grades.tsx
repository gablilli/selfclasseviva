"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { classeVivaAPI, type Grade } from "@/lib/classeviva-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react"

export function Grades() {
  const { user, token } = useAuth()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrades = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const gradesData = await classeVivaAPI.getGrades(token, user.usrId)
        setGrades(gradesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load grades")
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [token, user])

  const getGradeColor = (value: number) => {
    if (value >= 8) return "text-green-600 bg-green-50"
    if (value >= 6) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getGradeTrend = (value: number) => {
    if (value >= 8) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (value >= 6) return <Minus className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const groupedGrades = grades.reduce(
    (acc, grade) => {
      if (!acc[grade.subjectDesc]) {
        acc[grade.subjectDesc] = []
      }
      acc[grade.subjectDesc].push(grade)
      return acc
    },
    {} as Record<string, Grade[]>,
  )

  const calculateAverage = (subjectGrades: Grade[]) => {
    const validGrades = subjectGrades.filter((g) => !g.canceled && g.decimalValue > 0)
    if (validGrades.length === 0) return 0
    const sum = validGrades.reduce((acc, grade) => acc + grade.decimalValue, 0)
    return sum / validGrades.length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Grades</h2>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-12 w-16" />
                  ))}
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
          <BookOpen className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Grades</h2>
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
        <BookOpen className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Grades</h2>
      </div>

      {Object.keys(groupedGrades).length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No grades available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(groupedGrades).map(([subject, subjectGrades]) => {
            const average = calculateAverage(subjectGrades)
            return (
              <Card key={subject}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{subject}</CardTitle>
                      <CardDescription>
                        {subjectGrades.length} grade{subjectGrades.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                    {average > 0 && (
                      <div className="flex items-center space-x-2">
                        {getGradeTrend(average)}
                        <Badge variant="outline" className={getGradeColor(average)}>
                          Avg: {average.toFixed(1)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {subjectGrades
                      .sort((a, b) => new Date(b.evtDate).getTime() - new Date(a.evtDate).getTime())
                      .map((grade) => (
                        <div
                          key={grade.evtId}
                          className={`p-3 rounded-lg border ${getGradeColor(grade.decimalValue)} ${
                            grade.canceled ? "opacity-50 line-through" : ""
                          }`}
                        >
                          <div className="font-bold text-lg">{grade.displayValue}</div>
                          <div className="text-xs opacity-75">{new Date(grade.evtDate).toLocaleDateString()}</div>
                          {grade.notesForFamily && (
                            <div className="text-xs mt-1 max-w-32 truncate" title={grade.notesForFamily}>
                              {grade.notesForFamily}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
