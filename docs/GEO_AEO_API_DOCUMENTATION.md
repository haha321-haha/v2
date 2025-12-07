# GEO/AEO API 文档

**版本：** 1.0.0  
**最后更新：** 2025-01-19

---

## 📋 目录

1. [概述](#概述)
2. [AEO 追踪 API](#aeo-追踪-api)
3. [AEO 指标 API](#aeo-指标-api)
4. [使用示例](#使用示例)
5. [错误处理](#错误处理)

---

## 概述

GEO/AEO API 提供以下功能：

- **AI 引用追踪**：记录 AI 搜索引擎（Perplexity, ChatGPT, Claude 等）对网站内容的引用
- **指标查询**：获取 AEO 性能指标和统计数据

---

## AEO 追踪 API

### POST /api/aeo/track

记录 AI 引用数据。

#### 请求头

```
Content-Type: application/json
```

#### 请求体

```typescript
{
  source: string;              // 引用来源（如 "Perplexity", "ChatGPT", "Claude"）
  pageUrl: string;             // 被引用的页面 URL
  contentSnippet: string;      // 引用的内容片段
  timestamp?: string;          // 引用时间（ISO 8601，可选）
  accuracyScore?: number;      // 引用准确性评分（0-100，可选）
  includesSourceLink: boolean; // 是否包含来源链接
  userQuery?: string;          // 用户查询（可选）
}
```

#### 响应

**成功 (200)**
```json
{
  "success": true
}
```

**错误 (400)**
```json
{
  "error": "Missing required fields: source, pageUrl, contentSnippet"
}
```

**错误 (500)**
```json
{
  "error": "Internal server error"
}
```

#### 示例

```bash
curl -X POST https://www.periodhub.health/api/aeo/track \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Perplexity",
    "pageUrl": "https://www.periodhub.health/en",
    "contentSnippet": "PeriodHub provides evidence-based guidance...",
    "includesSourceLink": true,
    "accuracyScore": 95,
    "userQuery": "How to manage period pain?"
  }'
```

---

## AEO 指标 API

### GET /api/aeo/metrics

获取 AEO 性能指标。

#### 查询参数

- `days` (可选): 统计天数，默认 30，范围 1-365

#### 响应

**成功 (200)**
```json
{
  "totalReferences": 150,
  "referencesBySource": {
    "Perplexity": 80,
    "ChatGPT": 50,
    "Claude": 20
  },
  "referencesByPage": {
    "https://www.periodhub.health/en": 50,
    "https://www.periodhub.health/zh": 30
  },
  "averageAccuracyScore": 92.5,
  "sourceLinkPercentage": 85.3,
  "recentTrend": [
    { "date": "2025-01-01", "count": 5 },
    { "date": "2025-01-02", "count": 8 }
  ]
}
```

**错误 (400)**
```json
{
  "error": "Invalid days parameter. Must be between 1 and 365."
}
```

#### 示例

```bash
# 获取最近 30 天的指标
curl https://www.periodhub.health/api/aeo/metrics

# 获取最近 7 天的指标
curl https://www.periodhub.health/api/aeo/metrics?days=7
```

---

## 使用示例

### JavaScript/TypeScript

```typescript
// 追踪 AI 引用
async function trackAIReference(data: AIReference) {
  const response = await fetch('/api/aeo/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to track reference');
  }

  return response.json();
}

// 获取指标
async function getMetrics(days: number = 30) {
  const response = await fetch(`/api/aeo/metrics?days=${days}`);
  
  if (!response.ok) {
    throw new Error('Failed to get metrics');
  }

  return response.json();
}
```

### Python

```python
import requests

# 追踪 AI 引用
def track_ai_reference(data):
    response = requests.post(
        'https://www.periodhub.health/api/aeo/track',
        json=data
    )
    response.raise_for_status()
    return response.json()

# 获取指标
def get_metrics(days=30):
    response = requests.get(
        f'https://www.periodhub.health/api/aeo/metrics?days={days}'
    )
    response.raise_for_status()
    return response.json()
```

---

## 错误处理

### HTTP 状态码

- `200` - 成功
- `400` - 请求参数错误
- `500` - 服务器内部错误

### 错误响应格式

```json
{
  "error": "Error message"
}
```

### 常见错误

1. **缺少必需字段**
   - 错误：`Missing required fields: source, pageUrl, contentSnippet`
   - 解决：确保请求体包含所有必需字段

2. **无效的天数参数**
   - 错误：`Invalid days parameter. Must be between 1 and 365.`
   - 解决：确保 `days` 参数在 1-365 范围内

3. **服务器错误**
   - 错误：`Internal server error`
   - 解决：检查服务器日志，联系技术支持

---

## 限制

- **速率限制**：每个 IP 每分钟最多 60 次请求
- **数据保留**：引用数据保留 90 天
- **最大请求体大小**：1MB

---

## 更新日志

### v1.0.0 (2025-01-19)
- 初始版本
- 添加 AEO 追踪 API
- 添加 AEO 指标 API

---

**文档维护者：** PeriodHub Development Team  
**联系方式：** dev@periodhub.health














