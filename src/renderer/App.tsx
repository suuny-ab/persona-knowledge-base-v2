import React, { useState, useEffect } from 'react';
import './App.css';

declare global {
  interface Window {
    electronAPI: {
      getConfig: () => Promise<any>;
      setConfig: (config: any) => Promise<void>;
      selectDirectory: () => Promise<string>;
      watchDirectory: (path: string) => Promise<{ success: boolean; watchPath: string }>;
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
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadConfig();

    // 监听文件更新事件
    const handleNoteUpdate = (event: any, data: any) => {
      console.log('Note updated:', data);
      setLastUpdate(new Date(data.timestamp).toLocaleString());
      // 文件更新时重新加载笔记列表
      loadNotes();
    };

    window.electronAPI.onNoteUpdated(handleNoteUpdate);

    return () => {
      window.electronAPI.removeNoteUpdatedListener(handleNoteUpdate);
    };
  }, []);

  const loadConfig = async () => {
    try {
      const configData = await window.electronAPI.getConfig();
      setConfig(configData);

      // 如果有配置的目录,自动开始监听和加载笔记
      if (configData.obsidianPath) {
        await startWatching(configData.obsidianPath);
        await loadNotes();
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const noteList = await window.electronAPI.getNoteList();
      setNotes(noteList);
      console.log(`Loaded ${noteList.length} notes`);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const loadNoteContent = async (note: any) => {
    try {
      const content = await window.electronAPI.readNote(note.path);
      setNoteContent(content);
      setSelectedNote(note);
    } catch (error) {
      console.error('Failed to load note content:', error);
    }
  };

  const startWatching = async (path: string) => {
    try {
      const result = await window.electronAPI.watchDirectory(path);
      setWatching(result.success);
    } catch (error) {
      console.error('Failed to start watching:', error);
    }
  };

  const handleSelectDirectory = async () => {
    try {
      const path = await window.electronAPI.selectDirectory();
      if (path) {
        await window.electronAPI.setConfig({ ...config, obsidianPath: path });
        setConfig({ ...config, obsidianPath: path });

        // 停止之前的监听
        if (watching) {
          await window.electronAPI.unwatchDirectory();
        }

        // 开始监听新目录
        await startWatching(path);
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
          <div className="config-item">
            <label>监听状态:</label>
            <span className={`status ${watching ? 'watching' : 'idle'}`}>
              {watching ? '监听中' : '未监听'}
            </span>
          </div>
          {lastUpdate && (
            <div className="config-item">
              <label>最后更新:</label>
              <span className="last-update">{lastUpdate}</span>
            </div>
          )}
        </div>

        <div className="notes-section">
          <h2>笔记列表</h2>
          <div className="notes-layout">
            {/* 左侧笔记列表 */}
            <div className="notes-list">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="搜索笔记..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="notes-container">
                {notes
                  .filter(note =>
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(note => (
                    <div
                      key={note.id}
                      className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                      onClick={() => loadNoteContent(note)}
                    >
                      <div className="note-title">{note.title}</div>
                      <div className="note-meta">
                        <span className="note-tags">
                          {note.tags.length > 0 && (
                            <>
                              {note.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="tag">#{tag}</span>
                              ))}
                              {note.tags.length > 3 && <span className="tag">...</span>}
                            </>
                          )}
                        </span>
                        <span className="note-date">
                          {new Date(note.modifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                {notes.length === 0 && (
                  <div className="no-notes">
                    {searchQuery ? '没有找到匹配的笔记' : '没有笔记,请选择 Obsidian 目录'}
                  </div>
                )}
              </div>
            </div>

            {/* 右侧笔记内容 */}
            <div className="note-content">
              {selectedNote ? (
                <>
                  <div className="note-header">
                    <h3>{selectedNote.title}</h3>
                    <div className="note-actions">
                      <button
                        className="btn-small"
                        onClick={() => setSelectedNote(null)}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                  <div className="markdown-content">
                    {noteContent.split('\n').map((line, index) => (
                      <p key={index}>{line || '\u00A0'}</p>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <p>选择一个笔记查看内容</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
