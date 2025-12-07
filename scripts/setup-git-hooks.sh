#!/bin/bash

###############################################################################
# Git Hooks 自动设置脚本
# 配置 Husky 和 lint-staged，建立不可绕过的检查机制
###############################################################################

set -e

echo "🚀 开始设置 Git Hooks..."
echo ""

# 检查是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查是否已安装 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到 npm，请先安装 npm"
    exit 1
fi

echo "📦 安装依赖..."
npm install --save-dev husky lint-staged

echo ""
echo "🔧 初始化 Husky..."
npx husky install

# 设置 prepare 脚本
npm pkg set scripts.prepare="husky install"

echo ""
echo "📝 创建 pre-commit hook..."
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 运行 pre-commit 检查..."
echo ""

# 运行 lint-staged
npx lint-staged

# 运行翻译键同步检查
echo ""
echo "🔍 检查翻译键同步性..."
if ! node scripts/check-translation-sync.js; then
    echo ""
    echo "❌ 翻译键同步检查失败！"
    echo "请修复翻译键问题后重新提交。"
    echo ""
    exit 1
fi

echo ""
echo "✅ 所有 pre-commit 检查通过！"
EOF

chmod +x .husky/pre-commit

echo ""
echo "📝 创建 pre-push hook..."
cat > .husky/pre-push << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 运行 pre-push 验证..."
echo ""

# 验证 JSON 语法
echo "🔍 验证 JSON 语法..."
if ! node -e "JSON.parse(require('fs').readFileSync('messages/zh.json', 'utf8'))"; then
    echo "❌ messages/zh.json 语法错误！"
    exit 1
fi

if ! node -e "JSON.parse(require('fs').readFileSync('messages/en.json', 'utf8'))"; then
    echo "❌ messages/en.json 语法错误！"
    exit 1
fi

echo "✅ JSON 语法验证通过"
echo ""

# 运行完整的翻译键验证
echo "🔍 运行完整翻译键验证..."
if ! node scripts/check-translation-sync.js; then
    echo ""
    echo "❌ 翻译键验证失败！"
    echo "请修复所有翻译键问题后再推送。"
    echo ""
    exit 1
fi

echo ""
echo "✅ 所有 pre-push 验证通过！"
EOF

chmod +x .husky/pre-push

echo ""
echo "📝 配置 lint-staged..."
cat > .lintstagedrc.json << 'EOF'
{
  "app/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "components/**/*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "messages/*.json": [
    "node -e \"JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))\""
  ]
}
EOF

echo ""
echo "✅ Git Hooks 设置完成！"
echo ""
echo "📋 已配置的 Hooks:"
echo "   ✅ pre-commit: 运行 lint-staged + 翻译键同步检查"
echo "   ✅ pre-push: JSON 语法验证 + 完整翻译键验证"
echo ""
echo "🔒 防护机制:"
echo "   ✅ 提交前自动检查代码质量"
echo "   ✅ 提交前验证翻译键同步"
echo "   ✅ 推送前验证 JSON 语法"
echo "   ✅ 推送前完整验证翻译键"
echo ""
echo "💡 提示:"
echo "   - 本地可以使用 --no-verify 绕过检查（不推荐）"
echo "   - 但 CI/CD 会再次验证，无法合并到主分支"
echo ""
echo "🎉 设置完成！现在您的代码提交受到多层保护。"
