'use client'

interface SidebarProps {
  user: any
  activeView: string
  onViewChange: (view: string) => void
  onLogout: () => void
}

export default function Sidebar({ user, activeView, onViewChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'files', label: 'Files', icon: '📁' },
    { id: 'ai-chat', label: 'AI Assistant', icon: '🤖' },
  ]

  return (
    <div className="notion-sidebar">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeView === item.id
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 px-3">
            Quick Actions
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
              <span>📄</span>
              New Note
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
              <span>📤</span>
              Upload File
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
              <span>⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div>TD Studios Portal</div>
          <div className="mt-1">v1.0.0</div>
        </div>
      </div>
    </div>
  )
} 