#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 包装器：尝试加载构建脚本，如果不存在则使用现有索引文件
 * 这个文件应该在所有commit中都存在，以避免构建失败
 */

const scriptPath = path.join(__dirname, 'build-articles-index.js');
const indexPath = path.join(process.cwd(), 'public/articles-index.json');

try {
  // 尝试加载构建脚本
  if (fs.existsSync(scriptPath)) {
    require(scriptPath);
  } else {
    // 脚本不存在，检查是否有索引文件
    if (fs.existsSync(indexPath)) {
      const stats = fs.statSync(indexPath);
      console.log(`⚠️  Build script not found, using existing articles-index.json (${(stats.size / 1024).toFixed(2)} KB)`);
    } else {
      console.error('❌ Neither build script nor articles-index.json exists!');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
