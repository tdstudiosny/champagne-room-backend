const express = require('express');
const router = express.Router();

// Mock projects data
const DEFAULT_PROJECTS = [
  {
    id: '1',
    name: 'AI Beast Clone Studio',
    description: 'Revolutionary website cloning and improvement engine',
    status: 'active',
    progress: 85,
    category: 'ai-tools',
    startDate: '2024-01-15',
    dueDate: '2024-02-15',
    team: ['Tyler Davis', 'AI Beast'],
    priority: 'high',
    tags: ['automation', 'ai', 'cloning']
  },
  {
    id: '2',
    name: 'TD Studios Empire Dashboard',
    description: 'Personal command center for managing Tyler\'s empire',
    status: 'completed',
    progress: 100,
    category: 'dashboard',
    startDate: '2024-01-01',
    dueDate: '2024-01-31',
    team: ['Tyler Davis'],
    priority: 'high',
    tags: ['dashboard', 'management']
  },
  {
    id: '3',
    name: 'Bot Army Deployment',
    description: 'Autonomous bot network for market analysis and automation',
    status: 'active',
    progress: 60,
    category: 'automation',
    startDate: '2024-01-20',
    dueDate: '2024-03-01',
    team: ['Tyler Davis', 'AI Beast'],
    priority: 'urgent',
    tags: ['bots', 'automation', 'ai']
  }
];

// Get all projects
router.get('/', (req, res) => {
  try {
    res.json({
      projects: DEFAULT_PROJECTS,
      total: DEFAULT_PROJECTS.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// Get project by ID
router.get('/:id', (req, res) => {
  try {
    const project = DEFAULT_PROJECTS.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
});

// Create new project
router.post('/', (req, res) => {
  try {
    const newProject = {
      id: Date.now().toString(),
      ...req.body,
      status: req.body.status || 'pending',
      progress: req.body.progress || 0,
      startDate: req.body.startDate || new Date().toISOString().split('T')[0],
    };
    
    DEFAULT_PROJECTS.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const projectIndex = DEFAULT_PROJECTS.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    DEFAULT_PROJECTS[projectIndex] = {
      ...DEFAULT_PROJECTS[projectIndex],
      ...req.body,
      id: req.params.id
    };
    
    res.json(DEFAULT_PROJECTS[projectIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const projectIndex = DEFAULT_PROJECTS.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    DEFAULT_PROJECTS.splice(projectIndex, 1);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

module.exports = router; 