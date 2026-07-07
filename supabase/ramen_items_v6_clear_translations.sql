-- 영어, 중문, 일어 텍스트 필드 초기화 (한국어는 유지)
-- 한국어 수정 후 재번역 예정

update ramen_items set
  name_en = null, name_zh = null, name_ja = null,
  flavor_desc_en = null, flavor_desc_zh = null, flavor_desc_ja = null,
  comparison_en = null, comparison_zh = null, comparison_ja = null,
  popularity_en = null, popularity_zh = null, popularity_ja = null,
  texture_en = null, texture_zh = null, texture_ja = null;
