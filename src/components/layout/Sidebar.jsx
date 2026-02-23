import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const navItems = [
    { path: '/upload', label: 'Upload', icon: '📤' },
    { path: '/insights', label: 'Insights', icon: '💡' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/template-wizard', label: 'Templates', icon: '📋' },
    { path: '/firm-setup', label: 'Firm Setup', icon: '🏢' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
