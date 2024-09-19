// public/electron.js
const path = require("path");
const { app, BrowserWindow } = require("electron");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,  // Enable nodeIntegration for dev mode
      contextIsolation: false, // Optional, depending on your needs
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load React app
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL || `file://${path.join(__dirname, "./build/index.html")}`,
  );

  mainWindow.on("closed", () => (mainWindow = null));
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});