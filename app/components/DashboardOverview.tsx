'use client'

import { useEffect, useState } from 'react'

interface DashboardOverviewProps {
  data: any
  onRefresh: () => void
}

export default function DashboardOverview({ data, onRefresh }: DashboardOverviewProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const { projects, tasks, recentActivity, stats } = data

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-black text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Tyler!</h2>
        <p className="text-gray-300">
          Your TD Studios Portal is ready. Here's what's happening today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
            </div>
            <div className="text-2xl">🚀</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
            </div>
            <div className="text-2xl">⚡</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-bold">{stats.completedTasks}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-2xl font-bold">{stats.totalFiles}</p>
            </div>
            <div className="text-2xl">📁</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold">{stats.pendingTasks}</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disk Usage</p>
              <p className="text-2xl font-bold">{stats.diskUsage}</p>
            </div>
            <div className="text-2xl">💾</div>
          </div>
        </div>
      </div>

      {/* Projects and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Projects</h3>
            <button className="btn-ghost text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project: any) => (
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

        {/* Recent Tasks */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Tasks</h3>
            <button className="btn-ghost text-sm">View All</button>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task: any) => (
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

      {/* Recent Activity */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button onClick={onRefresh} className="btn-ghost text-sm">
            Refresh
          </button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity: any) => (
            <div key={activity.id} className="activity-item">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{activity.title}</div>
                <div className="text-xs text-gray-500">{activity.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getActivityIcon(type: string): string {
  switch (type) {
    case 'file-upload':
      return '📤'
    case 'ai-chat':
      return '🤖'
    case 'task-complete':
      return '✅'
    case 'project-update':
      return '🚀'
    default:
      return '📝'
  }
} 