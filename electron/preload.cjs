const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld({
  electronAPI: {
    // Expose any safe APIs here if needed
    platform: process.platform,
    version: process.version,
  },
});