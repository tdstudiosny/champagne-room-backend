const express = require('express');
const router = express.Router();

// Mock tasks data
const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Deploy AI Beast Clone Studio',
    description: 'Finalize and deploy the website cloning engine',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Tyler Davis',
    project: 'AI Beast Clone Studio',
    dueDate: '2024-02-01',
    createdAt: '2024-01-15',
    tags: ['deployment', 'ai', 'urgent'],
    progress: 75
  },
  {
    id: '2',
    title: 'Optimize Bot Army Performance',
    description: 'Improve bot response times and reduce resource usage',
    status: 'pending',
    priority: 'medium',
    assignee: 'AI Beast',
    project: 'Bot Army Deployment',
    dueDate: '2024-02-15',
    createdAt: '2024-01-20',
    tags: ['optimization', 'bots'],
    progress: 0
  },
  {
    id: '3',
    title: 'Market Analysis Dashboard',
    description: 'Create real-time market analysis dashboard',
    status: 'completed',
    priority: 'high',
    assignee: 'Tyler Davis',
    project: 'TD Studios Empire Dashboard',
    dueDate: '2024-01-31',
    createdAt: '2024-01-10',
    tags: ['dashboard', 'analytics'],
    progress: 100
  },
  {
    id: '4',
    title: 'Security Audit',
    description: 'Conduct comprehensive security audit of all systems',
    status: 'pending',
    priority: 'urgent',
    assignee: 'Tyler Davis',
    project: 'General',
    dueDate: '2024-02-05',
    createdAt: '2024-01-25',
    tags: ['security', 'audit'],
    progress: 0
  }
];

// Get all tasks
router.get('/', (req, res) => {
  try {
    res.json({
      tasks: DEFAULT_TASKS,
      total: DEFAULT_TASKS.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
});

// Get task by ID
router.get('/:id', (req, res) => {
  try {
    const task = DEFAULT_TASKS.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
});

// Create new task
router.post('/', (req, res) => {
  try {
    const newTask = {
      id: Date.now().toString(),
      ...req.body,
      status: req.body.status || 'pending',
      progress: req.body.progress || 0,
      createdAt: new Date().toISOString(),
    };
    
    DEFAULT_TASKS.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
});

// Update task
router.put('/:id', (req, res) => {
  try {
    const taskIndex = DEFAULT_TASKS.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    DEFAULT_TASKS[taskIndex] = {
      ...DEFAULT_TASKS[taskIndex],
      ...req.body,
      id: req.params.id
    };
    
    res.json(DEFAULT_TASKS[taskIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
});

// Delete task
router.delete('/:id', (req, res) => {
  try {
    const taskIndex = DEFAULT_TASKS.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    DEFAULT_TASKS.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
});

module.exports = router; 