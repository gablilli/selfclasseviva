"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { classeVivaAPI, type Absence } from "@/lib/classeviva-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, CheckCircle, XCircle, Clock } from "lucide-react"

export function Absences() {
  const { user, token } = useAuth()
  const [absences, setAbsences] = useState<Absence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAbsences = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const absencesData = await classeVivaAPI.getAbsences(token, user.usrId)
        setAbsences(absencesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load absences")
      } finally {
        setLoading(false)
      }
    }

    fetchAbsences()
  }, [token, user])

  const getAbsenceTypeColor = (evtCode: string) => {
    switch (evtCode) {
      case "A":
        return "bg-red-100 text-red-800"
      case "R":
        return "bg-yellow-100 text-yellow-800"
      case "U":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAbsenceTypeLabel = (evtCode: string) => {
    switch (evtCode) {
      case "A":
        return "Absence"
      case "R":
        return "Late"
      case "U":
        return "Early Exit"
      default:
        return evtCode
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStats = () => {
    const total = absences.length
    const justified = absences.filter((a) => a.isJustified).length
    const unjustified = total - justified

    return { total, justified, unjustified }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Absences</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32 mt-1" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
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
          <User className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Absences</h2>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <User className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Absences</h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Absences</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Justified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.justified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unjustified</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unjustified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Absences List */}
      {absences.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
            <p className="text-muted-foreground">No absences recorded</p>
            <p className="text-sm text-muted-foreground mt-1">Keep up the good attendance!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {absences
            .sort((a, b) => new Date(b.evtDate).getTime() - new Date(a.evtDate).getTime())
            .map((absence) => (
              <Card key={absence.evtId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{formatDate(absence.evtDate)}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>Hour {absence.evtHPos}</span>
                        {absence.evtValue && (
                          <>
                            <span>•</span>
                            <span>{absence.evtValue}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getAbsenceTypeColor(absence.evtCode)}>
                        {getAbsenceTypeLabel(absence.evtCode)}
                      </Badge>
                      {absence.isJustified ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Justified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          <XCircle className="h-3 w-3 mr-1" />
                          Unjustified
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {absence.justifReasonDesc && (
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Justification:</h4>
                      <p className="text-sm text-gray-600">{absence.justifReasonDesc}</p>
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
