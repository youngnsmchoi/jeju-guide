-- best5_picks, topping_combos 테이블 생성 및 초기 데이터 삽입

create table best5_picks (
  id bigint generated always as identity primary key,
  rank_num int not null default 0,
  name_ko text not null,
  name_en text,
  name_zh text,
  name_ja text,
  noodle_type text not null default 'bag',
  spicy int not null default 0,
  tag_ko text,
  tag_en text,
  tag_zh text,
  tag_ja text,
  reason_ko text,
  reason_en text,
  reason_zh text,
  reason_ja text
);

insert into best5_picks (rank_num, name_ko, name_en, name_zh, name_ja, noodle_type, spicy, tag_ko, tag_en, tag_zh, tag_ja, reason_ko, reason_en, reason_zh, reason_ja) values
(1, '신라면', 'Shin Ramyun', '辛拉面', '辛ラーメン', 'bag', 3, '한국 대표 라면', 'Korea''s #1', '韩国代表拉面', '韓国の定番', '한국 라면의 기준. 얼큰하고 진한 국물로 한 번은 꼭 먹어야 합니다.', 'The standard of Korean ramen. Bold, spicy broth — a must-try at least once.', '韩国拉面的标准。浓郁辛辣的汤底，必须尝试一次。', '韓国ラーメンの基準。辛くてコクのあるスープ——一度は食べるべき一品。'),
(2, '불닭볶음면', 'Buldak Bokkeum Myeon', '火鸡面', '火鶏麺', 'bag', 5, 'SNS 챌린지 필수', 'SNS Challenge', 'SNS挑战必备', 'SNSチャレンジ', '전 세계에서 화제인 매운 볶음면. 치즈 한 장 올리면 훨씬 먹기 편합니다.', 'The viral fire noodle. Add a cheese slice to tame the heat.', '风靡全球的辣炒面。加一片芝士会好吃很多。', '世界で話題の辛炒め麺。チーズを一枚のせると格段に食べやすくなります。'),
(3, '참깨라면', 'Chamgae Ramyun', '芝麻拉面', 'ごまラーメン', 'bag', 1, '맵지 않아 누구나', 'Mild & Nutty', '不辣·香浓', '辛くない・誰でも', '고소한 참깨 국물이 인상적입니다. 매운 것을 못 먹어도 즐길 수 있는 라면.', 'Rich, nutty sesame broth. Perfect if you can''t handle spice.', '浓郁的芝麻汤底令人印象深刻。不能吃辣也能享用的拉面。', '香ばしいごまスープが印象的。辛いものが苦手でも楽しめるラーメン。'),
(4, '짜파게티', 'Chapagetti', '炸酱意面', 'チャパゲティ', 'bag', 0, '짜장면 느낌', 'Black Bean Style', '炸酱面风味', 'ジャージャー麺風', '짜장 소스 볶음면. 국물 없이 비벼먹는 스타일이라 색다릅니다. 계란 프라이 필수.', 'Black bean sauce noodles — no broth, stir-fried style. Fry an egg on top.', '炸酱炒面。干拌风格，加个煎蛋是标配。', 'ジャージャーソース炒め麺。スープなしで混ぜて食べるスタイル。目玉焼きが必須。'),
(5, '너구리큰사발면', 'Neoguri Cup', '貉子拉面杯', 'たぬきカップ麺', 'cup', 2, '해물 국물', 'Seafood Broth', '海鲜汤底', 'シーフードスープ', '쫄깃한 우동 면발에 얼큰한 해물 국물. 컵라면인데 퀄리티가 높습니다.', 'Chewy udon-style noodles in spicy seafood broth. Surprisingly good for a cup.', '劲道的乌冬面配辛辣海鲜汤底。是杯面但品质出众。', 'もちもちのうどん麺に辛口シーフードスープ。カップ麺なのにクオリティが高い。');

create table topping_combos (
  id bigint generated always as identity primary key,
  order_num int not null default 0,
  ramen_ko text not null,
  ramen_en text,
  ramen_zh text,
  ramen_ja text,
  toppings text not null default '[]',
  reason_ko text,
  reason_en text,
  reason_zh text,
  reason_ja text,
  spicy int not null default 0
);

insert into topping_combos (order_num, ramen_ko, ramen_en, ramen_zh, ramen_ja, toppings, reason_ko, reason_en, reason_zh, reason_ja, spicy) values
(1, '신라면', 'Shin Ramyun', '辛拉面', '辛ラーメン', '["🥚","🍙"]', '국물에 밥 말아먹기 — 한국인이 가장 많이 하는 조합', 'Dip the rice ball into the broth — the most classic Korean combo', '把饭团泡在汤里吃——韩国人最常见的吃法', 'おにぎりをスープに浸して食べる——韓国人が最もよくやる組み合わせ', 3),
(2, '불닭볶음면', 'Buldak Bokkeum Myeon', '火鸡面', '火鶏麺', '["🧀"]', '치즈가 매운맛을 잡아줍니다. SNS에서 유명한 조합', 'Cheese cuts the heat. Famous combo on social media', '芝士中和辣味，社交媒体上的热门组合', 'チーズが辛さを和らげる。SNSで有名な組み合わせ', 5),
(3, '참깨라면', 'Chamgae Ramyun', '芝麻拉面', 'ごまラーメン', '["🥚"]', '고소한 국물 + 계란 = 고소함 두 배', 'Nutty broth + egg = double the richness', '香浓汤底+鸡蛋=香浓翻倍', 'コクのあるスープ＋卵＝旨味が倍増', 1),
(4, '짜파게티', 'Chapagetti', '炸酱意面', 'チャパゲティ', '["🥚"]', '짜파구리 스타일 — 계란 프라이를 올려 비벼먹기', 'Chapaguri style — fry an egg and mix it in', '炸酱混面风格——放上煎蛋拌着吃', 'チャパグリスタイル——目玉焼きをのせて混ぜて食べる', 0),
(5, '너구리큰사발면', 'Neoguri Cup', '貉子拉面', 'たぬきカップ麺', '["🧀","🍙"]', '얼큰한 해물 국물 + 치즈 = 크리미한 해물 라면', 'Spicy seafood broth + cheese = creamy seafood ramen', '鲜辣海鲜汤底+芝士=奶香海鲜拉面', '辛口シーフードスープ＋チーズ＝クリーミーな海鮮ラーメン', 2);
