-- ramen_log 테이블에 비망록 컬럼 추가
ALTER TABLE ramen_log ADD COLUMN IF NOT EXISTS memo_tags text[] DEFAULT '{}';
ALTER TABLE ramen_log ADD COLUMN IF NOT EXISTS note text;
