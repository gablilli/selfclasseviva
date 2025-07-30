"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { classeVivaAPI, type LoginCredentials, type LoginResponse } from "@/lib/classeviva-api"

interface User {
  id: number
  firstName: string
  lastName: string
  usrType: string
  usrId: number
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored authentication on mount
    const storedToken = localStorage.getItem("classeviva_token")
    const storedUser = localStorage.getItem("classeviva_user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))

      // Verify token is still valid
      classeVivaAPI.getAuthStatus(storedToken).catch(() => {
        // Token is invalid, clear storage
        localStorage.removeItem("classeviva_token")
        localStorage.removeItem("classeviva_user")
        setToken(null)
        setUser(null)
      })
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response: LoginResponse = await classeVivaAPI.login(credentials)

      const userData: User = {
        id: response.ident.id,
        firstName: response.ident.firstName,
        lastName: response.ident.lastName,
        usrType: response.ident.usrType,
        usrId: response.ident.usrId,
      }

      // Try to get avatar
      try {
        const avatarUrl = await classeVivaAPI.getAvatar(response.token)
        userData.avatar = avatarUrl
      } catch (error) {
        console.warn("Failed to load avatar:", error)
      }

      setToken(response.token)
      setUser(userData)

      // Store in localStorage
      localStorage.setItem("classeviva_token", response.token)
      localStorage.setItem("classeviva_user", JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("classeviva_token")
    localStorage.removeItem("classeviva_user")
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
