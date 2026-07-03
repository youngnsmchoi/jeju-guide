-- 나라별 인기 라면 테이블 생성 및 초기 데이터 삽입

create table country_picks (
  id bigint generated always as identity primary key,
  country_code text not null,
  flag text not null,
  country_ko text not null,
  country_en text,
  country_zh text,
  country_ja text,
  rank_num int not null default 0,
  name_ko text not null,
  name_en text,
  name_zh text,
  name_ja text,
  score numeric(4,1),
  reason_ko text,
  reason_en text,
  reason_zh text,
  reason_ja text,
  source_ko text,
  source_en text,
  source_zh text,
  source_ja text,
  source_url text
);

insert into country_picks (country_code, flag, country_ko, country_en, country_zh, country_ja, rank_num, name_ko, name_en, name_zh, name_ja, score, reason_ko, reason_en, reason_zh, reason_ja, source_ko, source_en, source_zh, source_ja, source_url) values
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 1, '농심 너구리', 'Nongshim Neoguri', '农心貉子拉面', '農心たぬきラーメン', 81.2, '굵은 면발과 듬뿍 들어있는 미역이 특징. 어떤 조리 방식으로도 맛있다는 평.', 'Thick noodles and generous seaweed. Praised for being delicious no matter how you cook it.', '粗面条和大量海带是特色，无论什么烹饪方式都好吃。', '太麺とたっぷりのわかめが特徴。どんな調理法でもおいしいと評判。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 2, '삼양 까르보 불닭볶음면', 'Samyang Carbo Buldak', '三养卡波不辣炒面', 'サムヤン カルボブルダック炒め麺', 77.9, '까르보나라 풍미에 매운맛을 더한 독특한 맛. 일본 라면과 차별화된 경험.', 'Carbonara flavor with a spicy kick. A uniquely different experience from Japanese ramen.', '卡波拿拉风味加辣味，与日本拉面截然不同的体验。', 'カルボナーラ風味に辛さをプラス。日本のラーメンとは一線を画す体験。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 3, '농심 신라면', 'Nongshim Shin Ramyun', '农心辛拉面', '農心辛ラーメン', 77.3, '오리지널 향신료의 감칠맛이 진하고 중독성 있는 매운맛.', 'Rich umami from original spices with an addictively spicy broth.', '原版香辛料的鲜味浓郁，辣味令人上瘾。', 'オリジナルスパイスの旨味が濃く、やみつきになる辛さ。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 4, '농심 감자면', 'Nongshim Gamja Myeon', '农心土豆面', '農心ジャガイモ麺', 75.6, '감자 전분 특유의 쫄깃한 식감과 매운 국물의 궁합이 최고.', 'The chewy texture from potato starch pairs perfectly with the spicy broth.', '土豆淀粉特有的弹性口感与辣汤绝配。', 'じゃがいもでんぷんならではのもちもち食感と辛いスープの相性が抜群。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 5, '오뚜기 진라면 매운맛', 'Ottogi Jin Ramen Spicy', '不倒翁真拉面辣味', 'オットギ ジンラーメン辛口', 74.3, '풍미도 좋고 맛도 깊어서 단순한 맵기를 넘어 복합적인 맛 제공.', 'Rich flavor that goes beyond simple spiciness, offering a complex taste.', '风味浓郁，超越单纯辣味，提供复合口感。', '風味が良く深い味わいで、単純な辛さを超えた複雑な味。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 6, '농심 안성탕면', 'Nongshim Ansungtangmyun', '农心安城汤面', '農心アンソンタン麺', 68.1, '약간 매콤한 된장 라면으로, 너무 강하지 않은 맵기를 선호하는 분께 인기.', 'A mildly spicy doenjang-style ramen. Popular with those who prefer moderate heat.', '略带辣味的大酱拉面，受偏爱适中辣度的人欢迎。', '少し辛みのある味噌ラーメン。強すぎない辛さを好む方に人気。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 7, '농심 짜파게티', 'Nongshim Chapagetti', '农心炸酱意面', '農心チャパゲティ', 63.9, '적당한 단맛에 쫄깃한 두꺼운 면. 집에서 짜장면을 즐길 수 있는 라면.', 'Moderately sweet with thick chewy noodles. Enjoy jjajangmyeon-style at home.', '适度甜味配粗弹面条，在家享受炸酱面风味。', '程よい甘さともちもちの太麺。家でジャージャー麺気分が楽しめる。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 8, '팔도 비빔면', 'Paldo Bibim Myeon', '八道拌面', 'パルド ビビン麺', 63.7, '달고 맵고 새콤한 복합 맛. 다양한 토핑과 잘 어울리는 냉면 스타일.', 'Sweet, spicy, and tangy all at once. Cold noodle style that pairs well with toppings.', '甜辣酸的复合口味，冷面风格搭配各种配料。', '甘辛酸っぱい複合的な味。冷麺スタイルでトッピングとの相性も抜群。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 9, '둥지냉면', 'Dongji Cold Noodles', '巢冷面', 'トンジ冷麺', 63.6, '간편한 조리 방식과 엄청 간단한 준비 과정이 장점.', 'Super easy to prepare — a major selling point.', '烹饪方法简单，准备过程非常简便。', 'とても簡単に作れることが最大の魅力。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho'),
('jp', '🇯🇵', '일본', 'Japan', '日本', '日本', 10, '삼양라면', 'Samyang Ramen', '三养拉面', 'サムヤンラーメン', 63.1, '야채를 듬뿍 넣으면 진짜 맛있고, 맵지 않아 접근성이 높음.', 'Even better loaded with veggies. Not spicy, so easy for anyone to enjoy.', '加大量蔬菜更好吃，不辣，接受度高。', '野菜をたっぷり入れると本当においしく、辛くないので誰でも食べやすい。', '일본 라면 전문 매체 랭킹', 'Japanese ramen media ranking', '日本拉面专业媒体排名', '日本ラーメン専門メディアランキング', 'https://v.daum.net/v/fw7shoc6Ho');
