import { useAuth } from '../../context/AuthContext'
import FirmSelector from '../FirmSelector'

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
          <FirmSelector />
          <div className="flex items-center space-x-3 border-l border-gray-300 pl-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
