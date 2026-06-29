-- 라면 가이드용 ramen_items 테이블 생성 (Supabase SQL 에디터에서 실행)

create table ramen_items (
  id bigint generated always as identity primary key,
  order_num int not null default 0,
  name_ko text not null,
  name_en text,
  name_zh text,
  name_ja text,
  image_url text,
  flavor_desc_ko text,
  flavor_desc_en text,
  flavor_desc_zh text,
  flavor_desc_ja text,
  comparison_ko text,
  comparison_en text,
  comparison_zh text,
  comparison_ja text,
  popularity_ko text,
  popularity_en text,
  popularity_zh text,
  popularity_ja text,
  texture_ko text,
  texture_en text,
  texture_zh text,
  texture_ja text,
  prep_time int
);

insert into ramen_items (
  order_num, name_ko, image_url,
  flavor_desc_ko, comparison_ko, popularity_ko, texture_ko, prep_time
) values (
  1, '신라면 컵', null,
  '맵고 진한 소고기 국물',
  '스리라차 소스의 매운맛과 비슷하지만 더 깊은 맛',
  '동남아시아, 북미에서 많이 먹는 글로벌 인기 라면',
  '꼬들꼬들한 면 (쫄깃한 식감)',
  3
);

-- living 카테고리 목록에 라면 가이드 항목 추가 (slug='ramen'이어야 guide/[slug] 페이지가 ramen_items를 함께 조회함)
insert into jeju_items (category_id, slug, order_num, title_ko, title_en, title_zh, title_ja)
select id, 'ramen', (select coalesce(max(order_num), 0) + 1 from jeju_items where category_id = jeju_categories.id),
  '라면 가이드', 'Ramen Guide', '拉面指南', 'ラーメンガイド'
from jeju_categories
where slug = 'living';
