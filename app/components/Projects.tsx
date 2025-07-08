'use client'

import { useEffect, useState } from 'react'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('td-portal-token')
      const response = await fetch('/api/dashboard/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button className="btn-primary">New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <div key={project.id} className="project-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <span className={`status-${project.status}`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className={`priority-${project.priority}`}>
                {project.priority} priority
              </span>
              <span className="text-sm text-gray-500">
                {project.progress}% complete
              </span>
            </div>
            
            <div className="bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-black h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {project.techStack.map((tech: string) => (
                <span key={tech} className="px-2 py-1 bg-gray-100 text-xs rounded">
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Updated {new Date(project.lastUpdate).toLocaleDateString()}
              </span>
              <button className="btn-ghost text-sm">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 