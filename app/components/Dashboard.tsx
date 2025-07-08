'use client'

import { useEffect, useState } from 'react'
import DesktopSidebar from './DesktopSidebar'
import AIBeastDashboard from './AIBeastDashboard'
import Projects from './Projects'
import Files from './Files'
import AIChat from './AIChat'
import Tasks from './Tasks'

interface DashboardProps {
  user: any
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState('overview')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if running in Electron
    setIsDesktop(!!(window as any).electronAPI)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch('/api/dashboard/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <AIBeastDashboard data={dashboardData} onRefresh={fetchDashboardData} />
      case 'projects':
        return <Projects />
      case 'files':
        return <Files />
      case 'ai-chat':
        return <AIChat user={user} />
      case 'tasks':
        return <Tasks />
      default:
        return <AIBeastDashboard data={dashboardData} onRefresh={fetchDashboardData} />
    }
  }

  const getViewTitle = () => {
    if (isDesktop) {
      return 'TD Studios AI Beast - Tyler\'s Empire Manager'
    }
    
    switch (activeView) {
      case 'overview':
        return 'Dashboard Overview'
      case 'projects':
        return 'Projects'
      case 'files':
        return 'File Manager'
      case 'ai-chat':
        return 'AI Assistant'
      case 'tasks':
        return 'Tasks'
      default:
        return 'TD Studios Portal'
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DesktopSidebar
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={onLogout}
      />
      
      <div className="notion-main">
        <div className="notion-header">
          <h1 className="text-xl font-semibold text-gray-900">
            {getViewTitle()}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            {isDesktop && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">AI Beast Active</span>
              </div>
            )}
            <span className="text-sm text-gray-500">
              Welcome back, {user.name}
            </span>
            <button
              onClick={onLogout}
              className="btn-ghost text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="notion-content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
} 