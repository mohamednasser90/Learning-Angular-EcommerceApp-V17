# 🗺️ Cross-Browser Extension Development Roadmap

*Complete guide for developing extensions that work on Chrome, Firefox, and Edge*

---

## 📋 **Phase 1: Foundation & Setup**

### **1.1 Choose Extension Architecture**

```
Manifest V3 (Recommended)
├── Chrome: Native support
├── Firefox: Partial support (transitioning)
└── Edge: Native support

Manifest V2 (Legacy)
├── Chrome: Deprecated (until 2024)
├── Firefox: Full support
└── Edge: Supported but transitioning
```

### **1.2 Development Environment Setup**

```bash
# Project structure
my-extension/
├── manifest.json          # Extension manifest
├── background/
│   └── service-worker.js   # Background script (MV3)
├── content/
│   └── content-script.js   # Content scripts
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/
│   ├── options.html
│   └── options.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── web-accessible-resources/
```

---

## 📝 **Phase 2: Manifest Configuration**

### **2.1 Universal Manifest.json**

```json
{
  "manifest_version": 3,
  "name": "My Cross-Browser Extension",
  "version": "1.0.0",
  "description": "Extension that works across all browsers",
  
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  
  "background": {
    "service_worker": "background/service-worker.js"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content/content-script.js"],
    "run_at": "document_end"
  }],
  
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "My Extension"
  },
  
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  
  "host_permissions": [
    "<all_urls>"
  ]
}
```

### **2.2 Browser-Specific Adaptations**

```javascript
// browser-adapter.js
const browserAPI = (() => {
  if (typeof browser !== 'undefined') {
    return browser; // Firefox
  }
  return chrome; // Chrome/Edge
})();

// Usage
browserAPI.storage.local.set({key: 'value'});
```

---

## 🔧 **Phase 3: Core Development**

### **3.1 Background Script (Service Worker)**

```javascript
// background/service-worker.js
class ExtensionBackground {
  constructor() {
    this.initializeExtension();
  }

  initializeExtension() {
    // Cross-browser event listeners
    this.setupInstallHandler();
    this.setupMessageHandler();
    this.setupTabHandler();
  }

  setupInstallHandler() {
    browserAPI.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        console.log('Extension installed');
        this.setDefaultSettings();
      }
    });
  }

  setupMessageHandler() {
    browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case 'GET_DATA':
          this.handleGetData(sendResponse);
          return true; // Keep message channel open
        case 'SAVE_DATA':
          this.handleSaveData(message.data, sendResponse);
          return true;
      }
    });
  }

  async handleGetData(sendResponse) {
    try {
      const data = await browserAPI.storage.local.get(['userData']);
      sendResponse({ success: true, data: data.userData });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleSaveData(data, sendResponse) {
    try {
      await browserAPI.storage.local.set({ userData: data });
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  setDefaultSettings() {
    browserAPI.storage.local.set({
      settings: {
        enabled: true,
        theme: 'light',
        notifications: true
      }
    });
  }
}

new ExtensionBackground();
```

### **3.2 Content Script**

```javascript
// content/content-script.js
class ContentScriptManager {
  constructor() {
    this.init();
  }

  init() {
    this.injectUI();
    this.setupEventListeners();
    this.communicateWithBackground();
  }

  injectUI() {
    // Create extension UI elements
    const extensionButton = document.createElement('button');
    extensionButton.id = 'my-extension-btn';
    extensionButton.textContent = 'Extension Action';
    extensionButton.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 10000;
      background: #007bff;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(extensionButton);
  }

  setupEventListeners() {
    document.getElementById('my-extension-btn')?.addEventListener('click', () => {
      this.handleButtonClick();
    });

    // Listen for messages from popup/background
    browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOGGLE_FEATURE') {
        this.toggleFeature();
        sendResponse({ success: true });
      }
    });
  }

  async communicateWithBackground() {
    try {
      const response = await browserAPI.runtime.sendMessage({
        type: 'GET_DATA'
      });
      console.log('Data from background:', response);
    } catch (error) {
      console.error('Communication error:', error);
    }
  }

  handleButtonClick() {
    // Perform content script action
    console.log('Extension button clicked');
    this.highlightElements();
  }

  highlightElements() {
    // Example: Highlight all links on the page
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.style.background = 'yellow';
      link.style.transition = 'background 0.3s';
    });

    // Remove highlight after 3 seconds
    setTimeout(() => {
      links.forEach(link => {
        link.style.background = '';
      });
    }, 3000);
  }

  toggleFeature() {
    // Toggle extension feature
    const button = document.getElementById('my-extension-btn');
    if (button) {
      button.style.background = button.style.background === 'red' ? '#007bff' : 'red';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContentScriptManager();
  });
} else {
  new ContentScriptManager();
}
```

### **3.3 Popup Interface**

```html
<!-- popup/popup.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 320px;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }

    .input-group {
      margin: 15px 0;
    }

    .input-group label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }

    .input-group input,
    .input-group select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .btn {
      padding: 10px 20px;
      margin: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background: #c82333;
    }

    .status {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
    }

    .status.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .feature-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .toggle-switch {
      position: relative;
      width: 50px;
      height: 24px;
      background: #ccc;
      border-radius: 12px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .toggle-switch.active {
      background: #007bff;
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s;
    }

    .toggle-switch.active::after {
      transform: translateX(26px);
    }
  </style>
</head>
<body>
  <div class="header">
    <h3>My Extension</h3>
    <p>Cross-browser extension</p>
  </div>
  
  <div class="input-group">
    <label for="setting-input">Custom Setting:</label>
    <input type="text" id="setting-input" placeholder="Enter value">
  </div>

  <div class="input-group">
    <label for="theme-select">Theme:</label>
    <select id="theme-select">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="auto">Auto</option>
    </select>
  </div>

  <div class="feature-toggle">
    <span>Enable notifications</span>
    <div class="toggle-switch" id="notifications-toggle"></div>
  </div>

  <div class="feature-toggle">
    <span>Auto-activate</span>
    <div class="toggle-switch" id="auto-activate-toggle"></div>
  </div>
  
  <div style="text-align: center; margin-top: 20px;">
    <button id="save-btn" class="btn btn-primary">Save Settings</button>
    <button id="toggle-feature-btn" class="btn btn-secondary">Toggle Feature</button>
    <button id="clear-btn" class="btn btn-danger">Clear Data</button>
  </div>
  
  <div id="status" class="status" style="display: none;"></div>
  
  <script src="popup.js"></script>
</body>
</html>
```

```javascript
// popup/popup.js
class PopupManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Save button
    document.getElementById('save-btn').addEventListener('click', () => {
      this.saveSettings();
    });

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
      this.clearSettings();
    });

    // Toggle feature button
    document.getElementById('toggle-feature-btn').addEventListener('click', () => {
      this.toggleContentFeature();
    });

    // Theme selector
    document.getElementById('theme-select').addEventListener('change', (e) => {
      this.updateTheme(e.target.value);
    });

    // Toggle switches
    document.getElementById('notifications-toggle').addEventListener('click', (e) => {
      this.toggleSwitch(e.target, 'notifications');
    });

    document.getElementById('auto-activate-toggle').addEventListener('click', (e) => {
      this.toggleSwitch(e.target, 'autoActivate');
    });
  }

  async loadSettings() {
    try {
      const result = await browserAPI.storage.local.get([
        'userSetting', 
        'theme', 
        'notifications', 
        'autoActivate'
      ]);
      
      // Load input values
      document.getElementById('setting-input').value = result.userSetting || '';
      document.getElementById('theme-select').value = result.theme || 'light';
      
      // Load toggle states
      this.setToggleState('notifications-toggle', result.notifications !== false);
      this.setToggleState('auto-activate-toggle', result.autoActivate || false);
      
    } catch (error) {
      this.showStatus('Error loading settings', 'error');
    }
  }

  async saveSettings() {
    const settings = {
      userSetting: document.getElementById('setting-input').value,
      theme: document.getElementById('theme-select').value,
      notifications: this.getToggleState('notifications-toggle'),
      autoActivate: this.getToggleState('auto-activate-toggle')
    };

    try {
      await browserAPI.storage.local.set(settings);
      this.showStatus('Settings saved successfully!', 'success');
      
      // Apply theme immediately
      this.applyTheme(settings.theme);
    } catch (error) {
      this.showStatus('Error saving settings', 'error');
    }
  }

  async clearSettings() {
    try {
      await browserAPI.storage.local.clear();
      this.showStatus('All data cleared!', 'success');
      
      // Reset form
      document.getElementById('setting-input').value = '';
      document.getElementById('theme-select').value = 'light';
      this.setToggleState('notifications-toggle', true);
      this.setToggleState('auto-activate-toggle', false);
    } catch (error) {
      this.showStatus('Error clearing data', 'error');
    }
  }

  async toggleContentFeature() {
    try {
      // Get active tab
      const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script
      await browserAPI.tabs.sendMessage(tab.id, { type: 'TOGGLE_FEATURE' });
      
      this.showStatus('Feature toggled!', 'success');
    } catch (error) {
      this.showStatus('Error: Make sure the page is loaded', 'error');
    }
  }

  updateTheme(theme) {
    this.applyTheme(theme);
  }

  applyTheme(theme) {
    const body = document.body;
    body.className = ''; // Clear existing theme classes
    
    switch (theme) {
      case 'dark':
        body.style.background = '#2d3748';
        body.style.color = '#e2e8f0';
        break;
      case 'light':
        body.style.background = '#f5f5f5';
        body.style.color = '#333';
        break;
      case 'auto':
        // Use system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.applyTheme('dark');
        } else {
          this.applyTheme('light');
        }
        break;
    }
  }

  toggleSwitch(element, setting) {
    element.classList.toggle('active');
    const isActive = element.classList.contains('active');
    
    // Save immediately
    browserAPI.storage.local.set({ [setting]: isActive });
  }

  setToggleState(elementId, isActive) {
    const element = document.getElementById(elementId);
    if (isActive) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  }

  getToggleState(elementId) {
    return document.getElementById(elementId).classList.contains('active');
  }

  showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
```

---

## 🌐 **Phase 4: Browser-Specific Considerations**

### **4.1 Chrome Extensions**

```javascript
// Chrome-specific features
class ChromeExtension {
  static setupDeclarativeNetRequest() {
    // Chrome's new way to modify requests (MV3)
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: 1,
        priority: 1,
        action: { 
          type: 'redirect', 
          redirect: { url: 'https://example.com' } 
        },
        condition: { 
          urlFilter: 'blocked-site.com',
          resourceTypes: ['main_frame']
        }
      }],
      removeRuleIds: [1] // Remove existing rules
    });
  }

  static setupContextMenus() {
    chrome.contextMenus.create({
      id: 'myExtensionMenu',
      title: 'My Extension Action',
      contexts: ['selection', 'page'],
      onclick: (info, tab) => {
        console.log('Context menu clicked', info);
      }
    });
  }

  static setupAlarms() {
    // Chrome alarms for periodic tasks
    chrome.alarms.create('periodicTask', {
      delayInMinutes: 1,
      periodInMinutes: 60
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'periodicTask') {
        console.log('Performing periodic task');
      }
    });
  }

  static setupOffscreen() {
    // Chrome offscreen API for background DOM access
    chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['DOM_PARSER'],
      justification: 'Parse HTML content'
    });
  }
}
```

### **4.2 Firefox Extensions (WebExtensions)**

```javascript
// Firefox-specific adaptations
class FirefoxExtension {
  static setupFirefoxSpecific() {
    // Firefox still supports some MV2 features
    if (typeof browser !== 'undefined') {
      // Firefox native promises (no need for callbacks)
      browser.storage.local.set({key: 'value'})
        .then(() => console.log('Saved'))
        .catch(console.error);

      // Firefox-specific APIs
      this.setupFirefoxTabs();
      this.setupFirefoxMenus();
    }
  }

  static setupFirefoxTabs() {
    // Firefox tab API differences
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        console.log('Tab loaded:', tab.url);
      }
    });
  }

  static setupFirefoxMenus() {
    // Firefox context menus (similar to Chrome but with promises)
    browser.contextMenus.create({
      id: 'firefox-menu',
      title: 'Firefox Extension Action',
      contexts: ['selection']
    }).then(() => {
      console.log('Context menu created');
    });
  }

  static handleFirefoxPermissions() {
    // Firefox permission system
    browser.permissions.request({
      permissions: ['downloads', 'bookmarks'],
      origins: ['https://*.example.com/*']
    }).then((granted) => {
      if (granted) {
        console.log('Permissions granted');
      } else {
        console.log('Permissions denied');
      }
    });
  }

  static setupFirefoxSidebar() {
    // Firefox-specific sidebar
    browser.sidebarAction.setPanel({
      panel: 'sidebar.html'
    });
  }
}
```

### **4.3 Edge Extensions**

```javascript
// Edge follows Chrome's implementation
class EdgeExtension {
  static setupEdgeSpecific() {
    // Edge uses Chrome APIs but may have some differences
    if (navigator.userAgent.includes('Edg/')) {
      console.log('Running on Microsoft Edge');
      
      // Edge-specific optimizations
      this.optimizeForEdge();
    }
  }

  static optimizeForEdge() {
    // Edge performance optimizations
    const isEdge = /Edg\//.test(navigator.userAgent);
    
    if (isEdge) {
      // Reduce polling frequency on Edge
      this.pollingInterval = 2000; // vs 1000 on Chrome
      
      // Use Edge-optimized storage
      this.useCompactStorage();
    }
  }

  static useCompactStorage() {
    // More efficient storage for Edge
    chrome.storage.local.set({
      compactData: JSON.stringify({
        timestamp: Date.now(),
        settings: {}
      })
    });
  }

  static setupEdgeEnterpriseFeatures() {
    // Edge enterprise integration
    if (chrome.enterprise) {
      chrome.enterprise.platformKeys.getTokens((tokens) => {
        console.log('Enterprise tokens:', tokens);
      });
    }
  }
}
```

---

## 📦 **Phase 5: Build & Deployment**

### **5.1 Build Script**

```javascript
// build.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class ExtensionBuilder {
  static async createBrowserBuilds() {
    const browsers = ['chrome', 'firefox', 'edge'];
    
    // Clean builds directory
    if (fs.existsSync('builds')) {
      fs.rmSync('builds', { recursive: true });
    }
    
    for (const browser of browsers) {
      console.log(`Building for ${browser}...`);
      await this.createBuild(browser);
    }
    
    console.log('All builds completed!');
  }

  static async createBuild(browser) {
    const manifest = this.generateManifest(browser);
    
    // Create browser-specific directory
    const buildDir = `builds/${browser}`;
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    // Copy files and modify for browser
    this.copyFiles(buildDir, browser);
    fs.writeFileSync(
      `${buildDir}/manifest.json`, 
      JSON.stringify(manifest, null, 2)
    );
    
    // Create ZIP for store upload
    await this.createZip(browser, buildDir);
  }

  static generateManifest(browser) {
    const baseManifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    switch (browser) {
      case 'firefox':
        // Firefox-specific modifications
        baseManifest.manifest_version = 2; // Firefox prefers MV2
        baseManifest.background = {
          scripts: ['background/service-worker.js'],
          persistent: false
        };
        baseManifest.browser_action = baseManifest.action;
        delete baseManifest.action;
        
        baseManifest.browser_specific_settings = {
          gecko: {
            id: 'my-extension@example.com',
            strict_min_version: '109.0'
          }
        };
        
        // Convert host_permissions to permissions for MV2
        if (baseManifest.host_permissions) {
          baseManifest.permissions = [
            ...baseManifest.permissions,
            ...baseManifest.host_permissions
          ];
          delete baseManifest.host_permissions;
        }
        break;
      
      case 'chrome':
        // Chrome optimizations
        baseManifest.minimum_chrome_version = '88';
        break;
        
      case 'edge':
        // Edge optimizations
        baseManifest.minimum_edge_version = '88';
        break;
    }
    
    return baseManifest;
  }

  static copyFiles(buildDir, browser) {
    const filesToCopy = [
      'background/',
      'content/',
      'popup/',
      'options/',
      'icons/',
      'web-accessible-resources/'
    ];

    filesToCopy.forEach(item => {
      if (fs.existsSync(item)) {
        const destPath = path.join(buildDir, item);
        
        if (fs.statSync(item).isDirectory()) {
          this.copyDirectory(item, destPath);
        } else {
          fs.copyFileSync(item, destPath);
        }
      }
    });

    // Browser-specific file modifications
    this.modifyFilesForBrowser(buildDir, browser);
  }

  static modifyFilesForBrowser(buildDir, browser) {
    // Modify service worker for Firefox MV2 compatibility
    if (browser === 'firefox') {
      const swPath = path.join(buildDir, 'background/service-worker.js');
      if (fs.existsSync(swPath)) {
        let content = fs.readFileSync(swPath, 'utf8');
        
        // Replace chrome with browser for Firefox
        content = content.replace(/chrome\./g, 'browser.');
        content = content.replace(/browserAPI/g, 'browser');
        
        fs.writeFileSync(swPath, content);
      }
    }
  }

  static copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  static async createZip(browser, buildDir) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(`builds/${browser}-extension.zip`);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`${browser} ZIP created: ${archive.pointer()} bytes`);
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(buildDir, false);
      archive.finalize();
    });
  }

  // Specific browser builds
  static async buildChrome() {
    await this.createBuild('chrome');
  }

  static async buildFirefox() {
    await this.createBuild('firefox');
  }

  static async buildEdge() {
    await this.createBuild('edge');
  }
}

// CLI interface
const command = process.argv[2];
switch (command) {
  case 'chrome':
    ExtensionBuilder.buildChrome();
    break;
  case 'firefox':
    ExtensionBuilder.buildFirefox();
    break;
  case 'edge':
    ExtensionBuilder.buildEdge();
    break;
  default:
    ExtensionBuilder.createBrowserBuilds();
}

module.exports = ExtensionBuilder;
```

### **5.2 Package.json Configuration**

```json
{
  "name": "cross-browser-extension",
  "version": "1.0.0",
  "description": "Cross-browser extension template",
  "scripts": {
    "build": "node build.js",
    "build:chrome": "node build.js chrome",
    "build:firefox": "node build.js firefox",
    "build:edge": "node build.js edge",
    "dev": "web-ext run --source-dir=./ --browser-console",
    "dev:firefox": "web-ext run --source-dir=./ --target=firefox-desktop",
    "dev:chrome": "web-ext run --source-dir=./ --target=chromium",
    "lint": "web-ext lint --source-dir=./",
    "lint:firefox": "web-ext lint --source-dir=./ --self-hosted",
    "package": "npm run build && npm run zip",
    "zip": "node -e \"require('./build.js').createBrowserBuilds()\"",
    "test": "jest",
    "test:e2e": "node test/e2e-runner.js",
    "clean": "rimraf builds dist",
    "watch": "nodemon --watch src --exec 'npm run build'",
    "validate": "npm run lint && npm run test",
    "release": "npm run validate && npm run build && npm run package"
  },
  "devDependencies": {
    "web-ext": "^7.8.0",
    "archiver": "^6.0.1",
    "rimraf": "^5.0.5",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "puppeteer": "^21.6.1",
    "selenium-webdriver": "^4.15.0"
  },
  "dependencies": {},
  "webExt": {
    "sourceDir": "./",
    "artifactsDir": "./builds/",
    "ignoreFiles": [
      "builds/**",
      "node_modules/**",
      "test/**",
      "*.md",
      "package*.json"
    ]
  }
}
```

### **5.3 Webpack Configuration (Optional)**

```javascript
// webpack.config.js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const browser = env.browser || 'chrome';
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      'background/service-worker': './src/background/service-worker.js',
      'content/content-script': './src/content/content-script.js',
      'popup/popup': './src/popup/popup.js',
      'options/options': './src/options/options.js'
    },
    output: {
      path: path.resolve(__dirname, `builds/${browser}`),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/icons', to: 'icons' },
          { from: 'src/popup/popup.html', to: 'popup/popup.html' },
          { from: 'src/options/options.html', to: 'options/options.html' },
          { 
            from: 'src/manifest.json', 
            to: 'manifest.json',
            transform(content) {
              const manifest = JSON.parse(content);
              // Browser-specific manifest modifications
              return JSON.stringify(manifest, null, 2);
            }
          }
        ]
      })
    ],
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map'
  };
};
```

---

## 🚀 **Phase 6: Store Submission**

### **6.1 Chrome Web Store**

```bash
# Chrome Web Store Submission Process

1. Developer Account Setup:
   - Visit: https://chrome.google.com/webstore/devconsole/
   - Pay $5 one-time developer fee
   - Verify your identity

2. Extension Upload:
   - Upload your ZIP file (chrome-extension.zip)
   - Fill out store listing details
   - Add screenshots and promotional images
   - Set pricing (free or paid)

3. Store Listing Requirements:
   - Detailed description (minimum 132 characters)
   - At least one screenshot (1280x800 or 640x400)
   - Small promotional tile (440x280)
   - Category selection
   - Language support

4. Review Process:
   - Initial review: 1-3 business days
   - Policy compliance check
   - Functionality testing
   - Security review

5. Publishing:
   - Choose visibility (public, unlisted, private)
   - Set up analytics
   - Monitor user feedback
```

### **6.2 Firefox Add-ons (AMO)**

```bash
# Firefox Add-ons Submission Process

1. Developer Account:
   - Visit: https://addons.mozilla.org/developers/
   - Create Mozilla account (free)
   - Accept developer agreement

2. Upload Process:
   - Submit XPI or ZIP file
   - Choose distribution method:
     * AMO (recommended)
     * Self-distribution
     * Unlisted

3. Listing Information:
   - Add-on name and summary
   - Detailed description
   - Screenshots (up to 10)
   - Support website and email
   - License selection

4. Review Types:
   - Automated review (minutes)
   - Human review (varies, can be weeks)
   - Full review for certain permissions

5. Post-Approval:
   - Add-on goes live immediately
   - Statistics and user feedback
   - Update management
```

### **6.3 Microsoft Edge Add-ons**

```bash
# Microsoft Edge Add-ons Submission

1. Partner Center Account:
   - Visit: https://partner.microsoft.com/dashboard/microsoftedge/
   - Create Microsoft Partner account
   - Complete tax and payout info

2. Submission Process:
   - Upload ZIP package
   - Complete product declaration
   - Add store listing details
   - Set pricing and availability

3. Certification Requirements:
   - Functionality testing
   - Security scan
   - Policy compliance
   - Performance testing

4. Timeline:
   - Certification: 3-7 business days
   - Expedited review available
   - Auto-publishing option

5. Management:
   - Analytics dashboard
   - User ratings and reviews
   - Update deployment
```

### **6.4 Store Assets Creation**

```html
<!-- store-assets/screenshot-template.html -->
<!DOCTYPE html>
<html>
<head>
  <style>
    .screenshot {
      width: 1280px;
      height: 800px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    
    .content {
      text-align: center;
      color: white;
      max-width: 800px;
    }
    
    .extension-window {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div class="screenshot">
    <div class="content">
      <h1>My Cross-Browser Extension</h1>
      <div class="extension-window">
        <!-- Extension UI mockup -->
        <img src="extension-ui.png" alt="Extension Interface">
      </div>
      <p>Works seamlessly across Chrome, Firefox, and Edge!</p>
    </div>
  </div>
</body>
</html>
```

---

## 🔧 **Phase 7: Testing & Debugging**

### **7.1 Cross-Browser Testing Setup**

```javascript
// test/cross-browser-test.js
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

class CrossBrowserTester {
  constructor() {
    this.drivers = {};
    this.extensionPaths = {
      chrome: './builds/chrome',
      firefox: './builds/firefox'
    };
  }

  async setupDrivers() {
    // Chrome setup
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments(`--load-extension=${this.extensionPaths.chrome}`);
    chromeOptions.addArguments('--disable-web-security');
    
    this.drivers.chrome = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();

    // Firefox setup
    const firefoxOptions = new firefox.Options();
    // Firefox extension loading is more complex
    
    this.drivers.firefox = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(firefoxOptions)
      .build();
  }

  async runTests() {
    const browsers = ['chrome', 'firefox'];
    const testResults = {};

    for (const browser of browsers) {
      console.log(`Testing on ${browser}...`);
      testResults[browser] = await this.testBrowser(browser);
    }

    return testResults;
  }

  async testBrowser(browser) {
    const driver = this.drivers[browser];
    const results = {};

    try {
      // Test 1: Extension injection
      await driver.get('https://example.com');
      await driver.sleep(1000);
      
      const extensionButton = await driver.findElement(By.id('my-extension-btn'));
      results.injection = !!extensionButton;

      // Test 2: Popup functionality
      await driver.get(`${browser}-extension://popup/popup.html`);
      const saveButton = await driver.findElement(By.id('save-btn'));
      await saveButton.click();
      results.popup = true;

      // Test 3: Storage functionality
      const input = await driver.findElement(By.id('setting-input'));
      await input.sendKeys('test value');
      await saveButton.click();
      await driver.sleep(500);
      
      const value = await input.getAttribute('value');
      results.storage = value === 'test value';

      // Test 4: Content script communication
      await driver.get('https://example.com');
      await driver.executeScript(`
        chrome.runtime.sendMessage({type: 'GET_DATA'}, response => {
          window.testResult = response.success;
        });
      `);
      
      await driver.sleep(1000);
      const commResult = await driver.executeScript('return window.testResult;');
      results.communication = commResult;

    } catch (error) {
      console.error(`Error testing ${browser}:`, error);
      results.error = error.message;
    }

    return results;
  }

  async cleanup() {
    for (const driver of Object.values(this.drivers)) {
      await driver.quit();
    }
  }

  // Manual testing checklist
  static getTestingChecklist() {
    return [
      {
        feature: 'Extension Installation',
        tests: [
          'Loads without errors',
          'Icon appears in toolbar',
          'Permissions are granted correctly'
        ]
      },
      {
        feature: 'Popup Interface',
        tests: [
          'Popup opens when clicked',
          'UI elements are responsive',
          'Settings save/load correctly',
          'Theme switching works'
        ]
      },
      {
        feature: 'Content Script',
        tests: [
          'Injects on target websites',
          'UI elements appear correctly',
          'Event listeners work',
          'Communication with background works'
        ]
      },
      {
        feature: 'Background Script',
        tests: [
          'Service worker starts correctly',
          'Message handling works',
          'Storage operations succeed',
          'Alarm/timer functionality'
        ]
      },
      {
        feature: 'Cross-Browser Compatibility',
        tests: [
          'Same functionality on all browsers',
          'UI consistency across browsers',
          'Performance is acceptable',
          'No browser-specific errors'
        ]
      }
    ];
  }
}

module.exports = CrossBrowserTester;
```

### **7.2 Unit Testing Setup**

```javascript
// test/unit/popup.test.js
/**
 * @jest-environment jsdom
 */

// Mock browser API
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  }
};

global.browserAPI = global.chrome;

// Import popup functionality
require('../../popup/popup.js');

describe('PopupManager', () => {
  let popupManager;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="setting-input" type="text">
      <select id="theme-select">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <button id="save-btn">Save</button>
      <div id="status"></div>
    `;

    popupManager = new PopupManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should load settings on initialization', async () => {
    const mockSettings = {
      userSetting: 'test value',
      theme: 'dark'
    };

    chrome.storage.local.get.mockResolvedValue(mockSettings);

    await popupManager.loadSettings();

    expect(document.getElementById('setting-input').value).toBe('test value');
    expect(document.getElementById('theme-select').value).toBe('dark');
  });

  test('should save settings when save button is clicked', async () => {
    document.getElementById('setting-input').value = 'new value';
    document.getElementById('theme-select').value = 'light';

    chrome.storage.local.set.mockResolvedValue();

    await popupManager.saveSettings();

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      userSetting: 'new value',
      theme: 'light',
      notifications: true,
      autoActivate: false
    });
  });

  test('should show status messages', () => {
    popupManager.showStatus('Test message', 'success');

    const statusDiv = document.getElementById('status');
    expect(statusDiv.textContent).toBe('Test message');
    expect(statusDiv.classList.contains('success')).toBe(true);
  });
});
```

### **7.3 Debug Configuration**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Chrome Extension",
      "type": "chrome",
      "request": "launch",
      "url": "chrome://extensions/",
      "webRoot": "${workspaceFolder}",
      "userDataDir": "${workspaceFolder}/chrome-debug-profile",
      "runtimeArgs": [
        "--load-extension=${workspaceFolder}/builds/chrome",
        "--disable-extensions-except=${workspaceFolder}/builds/chrome"
      ]
    },
    {
      "name": "Debug Firefox Extension",
      "type": "firefox",
      "request": "launch",
      "url": "about:debugging#/runtime/this-firefox",
      "webRoot": "${workspaceFolder}",
      "profile": "extension-debug",
      "firefoxExecutable": "/Applications/Firefox.app/Contents/MacOS/firefox"
    },
    {
      "name": "Debug Extension Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/test/e2e-runner.js",
      "env": {
        "NODE_ENV": "test"
      }
    }
  ]
}
```

---

## 📈 **Phase 8: Maintenance & Updates**

### **8.1 Update Strategy**

```javascript
// update-manager.js
class UpdateManager {
  constructor() {
    this.currentVersion = chrome.runtime.getManifest().version;
    this.init();
  }

  init() {
    this.handleExtensionUpdate();
    this.setupUpdateNotifications();
  }

  handleExtensionUpdate() {
    chrome.runtime.onInstalled.addListener((details) => {
      switch (details.reason) {
        case 'install':
          this.handleInstall();
          break;
        case 'update':
          this.handleUpdate(details.previousVersion);
          break;
        case 'chrome_update':
          this.handleBrowserUpdate();
          break;
      }
    });
  }

  async handleInstall() {
    console.log('Extension installed');
    
    // Set default settings
    await this.setDefaultSettings();
    
    // Show welcome page
    this.showWelcomePage();
    
    // Track installation
    this.trackEvent('extension_installed', {
      version: this.currentVersion,
      timestamp: Date.now()
    });
  }

  async handleUpdate(previousVersion) {
    console.log(`Updated from ${previousVersion} to ${this.currentVersion}`);
    
    // Perform data migration
    await this.migrateData(previousVersion, this.currentVersion);
    
    // Show update notifications
    this.showUpdateNotification(previousVersion);
    
    // Track update
    this.trackEvent('extension_updated', {
      from: previousVersion,
      to: this.currentVersion,
      timestamp: Date.now()
    });
  }

  async migrateData(fromVersion, toVersion) {
    const migrations = [
      { from: '1.0.0', to: '1.1.0', migrate: this.migrateTo110 },
      { from: '1.1.0', to: '1.2.0', migrate: this.migrateTo120 },
      // Add more migrations as needed
    ];

    for (const migration of migrations) {
      if (this.shouldRunMigration(fromVersion, migration.from, toVersion, migration.to)) {
        await migration.migrate();
        console.log(`Migrated from ${migration.from} to ${migration.to}`);
      }
    }
  }

  shouldRunMigration(currentFrom, migrationFrom, currentTo, migrationTo) {
    // Simple version comparison logic
    return this.compareVersions(currentFrom, migrationFrom) <= 0 &&
           this.compareVersions(currentTo, migrationTo) >= 0;
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }

  async migrateTo110() {
    // Example migration: convert old settings format
    const oldSettings = await chrome.storage.local.get(['settings']);
    if (oldSettings.settings && typeof oldSettings.settings === 'string') {
      const newSettings = JSON.parse(oldSettings.settings);
      await chrome.storage.local.set({ settings: newSettings });
    }
  }

  async migrateTo120() {
    // Example migration: add new default settings
    const currentSettings = await chrome.storage.local.get(['settings']);
    const updatedSettings = {
      ...currentSettings.settings,
      newFeature: true,
      enhancedUI: false
    };
    await chrome.storage.local.set({ settings: updatedSettings });
  }

  async setDefaultSettings() {
    const defaultSettings = {
      enabled: true,
      theme: 'light',
      notifications: true,
      autoActivate: false,
      version: this.currentVersion
    };

    await chrome.storage.local.set({ settings: defaultSettings });
  }

  showWelcomePage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html'),
      active: true
    });
  }

  showUpdateNotification(previousVersion) {
    const notificationId = `update-${this.currentVersion}`;
    
    chrome.notifications.create(notificationId, {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Extension Updated!',
      message: `Updated from v${previousVersion} to v${this.currentVersion}. Click to see what's new.`
    });

    chrome.notifications.onClicked.addListener((clickedId) => {
      if (clickedId === notificationId) {
        chrome.tabs.create({
          url: `https://yourwebsite.com/changelog?v=${this.currentVersion}`
        });
        chrome.notifications.clear(notificationId);
      }
    });
  }

  trackEvent(event, data) {
    // Analytics tracking (replace with your preferred service)
    console.log('Tracking event:', event, data);
    
    // Example: Send to Google Analytics
    // this.sendToAnalytics(event, data);
  }

  setupUpdateNotifications() {
    // Check for updates periodically
    chrome.alarms.create('updateCheck', {
      delayInMinutes: 60, // Check every hour
      periodInMinutes: 60 * 24 // Daily checks
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'updateCheck') {
        this.checkForUpdates();
      }
    });
  }

  async checkForUpdates() {
    try {
      // Check your server for available updates
      const response = await fetch('https://yourapi.com/extension/version');
      const data = await response.json();
      
      if (this.compareVersions(data.latestVersion, this.currentVersion) > 0) {
        this.notifyUpdateAvailable(data.latestVersion);
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }

  notifyUpdateAvailable(latestVersion) {
    chrome.action.setBadgeText({ text: 'NEW' });
    chrome.action.setBadgeBackgroundColor({ color: '#ff4444' });
    
    chrome.notifications.create('update-available', {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Update Available!',
      message: `Version ${latestVersion} is available. Update through your browser's extension store.`
    });
  }
}

// Initialize update manager
new UpdateManager();
```

### **8.2 Analytics Integration**

```javascript
// analytics.js
class ExtensionAnalytics {
  constructor() {
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.init();
  }

  async init() {
    await this.initializeUserId();
    this.trackSession();
  }

  async initializeUserId() {
    const stored = await chrome.storage.local.get(['userId']);
    if (stored.userId) {
      this.userId = stored.userId;
    } else {
      this.userId = this.generateUserId();
      await chrome.storage.local.set({ userId: this.userId });
    }
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  trackEvent(event, properties = {}) {
    const eventData = {
      event,
      properties: {
        ...properties,
        userId: this.userId,
        sessionId: this.sessionId,
        version: chrome.runtime.getManifest().version,
        timestamp: Date.now(),
        browser: this.getBrowser()
      }
    };

    this.sendEvent(eventData);
  }

  trackPageView(page) {
    this.trackEvent('page_view', { page });
  }

  trackFeatureUsage(feature, action) {
    this.trackEvent('feature_usage', { feature, action });
  }

  trackError(error, context) {
    this.trackEvent('error', {
      error: error.message,
      stack: error.stack,
      context
    });
  }

  trackSession() {
    this.trackEvent('session_start');
    
    // Track session end when extension is closed
    chrome.runtime.onSuspend.addListener(() => {
      this.trackEvent('session_end');
    });
  }

  getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Edg/')) return 'edge';
    if (userAgent.includes('Chrome')) return 'chrome';
    return 'unknown';
  }

  async sendEvent(eventData) {
    try {
      // Send to your analytics service
      await fetch('https://yourapi.com/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
      
      // Store failed events for retry
      this.storeFailedEvent(eventData);
    }
  }

  async storeFailedEvent(eventData) {
    const failed = await chrome.storage.local.get(['failedEvents']) || { failedEvents: [] };
    failed.failedEvents.push(eventData);
    
    // Keep only last 100 failed events
    if (failed.failedEvents.length > 100) {
      failed.failedEvents = failed.failedEvents.slice(-100);
    }
    
    await chrome.storage.local.set(failed);
  }

  async retryFailedEvents() {
    const failed = await chrome.storage.local.get(['failedEvents']);
    if (failed.failedEvents && failed.failedEvents.length > 0) {
      for (const event of failed.failedEvents) {
        try {
          await this.sendEvent(event);
        } catch (error) {
          // Still failing, keep for next retry
          break;
        }
      }
      
      // Clear successfully sent events
      await chrome.storage.local.set({ failedEvents: [] });
    }
  }
}

// Global analytics instance
const analytics = new ExtensionAnalytics();
```

---

## 🎯 **Development Timeline & Milestones**

| Phase | Duration | Key Deliverables | Success Criteria |
|-------|----------|-----------------|------------------|
| **Planning & Setup** | 1-2 weeks | Project structure, dev environment | ✅ All tools configured, builds working |
| **Core Development** | 3-4 weeks | Basic functionality, UI components | ✅ Extension works in at least one browser |
| **Cross-Browser Adaptation** | 1-2 weeks | Browser-specific features, compatibility | ✅ Works across Chrome, Firefox, Edge |
| **Testing & QA** | 1-2 weeks | Automated tests, manual testing | ✅ All test cases pass, no critical bugs |
| **Store Preparation** | 1 week | Store assets, descriptions, screenshots | ✅ Ready for submission to all stores |
| **Store Submission** | 1-2 weeks | Submit to Chrome, Firefox, Edge stores | ✅ All stores approved and published |
| **Launch & Monitoring** | Ongoing | Analytics, user feedback, bug fixes | ✅ Stable performance, user satisfaction |

---

## 📚 **Essential Resources & Documentation**

### **Official Documentation**
- **Chrome Extensions:** https://developer.chrome.com/docs/extensions/
- **Firefox WebExtensions:** https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- **Edge Extensions:** https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/
- **WebExtensions API Reference:** https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API

### **Development Tools**
- **web-ext:** Mozilla's command-line tool for extension development
- **Chrome Extension CLI:** Google's extension development tools
- **Extension Reloader:** Auto-reload extensions during development
- **WebExtension Polyfill:** Cross-browser compatibility library

### **Testing & Debugging**
- **Chrome DevTools:** Built-in debugging for Chrome extensions
- **Firefox Developer Tools:** Extension debugging for Firefox
- **Selenium WebDriver:** Automated testing across browsers
- **Jest:** Unit testing framework

### **Store Resources**
- **Chrome Web Store Developer Dashboard:** https://chrome.google.com/webstore/devconsole/
- **Firefox Add-on Developer Hub:** https://addons.mozilla.org/developers/
- **Microsoft Partner Center:** https://partner.microsoft.com/dashboard/microsoftedge/

### **Community & Support**
- **Stack Overflow:** Tag questions with `google-chrome-extension`, `firefox-addon`, `microsoft-edge-extension`
- **Reddit:** r/webdev, r/chrome, r/firefox communities
- **GitHub:** Search for extension boilerplates and examples
- **Discord/Slack:** Join web development communities

---

## 🚀 **Quick Start Commands**

```bash
# Initialize new extension project
npm init -y
npm install --save-dev web-ext archiver

# Development commands
npm run dev          # Start development server
npm run lint         # Lint extension code
npm run test         # Run unit tests

# Build commands
npm run build        # Build for all browsers
npm run build:chrome # Build for Chrome only
npm run build:firefox# Build for Firefox only
npm run build:edge   # Build for Edge only

# Package for store submission
npm run package      # Create ZIP files for all stores

# Testing commands
npm run test:unit    # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:manual  # Generate manual testing checklist
```

---

## 🎯 **Success Metrics & KPIs**

### **Development Metrics**
- **Build Success Rate:** 100% successful builds across all browsers
- **Test Coverage:** Minimum 80% code coverage
- **Performance:** Extension loads in <100ms
- **Bundle Size:** Keep under 2MB per browser

### **Store Performance**
- **Approval Rate:** 100% first-time approval on all stores
- **Review Time:** Track average review times per store
- **User Ratings:** Maintain 4+ star average
- **Download Growth:** Month-over-month growth tracking

### **User Engagement**
- **Active Users:** Daily/Monthly active user counts
- **Feature Usage:** Track most/least used features
- **Error Rate:** <1% error rate in production
- **User Retention:** 7-day and 30-day retention rates

---

*This roadmap provides a comprehensive guide for developing and deploying cross-browser extensions. Adapt the timeline and features based on your specific project requirements and complexity.*