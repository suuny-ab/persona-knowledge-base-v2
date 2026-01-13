import * as fs from 'fs';
import * as path from 'path';
import { ipcMain, BrowserWindow } from 'electron';

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink';
  path: string;
  timestamp: number;
}

class FileWatcher {
  private watchPath: string = '';
  private watcher: fs.FSWatcher | null = null;
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.setupIpcHandlers();
  }

  public setMainWindow(window: BrowserWindow | null): void {
    this.mainWindow = window;
  }

  public startWatching(watchPath: string): boolean {
    try {
      // 停止之前的监听
      if (this.watcher) {
        this.stopWatching();
      }

      // 验证路径是否存在
      if (!fs.existsSync(watchPath)) {
        console.error('Watch path does not exist:', watchPath);
        return false;
      }

      this.watchPath = watchPath;
      console.log('Starting to watch:', watchPath);

      // 开始监听
      this.watcher = fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
        if (filename) {
          const fullPath = path.join(watchPath, filename);
          console.log('File change detected:', fullPath);

          // 只处理 markdown 文件
          if (filename.endsWith('.md')) {
            this.notifyChange({
              type: eventType === 'rename' ? 'change' : 'change',
              path: fullPath,
              timestamp: Date.now()
            });
          }
        }
      });

      console.log('Watcher started successfully');
      return true;
    } catch (error) {
      console.error('Failed to start watcher:', error);
      return false;
    }
  }

  public stopWatching(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      this.watchPath = '';
      console.log('Watcher stopped');
    }
  }

  public isWatching(): boolean {
    return this.watcher !== null && this.watchPath !== '';
  }

  public getWatchPath(): string {
    return this.watchPath;
  }

  private notifyChange(event: FileChangeEvent): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('note-updated', event);
      console.log('Note update event sent:', event);
    }
  }

  private setupIpcHandlers(): void {
    ipcMain.handle('watch-directory', async (event, watchPath: string) => {
      const success = this.startWatching(watchPath);
      return { success, watchPath: this.watchPath };
    });

    ipcMain.handle('unwatch-directory', async () => {
      this.stopWatching();
      return { success: true };
    });

    ipcMain.handle('get-watcher-status', async () => {
      return {
        isWatching: this.isWatching(),
        watchPath: this.watchPath
      };
    });
  }
}

// 导出单例实例
export const fileWatcher = new FileWatcher();
