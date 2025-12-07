# Section 组件样式指南

**最后更新：** 2025-01-19

---

## 📋 组件列表

- `StatsSection` - 统计数据展示
- `ToolsSection` - 工具列表展示
- `ScenariosSection` - 场景解决方案展示
- `DownloadsSection` - 下载资源展示
- `PrivacySection` - 隐私政策通知
- `CTASection` - 行动号召

---

## 🎨 统一样式规范

### 容器样式

```typescript
// 标准 Section 容器
<section className="py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* 内容 */}
  </div>
</section>
```

### 标题样式

```typescript
// 标准标题
<h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
  {title}
</h2>

// 标准描述
<p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
  {description}
</p>
```

### 间距规范

- **Section 垂直间距**: `py-20` (80px)
- **容器水平间距**: `px-4 sm:px-6 lg:px-8`
- **标题底部间距**: `mb-4` 或 `mb-6`
- **描述底部间距**: `mb-16` 或 `mb-12`
- **卡片间距**: `gap-8`

### 颜色规范

- **主色调**: `purple-600`, `pink-500`
- **渐变**: `from-purple-600 to-pink-500`
- **文本颜色**: `text-gray-900 dark:text-white`
- **描述颜色**: `text-gray-600 dark:text-gray-400`
- **背景色**: `bg-white dark:bg-slate-800`

### 响应式断点

- **移动端**: 默认（< 640px）
- **平板**: `sm:` (>= 640px)
- **桌面**: `md:` (>= 768px)
- **大屏**: `lg:` (>= 1024px)

---

## 📝 组件使用示例

### StatsSection

```typescript
import StatsSection from '@/components/sections/StatsSection';

<StatsSection />
// 或自定义统计数据
<StatsSection stats={[
  { value: '10K+', label: 'Active Users' },
  { value: '4.8', label: 'User Rating' },
]} />
```

### ToolsSection

```typescript
import ToolsSection from '@/components/sections/ToolsSection';

<ToolsSection />
```

### ScenariosSection

```typescript
import ScenariosSection from '@/components/sections/ScenariosSection';

<ScenariosSection />
// 或自定义场景
<ScenariosSection scenarios={[...]} />
```

### DownloadsSection

```typescript
import DownloadsSection from '@/components/sections/DownloadsSection';

<DownloadsSection />
```

### PrivacySection

```typescript
import PrivacySection from '@/components/sections/PrivacySection';

<PrivacySection />
```

### CTASection

```typescript
import CTASection from '@/components/sections/CTASection';

<CTASection />
```

---

## 🔧 样式统一检查清单

- [ ] 所有组件使用统一的容器样式
- [ ] 所有组件使用统一的标题样式
- [ ] 所有组件使用统一的间距规范
- [ ] 所有组件使用统一的颜色规范
- [ ] 所有组件支持暗色模式
- [ ] 所有组件响应式设计一致

---

**最后更新：** 2025-01-19






