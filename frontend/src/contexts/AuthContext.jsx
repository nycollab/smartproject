import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const persist = (data) => {
    const u = { user_id: data.user_id, name: data.name, email: data.email }
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', data.token)
  }

  const login = async (email, password) => {
    const data = await api.login(email, password)
    persist(data)
    return data
  }

  const register = async (name, email, password, phone) => {
    const data = await api.register(name, email, password, phone)
    persist(data)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
