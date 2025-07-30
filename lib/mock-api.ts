import type {
  LoginCredentials,
  LoginResponse,
  Grade,
  Absence,
  AgendaEvent,
  Lesson,
  Notice,
  Subject,
} from "./classeviva-api"
import {
  mockLoginResponse,
  mockGrades,
  mockAbsences,
  mockAgendaEvents,
  mockLessons,
  mockNotices,
  mockSubjects,
} from "./mock-data"

class MockClasseVivaAPI {
  private delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.delay(1500) // Simulate network delay

    // Simple validation for demo
    if (credentials.uid === "demo" && credentials.pass === "demo") {
      console.log("Mock login successful!")
      return mockLoginResponse
    }

    if (credentials.uid === "student" && credentials.pass === "password") {
      return {
        ...mockLoginResponse,
        ident: {
          ...mockLoginResponse.ident,
          firstName: "Giulia",
          lastName: "Bianchi",
        },
      }
    }

    throw new Error("Invalid demo credentials. Use 'demo/demo' or 'student/password'")
  }

  async getAuthStatus(token: string): Promise<any> {
    await this.delay(500)
    return { status: "valid", user: mockLoginResponse.ident }
  }

  async getAvatar(token: string): Promise<string> {
    await this.delay(300)
    return "/placeholder.svg?height=40&width=40&text=👤"
  }

  async getGrades(token: string, studentId: number): Promise<Grade[]> {
    await this.delay(800)
    return mockGrades
  }

  async getAbsences(token: string, studentId: number): Promise<Absence[]> {
    await this.delay(600)
    return mockAbsences
  }

  async getAgenda(token: string, studentId: number, begin: string, end: string): Promise<AgendaEvent[]> {
    await this.delay(700)
    return mockAgendaEvents
  }

  async getLessonsToday(token: string, studentId: number): Promise<Lesson[]> {
    await this.delay(500)
    return mockLessons
  }

  async getLessons(token: string, studentId: number, start: string, end: string): Promise<Lesson[]> {
    await this.delay(600)
    return mockLessons
  }

  async getNotices(token: string, studentId: number): Promise<Notice[]> {
    await this.delay(900)
    return mockNotices
  }

  async getSubjects(token: string, studentId: number): Promise<Subject[]> {
    await this.delay(400)
    return mockSubjects
  }

  async getPeriods(token: string, studentId: number): Promise<any[]> {
    await this.delay(300)
    return [
      { id: 1, description: "Primo Quadrimestre", start: "2024-09-01", end: "2024-01-31" },
      { id: 2, description: "Secondo Quadrimestre", start: "2024-02-01", end: "2024-06-30" },
    ]
  }
}

export const mockClasseVivaAPI = new MockClasseVivaAPI()
