const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window management
  openWindow: (windowName) => ipcRenderer.invoke('open-window', windowName),
  
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  
  // Automation controls
  startAutonomous: () => ipcRenderer.invoke('start-autonomous'),
  stopAutonomous: () => ipcRenderer.invoke('stop-autonomous'),
  cloneWebsite: (url) => ipcRenderer.invoke('clone-website', url),
  createBot: (config) => ipcRenderer.invoke('create-bot', config),
  scanMarkets: () => ipcRenderer.invoke('scan-markets'),
  
  // AI Brain communication
  aiChat: (message) => ipcRenderer.invoke('ai-chat', message),
  aiCommand: (command) => ipcRenderer.invoke('ai-command', command),
  
  // Data operations
  saveProject: (project) => ipcRenderer.invoke('save-project', project),
  loadProjects: () => ipcRenderer.invoke('load-projects'),
  saveRevenue: (revenue) => ipcRenderer.invoke('save-revenue', revenue),
  loadRevenue: () => ipcRenderer.invoke('load-revenue'),
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Event listeners
  onAutonomousUpdate: (callback) => ipcRenderer.on('autonomous-update', callback),
  onRevenueUpdate: (callback) => ipcRenderer.on('revenue-update', callback),
  onOpportunityFound: (callback) => ipcRenderer.on('opportunity-found', callback),
  onCloneComplete: (callback) => ipcRenderer.on('clone-complete', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Log that preload is loaded
console.log('🔗 TD Studios AI Beast - Preload script loaded');

// Inject Tyler's personal AI assistant styles
window.addEventListener('DOMContentLoaded', () => {
  // Add custom styles for desktop app
  const style = document.createElement('style');
  style.textContent = `
    /* Desktop App Specific Styles */
    body {
      user-select: none;
      -webkit-app-region: no-drag;
    }
    
    .title-bar {
      -webkit-app-region: drag;
      height: 30px;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }
    
    .window-controls {
      -webkit-app-region: no-drag;
    }
    
    .ai-beast-indicator {
      position: fixed;
      top: 10px;
      right: 10px;
      background: linear-gradient(45deg, #ff0000, #00ff00);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: bold;
      z-index: 9999;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .autonomous-mode-active::before {
      content: "🤖 AUTONOMOUS MODE ACTIVE";
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: #000;
      color: #00ff00;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: bold;
      z-index: 9999;
      border: 1px solid #00ff00;
    }
  `;
  document.head.appendChild(style);
  
  // Add AI Beast indicator
  const indicator = document.createElement('div');
  indicator.className = 'ai-beast-indicator';
  indicator.textContent = '🚀 AI BEAST';
  document.body.appendChild(indicator);
}); 