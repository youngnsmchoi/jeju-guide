-- 신라면 컵 다국어 데이터 업데이트 (Supabase SQL 에디터에서 실행)

update ramen_items set
  name_en = 'Shin Ramyun Cup',
  name_zh = '辛拉面杯',
  name_ja = '辛ラーメンカップ',

  flavor_desc_en = 'Spicy and rich beef broth, Korea''s most iconic ramen in a convenient cup',
  flavor_desc_zh = '辛辣浓郁的牛肉汤底，韩国最具代表性的拉面杯装版',
  flavor_desc_ja = '辛くて濃い牛肉スープ、韓国を代表するラーメンのカップ版',

  comparison_en = 'Similar heat to Sriracha but deeper and richer in flavor',
  comparison_zh = '辣度类似辣椒酱但风味更深厚浓郁',
  comparison_ja = 'スリラチャに似た辛さだが、より深みがある',

  popularity_en = 'Exported to 100+ countries, the #1 globally sold Korean ramen',
  popularity_zh = '出口100多个国家，全球销量第一的韩国拉面',
  popularity_ja = '100カ国以上に輸出、世界販売No.1韓国ラーメン',

  texture_en = 'Chewy and springy noodles',
  texture_zh = '劲道有弹性的面条',
  texture_ja = 'モチモチとした弾力ある麺'

where name_ko = '신라면 컵';
