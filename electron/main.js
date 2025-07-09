const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production';
const { spawn } = require('child_process');
const Store = require('electron-store');
const fs = require('fs-extra');

// Initialize electron store for settings
const store = new Store();

// Keep references to windows
let windows = {
  main: null,
  cloneStudio: null,
  botArmy: null,
  marketScanner: null,
  aiBrain: null,
  wealthTracker: null
};

// Backend server process
let serverProcess = null;

// Create main dashboard window
function createMainWindow() {
  windows.main = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Load the main dashboard - dynamic port detection for development
  let startUrl;
  if (isDev) {
    // Try ports in order: 3000, 3001, 3002
    startUrl = 'http://localhost:3000';
  } else {
    startUrl = `file://${path.join(__dirname, '../out/index.html')}`;
  }
  
  console.log(`Loading URL: ${startUrl}`);
  windows.main.loadURL(startUrl);

  // Show window when ready
  windows.main.once('ready-to-show', () => {
    windows.main.show();
    
    // Focus on window
    if (isDev) {
      windows.main.webContents.openDevTools();
    }
    
    // Start autonomous engine after main window loads
    setTimeout(startAutonomousEngine, 5000);
  });

  // Handle load errors with dynamic port fallback
  windows.main.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${errorDescription}`);
    if (isDev) {
      if (validatedURL.includes('3000')) {
        console.log('Port 3000 failed, trying port 3001...');
        windows.main.loadURL('http://localhost:3001');
      } else if (validatedURL.includes('3001')) {
        console.log('Port 3001 failed, trying port 3002...');
        windows.main.loadURL('http://localhost:3002');
      } else if (validatedURL.includes('3002')) {
        console.log('All ports failed. Please ensure Next.js development server is running.');
        dialog.showErrorBox('Connection Error', 'Cannot connect to development server.\n\nPlease ensure Next.js is running with:\nnpm run dev');
      }
    }
  });

  windows.main.on('closed', () => {
    windows.main = null;
  });
}

// Create Clone Studio window
function createCloneStudioWindow() {
  if (windows.cloneStudio) {
    windows.cloneStudio.focus();
    return;
  }

  windows.cloneStudio = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    parent: windows.main,
    title: 'TD Studios - Clone Studio',
    show: false
  });

  const cloneUrl = isDev 
    ? 'http://localhost:3000/clone-studio' 
    : `file://${path.join(__dirname, '../out/clone-studio.html')}`;
  
  windows.cloneStudio.loadURL(cloneUrl);
  
  windows.cloneStudio.once('ready-to-show', () => {
    windows.cloneStudio.show();
  });

  windows.cloneStudio.on('closed', () => {
    windows.cloneStudio = null;
  });
}

// Create Bot Army window
function createBotArmyWindow() {
  if (windows.botArmy) {
    windows.botArmy.focus();
    return;
  }

  windows.botArmy = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    parent: windows.main,
    title: 'TD Studios - Bot Army',
    show: false
  });

  const botUrl = isDev 
    ? 'http://localhost:3000/bot-army' 
    : `file://${path.join(__dirname, '../out/bot-army.html')}`;
  
  windows.botArmy.loadURL(botUrl);
  
  windows.botArmy.once('ready-to-show', () => {
    windows.botArmy.show();
  });

  windows.botArmy.on('closed', () => {
    windows.botArmy = null;
  });
}

// Create Market Scanner window
function createMarketScannerWindow() {
  if (windows.marketScanner) {
    windows.marketScanner.focus();
    return;
  }

  windows.marketScanner = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    parent: windows.main,
    title: 'TD Studios - Market Scanner',
    show: false
  });

  const scannerUrl = isDev 
    ? 'http://localhost:3000/market-scanner' 
    : `file://${path.join(__dirname, '../out/market-scanner.html')}`;
  
  windows.marketScanner.loadURL(scannerUrl);
  
  windows.marketScanner.once('ready-to-show', () => {
    windows.marketScanner.show();
  });

  windows.marketScanner.on('closed', () => {
    windows.marketScanner = null;
  });
}

// Create AI Brain window
function createAIBrainWindow() {
  if (windows.aiBrain) {
    windows.aiBrain.focus();
    return;
  }

  windows.aiBrain = new BrowserWindow({
    width: 800,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    parent: windows.main,
    title: 'TD Studios - AI Brain',
    show: false
  });

  const aiUrl = isDev 
    ? 'http://localhost:3000/ai-brain' 
    : `file://${path.join(__dirname, '../out/ai-brain.html')}`;
  
  windows.aiBrain.loadURL(aiUrl);
  
  windows.aiBrain.once('ready-to-show', () => {
    windows.aiBrain.show();
  });

  windows.aiBrain.on('closed', () => {
    windows.aiBrain = null;
  });
}

// Create Wealth Tracker window
function createWealthTrackerWindow() {
  if (windows.wealthTracker) {
    windows.wealthTracker.focus();
    return;
  }

  windows.wealthTracker = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    parent: windows.main,
    title: 'TD Studios - Wealth Tracker',
    show: false
  });

  const wealthUrl = isDev 
    ? 'http://localhost:3000/wealth-tracker' 
    : `file://${path.join(__dirname, '../out/wealth-tracker.html')}`;
  
  windows.wealthTracker.loadURL(wealthUrl);
  
  windows.wealthTracker.once('ready-to-show', () => {
    windows.wealthTracker.show();
  });

  windows.wealthTracker.on('closed', () => {
    windows.wealthTracker = null;
  });
}

// Start backend server
function startBackendServer() {
  const serverPath = path.join(__dirname, '../server/index.js');
  
  serverProcess = spawn('node', [serverPath], {
    cwd: path.join(__dirname, '..'),
    stdio: isDev ? 'inherit' : 'ignore'
  });

  serverProcess.on('error', (error) => {
    console.error('Backend server error:', error);
  });
}

// Start autonomous AI engine
function startAutonomousEngine() {
  console.log('🤖 Starting Autonomous AI Engine...');
  
  try {
    // Initialize autonomous features
    const autonomousEngine = require('../automation/autonomous-engine');
    autonomousEngine.start({
      marketScanning: true,
      competitorMonitoring: true,
      opportunityDetection: true,
      autoOptimization: true
    });
    
    console.log('🚀 Autonomous AI Engine ACTIVE - Working 24/7 for Tyler');
  } catch (error) {
    console.error('Failed to start autonomous engine:', error);
  }
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'TD Studios AI Beast',
      submenu: [
        {
          label: 'About TD Studios AI Beast',
          click: () => {
            dialog.showMessageBox(windows.main, {
              type: 'info',
              title: 'About',
              message: 'TD Studios AI Beast v1.0.0',
              detail: 'Tyler\'s Personal AI Automation Empire\n\nBuilt for autonomous business growth and website cloning.'
            });
          }
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Windows',
      submenu: [
        { label: 'Main Dashboard', accelerator: 'CmdOrCtrl+1', click: () => createMainWindow() },
        { label: 'Clone Studio', accelerator: 'CmdOrCtrl+2', click: () => createCloneStudioWindow() },
        { label: 'Bot Army', accelerator: 'CmdOrCtrl+3', click: () => createBotArmyWindow() },
        { label: 'Market Scanner', accelerator: 'CmdOrCtrl+4', click: () => createMarketScannerWindow() },
        { label: 'AI Brain', accelerator: 'CmdOrCtrl+5', click: () => createAIBrainWindow() },
        { label: 'Wealth Tracker', accelerator: 'CmdOrCtrl+6', click: () => createWealthTrackerWindow() }
      ]
    },
    {
      label: 'Automation',
      submenu: [
        { label: 'Start Autonomous Mode', click: () => startAutonomousEngine() },
        { label: 'Clone Website...', click: () => createCloneStudioWindow() },
        { label: 'Create Bot...', click: () => createBotArmyWindow() },
        { label: 'Scan Markets', click: () => createMarketScannerWindow() }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers for window management
ipcMain.handle('open-window', (event, windowName) => {
  switch (windowName) {
    case 'clone-studio':
      createCloneStudioWindow();
      break;
    case 'bot-army':
      createBotArmyWindow();
      break;
    case 'market-scanner':
      createMarketScannerWindow();
      break;
    case 'ai-brain':
      createAIBrainWindow();
      break;
    case 'wealth-tracker':
      createWealthTrackerWindow();
      break;
  }
});

// IPC handler for autonomous stats
ipcMain.handle('get-autonomous-stats', async (event) => {
  return {
    isActive: true,
    startTime: new Date().toISOString(),
    tasksCompleted: 0,
    opportunitiesFound: 0,
    revenueGenerated: 0,
    websitesCloned: 0,
    botsActive: 0,
    marketScansToday: 0,
    status: 'Active - Working 24/7 for Tyler',
    lastUpdate: new Date().toISOString()
  };
});

// App event handlers
app.whenReady().then(() => {
  // Skip backend server in development since it's already running
  if (!isDev) {
    startBackendServer();
  }
  
  // Wait a moment for server to start, then create main window
  setTimeout(() => {
    createMainWindow();
    createMenu();
  }, 1000); // Reduced wait time for dev mode

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill backend server
  if (serverProcess) {
    serverProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Clean shutdown
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

console.log('🚀 TD Studios AI Beast - Tyler\'s Desktop Empire Manager Starting...'); 