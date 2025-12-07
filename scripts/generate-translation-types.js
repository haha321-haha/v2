#!/usr/bin/env node

/**
 * 生成TypeScript类型定义
 * 从翻译文件自动生成类型定义，提供编译时类型检查
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../messages');
const ZH_FILE = path.join(MESSAGES_DIR, 'zh.json');
const TYPES_DIR = path.join(__dirname, '../types');
const TYPES_FILE = path.join(TYPES_DIR, 'translations.ts');

// 将对象转换为TypeScript类型定义
function objectToType(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  const lines = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        lines.push(`${spaces}${safeKey}: {`);
        lines.push(...objectToType(value, indent + 1));
        lines.push(`${spaces}};`);
      } else {
        lines.push(`${spaces}${safeKey}: string;`);
      }
    }
  }

  return lines;
}

// 生成类型定义
function generateTypes() {
  console.log('🔍 开始生成翻译类型定义...\n');

  // 读取中文翻译文件作为基础
  let translations;

  try {
    const content = fs.readFileSync(ZH_FILE, 'utf8');
    translations = JSON.parse(content);
    console.log('✅ 翻译文件加载成功');
  } catch (error) {
    console.error('❌ 无法读取翻译文件:', error.message);
    process.exit(1);
  }

  // 生成类型定义
  const typeLines = [
    '/**',
    ' * 自动生成的翻译类型定义',
    ' * 请勿手动编辑此文件',
    ' * 使用 npm run types:generate 重新生成',
    ' */',
    '',
    'export interface Translations {',
    ...objectToType(translations, 1),
    '}',
    '',
    'export type TranslationKey = keyof Translations;',
  ];

  // 确保types目录存在
  if (!fs.existsSync(TYPES_DIR)) {
    fs.mkdirSync(TYPES_DIR, { recursive: true });
  }

  // 写入类型文件
  try {
    fs.writeFileSync(TYPES_FILE, typeLines.join('\n'), 'utf8');
    console.log(`✅ 类型定义已生成: ${TYPES_FILE}`);
    return true;
  } catch (error) {
    console.error('❌ 无法写入类型文件:', error.message);
    process.exit(1);
  }
}

// 主函数
if (require.main === module) {
  generateTypes();
}

module.exports = { generateTypes };






