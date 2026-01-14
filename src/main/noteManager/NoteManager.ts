import * as fs from 'fs';
import * as path from 'path';

export interface Note {
  id: string;
  title: string;
  path: string;
  content: string;
  tags: string[];
  createdAt: number;
  modifiedAt: number;
}

class NoteManager {
  private notes: Map<string, Note> = new Map();

  /**
   * 扫描目录获取所有笔记
   */
  public scanDirectory(directoryPath: string): Note[] {
    try {
      // 验证目录是否存在
      if (!fs.existsSync(directoryPath)) {
        console.error('Directory does not exist:', directoryPath);
        return [];
      }

      // 递归读取所有 .md 文件
      const notes: Note[] = [];
      this.scanDirectoryRecursive(directoryPath, notes);

      // 按 modifiedAt 降序排列
      notes.sort((a, b) => b.modifiedAt - a.modifiedAt);

      return notes;
    } catch (error) {
      console.error('Failed to scan directory:', error);
      return [];
    }
  }

  /**
   * 递归扫描目录
   */
  private scanDirectoryRecursive(dirPath: string, notes: Note[]): void {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 递归扫描子目录
        this.scanDirectoryRecursive(fullPath, notes);
      } else if (item.endsWith('.md')) {
        // 处理 Markdown 文件
        const note = this.parseNoteFile(fullPath);
        if (note) {
          notes.push(note);
        }
      }
    }
  }

  /**
   * 解析笔记文件
   */
  private parseNoteFile(filePath: string): Note | null {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const stat = fs.statSync(filePath);

      // 直接使用文件名作为标题
      const title = path.basename(filePath, '.md');

      // 提取标签 #tag 格式
      const tags: string[] = [];
      const tagMatches = content.matchAll(/#(\w+)/g);
      if (tagMatches) {
        for (const match of tagMatches) {
          tags.push(match[1]);
        }
      }

      const note: Note = {
        id: filePath,
        title,
        path: filePath,
        content,
        tags,
        createdAt: stat.birthtimeMs || Date.now(),
        modifiedAt: stat.mtimeMs,
      };

      this.notes.set(filePath, note);
      return note;
    } catch (error) {
      console.error('Failed to parse note file:', filePath, error);
      return null;
    }
  }

  /**
   * 读取笔记内容
   */
  public readNote(notePath: string): string {
    try {
      return fs.readFileSync(notePath, 'utf-8');
    } catch (error) {
      console.error('Failed to read note:', notePath, error);
      return '';
    }
  }

  /**
   * 保存新笔记
   */
  public saveNote(directory: string, note: Partial<Note>): boolean {
    try {
      const fileName = `${note.title || 'untitled'}.md`;
      const filePath = path.join(directory, fileName);
      const content = note.content || '';

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Note saved:', filePath);

      return true;
    } catch (error) {
      console.error('Failed to save note:', error);
      return false;
    }
  }

  /**
   * 搜索笔记
   */
  public searchNotes(query: string, notes: Note[]): Note[] {
    if (!query.trim()) {
      return notes;
    }

    const lowerQuery = query.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 按标签过滤
   */
  public filterByTag(tag: string, notes: Note[]): Note[] {
    if (!tag) {
      return notes;
    }
    return notes.filter(note => note.tags.includes(tag));
  }
}

// 导出单例实例
export const noteManager = new NoteManager();
