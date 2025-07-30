"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { classeVivaAPI, type Notice } from "@/lib/classeviva-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Calendar, Paperclip, Eye, EyeOff } from "lucide-react"

export function Notices() {
  const { user, token } = useAuth()
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotices = async () => {
      if (!token || !user) return

      try {
        setLoading(true)
        const noticesData = await classeVivaAPI.getNotices(token, user.usrId)
        setNotices(noticesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notices")
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [token, user])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "generale":
        return "bg-blue-100 text-blue-800"
      case "didattica":
        return "bg-green-100 text-green-800"
      case "amministrativa":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "attivo":
        return "bg-green-100 text-green-800"
      case "scaduto":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Notices</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
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
          <Bell className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Notices</h2>
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
        <Bell className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Notices</h2>
      </div>

      {notices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notices available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notices
            .sort((a, b) => new Date(b.pubDT).getTime() - new Date(a.pubDT).getTime())
            .map((notice) => (
              <Card key={notice.pubId} className={!notice.readStatus ? "border-l-4 border-l-blue-500" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {notice.readStatus ? (
                          <Eye className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-blue-600" />
                        )}
                        <span className={!notice.readStatus ? "font-bold" : ""}>{notice.cntTitle}</span>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(notice.pubDT)}</span>
                        </div>
                        {notice.cntHasAttach && (
                          <div className="flex items-center space-x-1">
                            <Paperclip className="h-4 w-4" />
                            <span>Has attachment</span>
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={getCategoryColor(notice.cntCategory)}>{notice.cntCategory}</Badge>
                      <Badge variant="outline" className={getStatusColor(notice.cntStatus)}>
                        {notice.cntStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {(notice.cntValidFrom || notice.cntValidTo) && (
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Valid Period:</h4>
                      <p className="text-sm text-gray-600">
                        {notice.cntValidFrom && `From: ${formatDate(notice.cntValidFrom)}`}
                        {notice.cntValidFrom && notice.cntValidTo && " • "}
                        {notice.cntValidTo && `To: ${formatDate(notice.cntValidTo)}`}
                      </p>
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
