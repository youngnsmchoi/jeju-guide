-- 편의점 핫바(어묵바/소시지바) 가이드용 hotbar_items 테이블 생성 (Supabase SQL 에디터에서 실행)
-- jul_gimbap_items와 동일한 패턴: 다국어 텍스트 + 큐레이션 필드
-- 가격(price_krw)은 실제 조사 전 플레이스홀더(0)로 채워둠 — admin에서 실제 값으로 수정 필요

create table hotbar_items (
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
  allergen_note_ko text,
  allergen_note_en text,
  allergen_note_zh text,
  allergen_note_ja text,
  price_krw int,
  manufacturer_url text
);

-- 편의점 핫바 대표 유형 3종 (일반적으로 널리 알려진 정보 기준, 상품별 상세는 추후 admin에서 조사 후 입력)
insert into hotbar_items (order_num, name_ko, name_en, name_zh, name_ja, flavor_desc_ko, flavor_desc_en, flavor_desc_zh, flavor_desc_ja, allergen_note_ko, allergen_note_en, allergen_note_zh, allergen_note_ja, price_krw) values
(1, '치즈 어묵바', 'Cheese Fish Cake Bar', '芝士鱼饼串', 'チーズ練り物バー',
 '생선살 반죽(어묵) 안에 치즈를 넣고 튀긴 꼬치. 짭짤한 어묵과 고소한 치즈의 조합.',
 'A skewered fish cake filled with cheese and deep-fried. Salty fish cake combined with rich, melty cheese.',
 '鱼糜（鱼饼）中夹入芝士油炸而成的串，咸香鱼饼与浓郁芝士的组合。',
 '練り物（かまぼこ生地）にチーズを入れて揚げた串。塩気のある練り物ととろけるチーズの組み合わせ。',
 '어패류(생선살), 우유(치즈), 밀가루 함유.',
 'Contains fish, milk (cheese), and wheat.',
 '含有鱼类（鱼糜）、牛奶（芝士）、小麦成分。',
 '魚介類（魚のすり身）・牛乳（チーズ）・小麦を含みます。',
 0),
(2, '소시지 야채꼬치', 'Sausage & Vegetable Skewer', '香肠蔬菜串', 'ソーセージ野菜串',
 '소시지와 채소를 번갈아 꽂은 꼬치. 케첩·머스터드 소스를 곁들여 먹는 경우가 많음.',
 'A skewer alternating sausage and vegetables. Often eaten with ketchup or mustard.',
 '香肠与蔬菜交替串成的串，常配番茄酱或芥末食用。',
 'ソーセージと野菜を交互に刺した串。ケチャップやマスタードをつけて食べることが多い。',
 '돼지고기(소시지) 함유. 돼지고기 성분으로 할랄·힌두 식단 부적합.',
 'Contains pork (sausage). Not suitable for halal or Hindu dietary restrictions due to pork.',
 '含有猪肉（香肠）成分。因含猪肉不适合清真或印度教饮食。',
 '豚肉（ソーセージ）を含みます。豚肉成分のためハラール・ヒンドゥー教の食事制限には不向き。',
 0),
(3, '매운 떡꼬치', 'Spicy Tteok Skewer', '辣年糕串', '辛いトッポギ串',
 '떡을 꼬치에 꿰어 매콤달콤한 소스를 발라 구운 것. 쫄깃한 떡과 매콤한 양념이 특징.',
 'Rice cake skewers brushed with a sweet-and-spicy sauce. Known for its chewy texture and spicy-sweet glaze.',
 '年糕串上刷甜辣酱烤制而成，Q弹的年糕搭配香辣的酱料是其特色。',
 '餅を串に刺して甘辛いソースを塗って焼いたもの。もちもちの食感とピリ辛のタレが特徴。',
 '밀가루 또는 쌀(떡 종류에 따라 다름), 대두(소스) 함유.',
 'Contains wheat or rice (varies by rice cake type) and soybean (sauce).',
 '含有小麦或大米（因年糕种类而异）、大豆（酱料）成分。',
 '小麦または米（餅の種類による）・大豆（ソース）を含みます。',
 0);
