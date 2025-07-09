'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'pending' | 'on-hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  techStack: string[]
  revenue: number
  createdAt: string
  updatedAt: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(!!(window as any).electronAPI)
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || defaultProjects)
      } else {
        setProjects(defaultProjects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      setProjects(defaultProjects)
    } finally {
      setLoading(false)
    }
  }

  const defaultProjects: Project[] = [
    {
      id: '1',
      name: 'TD Studios AI Beast',
      description: 'Autonomous AI desktop software for business automation and website cloning',
      status: 'active',
      priority: 'urgent',
      progress: 85,
      techStack: ['Electron', 'React', 'Node.js', 'Puppeteer', 'AI'],
      revenue: 0,
      createdAt: '2024-01-15',
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Luxury Platform Backend',
      description: 'High-end adult content platform with premium features',
      status: 'active',
      priority: 'high',
      progress: 65,
      techStack: ['Node.js', 'MongoDB', 'Express', 'Redis'],
      revenue: 15000,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'TD Studios AI Beast',
      description: 'Premium subscription management and payment processing',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      techStack: ['React', 'Stripe', 'WebSocket', 'PostgreSQL'],
      revenue: 25000,
      createdAt: '2023-12-01',
      updatedAt: '2024-01-10'
    },
    {
      id: '4',
      name: 'AI Website Cloner',
      description: 'Automated system to clone competitor websites with AI optimization',
      status: 'pending',
      priority: 'high',
      progress: 30,
      techStack: ['Puppeteer', 'OpenAI', 'React', 'Python'],
      revenue: 0,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20'
    },
    {
      id: '5',
      name: 'Bot Army Management',
      description: 'Social media automation and lead generation bot network',
      status: 'active',
      priority: 'medium',
      progress: 45,
      techStack: ['Python', 'Selenium', 'API Integrations'],
      revenue: 5000,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19'
    }
  ]

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.status === filter
  })

  const createNewProject = async () => {
    if (isDesktop) {
      // Open clone studio to create new project
      await (window as any).electronAPI?.openWindow('clone-studio')
    } else {
      // Show create project modal
      console.log('Create new project')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'on-hold': return 'bg-gray-100 text-gray-800'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
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
            {isDesktop ? '🚀 Tyler\'s Empire Projects' : 'Projects'}
          </h2>
          <p className="text-gray-600">
            {isDesktop ? 'AI-powered project management and automation' : 'Manage your active projects'}
          </p>
        </div>
        <button
          onClick={createNewProject}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isDesktop ? '🔄 Clone New Project' : '+ New Project'}
        </button>
      </div>

      {/* AI Beast Stats (Desktop Only) */}
      {isDesktop && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
            <div className="text-sm opacity-90">Active Projects</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">${projects.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}</div>
            <div className="text-sm opacity-90">Total Revenue</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%</div>
            <div className="text-sm opacity-90">Avg Progress</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
            <div className="text-2xl font-bold">{projects.filter(p => p.priority === 'urgent' || p.priority === 'high').length}</div>
            <div className="text-sm opacity-90">High Priority</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                filter === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab} ({projects.filter(p => tab === 'all' ? true : p.status === tab).length})
            </button>
          ))}
        </nav>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project.name}</h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">Tech Stack</div>
              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 4).map((tech, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Revenue & Actions */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-green-600">
                  ${project.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Edit
                </button>
                {isDesktop && (
                  <button 
                    onClick={() => (window as any).electronAPI?.openWindow('clone-studio')}
                    className="text-sm text-blue-600 hover:text-blue-900"
                  >
                    🔄 Clone
                  </button>
                )}
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' ? 'Create your first project to get started' : `No ${filter} projects at the moment`}
          </p>
          <button
            onClick={createNewProject}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isDesktop ? '🔄 Clone Your First Project' : 'Create Project'}
          </button>
        </div>
      )}
    </div>
  )
} 