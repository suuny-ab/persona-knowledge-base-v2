import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { configManager } from './config/ConfigManager';
import { fileWatcher } from './fileWatcher/FileWatcher';
import { noteManager } from './noteManager/NoteManager';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  console.log('Creating window...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // 设置文件监听器的主窗口引用
  fileWatcher.setMainWindow(mainWindow);

  // 加载打包后的 HTML 文件
  console.log('Loading HTML file...');
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
    .then(() => console.log('HTML file loaded successfully'))
    .catch((err) => console.error('Failed to load HTML:', err));

  // 窗口关闭时停止监听
  mainWindow.on('closed', () => {
    fileWatcher.stopWatching();
    mainWindow = null;
  });

  console.log('Window created');
}

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC 处理器 - 配置管理
ipcMain.handle('get-config', async () => {
  return configManager.getConfig();
});

ipcMain.handle('set-config', async (event, config: any) => {
  configManager.setConfig(config);
  return { success: true };
});

// IPC 处理器 - 目录选择
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: '选择 Obsidian 笔记目录'
  });

  if (result.canceled || result.filePaths.length === 0) {
    return '';
  }

  return result.filePaths[0];
});

// IPC 处理器 - 笔记管理
ipcMain.handle('get-note-list', async () => {
  const config = configManager.getConfig();
  if (!config.obsidianPath) {
    return [];
  }

  const notes = noteManager.scanDirectory(config.obsidianPath);
  console.log(`Found ${notes.length} notes`);
  return notes;
});

ipcMain.handle('read-note', async (event, notePath: string) => {
  const content = noteManager.readNote(notePath);
  return content;
});

ipcMain.handle('save-new-note', async (event, noteData: any) => {
  const config = configManager.getConfig();
  if (!config.obsidianPath) {
    return { success: false, message: 'No Obsidian path configured' };
  }

  const success = noteManager.saveNote(config.obsidianPath, noteData);
  return { success };
});
