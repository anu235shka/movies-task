import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error)
    } else if (error.request) {
      error.message = 'Network error... Please check if the backend server is running or not.'
      return Promise.reject(error)
    } else {
      error.message = error.message || 'An unexpected error occurred..'
      return Promise.reject(error)
    }
  }
)

export const signup = (email: string, password: string, name?: string) =>
  API.post('/auth/signup', { email, password, name })

export const verifyOtp = (email: string, otp: string) =>
  API.post('/auth/verify-otp', { email, otp })

export const login = (email: string, password: string) =>
  API.post('/auth/login', { email, password })
