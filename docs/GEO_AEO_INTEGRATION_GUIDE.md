# GEO/AEO 集成指南

**版本：** 1.0.0  
**最后更新：** 2025-01-19

---

## 📋 目录

1. [概述](#概述)
2. [快速开始](#快速开始)
3. [Schema 集成](#schema-集成)
4. [术语标准化](#术语标准化)
5. [AI 搜索标记](#ai-搜索标记)
6. [监控设置](#监控设置)
7. [最佳实践](#最佳实践)

---

## 概述

本指南介绍如何在 PeriodHub 项目中集成 GEO（生成式引擎优化）和 AEO（答案引擎优化）功能。

### 主要功能

- ✅ MedicalWebPage 和 MedicalCondition Schema
- ✅ 医学术语标准化
- ✅ AI 搜索优化标记
- ✅ AEO 追踪和监控

---

## 快速开始

### 1. 导入必要的模块

```typescript
import { generateMedicalWebPageSchema } from "@/lib/seo/medical-schema-generator";
import { generateMedicalConditionSchema } from "@/lib/seo/medical-schema-generator";
import { safeStringify } from "@/lib/utils/json-serialization";
```

### 2. 在页面中添加 Schema

```typescript
// 在页面组件中
const medicalConditionSchema = generateMedicalConditionSchema(
  "DYSMENORRHEA",
  locale as "en" | "zh"
);

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeStringify(medicalConditionSchema),
      }}
    />
    {/* 页面内容 */}
  </>
);
```

---

## Schema 集成

### MedicalWebPage Schema

用于包含医学内容的网页。

```typescript
const medicalWebPageSchema = generateMedicalWebPageSchema({
  title: "Page Title",
  description: "Page Description",
  condition: "DYSMENORRHEA",
  citations: [
    "ACOG_DYSMENORRHEA",
    "WHO_REPRODUCTIVE_HEALTH",
    "NIH_DYSMENORRHEA",
  ],
  locale: "en",
  url: `${baseUrl}/${locale}`,
  lastReviewed: new Date().toISOString().split("T")[0],
});
```

### MedicalCondition Schema

用于独立的医学条件信息。

```typescript
const medicalConditionSchema = generateMedicalConditionSchema(
  "DYSMENORRHEA",
  locale as "en" | "zh"
);
```

### 支持的医学实体

- `DYSMENORRHEA` - 痛经
- `ENDOMETRIOSIS` - 子宫内膜异位症
- 更多实体请查看 `lib/seo/medical-entities.ts`

---

## 术语标准化

### 使用术语标准化

```typescript
import {
  standardizeMedicalTerm,
  getMedicalTermSynonyms,
  areTermsEquivalent,
} from "@/lib/seo/medical-terminology";

// 标准化术语
const standardized = standardizeMedicalTerm("period-pain", "en");
// 返回: "Dysmenorrhea"

// 获取同义词
const synonyms = getMedicalTermSynonyms("dysmenorrhea", "en");
// 返回: ["Period Pain", "Menstrual Cramps", ...]

// 检查等价性
const isEquivalent = areTermsEquivalent("period-pain", "menstrual-cramps");
// 返回: true
```

### 在内容中应用

```typescript
import { markMedicalTermsInText } from "@/lib/seo/medical-terminology";

const text = "Period pain can be managed with heat therapy.";
const marked = markMedicalTermsInText(text, "en");
// 返回带有 data-entity 标记的 HTML
```

---

## AI 搜索标记

### 添加 AI 搜索标记

在组件中添加以下属性：

```tsx
<section
  data-ai-searchable="true"
  data-entity="DYSMENORRHEA"
  data-quotable="true"
>
  {/* 内容 */}
</section>
```

### 标记说明

- `data-ai-searchable="true"` - 标记内容可被 AI 搜索
- `data-entity="DYSMENORRHEA"` - 指定医学实体
- `data-quotable="true"` - 标记内容可被引用

### 已集成的组件

- ✅ `HeroNew.tsx` - 首页 Hero 区域
- ✅ `StatsSection.tsx` - 统计数据区域
- ✅ `ToolsSection.tsx` - 工具区域
- ✅ `CTASection.tsx` - CTA 区域

---

## 监控设置

### 1. Schema 验证

使用验证脚本定期检查 Schema：

```bash
# 运行验证脚本
node scripts/validate-schema.js

# 集成到 cron（每天运行）
0 2 * * * cd /path/to/project && node scripts/validate-schema.js
```

### 2. AEO 追踪

在客户端追踪 AI 引用：

```typescript
// 追踪 AI 引用
async function trackAIReference(data: AIReference) {
  await fetch('/api/aeo/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
```

### 3. 获取指标

```typescript
// 获取 AEO 指标
async function getMetrics(days: number = 30) {
  const response = await fetch(`/api/aeo/metrics?days=${days}`);
  return response.json();
}
```

---

## 最佳实践

### 1. Schema 使用

- ✅ 每个医学内容页面都应包含 MedicalCondition Schema
- ✅ 首页应包含 MedicalWebPage Schema
- ✅ 定期验证 Schema 的正确性

### 2. 术语标准化

- ✅ 在内容创建时使用标准化术语
- ✅ 使用 `markMedicalTermsInText` 标记术语
- ✅ 保持术语使用的一致性

### 3. AI 搜索标记

- ✅ 为主要内容区域添加标记
- ✅ 使用正确的实体名称
- ✅ 避免过度标记

### 4. 监控

- ✅ 定期检查 Schema 验证结果
- ✅ 监控 AEO 指标趋势
- ✅ 及时修复发现的问题

---

## 故障排除

### Schema 验证失败

1. 检查 JSON-LD 格式是否正确
2. 验证必需字段是否存在
3. 使用 Google Rich Results Test 验证

### 术语标准化不工作

1. 检查术语是否在 `MEDICAL_TERMINOLOGY` 中定义
2. 验证 locale 参数是否正确
3. 查看控制台错误信息

### AEO 追踪失败

1. 检查 API 路由是否正确配置
2. 验证请求格式是否正确
3. 查看服务器日志

---

## 相关文档

- [API 文档](./GEO_AEO_API_DOCUMENTATION.md)
- [测试脚本](../scripts/validate-schema.js)
- [医学实体定义](../lib/seo/medical-entities.ts)
- [术语标准化](../lib/seo/medical-terminology.ts)

---

**文档维护者：** PeriodHub Development Team  
**联系方式：** dev@periodhub.health














