-- 레시피 출처 URL 컬럼 추가
alter table recipes add column if not exists source_url text;

-- 기존 3개 레시피에 유튜브 URL 업데이트 (예시)
update recipes set source_url = 'https://www.youtube.com/watch?v=example1' where id = 7;
update recipes set source_url = 'https://www.youtube.com/watch?v=example2' where id = 8;
update recipes set source_url = 'https://www.youtube.com/watch?v=example3' where id = 9;
