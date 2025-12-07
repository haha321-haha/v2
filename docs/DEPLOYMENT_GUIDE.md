# 🚀 PeriodHub 部署指南

**最后更新：** 2025-01-19  
**适用版本：** v2.0.0+

---

## 📋 目录

1. [部署前准备](#部署前准备)
2. [Vercel 部署（推荐）](#vercel-部署推荐)
3. [其他部署选项](#其他部署选项)
4. [环境变量配置](#环境变量配置)
5. [构建优化](#构建优化)
6. [部署后检查](#部署后检查)
7. [故障排除](#故障排除)

---

## 🔧 部署前准备

### 1. 代码质量检查

```bash
# 运行所有检查
npm run translations:check    # 翻译键检查
npm run lint                  # ESLint 检查
npm run type-check            # TypeScript 类型检查
npm run detect-hardcode       # 硬编码文本检查

# 或运行完整检查
npm run build:safe            # 带翻译验证的构建
```

### 2. 构建测试

```bash
# 本地构建测试
npm run build

# 启动生产服务器测试
npm start

# 访问 http://localhost:3000 测试
```

### 3. 环境变量准备

确保所有必要的环境变量都已配置（见 [环境变量配置](#环境变量配置)）

---

## 🌐 Vercel 部署（推荐）

### 方法 1: 通过 Vercel Dashboard

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (默认)
   - **Install Command**: `npm install`

4. **配置环境变量**
   - 在 "Environment Variables" 中添加环境变量
   - 参考 [环境变量配置](#环境变量配置)

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成

### 方法 2: 通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署到预览环境
vercel

# 4. 部署到生产环境
vercel --prod
```

### Vercel 配置

项目已包含 `vercel.json` 配置文件：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

## 🖥️ 其他部署选项

### Netlify 部署

1. **通过 Netlify Dashboard**
   - 访问 [netlify.com](https://netlify.com)
   - 连接 GitHub 仓库
   - 配置构建设置：
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`

2. **通过 Netlify CLI**
   ```bash
   # 安装 Netlify CLI
   npm i -g netlify-cli
   
   # 登录
   netlify login
   
   # 部署
   netlify deploy --prod
   ```

### 自托管部署

#### 使用 PM2

```bash
# 1. 构建项目
npm run build

# 2. 安装 PM2
npm i -g pm2

# 3. 启动应用
pm2 start npm --name "periodhub" -- start

# 4. 保存 PM2 配置
pm2 save

# 5. 设置开机自启
pm2 startup
```

#### 使用 Docker

创建 `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

构建和运行：

```bash
# 构建镜像
docker build -t periodhub .

# 运行容器
docker run -p 3000:3000 periodhub
```

---

## ⚙️ 环境变量配置

### 必需环境变量

创建 `.env.local` 文件（开发环境）或在部署平台配置（生产环境）：

```bash
# 应用配置
NEXT_PUBLIC_APP_URL=https://periodhub.health
NEXT_PUBLIC_DEFAULT_LOCALE=zh

# 可选：分析工具
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
NEXT_PUBLIC_MICROSOFT_CLARITY_ID=your_clarity_id
```

### 环境变量说明

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `NEXT_PUBLIC_APP_URL` | ✅ | 应用 URL | `https://periodhub.health` |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | ✅ | 默认语言 | `zh` 或 `en` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | ❌ | Google Analytics ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_MICROSOFT_CLARITY_ID` | ❌ | Microsoft Clarity ID | `xxxxxxxxxx` |

### Vercel 环境变量配置

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加变量：
   - **Name**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://periodhub.health`
   - **Environment**: Production, Preview, Development
4. 点击 "Save"
5. 重新部署以应用更改

---

## 🚀 构建优化

### 构建命令

```bash
# 标准构建
npm run build

# 带翻译验证的构建
npm run build:safe

# 清理构建缓存
npm run clean-build
```

### 构建优化配置

项目已配置以下优化：

- **静态生成**: 自动静态优化
- **图片优化**: Sharp 图片处理
- **代码分割**: 自动代码分割
- **Tree Shaking**: 移除未使用代码
- **压缩**: Gzip/Brotli 压缩

### 构建性能

```bash
# 分析构建大小
npm run bundle:analyze

# 性能审计
npm run perf:audit
```

---

## ✅ 部署后检查

### 1. 功能检查

- [ ] 首页正常加载
- [ ] 语言切换正常
- [ ] 所有页面可访问
- [ ] 交互工具正常工作
- [ ] 图片正常加载

### 2. SEO 检查

```bash
# SEO 检查
npm run seo:check

# 提交 sitemap
npm run seo:submit-sitemap
```

检查项：
- [ ] Meta 标签正确
- [ ] 结构化数据正确
- [ ] Sitemap 可访问
- [ ] Robots.txt 正确

### 3. 性能检查

```bash
# Lighthouse 测试
npm run lighthouse
```

检查项：
- [ ] Core Web Vitals 达标
- [ ] 页面加载速度 < 3s
- [ ] 图片优化完成
- [ ] 代码分割正确

### 4. 翻译检查

- [ ] 所有页面有英文和中文版本
- [ ] 翻译键完整
- [ ] 无硬编码文本

---

## 🔍 故障排除

### 构建失败

**问题**: 构建时出现错误

**解决方案**:
```bash
# 1. 清理构建缓存
rm -rf .next node_modules/.cache

# 2. 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 3. 检查 TypeScript 错误
npm run type-check

# 4. 检查 ESLint 错误
npm run lint

# 5. 重新构建
npm run build
```

### 翻译键缺失

**问题**: 运行时出现翻译键缺失错误

**解决方案**:
```bash
# 1. 检查翻译键同步
npm run translations:check

# 2. 检查硬编码文本
npm run detect-hardcode

# 3. 生成翻译类型
npm run types:generate
```

### 环境变量未生效

**问题**: 环境变量在生产环境未生效

**解决方案**:
1. 检查环境变量名称（必须以 `NEXT_PUBLIC_` 开头）
2. 在部署平台重新配置环境变量
3. 重新部署应用

### 图片加载失败

**问题**: 图片在生产环境无法加载

**解决方案**:
1. 检查图片路径（使用相对路径）
2. 确保图片在 `public/` 目录
3. 检查图片优化配置

### 性能问题

**问题**: 页面加载速度慢

**解决方案**:
```bash
# 1. 运行性能审计
npm run perf:audit

# 2. 优化图片
npm run optimize:images

# 3. 检查 Core Web Vitals
npm run optimize:core-web-vitals
```

---

## 📊 监控和维护

### 性能监控

- **Vercel Analytics**: 自动性能监控
- **Google Analytics**: 用户行为分析
- **Lighthouse CI**: 持续性能监控

### 日志监控

- **Vercel Logs**: 查看部署和运行时日志
- **Error Tracking**: 错误追踪和报告

### 定期维护

```bash
# 每周运行
npm run project:health

# 包括：
# - 硬编码检查
# - SEO 检查
# - 性能审计
```

---

## 🔐 安全配置

### HTTPS

- Vercel 自动提供 HTTPS
- 确保所有环境变量使用 HTTPS URL

### 安全头

项目已配置安全头（在 `next.config.js` 中）：

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ];
}
```

---

## 📚 相关文档

- [开发指南](./DEVELOPMENT_GUIDE.md)
- [翻译键管理流程](./TRANSLATION_KEY_MANAGEMENT_PROCESS.md)
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

## 🤝 获取帮助

如果遇到部署问题：

1. 查看 [故障排除](#故障排除)
2. 查看相关文档
3. 在 GitHub Issues 中搜索类似问题
4. 创建新的 Issue 描述问题

---

**最后更新：** 2025-01-19














