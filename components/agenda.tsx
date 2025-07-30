"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { classeVivaAPI, type AgendaEvent } from "@/lib/classeviva-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, ChevronLeft, ChevronRight, Clock, User, BookOpen } from "lucide-react"

export function Agenda() {
  const { user, token } = useAuth()
  const [events, setEvents] = useState<AgendaEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0].replace(/-/g, "")
  }

  const getWeekRange = (date: Date) => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
    start.setDate(diff)

    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return {
      start: formatDate(start),
      end: formatDate(end),
    }
  }

  useEffect(() => {
    const fetchAgenda = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const { start, end } = getWeekRange(currentDate)
        const agendaData = await classeVivaAPI.getAgenda(token, user.usrId, start, end)
        setEvents(agendaData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load agenda")
      } finally {
        setLoading(false)
      }
    }

    fetchAgenda()
  }, [token, user, currentDate])

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const groupEventsByDate = (events: AgendaEvent[]) => {
    return events.reduce(
      (acc, event) => {
        const date = event.evtStart.split(" ")[0]
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(event)
        return acc
      },
      {} as Record<string, AgendaEvent[]>,
    )
  }

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"))
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEventTypeColor = (evtCode: string) => {
    switch (evtCode) {
      case "AGNT":
        return "bg-blue-100 text-blue-800"
      case "AGHT":
        return "bg-green-100 text-green-800"
      case "AGVR":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Agenda</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
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
          <Calendar className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Agenda</h2>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const groupedEvents = groupEventsByDate(events)
  const { start, end } = getWeekRange(currentDate)
  const startDate = new Date(start.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"))
  const endDate = new Date(end.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Agenda</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-fit">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No events scheduled for this week</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedEvents)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, dayEvents]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg">{formatDisplayDate(date)}</CardTitle>
                  <CardDescription>
                    {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dayEvents
                      .sort((a, b) => a.evtStart.localeCompare(b.evtStart))
                      .map((event) => (
                        <div key={event.evtId} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <Badge className={getEventTypeColor(event.evtCode)}>{event.evtCode}</Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <BookOpen className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{event.subjectDesc}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {event.evtStart.split(" ")[1]} - {event.evtEnd.split(" ")[1]}
                              </span>
                              <User className="h-4 w-4 ml-2" />
                              <span>{event.authorName}</span>
                            </div>
                            {event.evtText && <p className="text-sm text-gray-700 mb-2">{event.evtText}</p>}
                            {event.homeworkText && (
                              <div className="text-sm">
                                <span className="font-medium text-orange-600">Homework: </span>
                                <span className="text-gray-700">{event.homeworkText}</span>
                              </div>
                            )}
                          </div>
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
