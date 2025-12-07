# AEO 追踪数据库设置指南

**版本：** 1.0.0  
**最后更新：** 2025-01-19

---

## 📋 目录

1. [概述](#概述)
2. [数据库选择](#数据库选择)
3. [安装和配置](#安装和配置)
4. [运行迁移](#运行迁移)
5. [配置应用](#配置应用)
6. [验证](#验证)

---

## 概述

本指南介绍如何为 AEO 追踪系统设置数据库持久化存储。

### 支持的数据库

- ✅ PostgreSQL（推荐）
- ⚠️ MySQL/MariaDB（需要调整 SQL 语法）
- ⚠️ SQLite（适合开发环境）

---

## 数据库选择

### PostgreSQL（推荐）

**优势：**
- 强大的 JSON 支持
- 优秀的性能
- 丰富的索引类型
- 良好的扩展性

**安装：**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# 创建数据库
createdb periodhub_aeo
```

---

## 安装和配置

### 1. 安装数据库客户端

```bash
# 安装 pg (PostgreSQL)
npm install pg
npm install --save-dev @types/pg

# 或使用 Prisma（推荐）
npm install prisma @prisma/client
npx prisma init
```

### 2. 配置环境变量

在 `.env.local` 或 `.env` 中添加：

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/periodhub_aeo?sslmode=disable

# 或使用连接池
DATABASE_URL=postgresql://user:password@localhost:5432/periodhub_aeo?connection_limit=10
```

---

## 运行迁移

### 方法 1：使用 psql

```bash
# 连接到数据库
psql -U user -d periodhub_aeo

# 运行迁移脚本
\i db/migrations/001_create_aeo_tracking.sql

# 验证表是否创建
\dt
\d aeo_references
```

### 方法 2：使用 Node.js 脚本

创建 `scripts/run-migration.js`：

```javascript
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const sql = fs.readFileSync(
      path.join(__dirname, '../db/migrations/001_create_aeo_tracking.sql'),
      'utf8'
    );

    await client.query(sql);
    console.log('✅ Migration completed');

    // 验证
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'aeo_references'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Table aeo_references created successfully');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
```

运行：

```bash
node scripts/run-migration.js
```

---

## 配置应用

### 1. 更新 AEO Repository

编辑 `lib/db/aeo-repository.ts`，实现实际的数据库操作：

```typescript
import { Client } from 'pg';

let dbClient: Client | null = null;

function getClient(): Client {
  if (!dbClient) {
    dbClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    dbClient.connect();
  }
  return dbClient;
}

export async function saveAIReference(reference: AIReference): Promise<number> {
  const client = getClient();
  const query = `
    INSERT INTO aeo_references (
      source, page_url, content_snippet, accuracy_score,
      includes_source_link, user_query, timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  
  const result = await client.query(query, [
    reference.source,
    reference.pageUrl,
    reference.contentSnippet,
    reference.accuracyScore || null,
    reference.includesSourceLink,
    reference.userQuery || null,
    reference.timestamp || new Date().toISOString(),
  ]);
  
  return result.rows[0].id;
}
```

### 2. 使用连接池（推荐）

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function saveAIReference(reference: AIReference): Promise<number> {
  const query = `
    INSERT INTO aeo_references (
      source, page_url, content_snippet, accuracy_score,
      includes_source_link, user_query, timestamp
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  
  const result = await pool.query(query, [
    reference.source,
    reference.pageUrl,
    reference.contentSnippet,
    reference.accuracyScore || null,
    reference.includesSourceLink,
    reference.userQuery || null,
    reference.timestamp || new Date().toISOString(),
  ]);
  
  return result.rows[0].id;
}
```

---

## 验证

### 1. 测试数据库连接

```bash
# 使用 psql
psql $DATABASE_URL -c "SELECT version();"

# 或使用 Node.js
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => {
  console.log('✅ Database connected');
  client.end();
}).catch(err => {
  console.error('❌ Connection failed:', err);
  process.exit(1);
});
"
```

### 2. 测试 API

```bash
# 测试追踪 API
curl -X POST http://localhost:3000/api/aeo/track \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Perplexity",
    "pageUrl": "https://www.periodhub.health/en",
    "contentSnippet": "Test content",
    "includesSourceLink": true
  }'

# 测试指标 API
curl http://localhost:3000/api/aeo/metrics?days=30
```

### 3. 验证数据

```sql
-- 查看最近引用
SELECT * FROM aeo_references ORDER BY timestamp DESC LIMIT 10;

-- 查看统计
SELECT * FROM aeo_metrics_daily ORDER BY date DESC LIMIT 10;

-- 查看页面统计
SELECT * FROM aeo_page_stats ORDER BY total_references DESC LIMIT 10;
```

---

## 维护

### 数据清理

定期清理旧数据（保留 90 天）：

```sql
DELETE FROM aeo_references 
WHERE timestamp < NOW() - INTERVAL '90 days';
```

### 备份

```bash
# PostgreSQL 备份
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 恢复
psql $DATABASE_URL < backup_20250119.sql
```

### 性能优化

如果数据量很大，考虑：

1. **分区表**：按日期分区
2. **归档**：将旧数据移到归档表
3. **索引优化**：根据查询模式调整索引

---

## 故障排除

### 连接失败

1. 检查 `DATABASE_URL` 是否正确
2. 检查数据库服务是否运行
3. 检查防火墙设置
4. 检查用户权限

### 迁移失败

1. 检查 SQL 语法是否正确
2. 检查表是否已存在
3. 检查用户权限
4. 查看数据库日志

### 性能问题

1. 检查索引是否创建
2. 分析慢查询
3. 考虑使用连接池
4. 优化查询语句

---

## 相关文档

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [pg 库文档](https://node-postgres.com/)
- [Prisma 文档](https://www.prisma.io/docs/)

---

**文档维护者：** PeriodHub Development Team  
**联系方式：** dev@periodhub.health














