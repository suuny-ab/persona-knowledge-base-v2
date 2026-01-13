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
| `save-note` | `SaveNoteParams` | `SaveNoteResult` | 保存笔记 |
| `select-directory` | - | `string` | 选择文件夹 |
| `get-config` | - | `Config` | 获取配置 |
| `set-config` | `Config` | `void` | 保存配置 |

### send/on 单向通信

| 接口名称 | 参数 | 触发方 | 说明 |
|---------|------|--------|------|
| `note-updated` | `NoteUpdatedEvent` | 主进程 | 通知笔记已更新 |

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

### 3. save-note

**功能**：保存笔记内容到指定文件

**通信模式**：invoke/handle

**参数类型**：

```typescript
interface SaveNoteParams {
  filePath: string;          // 笔记文件完整路径
  content: string;           // 笔记内容（Markdown）
};
```

**返回类型**：

```typescript
interface SaveNoteResult {
  success: boolean;          // 是否成功
  note?: Note;               // 保存后的笔记信息
  error?: string;            // 错误信息（如果失败）
}
```

**错误处理**：

```typescript
// 可能的错误
{
  code: 'PERMISSION_DENIED';    // 权限不足
  code: 'WRITE_ERROR';          // 写入失败
  code: 'INVALID_PATH';         // 路径无效
}
```

**示例**：

```typescript
// 渲染进程调用
const result = await ipcRenderer.invoke('save-note', {
  filePath: 'C:/Users/xxx/Obsidian/Notes/React.md',
  content: '# React 学习笔记\n\n## 基础概念...'
});

if (result.success) {
  console.log('保存成功', result.note);
} else {
  console.error('保存失败', result.error);
}
```

**行为**：保存成功后，主进程会发送 `note-updated` 事件通知所有渲染进程。

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

### 7. note-updated（单向通知）

**功能**：通知渲染进程笔记已更新（文件监听或主动保存）

**通信模式**：send/on

**触发场景**：
1. 主进程通过 `save-note` 保存笔记后
2. 主进程监听到 Obsidian 目录下文件变化（可选）

**参数类型**：

```typescript
interface NoteUpdatedEvent {
  noteId: string;              // 笔记ID
  filePath: string;            // 文件路径
  eventType: 'created' | 'updated' | 'deleted';  // 事件类型
  updatedAt: Date;             // 更新时间
}
```

**示例**：

```typescript
// 渲染进程监听
ipcRenderer.on('note-updated', (event, data) => {
  console.log('笔记已更新：', data);
  
  if (data.eventType === 'updated') {
    // 刷新笔记列表
    refreshNotes();
  } else if (data.eventType === 'deleted') {
    // 从列表中移除
    removeNote(data.noteId);
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
| `delete-note` | 删除笔记 | P2 |
| `search-notes` | 全文搜索（F1 智能检索） | P0 |
| `analyze-structure` | 分析知识库结构（F4） | P1 |
| `export-notes` | 导出笔记 | P2 |
| `import-notes` | 导入笔记 | P2 |

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
