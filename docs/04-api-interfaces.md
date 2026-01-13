# IPC 接口定义文档

> 项目：Persona Knowledge Base V2
> 文档版本：v1.1
> 创建日期：2026-01-13
> 更新日期：2026-01-13
> 状态：已审核 ✅

---

## 📌 接口设计原则

### 核心原则
1. **命名清晰** - 见名知意，使用动词 + 名词
2. **统一风格** - 同类接口保持一致
3. **参数最小化** - 只传必需参数
4. **返回值明确** - 使用 TypeScript 类型定义
5. **功能单一** - 一个接口只做一件事
6. **错误处理** - 统一错误处理机制
7. **扩展性** - 考虑未来可能的扩展

---

## 🔌 IPC 接口清单

### invoke/handle 双向通信

| 接口名称 | 参数 | 返回值 | 说明 |
|---------|------|--------|------|
| `get-note-list` | `GetNoteListParams` | `Note[]` | 获取笔记列表 |
| `read-note` | `ReadNoteParams` | `string` | 读取笔记内容 |
| `save-new-note` | `SaveNewNoteParams` | `SaveNewNoteResult` | 保存 AI 生成的新笔记 |
| `watch-directory` | `WatchDirectoryParams` | `void` | 监听 Obsidian 目录变化 |
| `unwatch-directory` | - | `void` | 停止监听目录 |
| `select-directory` | - | `string` | 选择文件夹 |
| `get-config` | - | `Config` | 获取配置 |
| `set-config` | `Config` | `void` | 保存配置 |

### send/on 单向通信

| 接口名称 | 参数 | 触发方 | 说明 |
|---------|------|--------|------|
| `note-updated` | `NoteUpdatedEvent` | 主进程 | 通知笔记已更新（Obsidian 编辑或新笔记保存） |

---

## 📐 接口详细定义

### 1. get-note-list

**功能**：获取指定目录下的笔记列表

**通信模式**：invoke/handle

**参数类型**：

```typescript
interface GetNoteListParams {
  path: string;              // Obsidian 笔记目录路径
  options?: {
    limit?: number;          // 分页：每页数量（默认 50）
    offset?: number;         // 分页：偏移量（默认 0）
    filter?: {
      tags?: string[];       // 按标签过滤
      category?: string;     // 按分类过滤
      keyword?: string;      // 按关键词搜索
    };
  };
}
```

**返回类型**：

```typescript
interface Note {
  id: string;                // 笔记唯一ID（文件名）
  title: string;             // 笔记标题
  path: string;              // 文件完整路径
  content: string;           // 笔记内容
  tags: string[];            // 标签列表
  createdAt: Date;           // 创建时间
  updatedAt: Date;           // 更新时间
  category?: string;        // 分类（可选）
}
```

**错误处理**：

```typescript
// 可能的错误
{
  code: 'DIRECTORY_NOT_FOUND';    // 目录不存在
  code: 'PERMISSION_DENIED';      // 权限不足
  code: 'INVALID_PATH';          // 路径无效
}
```

**示例**：

```typescript
// 渲染进程调用
const notes = await ipcRenderer.invoke('get-note-list', {
  path: 'C:/Users/xxx/Obsidian/Notes',
  options: {
    limit: 20,
    filter: {
      keyword: 'React'
    }
  }
});
```

---

### 2. read-note

**功能**：读取指定笔记文件的内容

**通信模式**：invoke/handle

**参数类型**：

```typescript
interface ReadNoteParams {
  filePath: string;          // 笔记文件完整路径
};
```

**返回类型**：

```typescript
type ReadNoteResult = string;  // 笔记的 Markdown 内容
```

**错误处理**：

```typescript
// 可能的错误
{
  code: 'FILE_NOT_FOUND';       // 文件不存在
  code: 'PERMISSION_DENIED';    // 权限不足
  code: 'READ_ERROR';           // 读取失败
}
```

**示例**：

```typescript
// 渲染进程调用
const content = await ipcRenderer.invoke('read-note', {
  filePath: 'C:/Users/xxx/Obsidian/Notes/React.md'
});
```

---

### 3. save-new-note

**功能**：保存 AI 生成的新笔记到 Obsidian 目录（F2/F3 使用）

**用途说明**：
- 用户在 Obsidian 编辑笔记，不在应用内编辑
- 此接口仅用于保存 AI 生成的内容：
  - F2：整理后的结构化文档
  - F3：自动归档的经验笔记

**通信模式**：invoke/handle

**参数类型**：

```typescript
interface SaveNewNoteParams {
  fileName: string;           // 文件名（如：'React学习笔记.md'）
  content: string;            // 笔记内容（Markdown）
  subfolder?: string;        // 子目录路径（如：'学习笔记/React'），可选
  tags?: string[];           // 标签（会添加到笔记元数据），可选
  category?: string;         // 分类，可选
};
```

**返回类型**：

```typescript
interface SaveNewNoteResult {
  success: boolean;          // 是否成功
  note?: Note;               // 保存后的笔记信息
  filePath?: string;        // 完整文件路径
  error?: string;           // 错误信息（如果失败）
}
```

**错误处理**：

```typescript
// 可能的错误
{
  code: 'PERMISSION_DENIED';    // 权限不足
  code: 'WRITE_ERROR';          // 写入失败
  code: 'INVALID_PATH';         // 路径无效
  code: 'FILE_EXISTS';          // 文件已存在
}
```

**示例**：

```typescript
// 渲染进程调用 - F2 碎片信息整理
const result = await ipcRenderer.invoke('save-new-note', {
  fileName: 'React学习笔记-整理版.md',
  content: '# React 学习笔记\n\n## 核心概念\n\n...',
  subfolder: '学习笔记/前端',
  tags: ['React', '前端', '学习'],
  category: '前端开发'
});

if (result.success) {
  console.log('整理的笔记已保存：', result.filePath);
} else {
  console.error('保存失败', result.error);
}
```

**行为**：
- 保存成功后，主进程会发送 `note-updated` 事件通知所有渲染进程
- 如果指定 `subfolder`，会自动创建子目录
- 自动添加 Obsidian 元数据格式（frontmatter）

---

### 4. watch-directory

**功能**：监听 Obsidian 目录的文件变化，自动通知渲染进程更新

**用途说明**：
- 用户在 Obsidian 编辑笔记后，应用自动刷新笔记列表
- 无需手动点击刷新

**通信模式**：invoke/handle

**参数类型**：

```typescript
interface WatchDirectoryParams {
  path: string;              // Obsidian 目录路径
  debounceMs?: number;      // 防抖时间（毫秒），默认 500
};
```

**返回类型**：`void`

**错误处理**：

```typescript
// 可能的错误
{
  code: 'DIRECTORY_NOT_FOUND';    // 目录不存在
  code: 'ALREADY_WATCHING';      // 已在监听
}
```

**示例**：

```typescript
// 渲染进程调用 - 开始监听
await ipcRenderer.invoke('watch-directory', {
  path: 'C:/Users/xxx/Obsidian/Notes',
  debounceMs: 300
});

// 渲染进程监听文件变化
ipcRenderer.on('note-updated', (event, data) => {
  console.log('检测到文件变化：', data);
  refreshNoteList(); // 刷新笔记列表
});
```

**实现细节**：

```typescript
// 主进程实现
import { watch } from 'fs';

let watcher: FSWatcher | null = null;
let debounceTimer: NodeJS.Timeout | null = null;

ipcMain.handle('watch-directory', async (event, { path, debounceMs = 500 }) => {
  if (watcher) {
    throw new Error('已在监听其他目录');
  }
  
  watcher = watch(path, (eventType, filename) => {
    if (!filename || !filename.endsWith('.md')) return;
    
    // 防抖处理
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      mainWindow.webContents.send('note-updated', {
        filename,
        eventType: eventType === 'change' ? 'updated' : eventType
      });
    }, debounceMs);
  });
});
```

---

### 5. unwatch-directory

**功能**：停止监听目录

**通信模式**：invoke/handle

**参数类型**：无

**返回类型**：`void`

**错误处理**：无

**示例**：

```typescript
// 渲染进程调用
await ipcRenderer.invoke('unwatch-directory');
console.log('已停止监听目录');
```

---

### 4. select-directory

**功能**：打开系统文件夹选择对话框

**通信模式**：invoke/handle

**参数类型**：无

**返回类型**：

```typescript
type SelectDirectoryResult = string | null;  // 选中的目录路径，用户取消则返回 null
```

**错误处理**：无

**示例**：

```typescript
// 渲染进程调用
const directoryPath = await ipcRenderer.invoke('select-directory');

if (directoryPath) {
  console.log('用户选择了目录：', directoryPath);
} else {
  console.log('用户取消了选择');
}
```

---

### 5. get-config

**功能**：获取应用配置

**通信模式**：invoke/handle

**参数类型**：无

**返回类型**：

```typescript
interface Config {
  obsidianPath: string;        // Obsidian 笔记目录
  deepseekApiKey: string;      // DeepSeek API Key
  deepseekModel: string;       // 模型名称（如 'deepseek-chat'）
  theme: 'light' | 'dark';     // 主题
  language: 'zh' | 'en';       // 语言
}
```

**错误处理**：

```typescript
// 可能的错误
{
  code: 'CONFIG_NOT_FOUND';    // 配置文件不存在（首次运行）
}
```

**示例**：

```typescript
// 渲染进程调用
const config = await ipcRenderer.invoke('get-config');
console.log('API Key：', config.deepseekApiKey);
```

---

### 6. set-config

**功能**：保存应用配置

**通信模式**：invoke/handle

**参数类型**：

```typescript
interface Config {
  obsidianPath: string;
  deepseekApiKey: string;
  deepseekModel: string;
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}
```

**返回类型**：`void`

**错误处理**：

```typescript
// 可能的错误
{
  code: 'PERMISSION_DENIED';    // 权限不足
  code: 'WRITE_ERROR';          // 写入失败
}
```

**示例**：

```typescript
// 渲染进程调用
await ipcRenderer.invoke('set-config', {
  obsidianPath: 'C:/Users/xxx/Obsidian/Notes',
  deepseekApiKey: 'sk-xxx',
  deepseekModel: 'deepseek-chat',
  theme: 'dark',
  language: 'zh'
});
```

---

### 8. note-updated（单向通知）

**功能**：通知渲染进程笔记已更新

**通信模式**：send/on

**触发场景**：
1. 用户在 Obsidian 编辑笔记 → `watch-directory` 监听到变化
2. AI 保存新笔记 → `save-new-note` 保存后
3. 用户在 Obsidian 删除/重命名笔记 → `watch-directory` 监听到变化

**参数类型**：

```typescript
interface NoteUpdatedEvent {
  filename: string;            // 文件名
  eventType: 'created' | 'updated' | 'deleted' | 'renamed';  // 事件类型
  timestamp: Date;             // 时间戳
}
```

**示例**：

```typescript
// 渲染进程监听
ipcRenderer.on('note-updated', (event, data) => {
  console.log('笔记已更新：', data);

  switch (data.eventType) {
    case 'created':
      // 新笔记，添加到列表
      addNoteToList(data.filename);
      break;
    case 'updated':
      // 笔记更新，刷新列表或更新内容
      refreshNoteList();
      break;
    case 'deleted':
      // 笔记删除，从列表中移除
      removeNoteFromList(data.filename);
      break;
    case 'renamed':
      // 笔记重命名，更新列表
      updateNoteInList(data.filename);
      break;
  }
});
```

---

## 🔒 安全考虑

### API Key 处理

- ✅ API Key 存储在配置文件中（加密）
- ✅ 不返回给渲染进程（仅在主进程使用）
- ✅ 用户手动输入，不硬编码

### 路径验证

- ✅ 验证路径在允许的范围内
- ✅ 防止路径遍历攻击（`../`）
- ✅ 检查文件扩展名（`.md`）

---

## 📈 扩展性考虑

### 未来可能新增的接口

| 接口名称 | 用途 | 优先级 |
|---------|------|--------|
| `vector-search` | 向量检索（F1 智能检索核心） | P0 |
| `ai-organize` | AI 碎片信息整理（F2） | P1 |
| `ai-summarize-conversation` | AI 对话总结归档（F3） | P1 |
| `analyze-structure` | 分析知识库结构（F4） | P2 |
| `export-notes` | 导出笔记 | P3 |
| `import-notes` | 导入笔记 | P3 |

---

## 🧪 测试用例

### 单元测试示例

```typescript
describe('IPC Handlers', () => {
  test('get-note-list should return notes', async () => {
    const result = await ipcRenderer.invoke('get-note-list', {
      path: testDir
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('title');
  });
  
  test('read-note should return content', async () => {
    const result = await ipcRenderer.invoke('read-note', {
      filePath: testNotePath
    });
    expect(typeof result).toBe('string');
  });
});
```

---

**文档状态**：✅ 已完成
**下一步**：实现 IPC Handler 代码
