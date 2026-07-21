-- 신라면컵 추가 — FOOD QR 바코드 있음 (링크 우선 제공, 번역 카드 불필요)
insert into link_ramen_items (
  order_num, name_ko, name_en, name_zh, name_ja,
  foodqr_barcode,
  manufacturer_url
) values (
  4, '신라면컵', 'Shin Ramyun Cup', '辛拉面杯面', '辛ラーメンカップ',
  '8801043015714',
  'https://nongshimmall.com/product/detail.html?product_no=2711&cate_no=43&display_group=1'
);
