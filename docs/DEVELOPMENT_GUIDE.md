# 📖 PeriodHub 开发指南

**最后更新：** 2025-01-19  
**适用版本：** v2.0.0+

---

## 📋 目录

1. [环境设置](#环境设置)
2. [项目结构](#项目结构)
3. [开发流程](#开发流程)
4. [代码规范](#代码规范)
5. [翻译系统](#翻译系统)
6. [组件开发](#组件开发)
7. [测试](#测试)
8. [常见问题](#常见问题)

---

## 🛠️ 环境设置

### 系统要求

- **Node.js**: >= 20.0.0 (推荐 20.15.0+)
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **Git**: >= 2.0.0
- **操作系统**: macOS, Linux, Windows (WSL2 推荐)

### 初始设置

```bash
# 1. 克隆仓库
git clone https://github.com/haha321-haha/v2-clean-fixed.git
cd v2-clean-fixed

# 2. 安装依赖
npm install
# 或
yarn install

# 3. 创建环境变量文件
cp .env.example .env.local

# 4. 配置环境变量（编辑 .env.local）
# NEXT_PUBLIC_APP_URL=http://localhost:3001
# NEXT_PUBLIC_DEFAULT_LOCALE=zh

# 5. 启动开发服务器
npm run dev
# 或
yarn dev
```

### 开发服务器

开发服务器默认运行在 `http://localhost:3001`

```bash
# 启动开发服务器
npm run dev

# 启动开发服务器（带翻译验证）
npm run dev:safe

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

---

## 📁 项目结构

### 目录结构

```
periodhub-health/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # 国际化路由
│   │   ├── page.tsx              # 首页
│   │   ├── interactive-tools/    # 交互工具
│   │   ├── privacy-policy/       # 隐私政策
│   │   ├── scenario-solutions/   # 场景解决方案
│   │   ├── downloads/            # 下载页面
│   │   ├── natural-therapies/    # 自然疗法
│   │   └── health-guide/         # 健康指南
│   ├── api/                      # API 路由
│   ├── globals.css               # 全局样式
│   └── layout.tsx                # 根布局
│
├── components/                   # 组件库
│   ├── ui/                       # 基础 UI 组件
│   ├── layout/                   # 布局组件
│   ├── landing/                  # 首页组件
│   │   ├── V2Home.tsx            # 首页主组件
│   │   ├── StatsSection.tsx      # 统计数据组件
│   │   ├── ScenariosSection.tsx  # 场景解决方案组件
│   │   ├── DownloadsSection.tsx  # 下载资源组件
│   │   └── PrivacyNotice.tsx     # 隐私通知组件
│   └── sections/                 # Section 组件
│
├── lib/                          # 核心库
│   ├── seo/                      # SEO 工具
│   │   ├── page-seo.ts           # 页面 SEO 配置
│   │   └── multilingual-seo.ts   # 多语言 SEO
│   └── utils/                    # 工具函数
│
├── messages/                     # 翻译文件
│   ├── en.json                   # 英文翻译
│   └── zh.json                   # 中文翻译
│
├── config/                       # 配置文件
│   ├── site.config.ts            # 站点配置
│   └── pdfResources.ts           # PDF 资源配置
│
├── scripts/                      # 开发脚本
│   └── hardcode-fix-tools/       # 硬编码修复工具
│
└── docs/                         # 文档
    ├── DEVELOPMENT_GUIDE.md      # 开发指南（本文件）
    ├── DEPLOYMENT_GUIDE.md       # 部署指南
    └── TRANSLATION_KEY_MANAGEMENT_PROCESS.md  # 翻译键管理
```

### 关键文件说明

| 文件/目录 | 说明 |
|----------|------|
| `app/[locale]/page.tsx` | 首页，使用 V2Home 组件 |
| `components/landing/V2Home.tsx` | 首页主组件 |
| `components/Footer.tsx` | 全局 Footer 组件（4 列布局） |
| `app/[locale]/layout.tsx` | 全局布局，包含 Header 和 Footer |
| `messages/en.json` | 英文翻译文件 |
| `messages/zh.json` | 中文翻译文件 |
| `lib/seo/page-seo.ts` | 统一的 SEO 配置函数 |

---

## 🔄 开发流程

### 1. 创建功能分支

```bash
# 从 main 分支创建新分支
git checkout -b feature/your-feature-name
# 或修复分支
git checkout -b fix/bug-description
```

### 2. 开发新功能

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问
# http://localhost:3001
```

### 3. 代码质量检查

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# TypeScript 类型检查
npm run type-check

# 翻译键检查
npm run translations:check

# 硬编码文本检查
npm run detect-hardcode
```

### 4. 提交代码

```bash
# 添加文件
git add .

# 提交（使用约定式提交格式）
git commit -m "feat: add new feature"
# 或
git commit -m "fix: fix bug description"
```

### 约定式提交格式

```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整（不影响功能）
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
perf: 性能优化
ci: CI/CD 相关
```

### 5. 推送并创建 PR

```bash
# 推送分支
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

---

## 📝 代码规范

### TypeScript 规范

- **严格模式**: 启用 TypeScript 严格模式
- **类型定义**: 所有函数和组件必须有类型定义
- **避免 `any`**: 尽量避免使用 `any`，使用 `unknown` 或具体类型

```typescript
// ✅ 好的做法
interface UserProps {
  name: string;
  age: number;
}

function User({ name, age }: UserProps): JSX.Element {
  return <div>{name} ({age})</div>;
}

// ❌ 不好的做法
function User(props: any) {
  return <div>{props.name}</div>;
}
```

### React 组件规范

- **函数式组件**: 使用函数式组件和 Hooks
- **组件命名**: 使用 PascalCase
- **文件命名**: 组件文件使用 PascalCase（如 `UserProfile.tsx`）

```typescript
// ✅ 好的做法
'use client';

import { useTranslations } from 'next-intl';

export default function UserProfile() {
  const t = useTranslations('userProfile');
  
  return <div>{t('title')}</div>;
}

// ❌ 不好的做法
export default function userProfile() {
  return <div>User Profile</div>; // 硬编码文本
}
```

### 样式规范

- **Tailwind CSS**: 使用 Tailwind CSS 进行样式设计
- **响应式设计**: 移动优先，使用响应式断点
- **颜色系统**: 使用项目定义的颜色系统

```typescript
// ✅ 好的做法
<div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
  <h1 className="text-2xl font-bold text-purple-600 md:text-3xl">
    Title
  </h1>
</div>

// ❌ 不好的做法
<div style={{ padding: '20px', color: '#9333ea' }}>
  <h1>Title</h1>
</div>
```

### 文件组织规范

- **组件文件**: 一个文件一个组件
- **工具函数**: 放在 `lib/utils/` 目录
- **类型定义**: 放在 `types/` 目录或组件文件内

---

## 🌍 翻译系统

### 翻译键命名规范

使用 `snake_case` 命名：

```json
{
  "user_profile": {
    "title": "User Profile",
    "name_label": "Name",
    "email_label": "Email"
  }
}
```

### 添加新翻译

1. **在翻译文件中添加键**:

```json
// messages/en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Feature description"
  }
}

// messages/zh.json
{
  "newFeature": {
    "title": "新功能",
    "description": "功能描述"
  }
}
```

2. **在组件中使用**:

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function NewFeature() {
  const t = useTranslations('newFeature');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 翻译键检查

```bash
# 检查翻译键同步
npm run translations:check

# 检查硬编码文本
npm run detect-hardcode

# 生成翻译类型
npm run types:generate
```

### 翻译系统最佳实践

1. **不要硬编码文本**: 所有用户可见的文本都应使用翻译键
2. **命名空间**: 使用有意义的命名空间（如 `userProfile`, `homePage`）
3. **键名清晰**: 使用描述性的键名（如 `title`, `description`, `submit_button`）
4. **保持同步**: 确保英文和中文翻译键结构一致

---

## 🧩 组件开发

### 创建新组件

1. **创建组件文件**:

```typescript
// components/ui/NewComponent.tsx
'use client';

import { useTranslations } from 'next-intl';

interface NewComponentProps {
  title: string;
  description?: string;
}

export default function NewComponent({ 
  title, 
  description 
}: NewComponentProps) {
  const t = useTranslations('newComponent');
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
```

2. **添加翻译键**:

```json
// messages/en.json
{
  "newComponent": {
    "title": "New Component",
    "description": "Component description"
  }
}
```

3. **导出组件**:

```typescript
// 使用 export default
export default function NewComponent() { ... }
```

### 组件类型

- **客户端组件**: 使用 `'use client'` 指令（需要交互、状态管理）
- **服务端组件**: 默认（不需要交互、SEO 重要）

```typescript
// 客户端组件（需要 useState, useEffect 等）
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  // ...
}

// 服务端组件（默认）
import { getTranslations } from 'next-intl/server';

export default async function ServerComponent() {
  const t = await getTranslations('page');
  // ...
}
```

---

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- component.test.tsx

# 运行测试（观察模式）
npm test -- --watch
```

### 测试规范

- **单元测试**: 测试单个组件或函数
- **集成测试**: 测试组件之间的交互
- **E2E 测试**: 测试完整用户流程

---

## ❓ 常见问题

### Q: 如何添加新页面？

A: 在 `app/[locale]/` 目录下创建新目录和 `page.tsx` 文件：

```typescript
// app/[locale]/new-page/page.tsx
import { getTranslations } from 'next-intl/server';
import { generatePageSEO } from '@/lib/seo/page-seo';

export async function generateMetadata({ params }) {
  const t = await getTranslations('newPage');
  return generatePageSEO({
    locale: params.locale,
    path: '/new-page',
    title: t('title'),
    description: t('description'),
  });
}

export default async function NewPage() {
  const t = await getTranslations('newPage');
  return <div>{t('content')}</div>;
}
```

### Q: 如何添加新的翻译命名空间？

A: 在 `messages/en.json` 和 `messages/zh.json` 中添加新的命名空间：

```json
{
  "newNamespace": {
    "key1": "Value 1",
    "key2": "Value 2"
  }
}
```

### Q: 如何修复 ESLint 错误？

A: 运行自动修复：

```bash
npm run lint:fix
```

### Q: 如何检查硬编码文本？

A: 运行硬编码检测工具：

```bash
npm run detect-hardcode
```

### Q: 如何更新 SEO 配置？

A: 使用 `generatePageSEO` 函数：

```typescript
import { generatePageSEO } from '@/lib/seo/page-seo';

export async function generateMetadata({ params }) {
  return generatePageSEO({
    locale: params.locale,
    path: '/your-page',
    title: 'Page Title',
    description: 'Page description',
    keywords: ['keyword1', 'keyword2'],
  });
}
```

---

## 📚 相关文档

- [部署指南](./DEPLOYMENT_GUIDE.md)
- [翻译键管理流程](./TRANSLATION_KEY_MANAGEMENT_PROCESS.md)
- [项目完成总结报告](../../项目完成总结报告-最终版.md)

---

## 🤝 获取帮助

如果遇到问题：

1. 查看 [常见问题](#常见问题)
2. 查看相关文档
3. 在 GitHub Issues 中搜索类似问题
4. 创建新的 Issue 描述问题

---

**最后更新：** 2025-01-19














