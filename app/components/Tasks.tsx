'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  project: string
  assignee: 'Tyler' | 'AI' | 'Bot'
  dueDate: string
  createdAt: string
  automated: boolean
  progress: number
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'urgent'>('all')
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(!!(window as any).electronAPI)
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || defaultTasks)
      } else {
        setTasks(defaultTasks)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setTasks(defaultTasks)
    } finally {
      setLoading(false)
    }
  }

  const defaultTasks: Task[] = [
    {
      id: '1',
      title: 'Clone luxury competitor website',
      description: 'AI Beast detected high-converting luxury site. Auto-clone with improvements.',
      status: 'in-progress',
      priority: 'urgent',
      project: 'AI Beast Clone Studio',
      assignee: 'AI',
      dueDate: '2024-01-22',
      createdAt: '2024-01-20',
      automated: true,
      progress: 75
    },
    {
      id: '2',
      title: 'Optimize payment flow conversion',
      description: 'Analyze user drop-off points and implement fixes',
      status: 'pending',
      priority: 'high',
      project: 'Champagne Room Backend',
      assignee: 'Tyler',
      dueDate: '2024-01-25',
      createdAt: '2024-01-19',
      automated: false,
      progress: 0
    },
    {
      id: '3',
      title: 'Deploy social media bots',
      description: 'Launch Instagram and Twitter engagement bots for luxury audience',
      status: 'completed',
      priority: 'medium',
      project: 'Bot Army',
      assignee: 'Bot',
      dueDate: '2024-01-21',
      createdAt: '2024-01-18',
      automated: true,
      progress: 100
    },
    {
      id: '4',
      title: 'Market analysis: Adult content trends',
      description: 'AI Beast scanning competitor pricing and features',
      status: 'in-progress',
      priority: 'high',
      project: 'Market Scanner',
      assignee: 'AI',
      dueDate: '2024-01-23',
      createdAt: '2024-01-20',
      automated: true,
      progress: 45
    },
    {
      id: '5',
      title: 'Revenue dashboard optimization',
      description: 'Add real-time tracking for all income streams',
      status: 'pending',
      priority: 'medium',
      project: 'Wealth Tracker',
      assignee: 'Tyler',
      dueDate: '2024-01-28',
      createdAt: '2024-01-19',
      automated: false,
      progress: 20
    }
  ]

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || task.status === filter
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAssigneeIcon = (assignee: string) => {
    switch (assignee) {
      case 'Tyler': return '👨‍💼'
      case 'AI': return '🤖'
      case 'Bot': return '⚡'
      default: return '👤'
    }
  }

  const createNewTask = () => {
    if (isDesktop) {
      // Open bot army or AI brain to create automated task
      (window as any).electronAPI?.openWindow('bot-army')
    } else {
      console.log('Create new task')
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress }
        : task
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isDesktop ? '⚡ AI Beast Task Manager' : 'Tasks'}
          </h2>
          <p className="text-gray-600">
            {isDesktop ? 'Autonomous task execution and business automation' : 'Track and manage your tasks'}
          </p>
        </div>
        <button
          onClick={createNewTask}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isDesktop ? '🤖 Auto-Create Task' : '+ New Task'}
        </button>
      </div>

      {/* AI Beast Stats (Desktop Only) */}
      {isDesktop && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{tasks.filter(t => t.automated).length}</div>
            <div className="text-sm opacity-90">AI Automated Tasks</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'completed').length}</div>
            <div className="text-sm opacity-90">Completed Today</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length}</div>
            <div className="text-sm opacity-90">High Priority</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)}%</div>
            <div className="text-sm opacity-90">Avg Progress</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  {task.automated && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                      🤖 AI Automated
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>📁</span>
                    <span>{task.project}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{getAssigneeIcon(task.assignee)}</span>
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📅</span>
                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    task.automated ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-black'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Created {new Date(task.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2">
                {task.status === 'pending' && (
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'in-progress')}
                    className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Start
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <button 
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                    className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Complete
                  </button>
                )}
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Edit
                </button>
                {isDesktop && task.automated && (
                  <button 
                    onClick={() => (window as any).electronAPI?.openWindow('bot-army')}
                    className="text-sm text-purple-600 hover:text-purple-900"
                  >
                    🤖 Manage Bot
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⚡</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' ? 'Create your first task to get started' : `No ${filter} tasks found`}
          </p>
          <button
            onClick={createNewTask}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isDesktop ? '🤖 Auto-Create Task' : 'Create Task'}
          </button>
        </div>
      )}
    </div>
  )
} 