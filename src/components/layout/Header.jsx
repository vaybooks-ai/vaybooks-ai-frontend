import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary-600">VayBooks AI</h1>
          <span className="text-sm text-gray-500">Retail Inventory AI CFO</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">{user?.fullName || user?.email}</span>
          <button
            onClick={logout}
            className="btn btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
