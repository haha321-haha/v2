#!/usr/bin/env node

/**
 * 翻译键同步检查工具 (简化版)
 * 用于CI/CD和Git Hooks
 */

const { checkTranslationSync } = require('./hardcode-fix-tools/translation-sync-check');

if (require.main === module) {
  const isSync = checkTranslationSync();
  process.exit(isSync ? 0 : 1);
}

module.exports = { checkTranslationSync };






