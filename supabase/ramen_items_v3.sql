-- 라면 카드 신규 필드 추가 (Supabase SQL 에디터에서 실행)

alter table ramen_items
  add column noodle_type text check (noodle_type in ('cup', 'bag')),
  add column soup_type text check (soup_type in ('soup', 'dry')),
  add column heat_source text check (heat_source in ('hot_water', 'microwave', 'stovetop')),
  add column manufacturer_url text,
  add column price_krw int;

-- 신라면 컵 기존 데이터 업데이트
update ramen_items set
  noodle_type = 'cup',
  soup_type = 'soup',
  heat_source = 'hot_water',
  manufacturer_url = 'https://www.nongshim.com/product/productDetail?prdCode=001000060',
  price_krw = 1200
where name_ko = '신라면 컵';
