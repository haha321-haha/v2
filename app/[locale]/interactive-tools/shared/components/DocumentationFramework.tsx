"use client";

import React, { useState, useEffect } from "react";

/**
 * P3阶段：技术文档框架
 * 提供代码注释、API文档、用户指南和部署文档
 */

// 文档类型接口
interface DocumentationItem {
  id: string;
  title: string;
  type: "api" | "guide" | "deployment" | "code" | "architecture";
  category: string;
  content: string;
  lastUpdated: string;
  author: string;
  tags: string[];
  status: "draft" | "review" | "published";
}

// 文档分类接口
interface DocumentationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: DocumentationItem[];
}

// 文档框架钩子
export function useDocumentationFramework() {
  const [categories, setCategories] = useState<DocumentationCategory[]>([]);
  const [selectedItem, setSelectedItem] = useState<DocumentationItem | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // 初始化文档分类
  useEffect(() => {
    const initialCategories: DocumentationCategory[] = [
      {
        id: "api-docs",
        name: "API文档",
        description: "应用程序接口文档",
        icon: "🔌",
        items: [
          {
            id: "symptom-assessment-api",
            title: "症状评估API",
            type: "api",
            category: "api-docs",
            content: `# 症状评估API

## 概述
症状评估API提供痛经症状的评估和分析功能。

## 端点
\`\`\`typescript
POST /api/symptom-assessment
Content-Type: application/json

{
  "answers": {
    "painLevel": "moderate",
    "painDuration": "medium",
    "painLocation": ["lowerAbdomen", "lowerBack"],
    "accompanyingSymptoms": ["fatigue", "headache"],
    "reliefPreference": "natural"
  }
}
\`\`\`

## 响应
\`\`\`typescript
{
  "success": true,
  "data": {
    "score": 6.5,
    "severity": "moderate",
    "riskLevel": "medium",
    "recommendations": {
      "immediate": ["热敷", "轻度运动"],
      "longTerm": ["规律作息", "饮食调理"]
    }
  }
}
\`\`\``,
            lastUpdated: "2024-01-15",
            author: "开发团队",
            tags: ["API", "症状评估", "痛经"],
            status: "published",
          },
          {
            id: "pain-tracker-api",
            title: "疼痛追踪API",
            type: "api",
            category: "api-docs",
            content: `# 疼痛追踪API

## 概述
疼痛追踪API用于记录和分析用户的疼痛数据。

## 端点
\`\`\`typescript
POST /api/pain-tracker/record
GET /api/pain-tracker/history
PUT /api/pain-tracker/record/:id
DELETE /api/pain-tracker/record/:id
\`\`\``,
            lastUpdated: "2024-01-15",
            author: "开发团队",
            tags: ["API", "疼痛追踪", "数据记录"],
            status: "published",
          },
        ],
      },
      {
        id: "user-guides",
        name: "用户指南",
        description: "用户使用指南和教程",
        icon: "📖",
        items: [
          {
            id: "getting-started",
            title: "快速开始指南",
            type: "guide",
            category: "user-guides",
            content: `# 快速开始指南

## 欢迎使用痛经影响评估工具

本工具帮助您：
- 评估痛经症状的严重程度
- 获得个性化的缓解建议
- 追踪疼痛模式和趋势
- 了解身体状况

## 第一步：症状评估
1. 点击"开始评估"按钮
2. 回答关于您症状的问题
3. 查看评估结果和建议

## 第二步：疼痛追踪
1. 记录您的疼痛数据
2. 查看历史趋势
3. 获得模式分析

## 第三步：个性化建议
根据您的评估结果和追踪数据，获得：
- 即时缓解方法
- 长期管理策略
- 生活方式建议`,
            lastUpdated: "2024-01-15",
            author: "产品团队",
            tags: ["指南", "快速开始", "用户"],
            status: "published",
          },
          {
            id: "symptom-assessment-guide",
            title: "症状评估使用指南",
            type: "guide",
            category: "user-guides",
            content: `# 症状评估使用指南

## 如何准确评估症状

### 疼痛程度评估
- 1-3分：轻度疼痛，不影响日常活动
- 4-6分：中度疼痛，影响专注力和工作效率
- 7-8分：重度疼痛，需要停止活动
- 9-10分：极重度疼痛，无法忍受

### 疼痛持续时间
- 几小时：仅在经期第一天
- 1-2天：经期前1-2天较严重
- 3天以上：持续3天或更长时间
- 不规律：每次周期变化很大

### 伴随症状
选择所有您经历的症状：
- 疲劳或乏力
- 头痛或偏头痛
- 恶心或呕吐
- 腹泻或便秘
- 情绪波动
- 腹胀
- 乳房胀痛
- 头晕或眩晕`,
            lastUpdated: "2024-01-15",
            author: "产品团队",
            tags: ["指南", "症状评估", "疼痛"],
            status: "published",
          },
        ],
      },
      {
        id: "deployment",
        name: "部署文档",
        description: "部署和运维相关文档",
        icon: "🚀",
        items: [
          {
            id: "deployment-guide",
            title: "部署指南",
            type: "deployment",
            category: "deployment",
            content: `# 部署指南

## 环境要求
- Node.js 18+
- Next.js 14+
- PostgreSQL 14+
- Redis 6+

## 部署步骤

### 1. 环境准备
\`\`\`bash
# 安装依赖
npm install

# 环境变量配置
cp .env.example .env.local
\`\`\`

### 2. 数据库设置
\`\`\`bash
# 创建数据库
createdb dysmenorrhea_assessment

# 运行迁移
npm run db:migrate
\`\`\`

### 3. 构建和部署
\`\`\`bash
# 构建应用
npm run build

# 启动应用
npm run start
\`\`\`

## 生产环境配置
- 启用HTTPS
- 配置CDN
- 设置监控
- 备份策略`,
            lastUpdated: "2024-01-15",
            author: "运维团队",
            tags: ["部署", "运维", "生产环境"],
            status: "published",
          },
        ],
      },
      {
        id: "code-docs",
        name: "代码文档",
        description: "代码注释和架构文档",
        icon: "💻",
        items: [
          {
            id: "architecture-overview",
            title: "架构概览",
            type: "architecture",
            category: "code-docs",
            content: `# 架构概览

## 技术栈
- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **国际化**: next-intl
- **测试**: Jest, React Testing Library

## 项目结构
\`\`\`
app/
├── [locale]/                 # 国际化路由
│   ├── interactive-tools/    # 交互工具
│   ├── articles/            # 文章页面
│   └── scenario-solutions/  # 场景解决方案
├── api/                     # API路由
├── globals.css              # 全局样式
└── layout.tsx              # 根布局

components/                  # 共享组件
├── ui/                     # UI组件
├── forms/                  # 表单组件
└── charts/                 # 图表组件

lib/                        # 工具库
├── utils/                  # 工具函数
├── hooks/                  # 自定义钩子
└── stores/                 # 状态管理
\`\`\`

## 核心模块
1. **症状评估模块**: 评估痛经症状严重程度
2. **疼痛追踪模块**: 记录和分析疼痛数据
3. **建议生成模块**: 提供个性化建议
4. **数据同步模块**: 处理数据同步和备份`,
            lastUpdated: "2024-01-15",
            author: "开发团队",
            tags: ["架构", "技术栈", "项目结构"],
            status: "published",
          },
        ],
      },
    ];

    setCategories(initialCategories);
  }, []);

  // 搜索文档
  const searchDocumentation = (query: string) => {
    setSearchQuery(query);
    // 这里可以实现实际的搜索逻辑
  };

  // 过滤文档
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ),
    }))
    .filter((category) => category.items.length > 0);

  // 创建新文档
  const createDocumentation = (
    item: Omit<DocumentationItem, "id" | "lastUpdated">,
  ) => {
    const newItem: DocumentationItem = {
      ...item,
      id: `doc-${Date.now()}`,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setCategories((prev) =>
      prev.map((category) =>
        category.id === item.category
          ? { ...category, items: [...category.items, newItem] }
          : category,
      ),
    );
  };

  // 更新文档
  const updateDocumentation = (
    id: string,
    updates: Partial<DocumentationItem>,
  ) => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        items: category.items.map((item) =>
          item.id === id ? { ...item, ...updates } : item,
        ),
      })),
    );
  };

  // 删除文档
  const deleteDocumentation = (id: string) => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        items: category.items.filter((item) => item.id !== id),
      })),
    );
  };

  return {
    categories: filteredCategories,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    isEditing,
    setIsEditing,
    searchDocumentation,
    createDocumentation,
    updateDocumentation,
    deleteDocumentation,
  };
}

import { logInfo } from "@/lib/debug-logger";

// 文档框架组件
export function DocumentationFramework() {
  const {
    categories,
    selectedItem,
    setSelectedItem,
    searchQuery,
    setSearchQuery,
    isEditing,
    setIsEditing,
  } = useDocumentationFramework();

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex h-screen">
        {/* 侧边栏 */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* 搜索栏 */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索文档..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
            </div>
          </div>

          {/* 文档分类 */}
          <div className="flex-1 overflow-y-auto p-4">
            {categories.map((category) => (
              <div key={category.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{category.icon}</span>
                  <h3 className="font-semibold text-gray-800">
                    {category.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {category.description}
                </p>

                <div className="space-y-2">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedItem?.id === item.id
                          ? "bg-blue-100 border border-blue-300"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">
                          {item.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.status === "published"
                              ? "bg-green-100 text-green-800"
                              : item.status === "review"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status === "published"
                            ? "已发布"
                            : item.status === "review"
                              ? "审核中"
                              : "草稿"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {item.lastUpdated}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {item.author}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex flex-col">
          {selectedItem ? (
            <>
              {/* 文档头部 */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {selectedItem.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>最后更新: {selectedItem.lastUpdated}</span>
                      <span>作者: {selectedItem.author}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          selectedItem.status === "published"
                            ? "bg-green-100 text-green-800"
                            : selectedItem.status === "review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedItem.status === "published"
                          ? "已发布"
                          : selectedItem.status === "review"
                            ? "审核中"
                            : "草稿"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isEditing ? "查看" : "编辑"}
                    </button>
                  </div>
                </div>
              </div>

              {/* 文档内容 */}
              <div className="flex-1 p-6 overflow-y-auto">
                {isEditing ? (
                  <textarea
                    value={selectedItem.content}
                    onChange={() => {
                      // 这里应该调用updateDocumentation
                      logInfo("文档内容更新（未实现）");
                    }}
                    className="w-full h-full p-4 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="输入文档内容..."
                  />
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                      {selectedItem.content}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-xl font-semibold mb-2">选择文档查看</h2>
                <p>从左侧列表中选择一个文档来查看内容</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DocumentationFrameworkModule = {
  useDocumentationFramework,
  DocumentationFramework,
};

export default DocumentationFrameworkModule;
