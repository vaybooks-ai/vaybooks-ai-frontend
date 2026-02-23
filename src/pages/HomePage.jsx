import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { isAuthenticated, selectedFirm, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If authenticated but no firm selected, redirect to firm setup
  if (!selectedFirm) {
    return <Navigate to="/firm-setup" replace />
  }

  // If authenticated and firm selected, redirect to insights
  return <Navigate to="/insights" replace />
}

export default HomePage
