# 项目设计总览

> 项目：Persona Knowledge Base V2 - 智能个人知识库管理系统
> 版本：v2.0
> 创建日期：2026-01-13
> 最后更新：2026-01-13
> 状态：设计完成 ✅

---

## 📋 目录

- [项目背景与目标](#1-项目背景与目标)
- [核心功能需求](#2-核心功能需求)
- [技术选型](#3-技术选型)
- [系统架构设计](#4-系统架构设计)
- [接口设计](#5-接口设计)
- [使用场景](#6-使用场景)
- [开发计划](#7-开发计划)

---

## 1. 项目背景与目标

### 1.1 用户画像

- **身份**：学生 → 软件开发工作者
- **痛点**：学习过的知识容易遗忘，难以组织管理
- **现状**：已使用 Obsidian 记录笔记，形成本地 Markdown 知识库
- **期望**：利用 AI 增强知识库管理能力

### 1.2 项目愿景

> 为个人学习者提供一个用于维护个人知识库的智能系统，利用 AI 大模型的文字处理能力，实现智能检索、自动整理、经验归档等功能。

### 1.3 核心职责分工

| 应用 | 职责 |
|------|------|
| **Obsidian** | 笔记编辑、Markdown 编辑器、文件管理 |
| **你的应用** | AI 增强功能（检索、整理、归档、优化） |

### 1.4 关键决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| **产品形态** | 独立桌面应用（Electron） | 学习价值高，生态成熟 |
| **编辑功能** | 不在应用内编辑（只在 Obsidian 编辑） | 避免重复造轮子，职责分离 |
| **AI 内容保存** | 自动保存到 Obsidian | 统一管理，保持知识库完整性 |
| **文件监听** | 监听 Obsidian 目录变化 | 自动刷新，提升用户体验 |

---

## 2. 核心功能需求

### 2.1 功能清单

| ID | 功能名称 | 功能描述 | 优先级 | 难度 |
|----|---------|---------|--------|------|
| **F1** | 智能检索 | 理解用户需求，从知识库中检索相关信息并推送 | P0（最高） | 中 |
| **F2** | 碎片信息整理 | 将日常碎片化记录总结成结构化文档，自动保存到 Obsidian | P1（高） | 高 |
| **F3** | 问答经验归档 | 自动总结 AI 解决问题的经验，自动归档到 Obsidian | P1（高） | 高 |
| **F4** | 知识库优化建议 | 分析知识库结构，给出分类优化建议 | P2（中） | 中 |
| **F5** | 用户画像上下文 | 将知识库作为 AI 助手上下文，提升问题解决精准度 | P3（低） | 高 |

### 2.2 开发顺序

```
第一阶段：MVP
  ├─ F1：智能检索（最基础、最核心）
  └─ 基础 UI 界面

第二阶段：知识整理
  └─ F2：碎片信息整理

第三阶段：高级功能
  ├─ F3：问答经验归档
  └─ F4：知识库优化建议

第四阶段：智能增强
  └─ F5：用户画像上下文
```

### 2.3 技术约束

1. ✅ 不重新开发编辑器：管理 Obsidian 中的笔记
2. ✅ 文件格式：本地 `.md` 文件
3. ✅ 笔记位置：用户本地目录
4. ✅ UI/UX：简洁美观，UI 设计非常重要

---

## 3. 技术选型

### 3.1 技术栈总览

```
┌─────────────────────────────────────────┐
│         Persona Knowledge Base V2        │
├─────────────────────────────────────────┤
│ 桌面框架     │ Electron                  │
│ 前端框架     │ React + TypeScript        │
│ UI 框架      │ shadcn/ui + Tailwind CSS  │
│ AI 框架      │ LangChain                 │
│ AI 服务      │ DeepSeek                  │
│ 文件系统     │ Node.js fs 模块           │
│ 构建工具     │ Vite                      │
│ 包管理器     │ npm                       │
└─────────────────────────────────────────┘
```

### 3.2 详细选型

#### 桌面框架：Electron ⭐⭐⭐⭐⭐

| 优势 | 劣势 |
|------|------|
| ✅ 成熟生态，资料丰富 | ❌ 体积大 |
| ✅ 跨平台能力强 | ❌ 内存占用高 |
| ✅ 社区支持强大 | |
| ✅ 学习价值高 | |

**选择理由**：学习资料最丰富，适合个人开发者学习

---

#### 前端框架：React + TypeScript ⭐⭐⭐⭐⭐

| 优势 | 劣势 |
|------|------|
| ✅ 生态最强 | ❌ 学习曲线中等 |
| ✅ 资料最多 | ❌ 概念较多 |
| ✅ TypeScript 类型安全 | |
| ✅ shadcn/ui 最符合需求 | |

**选择理由**：shadcn/ui（基于React）最符合"简洁美观"需求

---

#### AI 框架：LangChain ⭐⭐⭐⭐⭐

| 优势 | 劣势 |
|------|------|
| ✅ 主流框架 | ❌ 学习成本较高 |
| ✅ 功能强大 | ❌ 包体积较大 |
| ✅ 学习价值高 | |
| ✅ 生态完善 | |

**选择理由**：用户已有 LangChain 学习基础，学习目标是"开发框架使用经验"

---

#### AI 服务：DeepSeek ⭐⭐⭐⭐⭐

| 优势 | 说明 |
|------|------|
| ✅ 价格便宜 | 个人开发者友好 |
| ✅ 中文模型表现优秀 | |
| ✅ API 兼容 OpenAI 格式 | 容易切换 |

**选择理由**：性价比高，"后续可能有调整"时迁移成本低

---

#### UI 组件库：shadcn/ui ⭐⭐⭐⭐⭐

| 优势 | 说明 |
|------|------|
| ✅ 简洁美观 | 最符合需求 |
| ✅ 现代化设计 | 用户体验好 |
| ✅ 可高度定制 | 符合个性化需求 |
| ✅ 基于 Radix UI | 无障碍性好 |

---

## 4. 系统架构设计

### 4.1 架构风格

> **模块化架构（Modular Architecture）**

### 4.2 整体架构图

```
┌─────────────────────────────────────────────────┐
│         Persona Knowledge Base V2               │
│              (Electron 桌面应用)                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  UI 模块  │  │  核心模块  │  │  AI 模块   │      │
│  │  (React)  │  │ (Business)│  │(LangChain)│      │
│  │          │  │          │  │          │      │
│  │ - 主界面  │  │ - 笔记管理│  │ - LLM调用│      │
│  │ - 检索界面│  │ - 文件IO  │  │ - Prompt │      │
│  │ - 整理界面│  │ - 状态管理│  │ - Chain  │      │
│  │ - 对话界面│  │ - 结构分析│  │ - 记忆   │      │
│  │ - 建议界面│  │ - 向量化  │  │ - 检索   │      │
│  │ - 设置界面│  │           │  │          │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │             │           │
│       └─────────────┴─────────────┘           │
│                     │                         │
│              ┌──────┴──────┐                  │
│              │  数据层      │                  │
│              │ (Data Layer)│                  │
│              │             │                  │
│              │ - 本地文件  │ ←─────────────┐  │
│              │ - 配置管理  │               │  │
│              │ - 向量数据库│               │  │
│              └─────────────┘               │  │
│                     │                        │  │
└─────────────────────┼────────────────────────┘  │
                      │                           │
         ┌────────────┴────────────┐            │
         ↓                         ↓            │
┌─────────────────┐      ┌─────────────────┐     │
│  本地文件系统    │      │  DeepSeek API   │     │
│  (.md 笔记)     │      │  (LLM 服务)      │     │
└─────────────────┘      └─────────────────┘     │
                                                   │
                   外部依赖                        │
```

### 4.3 模块详细设计

#### UI 模块（React）

| 子模块 | 功能 | 对应功能 |
|--------|------|---------|
| **主界面** | Dashboard | 应用主入口、快捷功能入口 |
| **检索界面** | SearchPanel | F1：智能检索 |
| **整理界面** | OrganizePanel | F2：碎片信息整理 |
| **对话界面** | ChatPanel | F3：AI 问答对话 |
| **建议界面** | SuggestPanel | F4：优化建议展示 |
| **设置界面** | SettingsPanel | 应用设置、API 配置 |

---

#### 核心模块（TypeScript + Node.js）

| 子模块 | 功能 |
|--------|------|
| **笔记管理器** (NoteManager) | 读取、解析 Obsidian 笔记 |
| **文件IO** (FileService) | 文件读写、目录操作 |
| **状态管理** (StoreManager) | 应用状态管理 |
| **结构分析器** (StructureAnalyzer) | 分析知识库结构，生成优化建议 |
| **向量化服务** (EmbeddingService) | 文本向量化，用于智能检索 |

---

#### AI 模块（LangChain + DeepSeek）

| 子模块 | 功能 |
|--------|------|
| **LLM 客户端** (LLMClient) | 封装 DeepSeek API 调用 |
| **Prompt 管理器** (PromptManager) | 管理提示词模板 |
| **Chain 编排器** (ChainBuilder) | 构建和执行 LangChain Chain |
| **记忆管理** (MemoryManager) | 管理对话记忆和历史 |
| **检索器** (Retriever) | 实现智能检索（RAG） |

---

#### 数据层（Node.js fs + JSON + 向量数据库）

| 子模块 | 功能 |
|--------|------|
| **本地存储** (LocalStorage) | 用户配置、偏好设置 |
| **文件存储** (FileStorage) | Obsidian 笔记目录管理 |
| **向量数据库** (VectorDB) | 存储文本向量（可选：ChromaDB） |

---

### 4.4 功能与模块映射

| 功能ID | 功能名称 | 涉及模块 | 核心组件 |
|--------|---------|---------|---------|
| **F1** | 智能检索 | UI + 核心 + AI | SearchPanel, Retriever, LLMClient |
| **F2** | 碎片信息整理 | UI + 核心 + AI | OrganizePanel, NoteManager, Chain |
| **F3** | 问答经验归档 | UI + 核心 + AI | ChatPanel, LLMClient, FileService |
| **F4** | 知识库优化建议 | UI + 核心 + AI | SuggestPanel, StructureAnalyzer, LLMClient |
| **F5** | 用户画像上下文 | AI + 数据 | MemoryManager, VectorDB |

---

### 4.5 项目目录结构

```
persona-knowledge-base-v2/
├── src/
│   ├── main/                    # Electron 主进程
│   │   ├── index.ts            # 主进程入口
│   │   ├── ipc/                # IPC 通信处理器
│   │   │   ├── handlers.ts     # 所有 IPC 处理函数
│   │   │   └── channels.ts     # IPC 通道名称常量
│   │   └── services/           # 系统服务
│   │       ├── fileService.ts  # 文件操作服务
│   │       └── watchService.ts # 文件监听服务
│   │
│   ├── renderer/               # 渲染进程（React）
│   │   ├── App.tsx             # 根组件
│   │   ├── components/         # UI 组件
│   │   │   ├── Dashboard/
│   │   │   │   └── index.tsx
│   │   │   ├── SearchPanel/
│   │   │   │   └── index.tsx
│   │   │   ├── OrganizePanel/
│   │   │   │   └── index.tsx
│   │   │   ├── ChatPanel/
│   │   │   │   └── index.tsx
│   │   │   ├── SuggestPanel/
│   │   │   │   └── index.tsx
│   │   │   └── Settings/
│   │   │       └── index.tsx
│   │   ├── store/              # 状态管理（Zustand）
│   │   ├── hooks/              # 自定义 Hooks
│   │   └── utils/              # 工具函数
│   │
│   ├── core/                   # 核心业务模块
│   │   ├── NoteManager.ts
│   │   ├── FileService.ts
│   │   ├── StructureAnalyzer.ts
│   │   └── EmbeddingService.ts
│   │
│   ├── ai/                     # AI 模块
│   │   ├── LLMClient.ts
│   │   ├── PromptManager.ts
│   │   ├── ChainBuilder.ts
│   │   ├── MemoryManager.ts
│   │   └── Retriever.ts
│   │
│   └── shared/                 # 共享代码
│       ├── types/              # TypeScript 类型定义
│       │   ├── note.ts
│       │   ├── config.ts
│       │   └── index.ts
│       └── constants/          # 常量
│           └── index.ts
│
├── docs/                       # 文档
│   ├── PROJECT-DESIGN.md      # 本文档（总览）
│   └── development-log.md      # 开发日志
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── electron-builder.yml        # 打包配置
```

---

## 5. 接口设计

### 5.1 IPC 接口清单

#### invoke/handle 双向通信

| 接口名称 | 参数 | 返回值 | 用途 |
|---------|------|--------|------|
| `get-note-list` | `GetNoteListParams` | `Note[]` | 获取笔记列表 |
| `read-note` | `ReadNoteParams` | `string` | 读取笔记内容（只读） |
| `save-new-note` | `SaveNewNoteParams` | `SaveNewNoteResult` | 保存 AI 生成的新笔记（F2/F3） |
| `watch-directory` | `WatchDirectoryParams` | `void` | 监听 Obsidian 目录变化 |
| `unwatch-directory` | - | `void` | 停止监听目录 |
| `select-directory` | - | `string` | 选择 Obsidian 目录 |
| `get-config` | - | `Config` | 获取配置 |
| `set-config` | `Config` | `void` | 保存配置 |

#### send/on 单向通信

| 接口名称 | 参数 | 触发方 | 说明 |
|---------|------|--------|------|
| `note-updated` | `NoteUpdatedEvent` | 主进程 | 通知笔记已更新（Obsidian 编辑或新笔记保存） |

---

### 5.2 接口详细定义

#### 5.2.1 get-note-list

**功能**：获取指定目录下的笔记列表

**参数**：

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

**返回值**：

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

---

#### 5.2.2 read-note

**功能**：读取指定笔记文件的内容（只读展示）

**参数**：

```typescript
interface ReadNoteParams {
  filePath: string;          // 笔记文件完整路径
};
```

**返回值**：

```typescript
type ReadNoteResult = string;  // 笔记的 Markdown 内容
```

**重要说明**：
- ❌ **不在应用内编辑笔记**
- ✅ 只读展示，用户在 Obsidian 编辑
- ✅ `watch-directory` 监听变化后自动刷新

---

#### 5.2.3 save-new-note

**功能**：保存 AI 生成的新笔记到 Obsidian 目录（F2/F3 使用）

**用途**：
- 用户在 Obsidian 编辑笔记，不在应用内编辑
- 此接口仅用于保存 AI 生成的内容：
  - F2：整理后的结构化文档
  - F3：自动归档的经验笔记

**参数**：

```typescript
interface SaveNewNoteParams {
  fileName: string;           // 文件名（如：'React学习笔记.md'）
  content: string;            // 笔记内容（Markdown）
  subfolder?: string;        // 子目录路径（如：'学习笔记/React'），可选
  tags?: string[];           // 标签（会添加到笔记元数据），可选
  category?: string;         // 分类，可选
};
```

**返回值**：

```typescript
interface SaveNewNoteResult {
  success: boolean;          // 是否成功
  note?: Note;               // 保存后的笔记信息
  filePath?: string;        // 完整文件路径
  error?: string;           // 错误信息（如果失败）
}
```

**行为**：
- 保存成功后，主进程会发送 `note-updated` 事件
- 如果指定 `subfolder`，会自动创建子目录
- 自动添加 Obsidian 元数据格式（frontmatter）

---

#### 5.2.4 watch-directory

**功能**：监听 Obsidian 目录的文件变化，自动通知渲染进程更新

**参数**：

```typescript
interface WatchDirectoryParams {
  path: string;              // Obsidian 目录路径
  debounceMs?: number;      // 防抖时间（毫秒），默认 500
};
```

**返回值**：`void`

**实现细节**：

```typescript
// 主进程实现（使用 fs.watch）
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
        eventType: eventType === 'change' ? 'updated' : eventType,
        timestamp: new Date()
      });
    }, debounceMs);
  });
});
```

---

#### 5.2.5 unwatch-directory

**功能**：停止监听目录

**返回值**：`void`

---

#### 5.2.6 select-directory

**功能**：打开系统文件夹选择对话框

**返回值**：

```typescript
type SelectDirectoryResult = string | null;  // 选中的目录路径，用户取消则返回 null
```

---

#### 5.2.7 get-config

**功能**：获取应用配置

**返回值**：

```typescript
interface Config {
  obsidianPath: string;        // Obsidian 笔记目录
  deepseekApiKey: string;      // DeepSeek API Key
  deepseekModel: string;       // 模型名称（如 'deepseek-chat'）
  theme: 'light' | 'dark';     // 主题
  language: 'zh' | 'en';       // 语言
}
```

---

#### 5.2.8 set-config

**功能**：保存应用配置

**参数**：`Config`

**返回值**：`void`

---

#### 5.2.9 note-updated（单向通知）

**功能**：通知渲染进程笔记已更新

**触发场景**：
1. 用户在 Obsidian 编辑笔记 → `watch-directory` 监听到变化
2. AI 保存新笔记 → `save-new-note` 保存后

**参数**：

```typescript
interface NoteUpdatedEvent {
  filename: string;            // 文件名
  eventType: 'created' | 'updated' | 'deleted' | 'renamed';  // 事件类型
  timestamp: Date;             // 时间戳
}
```

---

### 5.3 关键设计说明

#### 职责分工

| 操作 | 在哪里 | 接口 |
|------|--------|------|
| **编辑笔记** | Obsidian | - |
| **读取笔记** | 应用（只读） | `read-note` |
| **保存 AI 生成的内容** | 应用 → Obsidian | `save-new-note` |
| **监听 Obsidian 变化** | 应用 | `watch-directory` |
| **自动刷新** | 应用 | `note-updated` 事件 |

#### 不在应用内编辑的原因

1. ✅ Obsidian 已经是成熟的 Markdown 编辑器
2. ✅ 避免重复造轮子
3. ✅ 职责分离：Obsidian 负责编辑，应用负责 AI 功能
4. ✅ 用户已习惯 Obsidian 的使用方式

---

## 6. 使用场景

### 6.1 场景1：F1 - 智能检索

**用户目标**：用自然语言查询知识库

**流程**：

```
1. 用户在 Obsidian 写学习笔记
   ├─ React学习笔记.md
   ├─ Python基础.md
   └─ 设计模式.md

2. 用户打开你的应用

3. 应用自动加载 Obsidian 笔记
   ↓ get-note-list 接口

4. 用户提问："React 中的 useEffect 怎么用？"
   ↓ vector-search 接口（未来）

5. 展示检索结果（只读）
   ├─ React学习笔记.md（相关度 95%）
   └─ React Hook 教程.md（相关度 82%）

6. 用户点击查看笔记内容
   ↓ read-note 接口（只读展示）
```

**涉及接口**：`get-note-list`、`read-note`、`vector-search`（未来）

---

### 6.2 场景2：F2 - 碎片信息整理

**用户目标**：将碎片化记录整理成结构化文档

**流程**：

```
1. 用户在 Obsidian 写碎片化笔记

2. 用户打开应用，粘贴碎片化内容到"信息整理"面板

3. 点击"AI 整理"按钮
   ↓ ai-organize 接口（未来）

4. 预览整理结果

5. 确认保存
   ↓ save-new-note 接口
   ↓ 保存为新的 .md 文件到 Obsidian
   ├─ 文件名：React Hooks学习笔记-整理版.md
   ├─ 子目录：学习笔记/前端
   └─ 自动添加标签和元数据

6. Obsidian 自动显示新文件

7. 触发 note-updated 事件
```

**涉及接口**：`save-new-note`、`note-updated`、`ai-organize`（未来）

---

### 6.3 场景3：F3 - 问答经验归档

**用户目标**：与 AI 对话解决问题，自动归档经验

**流程**：

```
1. 用户在应用中遇到问题

2. 打开"AI 对话"面板

3. 向 AI 提问
   用户："React 中 useEffect 依赖数组为空和有值有什么区别？"

4. AI 回答

5. 用户追问

6. AI 继续回答

7. 用户确认问题解决

8. 点击"自动归档"按钮
   ↓ ai-summarize-conversation 接口（未来）

9. AI 生成经验笔记

10. 确认保存
    ↓ save-new-note 接口
    ↓ 保存为新的 .md 文件到 Obsidian

11. 触发 note-updated 事件
```

**涉及接口**：`save-new-note`、`note-updated`、`ai-summarize-conversation`（未来）

---

### 6.4 场景4：Obsidian 编辑监听

**用户目标**：在 Obsidian 编辑笔记后，应用自动刷新

**流程**：

```
1. 用户打开应用
   ↓ watch-directory 接口

2. 用户在 Obsidian 编辑 React学习笔记.md

3. Obsidian 自动保存文件

4. 应用检测到文件变化（fs.watch）
   ↓ 防抖处理（300ms）
   ↓ 触发 note-updated 事件

5. 应用自动刷新笔记列表
   ↓ get-note-list 接口
```

**涉及接口**：`watch-directory`、`note-updated`、`get-note-list`

---

### 6.5 场景5：F4 - 知识库优化建议（未来）

**用户目标**：AI 分析知识库结构，给出优化建议

**流程**：

```
1. 用户打开"优化建议"面板

2. 点击"分析知识库"按钮
   ↓ analyze-structure 接口（未来）

3. 展示优化建议
   ├─ 建议 1：有 5 篇笔记缺少标签，建议补充
   ├─ 建议 2："React" 和 "react" 标签重复，建议统一
   └─ 建议 3："学习笔记" 分类下有 20 篇，建议细分

4. 用户选择是否应用建议
```

**涉及接口**：`analyze-structure`（未来）、`note-updated`

---

### 6.6 完整工作流程图

```
日常学习阶段：
┌─────────────────┐    1. 写笔记     ┌─────────────────┐
│   Obsidian     │ ──────────────→ │   .md 文件       │
└─────────────────┘                 └─────────────────┘
     ↓ (用户切换应用)
┌─────────────────┐    2. 加载笔记   ┌─────────────────┐
│  你的应用      │ ←────────────── │   .md 文件       │
└─────────────────┘                 └─────────────────┘

AI 功能使用阶段：

F1 智能检索：
用户提问 → AI 检索 → 展示结果（只读）

F2 信息整理：
碎片内容 → AI 整理 → 保存新笔记 → Obsidian 显示

F3 问答归档：
AI 对话 → AI 总结 → 保存经验笔记 → Obsidian 显示

F4 优化建议（未来）：
AI 分析 → 展示建议 → 用户确认 → 优化笔记

实时同步阶段：
Obsidian 编辑 → 监听变化 → 自动刷新应用 → note-updated
```

---

## 7. 开发计划

### 7.1 里程碑概览

```
Milestone 1: 项目初始化 ✅ 已完成
Milestone 2: 技术选型与设计 ✅ 已完成
Milestone 3: 项目初始化与 MVP 开发 ⏳ 进行中
Milestone 4: 功能完善
Milestone 5: 高级特性
Milestone 6: 测试与优化
Milestone 7: 打包发布
```

---

### 7.2 Milestone 3：项目初始化与 MVP

**目标**：完成最小可行产品（智能检索）

**任务清单**：

1. 初始化 Electron + React + TypeScript 项目
2. 配置开发环境（Vite、ESLint、Prettier）
3. 搭建基础项目结构
4. 配置 shadcn/ui 组件库
5. 实现第一个 Electron 窗口
6. 实现基础 IPC 通信
7. 实现 Obsidian 笔记读取功能
8. 实现 F1：智能检索（简化版）

**预期成果**：能够读取 Obsidian 笔记并进行基础检索的应用

---

### 7.3 Milestone 4：功能完善

**任务清单**：

1. 实现 F2：碎片信息整理
2. 实现 F3：问答经验归档
3. 完善文件监听功能
4. 完善 UI 界面
5. 添加配置管理

---

### 7.4 Milestone 5：高级特性

**任务清单**：

1. 实现 F4：知识库优化建议
2. 实现 F5：用户画像上下文
3. 添加主题切换
4. 添加快捷键支持
5. 性能优化

---

### 7.5 Milestone 6：测试与优化

**任务清单**：

1. 单元测试
2. 集成测试
3. E2E 测试
4. Bug 修复
5. 性能优化

---

### 7.6 Milestone 7：打包发布

**任务清单**：

1. 配置 electron-builder
2. 生成安装包
3. 编写使用文档
4. 发布到 GitHub
5. 版本发布

---

## 8. 关键决策总结

| 决策项 | 选择 | 理由 |
|--------|------|------|
| **产品形态** | Electron 桌面应用 | 学习价值高，生态成熟 |
| **前端框架** | React + TypeScript | shadcn/ui 最符合需求 |
| **AI 框架** | LangChain | 用户已有基础，学习目标明确 |
| **AI 服务** | DeepSeek | 性价比高，兼容 OpenAI 格式 |
| **UI 框架** | shadcn/ui | 简洁美观，现代化设计 |
| **编辑功能** | 不在应用内编辑 | Obsidian 已成熟，避免重复 |
| **AI 内容保存** | 自动保存到 Obsidian | 统一管理，保持完整性 |
| **文件监听** | 监听 Obsidian 目录变化 | 自动刷新，提升体验 |

---

## 9. 风险评估与应对

| 风险项 | 可能性 | 影响 | 应对措施 |
|--------|--------|------|---------|
| Electron 体积大 | 高 | 中 | 后期考虑 Tauri 迁移 |
| LangChain 学习曲线 | 中 | 低 | 用户已有基础 |
| DeepSeek 稳定性 | 中 | 中 | 代码兼容 OpenAI，易切换 |
| 跨平台兼容性 | 低 | 高 | 测试多平台部署 |
| AI API 费用 | 中 | 中 | 设置预算限制，缓存常见查询 |

---

## 10. 学习目标

用户明确表示的学习目标：

1. ✅ 掌握开发流程（需求分析 → 技术选型 → 架构设计 → 编码实现）
2. ✅ 掌握项目规划能力
3. ✅ 掌握各种开发工具的使用（Git、Vite、ESLint、Prettier）
4. ✅ 学习 Electron 桌面应用开发
5. ✅ 学习 React + TypeScript
6. ✅ 学习 LangChain AI 应用开发
7. ✅ 不聚焦于具体代码实现，更注重工程思维

---

**文档状态**：设计完成 ✅
**下一步**：初始化项目并开始编码（Milestone 3）

---

## 附录

### A. 参考资料

- [Electron 官方文档](https://www.electronjs.org/docs)
- [React 官方文档](https://react.dev)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [LangChain 文档](https://js.langchain.com/docs)
- [DeepSeek API](https://platform.deepseek.com/api-docs)

### B. 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v2.0 | 2026-01-13 | 合并 5 个文档为总览文档 |
| v1.0 | 2026-01-13 | 初始版本 |

---

**最后更新**：2026-01-13
