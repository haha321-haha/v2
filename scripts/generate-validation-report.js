#!/usr/bin/env node

/**
 * 生成翻译验证报告
 * 生成HTML和JSON格式的验证报告
 */

const fs = require('fs');
const path = require('path');
const { checkTranslationSync, getAllKeys } = require('./hardcode-fix-tools/translation-sync-check');

const MESSAGES_DIR = path.join(__dirname, '../messages');
const ZH_FILE = path.join(MESSAGES_DIR, 'zh.json');
const EN_FILE = path.join(MESSAGES_DIR, 'en.json');
const REPORT_DIR = path.join(__dirname, '..');
const HTML_REPORT = path.join(REPORT_DIR, 'translation-validation-report.html');
const JSON_REPORT = path.join(REPORT_DIR, 'translation-validation-report.json');

// 生成HTML报告
function generateHTMLReport(stats) {
  const timestamp = new Date().toLocaleString('zh-CN');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>翻译键验证报告</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card.error {
      border-left: 4px solid #ef4444;
    }
    .card.success {
      border-left: 4px solid #10b981;
    }
    .card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #666;
    }
    .card .number {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0;
    }
    .card.error .number {
      color: #ef4444;
    }
    .card.success .number {
      color: #10b981;
    }
    .details {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .details pre {
      background: #f9fafb;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 翻译键验证报告</h1>
    <p>生成时间: ${timestamp}</p>
  </div>

  <div class="summary">
    <div class="card ${stats.missingInEn.length === 0 && stats.missingInZh.length === 0 ? 'success' : 'error'}">
      <h3>中文翻译键</h3>
      <div class="number">${stats.zhKeys}</div>
      <p>总键数</p>
    </div>

    <div class="card ${stats.missingInEn.length === 0 && stats.missingInZh.length === 0 ? 'success' : 'error'}">
      <h3>英文翻译键</h3>
      <div class="number">${stats.enKeys}</div>
      <p>总键数</p>
    </div>

    <div class="card ${stats.missingInEn.length === 0 ? 'success' : 'error'}">
      <h3>英文缺失键</h3>
      <div class="number">${stats.missingInEn.length}</div>
      <p>缺失的翻译键</p>
    </div>

    <div class="card ${stats.missingInZh.length === 0 ? 'success' : 'error'}">
      <h3>中文缺失键</h3>
      <div class="number">${stats.missingInZh.length}</div>
      <p>缺失的翻译键</p>
    </div>
  </div>

  <div class="details">
    <h2>详细验证结果</h2>
    ${stats.missingInEn.length === 0 && stats.missingInZh.length === 0
      ? '<p style="color: #10b981;">✅ 翻译键完全同步！</p>'
      : '<p style="color: #ef4444;">⚠️ 发现翻译键不同步问题，请查看下方详细信息。</p>'}

    ${stats.missingInEn.length > 0 ? `
    <h3>英文缺失的键 (前50个):</h3>
    <pre>${stats.missingInEn.slice(0, 50).join('\n')}</pre>
    ${stats.missingInEn.length > 50 ? `<p>... 还有 ${stats.missingInEn.length - 50} 个</p>` : ''}
    ` : ''}

    ${stats.missingInZh.length > 0 ? `
    <h3>中文缺失的键 (前50个):</h3>
    <pre>${stats.missingInZh.slice(0, 50).join('\n')}</pre>
    ${stats.missingInZh.length > 50 ? `<p>... 还有 ${stats.missingInZh.length - 50} 个</p>` : ''}
    ` : ''}
  </div>
</body>
</html>`;
}

// 生成验证报告
function generateReport() {
  console.log('🔍 开始生成验证报告...\n');

  // 读取翻译文件
  let zhTranslations, enTranslations;

  try {
    const zhContent = fs.readFileSync(ZH_FILE, 'utf8');
    zhTranslations = JSON.parse(zhContent);
  } catch (error) {
    console.error('❌ 无法读取中文翻译文件:', error.message);
    process.exit(1);
  }

  try {
    const enContent = fs.readFileSync(EN_FILE, 'utf8');
    enTranslations = JSON.parse(enContent);
  } catch (error) {
    console.error('❌ 无法读取英文翻译文件:', error.message);
    process.exit(1);
  }

  // 获取所有键
  const zhKeys = new Set(getAllKeys(zhTranslations));
  const enKeys = new Set(getAllKeys(enTranslations));

  // 找出缺失的键
  const missingInEn = [...zhKeys].filter(key => !enKeys.has(key));
  const missingInZh = [...enKeys].filter(key => !zhKeys.has(key));

  // 统计数据
  const stats = {
    zhKeys: zhKeys.size,
    enKeys: enKeys.size,
    missingInEn: missingInEn.sort(),
    missingInZh: missingInZh.sort(),
    timestamp: new Date().toISOString(),
  };

  // 生成HTML报告
  const htmlReport = generateHTMLReport(stats);
  fs.writeFileSync(HTML_REPORT, htmlReport, 'utf8');
  console.log(`✅ HTML报告已生成: ${HTML_REPORT}`);

  // 生成JSON报告
  fs.writeFileSync(JSON_REPORT, JSON.stringify(stats, null, 2), 'utf8');
  console.log(`✅ JSON报告已生成: ${JSON_REPORT}`);

  // 显示摘要
  console.log('\n📊 报告摘要:');
  console.log(`   中文翻译键总数: ${stats.zhKeys}`);
  console.log(`   英文翻译键总数: ${stats.enKeys}`);
  console.log(`   英文缺失键数量: ${stats.missingInEn.length}`);
  console.log(`   中文缺失键数量: ${stats.missingInZh.length}`);

  if (stats.missingInEn.length === 0 && stats.missingInZh.length === 0) {
    console.log('\n✅ 翻译键完全同步！');
  } else {
    console.log('\n⚠️  发现翻译键不同步问题');
  }
}

// 主函数
if (require.main === module) {
  generateReport();
}

module.exports = { generateReport };






