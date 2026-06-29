-- 라면 가이드 이름 변경 + 맵기 단계 필드 추가 (Supabase SQL 에디터에서 실행)

-- '라면 가이드' → '편의점 라면 픽'으로 이름 변경
update jeju_items
set title_ko = '편의점 라면 픽',
    title_en = 'Ramen Picks',
    title_zh = '便利店拉面精选',
    title_ja = 'コンビニラーメン選',
    content_ko = null
where slug = 'ramen';

-- 맵기 단계 (0~5) 필드 추가
alter table ramen_items add column spicy_level int;

update ramen_items set spicy_level = 3 where name_ko = '신라면 컵';
