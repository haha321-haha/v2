#!/bin/bash

# Pre-commit hook 安装脚本
# 基于零硬编码开发标准体系

echo "🚀 开始安装pre-commit hook..."

# 检查是否已安装pre-commit
if ! command -v pre-commit &> /dev/null; then
    echo "📦 安装pre-commit..."
    if command -v pip3 &> /dev/null; then
        pip3 install pre-commit
    elif command -v pip &> /dev/null; then
        pip install pre-commit
    else
        echo "❌ 错误：未找到pip，请先安装Python和pip"
        exit 1
    fi
else
    echo "✅ pre-commit已安装"
fi

# 安装pre-commit hook
echo "🔧 配置pre-commit hook..."
pre-commit install

# 测试pre-commit
echo "🧪 测试pre-commit配置..."
pre-commit run --all-files

echo ""
echo "🎉 pre-commit hook安装完成！"
echo ""
echo "📋 已配置的检查："
echo "  ✅ 代码格式检查"
echo "  ✅ ESLint检查"
echo "  ✅ 硬编码检测"
echo "  ✅ 压力管理项目专用检测"
echo "  ✅ TypeScript类型检查"
echo ""
echo "💡 使用方法："
echo "  • 自动运行：每次git commit时自动检查"
echo "  • 手动运行：pre-commit run --all-files"
echo "  • 跳过检查：git commit --no-verify（不推荐）"
echo ""
echo "📚 更多信息请查看：docs/ZERO-HARDCODE-DEVELOPMENT-GUIDE.md"
