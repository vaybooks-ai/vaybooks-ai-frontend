import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [selectedFirm, setSelectedFirm] = useState(localStorage.getItem('selectedFirm'))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if token exists and is valid
    if (token) {
      // TODO: Validate token with backend
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [token])

  const selectFirm = (firmId) => {
    localStorage.setItem('selectedFirm', firmId)
    setSelectedFirm(firmId)
  }

  const clearFirm = () => {
    localStorage.removeItem('selectedFirm')
    setSelectedFirm(null)
  }

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const signup = async (email, password, fullName) => {
    try {
      const response = await authApi.signup(email, password, fullName)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('selectedFirm')
    setToken(null)
    setUser(null)
    setSelectedFirm(null)
    navigate('/login')
  }

  const value = {
    user,
    token,
    selectedFirm,
    loading,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
    selectFirm,
    clearFirm
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
