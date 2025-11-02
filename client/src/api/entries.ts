import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
})

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export type Entry = {
  id?: number
  title: string
  type: 'MOVIE' | 'TV_SHOW'
  director?: string
  budget?: number
  location?: string
  duration?: string
  yearOrTime?: string
  posterUrl?: string
  createdAt?: string
}

export const fetchEntries = (page = 1, limit = 20) =>
  API.get(`/entries?page=${page}&limit=${limit}`).then(res => res.data)

export const createEntry = (payload: Entry) =>
  API.post('/entries', payload).then(res => res.data)

export const updateEntry = (id: number, payload: Partial<Entry>) =>
  API.put(`/entries/${id}`, payload).then(res => res.data)

export const deleteEntry = (id: number) =>
  API.delete(`/entries/${id}`).then(res => res.data)
