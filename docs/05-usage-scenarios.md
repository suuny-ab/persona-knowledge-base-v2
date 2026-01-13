# 使用场景与工作流程

> 项目：Persona Knowledge Base V2
> 文档版本：v1.0
> 创建日期：2026-01-13
> 状态：已确认 ✅

---

## 📌 核心原则

### 明确的职责分工

| 应用 | 职责 |
|------|------|
| **Obsidian** | 笔记编辑、Markdown 编辑器、文件管理 |
| **你的应用** | AI 增强功能（检索、整理、归档、优化） |

### 数据流向

```
Obsidian（.md 文件）
    ↓ 只读
你的应用（读取 + AI 处理）
    ↓ 保存 AI 生成的内容
Obsidian（新增/更新的 .md 文件）
```

---

## 🎬 完整使用场景

### 场景 1：F1 - 智能检索

**用户目标**：用自然语言查询知识库

**步骤流程**：

```
1. 用户在 Obsidian 写学习笔记
   ├─ React学习笔记.md
   ├─ Python基础.md
   └─ 设计模式.md

2. 用户打开你的应用

3. 应用自动加载 Obsidian 笔记
   ↓
   调用 get-note-list 接口
   ↓
   读取所有 .md 文件

4. 用户提问："React 中的 useEffect 怎么用？"
   ↓
   调用 vector-search 接口（未来）
   ↓
   AI 检索相关笔记

5. 展示检索结果
   ├─ React学习笔记.md（相关度 95%）
   └─ React Hook 教程.md（相关度 82%）

6. 用户点击查看笔记内容
   ↓
   调用 read-note 接口
   ↓
   只读展示（不可编辑）
```

**涉及接口**：
- `get-note-list` - 获取笔记列表
- `read-note` - 读取笔记内容
- `vector-search` - AI 智能检索（P0）

**不涉及**：
- ❌ 保存笔记（用户在 Obsidian 编辑）

---

### 场景 2：F2 - 碎片信息整理

**用户目标**：将碎片化记录整理成结构化文档

**步骤流程**：

```
1. 用户在 Obsidian 写碎片化笔记
   ├─ 今天学习了 React hooks...
   ├─ useEffect 依赖数组...
   └─ useCallback 的使用...

2. 用户打开你的应用

3. 粘贴碎片化内容到"信息整理"面板

4. 点击"AI 整理"按钮
   ↓
   调用 ai-organize 接口（未来）
   ↓
   AI 生成结构化文档

5. 预览整理结果
   ↓
   展示 Markdown 格式的结构化文档

6. 确认保存
   ↓
   调用 save-new-note 接口
   ↓
   保存为新的 .md 文件到 Obsidian
   ├─ 文件名：React Hooks学习笔记-整理版.md
   ├─ 子目录：学习笔记/前端
   └─ 自动添加标签和元数据

7. Obsidian 自动显示新文件（或刷新后显示）

8. 触发 note-updated 事件
   ↓
   应用自动刷新笔记列表
```

**涉及接口**：
- `save-new-note` - 保存 AI 生成的笔记
- `note-updated` - 通知笔记更新
- `ai-organize` - AI 信息整理（P1）

**保存的笔记格式**：

```markdown
---
tags: [React, 前端, 学习]
category: 前端开发
createdAt: 2026-01-13
---

# React Hooks 学习笔记

## 核心概念

### useEffect
- 作用：处理副作用
- 依赖数组：控制执行时机

### useCallback
- 作用：记忆函数
- 使用场景：优化性能

## 参考资料
- React 官方文档
- ...
```

---

### 场景 3：F3 - 问答经验归档

**用户目标**：与 AI 对话解决问题，自动归档经验

**步骤流程**：

```
1. 用户在应用中遇到问题

2. 打开"AI 对话"面板

3. 向 AI 提问
   用户："React 中 useEffect 依赖数组为空和有值有什么区别？"

4. AI 回答问题
   AI："依赖数组为空时，只在组件挂载时执行一次；有值时，当值变化时执行..."

5. 用户追问
   用户："那如果在依赖数组里放一个函数呢？"

6. AI 继续回答
   AI："这会导致无限循环，需要用 useCallback 包裹..."

7. 用户确认问题解决

8. 点击"自动归档"按钮
   ↓
   调用 ai-summarize-conversation 接口（未来）
   ↓
   AI 总结对话内容

9. AI 生成经验笔记

10. 确认保存
   ↓
   调用 save-new-note 接口
   ↓
   保存为新的 .md 文件到 Obsidian
   ├─ 文件名：React useEffect依赖数组-问题与解决.md
   ├─ 子目录：经验库/前端
   └─ 自动添加标签：问题解决、React、useEffect

11. Obsidian 自动显示新文件

12. 触发 note-updated 事件
```

**涉及接口**：
- `save-new-note` - 保存 AI 生成的笔记
- `note-updated` - 通知笔记更新
- `ai-summarize-conversation` - AI 对话总结（P1）

**保存的笔记格式**：

```markdown
---
tags: [问题解决, React, useEffect]
category: 经验库
createdAt: 2026-01-13
resolvedAt: 2026-01-13
---

# React useEffect 依赖数组问题

## 问题描述
useEffect 依赖数组为空和有值有什么区别？
如果在依赖数组里放一个函数会怎样？

## 解决过程

### 问题 1：依赖数组为空 vs 有值
**答案**：依赖数组为空时，只在组件挂载时执行一次；有值时，当值变化时执行。

### 问题 2：依赖数组放函数
**问题**：这会导致无限循环。

**解决方案**：用 useCallback 包裹函数。

## 经验总结
- useEffect 依赖数组控制执行时机
- 避免在依赖数组中直接放函数
- 使用 useCallback 记忆函数引用

## 相关笔记
- [React Hooks学习笔记](../学习笔记/ReactHooks.md)
- [useEffect详细文档](https://react.dev/reference/react/useEffect)
```

---

### 场景 4：Obsidian 编辑监听

**用户目标**：在 Obsidian 编辑笔记后，应用自动刷新

**步骤流程**：

```
1. 用户打开应用
   ↓
   调用 watch-directory 接口
   ↓
   开始监听 Obsidian 目录

2. 用户在 Obsidian 编辑 React学习笔记.md

3. Obsidian 自动保存文件

4. 应用检测到文件变化（fs.watch）
   ↓
   防抖处理（300ms）
   ↓
   触发 note-updated 事件
   ↓
   { filename: 'React学习笔记.md', eventType: 'updated' }

5. 应用自动刷新笔记列表
   ↓
   调用 get-note-list 接口

6. 用户看到最新的笔记列表
```

**涉及接口**：
- `watch-directory` - 开始监听目录
- `note-updated` - 通知笔记更新
- `get-note-list` - 刷新笔记列表

**实现细节**：

```typescript
// 主进程监听文件变化
watch(obsidianPath, (eventType, filename) => {
  if (!filename?.endsWith('.md')) return;

  // 防抖处理（避免频繁触发）
  debounce(() => {
    mainWindow.webContents.send('note-updated', {
      filename,
      eventType: eventType === 'change' ? 'updated' : eventType,
      timestamp: new Date()
    });
  }, 300);
});
```

---

### 场景 5：F4 - 知识库优化建议（未来）

**用户目标**：AI 分析知识库结构，给出优化建议

**步骤流程**：

```
1. 用户打开"优化建议"面板

2. 点击"分析知识库"按钮
   ↓
   调用 analyze-structure 接口（P2）
   ↓
   AI 分析笔记结构、标签、分类等

3. 展示优化建议
   ├─ 建议 1：有 5 篇笔记缺少标签，建议补充
   ├─ 建议 2："React" 和 "react" 标签重复，建议统一
   └─ 建议 3："学习笔记" 分类下有 20 篇，建议细分

4. 用户可以选择是否应用建议
   ↓
   如果同意，调用相关接口执行

5. 修改后的笔记自动保存
   ↓
   触发 note-updated 事件
```

**涉及接口**：
- `analyze-structure` - 分析知识库结构（P2）
- `note-updated` - 通知笔记更新

---

## 🔄 完整工作流程图

```
┌─────────────────────────────────────────────────────┐
│                    用户工作流                        │
└─────────────────────────────────────────────────────┘

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

## 📊 数据流图

```
Obsidian 笔记目录
    ↓ get-note-list
你的应用（读取）
    ↓ vector-search / ai-organize / ai-summarize
AI 处理
    ↓ save-new-note
Obsidian 笔记目录（新文件）
    ↓
触发 note-updated 事件
    ↓
你的应用自动刷新
```

---

## 🎯 关键设计决策

### 决策 1：不在应用内编辑笔记

**原因**：
- Obsidian 已经是成熟的 Markdown 编辑器
- 避免重复造轮子
- 职责分离：Obsidian 负责编辑，应用负责 AI 功能

**影响**：
- 删除 `save-note` 接口
- 使用 `read-note` 只读展示
- 新增 `save-new-note` 保存 AI 生成的内容

---

### 决策 2：监听 Obsidian 目录变化

**原因**：
- 用户在 Obsidian 编辑后，应用自动刷新
- 提升用户体验，无需手动刷新

**实现**：
- 使用 Node.js `fs.watch` 监听目录
- 防抖处理避免频繁触发
- 通过 `note-updated` 事件通知渲染进程

---

### 决策 3：AI 生成的内容保存到 Obsidian

**原因**：
- 所有笔记统一管理
- 用户可以在 Obsidian 查看/编辑 AI 生成的内容
- 保持知识库完整性

**实现**：
- F2/F3 生成的笔记通过 `save-new-note` 保存
- 自动添加 Obsidian 元数据（frontmatter）
- 支持子目录和标签分类

---

## ❓ 常见问题

### Q1：如果用户在 Obsidian 删除笔记会怎样？

**A**：
1. `watch-directory` 监听到删除事件
2. 触发 `note-updated`（eventType: 'deleted'）
3. 应用自动从列表中移除该笔记

---

### Q2：如果应用保存的新笔记文件名已存在？

**A**：
- `save-new-note` 会返回错误 `{ code: 'FILE_EXISTS' }`
- 前端提示用户更改文件名
- 或者自动添加时间戳避免冲突

---

### Q3：监听文件变化会影响性能吗？

**A**：
- 使用防抖（debounce）处理，避免频繁触发
- 只监听 `.md` 文件
- 实际性能影响很小

---

**文档状态**：✅ 已确认
**下一步**：初始化项目并开始实现
