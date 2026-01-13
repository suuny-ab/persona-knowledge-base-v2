import React, { useState, useEffect } from 'react';
import './App.css';

declare global {
  interface Window {
    electronAPI: {
      getConfig: () => Promise<any>;
      setConfig: (config: any) => Promise<void>;
      selectDirectory: () => Promise<string>;
      watchDirectory: (path: string) => Promise<void>;
      unwatchDirectory: () => Promise<void>;
      getNoteList: () => Promise<any[]>;
      readNote: (path: string) => Promise<string>;
      saveNewNote: (note: any) => Promise<any>;
      onNoteUpdated: (callback: (event: any, data: any) => void) => void;
      removeNoteUpdatedListener: (callback: (event: any, data: any) => void) => void;
    };
  }
}

function App() {
  const [config, setConfig] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configData = await window.electronAPI.getConfig();
      setConfig(configData);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDirectory = async () => {
    try {
      const path = await window.electronAPI.selectDirectory();
      if (path) {
        await window.electronAPI.setConfig({ ...config, obsidianPath: path });
        setConfig({ ...config, obsidianPath: path });
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Persona Knowledge Base V2</h1>
      </header>

      <main className="app-main">
        <div className="config-section">
          <h2>配置</h2>
          <div className="config-item">
            <label>Obsidian 目录:</label>
            <input
              type="text"
              value={config?.obsidianPath || ''}
              readOnly
              placeholder="选择 Obsidian 笔记目录"
            />
            <button onClick={handleSelectDirectory}>选择目录</button>
          </div>
        </div>

        <div className="notes-section">
          <h2>笔记列表</h2>
          <p>笔记列表将在这里显示</p>
        </div>
      </main>
    </div>
  );
}

export default App;
