-- AEO Tracking Database Migration
-- 创建 AEO 追踪数据表

-- 创建 aeo_references 表
CREATE TABLE IF NOT EXISTS aeo_references (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  page_url TEXT NOT NULL,
  content_snippet TEXT,
  accuracy_score INTEGER CHECK (accuracy_score >= 0 AND accuracy_score <= 100),
  includes_source_link BOOLEAN DEFAULT FALSE,
  user_query TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_aeo_source ON aeo_references(source);
CREATE INDEX IF NOT EXISTS idx_aeo_page_url ON aeo_references(page_url);
CREATE INDEX IF NOT EXISTS idx_aeo_timestamp ON aeo_references(timestamp);
CREATE INDEX IF NOT EXISTS idx_aeo_created_at ON aeo_references(created_at);

-- 创建复合索引用于常见查询
CREATE INDEX IF NOT EXISTS idx_aeo_source_timestamp ON aeo_references(source, timestamp);
CREATE INDEX IF NOT EXISTS idx_aeo_page_timestamp ON aeo_references(page_url, timestamp);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_aeo_references_updated_at
  BEFORE UPDATE ON aeo_references
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建视图用于统计查询
CREATE OR REPLACE VIEW aeo_metrics_daily AS
SELECT
  DATE(timestamp) as date,
  source,
  COUNT(*) as reference_count,
  AVG(accuracy_score) as avg_accuracy_score,
  COUNT(*) FILTER (WHERE includes_source_link = TRUE) as with_source_link_count,
  COUNT(*) FILTER (WHERE includes_source_link = TRUE)::FLOAT / COUNT(*) * 100 as source_link_percentage
FROM aeo_references
GROUP BY DATE(timestamp), source
ORDER BY date DESC, source;

-- 创建视图用于页面统计
CREATE OR REPLACE VIEW aeo_page_stats AS
SELECT
  page_url,
  COUNT(*) as total_references,
  COUNT(DISTINCT source) as unique_sources,
  AVG(accuracy_score) as avg_accuracy_score,
  COUNT(*) FILTER (WHERE includes_source_link = TRUE) as with_source_link_count,
  MAX(timestamp) as last_referenced_at
FROM aeo_references
GROUP BY page_url
ORDER BY total_references DESC;

-- 添加注释
COMMENT ON TABLE aeo_references IS 'AI 搜索引擎引用追踪数据表';
COMMENT ON COLUMN aeo_references.source IS '引用来源（Perplexity, ChatGPT, Claude 等）';
COMMENT ON COLUMN aeo_references.page_url IS '被引用的页面 URL';
COMMENT ON COLUMN aeo_references.content_snippet IS '引用的内容片段';
COMMENT ON COLUMN aeo_references.accuracy_score IS '引用准确性评分（0-100）';
COMMENT ON COLUMN aeo_references.includes_source_link IS '是否包含来源链接';
COMMENT ON COLUMN aeo_references.user_query IS '用户查询';






