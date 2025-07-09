const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Tyler's dashboard data
const DASHBOARD_DATA = {
  projects: [
    {
      id: 'td-portal',
      name: 'TD Studios Portal',
      status: 'active',
      progress: 85,
      lastUpdate: new Date().toISOString(),
      description: 'Personal command center and daily dashboard',
      techStack: ['Next.js', 'React', 'Node.js', 'Socket.io'],
      priority: 'high'
    },
    {
      id: 'td-studios-ai-beast',
      name: 'TD Studios AI Beast',
      status: 'maintenance',
      progress: 95,
      lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      description: 'Luxury platform backend infrastructure',
      techStack: ['Node.js', 'Express', 'MongoDB'],
      priority: 'medium'
    },
    {
      id: 'luxury-platform',
      name: 'Luxury Platform Development',
      status: 'planning',
      progress: 20,
      lastUpdate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      description: 'Next generation luxury content platform',
      techStack: ['React', 'Node.js', 'AI Integration'],
      priority: 'high'
    }
  ],
  tasks: [
    {
      id: 'portal-ai-integration',
      title: 'Complete AI chatbot integration',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      project: 'td-portal',
      description: 'Integrate Claude AI with personal context'
    },
    {
      id: 'file-storage-security',
      title: 'Implement secure file storage',
      status: 'completed',
      priority: 'high',
      completedDate: new Date().toISOString(),
      project: 'td-portal',
      description: 'Secure storage for .env files and sensitive documents'
    },
    {
      id: 'notion-blocks',
      title: 'Build Notion-style block system',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      project: 'td-portal',
      description: 'Drag and drop block-based content editing'
    },
    {
      id: 'responsive-design',
      title: 'Optimize for mobile/tablet',
      status: 'pending',
      priority: 'low',
      project: 'td-portal',
      description: 'Ensure portal works on all devices'
    }
  ],
  recentActivity: [
    {
      id: 'activity-1',
      type: 'file-upload',
      title: 'Uploaded new .env file',
      timestamp: new Date().toISOString(),
      description: 'Secure storage of production environment variables'
    },
    {
      id: 'activity-2',
      type: 'ai-chat',
      title: 'AI conversation about project architecture',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      description: 'Discussed implementation strategy for luxury platform'
    },
    {
      id: 'activity-3',
      type: 'task-complete',
      title: 'Completed file storage security implementation',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      description: 'Secure file upload and storage system now live'
    }
  ],
  stats: {
    totalProjects: 3,
    activeProjects: 1,
    completedTasks: 1,
    pendingTasks: 2,
    totalFiles: 0,
    diskUsage: '0 MB'
  }
};

// Get dashboard overview
router.get('/overview', (req, res) => {
  try {
    // Update stats with real data
    const stats = calculateDashboardStats();
    
    res.json({
      ...DASHBOARD_DATA,
      stats: { ...DASHBOARD_DATA.stats, ...stats },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
});

// Get projects
router.get('/projects', (req, res) => {
  try {
    res.json({ projects: DASHBOARD_DATA.projects });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load projects', error: error.message });
  }
});

// Update project
router.put('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const projectIndex = DASHBOARD_DATA.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    DASHBOARD_DATA.projects[projectIndex] = {
      ...DASHBOARD_DATA.projects[projectIndex],
      ...updates,
      lastUpdate: new Date().toISOString()
    };
    
    res.json({ project: DASHBOARD_DATA.projects[projectIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// Get tasks
router.get('/tasks', (req, res) => {
  try {
    const { status, priority, project } = req.query;
    let tasks = DASHBOARD_DATA.tasks;
    
    // Filter tasks based on query parameters
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (priority) {
      tasks = tasks.filter(task => task.priority === priority);
    }
    if (project) {
      tasks = tasks.filter(task => task.project === project);
    }
    
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load tasks', error: error.message });
  }
});

// Update task
router.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const taskIndex = DASHBOARD_DATA.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    DASHBOARD_DATA.tasks[taskIndex] = {
      ...DASHBOARD_DATA.tasks[taskIndex],
      ...updates
    };
    
    // Add to recent activity if task completed
    if (updates.status === 'completed') {
      DASHBOARD_DATA.recentActivity.unshift({
        id: `activity-${Date.now()}`,
        type: 'task-complete',
        title: `Completed: ${DASHBOARD_DATA.tasks[taskIndex].title}`,
        timestamp: new Date().toISOString(),
        description: DASHBOARD_DATA.tasks[taskIndex].description
      });
    }
    
    res.json({ task: DASHBOARD_DATA.tasks[taskIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Get recent activity
router.get('/activity', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activity = DASHBOARD_DATA.recentActivity.slice(0, parseInt(limit));
    
    res.json({ activity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load activity', error: error.message });
  }
});

// Add activity entry
router.post('/activity', (req, res) => {
  try {
    const { type, title, description } = req.body;
    
    const activity = {
      id: `activity-${Date.now()}`,
      type,
      title,
      timestamp: new Date().toISOString(),
      description
    };
    
    DASHBOARD_DATA.recentActivity.unshift(activity);
    
    // Keep only last 50 activities
    if (DASHBOARD_DATA.recentActivity.length > 50) {
      DASHBOARD_DATA.recentActivity = DASHBOARD_DATA.recentActivity.slice(0, 50);
    }
    
    res.json({ activity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add activity', error: error.message });
  }
});

// Calculate dashboard statistics
function calculateDashboardStats() {
  const stats = {
    totalProjects: DASHBOARD_DATA.projects.length,
    activeProjects: DASHBOARD_DATA.projects.filter(p => p.status === 'active').length,
    completedTasks: DASHBOARD_DATA.tasks.filter(t => t.status === 'completed').length,
    pendingTasks: DASHBOARD_DATA.tasks.filter(t => t.status === 'pending').length,
    totalFiles: 0,
    diskUsage: '0 MB'
  };
  
  // Calculate file stats
  try {
    const metadataPath = path.join(__dirname, '../../file-storage/metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      stats.totalFiles = metadata.length;
      
      const totalSize = metadata.reduce((sum, file) => sum + file.size, 0);
      stats.diskUsage = `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
    }
  } catch (error) {
    console.error('Error calculating file stats:', error);
  }
  
  return stats;
}

module.exports = router; 