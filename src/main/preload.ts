import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // 配置相关
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (config: any) => ipcRenderer.invoke('set-config', config),

  // 目录选择
  selectDirectory: () => ipcRenderer.invoke('select-directory'),

  // 文件监听
  watchDirectory: (path: string): Promise<{ success: boolean; watchPath: string }> =>
    ipcRenderer.invoke('watch-directory', path),
  unwatchDirectory: () => ipcRenderer.invoke('unwatch-directory'),

  // 笔记操作
  getNoteList: () => ipcRenderer.invoke('get-note-list'),
  readNote: (path: string) => ipcRenderer.invoke('read-note', path),
  saveNewNote: (note: any) => ipcRenderer.invoke('save-new-note', note),

  // 事件监听
  onNoteUpdated: (callback: (event: any, data: any) => void) => {
    ipcRenderer.on('note-updated', callback);
  },
  removeNoteUpdatedListener: (callback: (event: any, data: any) => void) => {
    ipcRenderer.removeListener('note-updated', callback);
  },
});
