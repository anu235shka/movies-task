import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as loginAPI, signup as signupAPI, verifyOtp as verifyOtpAPI } from '../api/auth'

interface User {
  id: number
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await loginAPI(email, password)
      setUser(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed'
      throw new Error(message)
    }
  }

  const signup = async (email: string, password: string, name?: string) => {
    try {
      await signupAPI(email, password, name)
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Signup failed'
      throw new Error(message)
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await verifyOtpAPI(email, otp)
      setUser(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || 'OTP verification failed'
      throw new Error(message)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
