import { mockClasseVivaAPI } from "./mock-api"

interface LoginCredentials {
  uid: string
  pass: string
}

interface LoginResponse {
  token: string
  release: string
  expire: string
  ident: {
    id: number
    firstName: string
    lastName: string
    usrType: string
    usrId: number
  }
}

interface Grade {
  subjectId: number
  subjectCode: string
  subjectDesc: string
  evtId: number
  evtCode: string
  evtDate: string
  decimalValue: number
  displayValue: string
  displaPos: number
  notesForFamily: string
  color: string
  canceled: boolean
  underlined: boolean
  periodPos: number
  periodDesc: string
  componentPos: number
  componentDesc: string
  weightFactor: number
  skillId: number
  gradeMasterId: number
}

interface Absence {
  evtId: number
  evtCode: string
  evtDate: string
  evtHPos: number
  evtValue: string
  isJustified: boolean
  justifReasonCode: string
  justifReasonDesc: string
}

interface AgendaEvent {
  evtId: number
  evtStart: string
  evtEnd: string
  evtCode: string
  evtDatetimeBegin: string
  evtDatetimeEnd: string
  classDesc: string
  authorName: string
  subjectId: number
  subjectCode: string
  subjectDesc: string
  evtText: string
  homeworkText?: string
}

interface Lesson {
  evtId: number
  evtDate: string
  evtHPos: number
  evtDuration: number
  classDesc: string
  authorName: string
  subjectId: number
  subjectCode: string
  subjectDesc: string
  lessonType: string
  lessonArg: string
}

interface Notice {
  pubId: number
  pubDT: string
  readStatus: boolean
  evtCode: string
  cntValidFrom: string
  cntValidTo: string
  cntValidInRange: boolean
  cntStatus: string
  cntTitle: string
  cntCategory: string
  cntHasChanged: boolean
  cntHasAttach: boolean
  needJoin: boolean
  needReply: boolean
  needFile: boolean
  evento_id: number
}

interface Subject {
  id: number
  description: string
  order: number
  teachers: Array<{
    teacherId: number
    teacherName: string
    teacherFirstName: string
    teacherLastName: string
  }>
}

class ClasseVivaAPI {
  private useMockData = false

  private async tryRealAPI<T>(realAPICall: () => Promise<T>, mockAPICall: () => Promise<T>): Promise<T> {
    if (this.useMockData) {
      return mockAPICall()
    }

    try {
      return await realAPICall()
    } catch (error) {
      console.log("Real API failed, falling back to mock data:", error)
      this.useMockData = true
      return mockAPICall()
    }
  }

  private async makeAuthenticatedRequest(token: string, path: string, method: "GET" | "POST" = "GET", body?: any) {
    const url = new URL("/api/classeviva", window.location.origin)
    url.searchParams.set("path", path)

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    }

    if (method === "POST" && body) {
      headers["Content-Type"] = "application/json"
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = "Request failed"
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.details || errorData.error || errorMessage
      } catch {
        errorMessage = errorText || `HTTP ${response.status}`
      }
      throw new Error(errorMessage)
    }

    return response.json()
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log("Starting login attempt...")

    // Check if user is trying demo credentials
    if (credentials.uid === "demo" || credentials.uid === "student") {
      console.log("Demo credentials detected, using mock API")
      this.useMockData = true
      return mockClasseVivaAPI.login(credentials)
    }

    // Try real API
    try {
      console.log("Trying real ClasseViva API...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const responseData = await response.json()
      console.log("Real API response:", response.status, responseData)

      if (response.ok && !responseData.error) {
        console.log("Real API login successful!")
        return responseData as LoginResponse
      } else {
        // Handle different types of API responses
        if (responseData.isBlocked || responseData.error === "API Access Blocked") {
          throw new Error(
            "🚫 ClasseViva API is blocking requests from this server.\n\n" +
              "This could be due to geographic restrictions or security policies.\n\n" +
              "📱 Try DEMO MODE to see how the app works:\n" +
              "• Username: 'demo' Password: 'demo'\n" +
              "• Username: 'student' Password: 'password'\n\n" +
              "The demo includes realistic data and all features!",
          )
        } else {
          throw new Error(responseData.details || responseData.error || "Login failed")
        }
      }
    } catch (error) {
      console.log("Real API failed:", error)

      // If it's our custom blocking error, re-throw it
      if (error instanceof Error && error.message.includes("blocking requests")) {
        throw error
      }

      // For other errors, suggest demo mode
      throw new Error(
        "🔌 Unable to connect to ClasseViva API.\n\n" +
          "This could be due to:\n" +
          "• Network connectivity issues\n" +
          "• Server-side blocking\n" +
          "• API maintenance\n\n" +
          "📱 Try DEMO MODE instead:\n" +
          "Username: 'demo' | Password: 'demo'",
      )
    }
  }

  async getAuthStatus(token: string): Promise<any> {
    return this.tryRealAPI(
      () => this.makeAuthenticatedRequest(token, "auth/status"),
      () => mockClasseVivaAPI.getAuthStatus(token),
    )
  }

  async getAvatar(token: string): Promise<string> {
    return this.tryRealAPI(
      async () => {
        const url = new URL("/api/classeviva", window.location.origin)
        url.searchParams.set("path", "auth/avatar")

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to get avatar")
        }

        const blob = await response.blob()
        return URL.createObjectURL(blob)
      },
      () => mockClasseVivaAPI.getAvatar(token),
    )
  }

  async getGrades(token: string, studentId: number): Promise<Grade[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/grades`)
        return data.grades || []
      },
      () => mockClasseVivaAPI.getGrades(token, studentId),
    )
  }

  async getAbsences(token: string, studentId: number): Promise<Absence[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/absences/details`)
        return data.events || []
      },
      () => mockClasseVivaAPI.getAbsences(token, studentId),
    )
  }

  async getAgenda(token: string, studentId: number, begin: string, end: string): Promise<AgendaEvent[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/agenda/all/${begin}/${end}`)
        return data.agenda || []
      },
      () => mockClasseVivaAPI.getAgenda(token, studentId, begin, end),
    )
  }

  async getLessonsToday(token: string, studentId: number): Promise<Lesson[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/lessons/today`)
        return data.lessons || []
      },
      () => mockClasseVivaAPI.getLessonsToday(token, studentId),
    )
  }

  async getLessons(token: string, studentId: number, start: string, end: string): Promise<Lesson[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/lessons/${start}/${end}`)
        return data.lessons || []
      },
      () => mockClasseVivaAPI.getLessons(token, studentId, start, end),
    )
  }

  async getNotices(token: string, studentId: number): Promise<Notice[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/noticeboard`)
        return data.items || []
      },
      () => mockClasseVivaAPI.getNotices(token, studentId),
    )
  }

  async getSubjects(token: string, studentId: number): Promise<Subject[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/subjects`)
        return data.subjects || []
      },
      () => mockClasseVivaAPI.getSubjects(token, studentId),
    )
  }

  async getPeriods(token: string, studentId: number): Promise<any[]> {
    return this.tryRealAPI(
      async () => {
        const data = await this.makeAuthenticatedRequest(token, `students/${studentId}/periods`)
        return data.periods || []
      },
      () => mockClasseVivaAPI.getPeriods(token, studentId),
    )
  }
}

export const classeVivaAPI = new ClasseVivaAPI()
export type { LoginCredentials, LoginResponse, Grade, Absence, AgendaEvent, Lesson, Notice, Subject }
