'use client'

import { useEffect, useState } from 'react'

interface AIBeastDashboardProps {
  data: any
  onRefresh: () => void
}

declare global {
  interface Window {
    electronAPI?: any
  }
}

export default function AIBeastDashboard({ data, onRefresh }: AIBeastDashboardProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [autonomousStats, setAutonomousStats] = useState({
    opportunitiesFound: 0,
    sitesCloned: 0,
    botsCreated: 0,
    revenueGenerated: 0,
    tasksAutomated: 0,
    competitorsMonitored: 0
  })
  const [realtimeData, setRealtimeData] = useState({
    currentRevenue: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    yearRevenue: 0
  })

  useEffect(() => {
    setIsDesktop(!!window.electronAPI)
    
    if (window.electronAPI) {
      // Load autonomous stats
      loadAutonomousStats()
      
      // Set up real-time listeners
      window.electronAPI.onAutonomousUpdate((event: any, stats: any) => {
        setAutonomousStats(stats)
      })
      
      window.electronAPI.onRevenueUpdate((event: any, revenue: any) => {
        setRealtimeData(revenue)
      })
      
      window.electronAPI.onOpportunityFound((event: any, opportunity: any) => {
        console.log('🎯 New opportunity found:', opportunity)
        // Show notification or update UI
      })
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('autonomous-update')
        window.electronAPI.removeAllListeners('revenue-update')
        window.electronAPI.removeAllListeners('opportunity-found')
      }
    }
  }, [])

  const loadAutonomousStats = async () => {
    if (window.electronAPI) {
      try {
        // Load stats from electron store
        const stats = await window.electronAPI.getAutonomousStats()
        if (stats) {
          setAutonomousStats(stats)
        }
      } catch (error) {
        console.error('Failed to load autonomous stats:', error)
      }
    }
  }

  if (!data && !isDesktop) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {}

  return (
    <div className="space-y-6">
      {/* AI Beast Header */}
      {isDesktop && (
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">🚀 AI BEAST MODE ACTIVE</h2>
              <p className="text-gray-300">
                Your autonomous empire is working 24/7, Tyler. Sit back and watch the magic happen.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                ${realtimeData.todayRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300">Revenue Today</div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Welcome Message (Web) */}
      {!isDesktop && (
        <div className="bg-black text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Tyler!</h2>
          <p className="text-gray-300">
            Your TD Studios Portal is ready. Here's what's happening today.
          </p>
        </div>
      )}

      {/* AI Beast Stats (Desktop Only) */}
      {isDesktop && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{autonomousStats.opportunitiesFound}</div>
            <div className="text-sm opacity-90">Opportunities Found</div>
            <div className="text-xs mt-1">🎯 AI Detected</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{autonomousStats.sitesCloned}</div>
            <div className="text-sm opacity-90">Sites Cloned</div>
            <div className="text-xs mt-1">🔄 Auto Cloned</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{autonomousStats.botsCreated}</div>
            <div className="text-sm opacity-90">Bots Created</div>
            <div className="text-xs mt-1">🤖 Auto Generated</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">${autonomousStats.revenueGenerated.toLocaleString()}</div>
            <div className="text-sm opacity-90">AI Revenue</div>
            <div className="text-xs mt-1">💰 Auto Earned</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{autonomousStats.tasksAutomated}</div>
            <div className="text-sm opacity-90">Tasks Automated</div>
            <div className="text-xs mt-1">⚡ Auto Completed</div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{autonomousStats.competitorsMonitored}</div>
            <div className="text-sm opacity-90">Competitors Watched</div>
            <div className="text-xs mt-1">🕵️ Auto Monitored</div>
          </div>
        </div>
      )}

      {/* Revenue Tracking (Desktop Enhanced) */}
      {isDesktop && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">
                  ${realtimeData.todayRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${realtimeData.weekRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${realtimeData.monthRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl">💎</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Year</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${realtimeData.yearRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl">🏆</div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Stats (Web) */}
      {!isDesktop && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects || 0}</p>
              </div>
              <div className="text-2xl">🚀</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{stats.activeProjects || 0}</p>
              </div>
              <div className="text-2xl">⚡</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold">{stats.completedTasks || 0}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-2xl font-bold">{stats.totalFiles || 0}</p>
              </div>
              <div className="text-2xl">📁</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Beast Quick Actions (Desktop) */}
      {isDesktop && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => window.electronAPI?.openWindow('clone-studio')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <div className="text-4xl mb-2">🔄</div>
            <div className="text-xl font-bold">Clone Studio</div>
            <div className="text-sm opacity-90">Clone any website in minutes</div>
          </button>

          <button 
            onClick={() => window.electronAPI?.openWindow('bot-army')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            <div className="text-4xl mb-2">🤖</div>
            <div className="text-xl font-bold">Bot Army</div>
            <div className="text-sm opacity-90">Create automation bots</div>
          </button>

          <button 
            onClick={() => window.electronAPI?.openWindow('market-scanner')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <div className="text-4xl mb-2">📈</div>
            <div className="text-xl font-bold">Market Scanner</div>
            <div className="text-sm opacity-90">Find profitable opportunities</div>
          </button>
        </div>
      )}

      {/* Projects and Tasks (Existing) */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects section stays the same */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Projects</h3>
              <button className="btn-ghost text-sm">View All</button>
            </div>
            <div className="space-y-3">
              {data.projects?.slice(0, 3).map((project: any) => (
                <div key={project.id} className="project-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className={`status-${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`priority-${project.priority}`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.progress}% complete
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks section stays the same */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Tasks</h3>
              <button className="btn-ghost text-sm">View All</button>
            </div>
            <div className="space-y-2">
              {data.tasks?.slice(0, 5).map((task: any) => (
                <div key={task.id} className="task-item">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-yellow-500' :
                      'bg-gray-300'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.project}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className={`status-${task.status}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 