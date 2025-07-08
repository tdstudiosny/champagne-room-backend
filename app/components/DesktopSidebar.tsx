'use client'

import { useState, useEffect } from 'react'

interface DesktopSidebarProps {
  user: any
  activeView: string
  onViewChange: (view: string) => void
  onLogout: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: string
  window?: string | null
}

declare global {
  interface Window {
    electronAPI?: any
  }
}

export default function DesktopSidebar({ user, activeView, onViewChange, onLogout }: DesktopSidebarProps) {
  const [autonomousActive, setAutonomousActive] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if running in Electron
    setIsDesktop(!!window.electronAPI)
  }, [])

  const desktopMenuItems: MenuItem[] = [
    { id: 'overview', label: 'Dashboard', icon: '📊', window: null },
    { id: 'clone-studio', label: 'Clone Studio', icon: '🔄', window: 'clone-studio' },
    { id: 'bot-army', label: 'Bot Army', icon: '🤖', window: 'bot-army' },
    { id: 'market-scanner', label: 'Market Scanner', icon: '📈', window: 'market-scanner' },
    { id: 'ai-brain', label: 'AI Brain', icon: '🧠', window: 'ai-brain' },
    { id: 'wealth-tracker', label: 'Wealth Tracker', icon: '💰', window: 'wealth-tracker' }
  ]

  const webMenuItems: MenuItem[] = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'files', label: 'Files', icon: '📁' },
    { id: 'ai-chat', label: 'AI Assistant', icon: '🤖' },
  ]

  const menuItems = isDesktop ? desktopMenuItems : webMenuItems

  const handleMenuClick = async (item: MenuItem) => {
    if (isDesktop && item.window) {
      // Open new window for desktop app
      await window.electronAPI?.openWindow(item.window)
    } else {
      // Change view in web app
      onViewChange(item.id)
    }
  }

  const toggleAutonomous = async () => {
    if (isDesktop) {
      if (autonomousActive) {
        await window.electronAPI?.stopAutonomous()
      } else {
        await window.electronAPI?.startAutonomous()
      }
      setAutonomousActive(!autonomousActive)
    }
  }

  return (
    <div className="notion-sidebar bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">
              {isDesktop ? 'AI Beast Desktop' : user.role}
            </div>
          </div>
        </div>
      </div>

      {/* AI Beast Status (Desktop Only) */}
      {isDesktop && (
        <div className="p-3 border-b border-gray-200 bg-black text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${autonomousActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs font-medium">
                {autonomousActive ? 'AUTONOMOUS ACTIVE' : 'MANUAL MODE'}
              </span>
            </div>
            <button
              onClick={toggleAutonomous}
              className="text-xs px-2 py-1 bg-white text-black rounded hover:bg-gray-200"
            >
              {autonomousActive ? 'STOP' : 'START'}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                activeView === item.id
                  ? 'bg-gray-200 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isDesktop && item.window && (
                <span className="ml-auto text-xs text-gray-400">↗</span>
              )}
            </button>
          ))}
        </div>

        {/* AI Beast Actions (Desktop Only) */}
        {isDesktop && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 px-3">
              AI Beast Actions
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => window.electronAPI?.openWindow('clone-studio')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <span>🔄</span>
                Clone Website
              </button>
              <button 
                onClick={() => window.electronAPI?.openWindow('bot-army')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <span>🤖</span>
                Create Bot
              </button>
              <button 
                onClick={() => window.electronAPI?.scanMarkets()}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <span>📈</span>
                Scan Markets
              </button>
              <button 
                onClick={() => window.electronAPI?.openWindow('wealth-tracker')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
              >
                <span>💰</span>
                Track Wealth
              </button>
            </div>
          </div>
        )}

        {/* Regular Quick Actions (Web) */}
        {!isDesktop && (
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
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div className="font-medium">
            {isDesktop ? 'TD Studios AI Beast' : 'TD Studios Portal'}
          </div>
          <div className="mt-1">v{isDesktop ? '1.0.0' : '0.1.0'}</div>
          {isDesktop && (
            <div className="mt-2 text-green-600 font-medium">
              🤖 AI BEAST MODE
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 