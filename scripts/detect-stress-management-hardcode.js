#!/usr/bin/env node

/**
 * 压力管理项目硬编码检测脚本
 * 专门检测压力管理相关页面的硬编码中文字符串
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // 要扫描的目录（压力管理相关）
  scanDirs: [
    'app/[locale]/stress-management',
    'components/stress-management'
  ],

  // 要忽略的文件模式
  ignorePatterns: [
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/messages/**'
  ],

  // 允许的硬编码模式（正则表达式）
  allowedPatterns: [
    '^[a-zA-Z0-9\\s\\-_\\.,!?]+$', // 纯英文和数字
    '^https?://', // URL
    '^\\d+$', // 纯数字
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // 邮箱
    '^[a-zA-Z0-9\\-_]+$', // 标识符
    '^[\\s\\-_\\.,!?]*$', // 只有标点符号和空格
    '^\\s*$', // 空白字符串
    '^[\\u4e00-\\u9fff]*[\\s\\-_\\.,!?]*$', // 只有中文标点符号
    '^[a-zA-Z0-9\\s\\-_\\.,!?]*[\\u4e00-\\u9fff]*[a-zA-Z0-9\\s\\-_\\.,!?]*$' // 混合但主要是英文
  ],

  // 中文字符正则
  chineseRegex: /[\u4e00-\u9fff]/,

  // locale判断正则
  localeRegex: /locale\s*[=!]==?\s*["']zh["']/,

  // 文件扩展名
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx']
};

// 检查文件是否应该被忽略
function shouldIgnoreFile(filePath) {
  return CONFIG.ignorePatterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

// 检查字符串是否被允许
function isAllowedString(str) {
  return CONFIG.allowedPatterns.some(pattern => {
    const regex = new RegExp(pattern);
    return regex.test(str);
  });
}

// 检查是否包含中文字符
function containsChinese(str) {
  return CONFIG.chineseRegex.test(str);
}

// 检查是否是locale判断
function isLocaleCheck(str) {
  return CONFIG.localeRegex.test(str);
}

// 扫描文件
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // 跳过注释行
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        return;
      }

      // 检查字符串字面量
      const stringMatches = line.match(/["'`]([^"'`]*?)["'`]/g);
      if (stringMatches) {
        stringMatches.forEach(match => {
          const str = match.slice(1, -1); // 去掉引号

          // 跳过空字符串或只有空格的字符串
          if (!str.trim()) return;

          // 跳过locale判断
          if (isLocaleCheck(line)) return;

          // 检查是否包含中文
          if (containsChinese(str)) {
            // 检查是否被允许
            if (!isAllowedString(str)) {
              issues.push({
                line: lineNumber,
                content: line.trim(),
                string: str,
                type: '中文硬编码'
              });
            }
          }
        });
      }
    });

    return issues;
  } catch (error) {
    console.error(`❌ 扫描文件失败: ${filePath}`, error.message);
    return [];
  }
}

// 递归扫描目录
function scanDirectory(dirPath) {
  const issues = [];

  if (!fs.existsSync(dirPath)) {
    return issues;
  }

  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      issues.push(...scanDirectory(itemPath));
    } else if (stat.isFile()) {
      const ext = path.extname(itemPath);
      if (CONFIG.fileExtensions.includes(ext) && !shouldIgnoreFile(itemPath)) {
        const fileIssues = scanFile(itemPath);
        if (fileIssues.length > 0) {
          issues.push({
            file: itemPath,
            issues: fileIssues
          });
        }
      }
    }
  });

  return issues;
}

// 主函数
function main() {
  console.log('🔍 开始扫描压力管理项目硬编码...\n');

  const allIssues = [];

  CONFIG.scanDirs.forEach(dir => {
    console.log(`📁 扫描目录: ${dir}`);
    const issues = scanDirectory(dir);
    allIssues.push(...issues);
  });

  if (allIssues.length === 0) {
    console.log('✅ 未发现硬编码问题！');
    process.exit(0);
  }

  console.log(`\n❌ 发现 ${allIssues.length} 个文件存在硬编码问题:\n`);

  allIssues.forEach(fileIssue => {
    console.log(`📄 ${fileIssue.file}`);
    fileIssue.issues.forEach(issue => {
      console.log(`   🈲 第${issue.line}行 [${issue.type}]: "${issue.string}"`);
      console.log(`      ${issue.content}`);
    });
    console.log('');
  });

  console.log('💡 建议:');
  console.log('   - 中文硬编码 → 使用 t("translation.key")');
  console.log('   - Locale判断 → 使用国际化系统');
  console.log('   - Metadata → 可以保持现状');
  console.log('\n🔧 修复命令:');
  console.log('   npm run lint -- --fix');
  console.log('   npm run detect-stress-hardcode');

  process.exit(1);
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { scanFile, scanDirectory, main };
