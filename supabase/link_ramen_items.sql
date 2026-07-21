-- 라면 가이드 v2 — "최소 정보 + 외부 링크" 철학의 새 테이블
-- FOOD QR(정부 공식)에 없는 라면은 제조사 홈페이지 정보를 번역해 카드로 제공
-- 기존 ramen_items 테이블은 건드리지 않고 그대로 보존, 이 테이블은 완전히 별개로 신설

create table link_ramen_items (
  id bigint generated always as identity primary key,
  order_num int not null default 0,
  name_ko text not null,
  name_en text,
  name_zh text,
  name_ja text,

  -- FOOD QR 등록된 경우만 채움 (없으면 null → 제조사 링크로 대체)
  foodqr_barcode text,

  -- 제조사 공식 제품 페이지 (항상 있어야 함)
  manufacturer_url text not null,

  -- 원재료명 (제조사 표기 그대로 번역)
  ingredients_ko text,
  ingredients_en text,
  ingredients_zh text,
  ingredients_ja text,

  -- 알레르기 유발물질 (제품에 직접 함유된 것)
  allergens_ko text,
  allergens_en text,
  allergens_zh text,
  allergens_ja text,

  -- 교차오염 주의 (같은 시설에서 제조하는 다른 알레르기 유발물질)
  cross_contamination_ko text,
  cross_contamination_en text,
  cross_contamination_zh text,
  cross_contamination_ja text,

  -- 영양정보 (숫자는 언어 무관, 구조화된 컬럼으로 저장)
  serving_size_g int,
  nutrition_kcal int,
  nutrition_sodium_mg int,
  nutrition_carbs_g numeric(5,1),
  nutrition_sugar_g numeric(5,1),
  nutrition_fat_g numeric(5,1),
  nutrition_trans_fat_g numeric(5,1),
  nutrition_sat_fat_g numeric(5,1),
  nutrition_cholesterol_mg numeric(5,1),
  nutrition_protein_g numeric(5,1),
  nutrition_calcium_mg int,

  -- 보관방법 및 소비자 안전 주의사항
  storage_note_ko text,
  storage_note_en text,
  storage_note_zh text,
  storage_note_ja text
);

-- 3종 시범 데이터 (신라면, 얼큰한너구리, 너구리큰사발면)
-- 원재료명/알레르기 표기는 nongshimmall.com 제품 상세 페이지 캡처 기준
insert into link_ramen_items (
  order_num, name_ko, name_en, name_zh, name_ja,
  manufacturer_url,
  ingredients_ko, ingredients_en, ingredients_zh, ingredients_ja,
  allergens_ko, allergens_en, allergens_zh, allergens_ja,
  cross_contamination_ko, cross_contamination_en, cross_contamination_zh, cross_contamination_ja,
  serving_size_g, nutrition_kcal, nutrition_sodium_mg, nutrition_carbs_g, nutrition_sugar_g,
  nutrition_fat_g, nutrition_trans_fat_g, nutrition_sat_fat_g, nutrition_cholesterol_mg,
  nutrition_protein_g, nutrition_calcium_mg,
  storage_note_ko, storage_note_en, storage_note_zh, storage_note_ja
) values
(1, '신라면', 'Shin Ramyun', '辛拉面', '辛ラーメン',
 'https://nongshimmall.com/product/detail.html?product_no=2660&cate_no=43&display_group=1',
 '면/소맥분(밀:미국산,호주산), 감자전분(독일산), 팜유(말레이시아산), 변성전분, 난각칼슘, 정제소금, 야채조미추출물, 면류첨가알칼리제(탄산칼륨, 탄산나트륨, 제이인산나트륨), 혼합제제(메타인산나트륨, 폴리인산나트륨, 제일인산나트륨, 피로인산나트륨), 올리고녹차풍미액, 비타민B2. 스프류/소고기맛베이스, 정제소금, 매콤양념분말, 간장양념분말, 설탕, 조미아미노산간장분말, 볶음양념분, 조미소고기분말, 후추가루, 마늘베이스, 간장분말, 조미양념분, 조미홍고추분말, 5''-리보뉴클레오티드이나트륨, 매운맛조미분, 호박산이나트륨, 대두단백, 건파, 건청경채, 건표고버섯, 건당근, 고추맛후레이크.',
 'Noodles/Wheat flour (wheat: USA, Australia), potato starch (Germany), palm oil (Malaysia), modified starch, eggshell calcium, refined salt, vegetable seasoning extract, noodle alkaline agent (potassium carbonate, sodium carbonate, disodium phosphate), mixed preparation (sodium metaphosphate, sodium polyphosphate, monosodium phosphate, sodium pyrophosphate), oligo green tea flavor extract, vitamin B2. Soup base/beef flavor base, refined salt, spicy seasoning powder, soy sauce seasoning powder, sugar, seasoned amino acid soy sauce powder, stir-fry seasoning, seasoned beef powder, pepper powder, garlic base, soy sauce powder, seasoning powder, seasoned red pepper powder, disodium 5''-ribonucleotide, spicy seasoning powder, disodium succinate, soybean protein, dried green onion, dried bok choy, dried shiitake mushroom, dried carrot, red pepper flavor flakes.',
 '面条/小麦粉（小麦：美国产、澳大利亚产）、马铃薯淀粉（德国产）、棕榈油（马来西亚产）、变性淀粉、蛋壳钙、精制盐、蔬菜调味提取物、面条用碱剂（碳酸钾、碳酸钠、磷酸氢二钠）、混合制剂（偏磷酸钠、聚磷酸钠、磷酸二氢钠、焦磷酸钠）、低聚绿茶风味液、维生素B2。汤料/牛肉风味底料、精制盐、辣味调味粉、酱油调味粉、白糖、调味氨基酸酱油粉、炒制调味粉、调味牛肉粉、胡椒粉、大蒜底料、酱油粉、调味料、调味红辣椒粉、5''-核糖核苷酸二钠、辣味调味粉、琥珀酸二钠、大豆蛋白、干葱、干小白菜、干香菇、干胡萝卜、辣椒风味片。',
 '麺/小麦粉（小麦：アメリカ産、オーストラリア産）、じゃがいもでん粉（ドイツ産）、パーム油（マレーシア産）、加工でん粉、卵殻カルシウム、精製塩、野菜調味エキス、麺用アルカリ剤（炭酸カリウム、炭酸ナトリウム、リン酸二ナトリウム）、混合製剤（メタリン酸ナトリウム、ポリリン酸ナトリウム、リン酸二水素ナトリウム、ピロリン酸ナトリウム）、オリゴ緑茶風味液、ビタミンB2。スープ類/牛肉風味ベース、精製塩、辛味調味粉、醤油調味粉、砂糖、調味アミノ酸醤油粉、炒め調味粉、調味牛肉粉、こしょう、にんにくベース、醤油粉、調味料、調味赤唐辛子粉、5''-リボヌクレオチド二ナトリウム、辛味調味粉、コハク酸二ナトリウム、大豆たん白、乾燥ねぎ、乾燥チンゲン菜、乾燥しいたけ、乾燥にんじん、唐辛子風味フレーク。',
 '밀, 대두, 돼지고기, 계란, 쇠고기 함유',
 'Contains wheat, soybean, pork, egg, beef',
 '含有小麦、大豆、猪肉、鸡蛋、牛肉成分',
 '小麦・大豆・豚肉・卵・牛肉を含む',
 '우유, 메밀, 땅콩, 고등어, 게, 새우, 토마토, 호두, 닭고기, 오징어, 잣, 조개류(굴, 전복, 홍합 포함)를 사용한 제품과 같은 시설에서 제조',
 'Manufactured in a facility that also processes milk, buckwheat, peanuts, mackerel, crab, shrimp, tomato, walnut, chicken, squid, pine nuts, and shellfish (including oyster, abalone, mussel)',
 '本产品与含有牛奶、荞麦、花生、鲭鱼、蟹、虾、番茄、核桃、鸡肉、鱿鱼、松子、贝类（含牡蛎、鲍鱼、贻贝）的产品在同一设施生产',
 '牛乳・そば・落花生・さば・かに・えび・トマト・くるみ・鶏肉・いか・松の実・貝類（かき・あわび・むらさきいがい含む）を使用した製品と同じ施設で製造',
 120, 500, 1790, 79, 4,
 16, 0, 8, 0,
 10, 143,
 '직사광선을 피하고 서늘하고 건조한 곳에 보관하십시오. 개봉 후에는 즉시 조리해 드십시오.',
 'Store away from direct sunlight in a cool, dry place. Cook immediately after opening.',
 '请避光并存放在阴凉干燥处。开封后请立即烹饪食用。',
 '直射日光を避け、涼しく乾燥した場所に保管してください。開封後はすぐに調理してお召し上がりください。'
),
(2, '얼큰한너구리', 'Spicy Neoguri', '辣味浣熊拉面', '辛口ノグリ',
 'https://nongshimmall.com/product/detail.html?product_no=2639&cate_no=43&display_group=1',
 '면/소맥분(밀:호주산,미국산), 감자전분(독일산), 팜유(말레이시아산), 변성전분, 식물성풍미유, 난각칼슘, 정제소금, 해물페이스트, 글루텐펩타이드, 면류첨가알칼리제(탄산칼륨, 탄산나트륨, 제이인산나트륨), 혼합제제(메타인산나트륨, 폴리인산나트륨, 제일인산나트륨, 피로인산나트륨), 올리고녹차풍미액, 비타민B2. 스프류/정제소금, 홍합지미베이스분말, 해물채소분말, 홍합추출물분말, 조미양념분, 설탕, 시원한육수분말, 볶음양념분, 포도당, 동결건조생생고추분말, 멸치조미분, 호박산이나트륨, 마늘베이스, 후추가루, 조미아미노산간장분말, 복합조미간장분말, 양파풍미분, 칠리맛풍미분, 구운해물분, 호화옥수수분, 5''-리보뉴클레오티드이나트륨, 혼합제제(덱스트린, 카라멜색소III), 매운양념분말, 산도조절제, 건미역, 오징어맛후레이크, 건당근, 건다시마.',
 'Noodles/Wheat flour (wheat: Australia, USA), potato starch (Germany), palm oil (Malaysia), modified starch, vegetable flavor oil, eggshell calcium, refined salt, seafood paste, gluten peptide, noodle alkaline agent (potassium carbonate, sodium carbonate, disodium phosphate), mixed preparation (sodium metaphosphate, sodium polyphosphate, monosodium phosphate, sodium pyrophosphate), oligo green tea flavor extract, vitamin B2. Soup base/refined salt, mussel extract base powder, seafood vegetable powder, mussel extract powder, seasoning, sugar, savory broth powder, stir-fry seasoning, glucose, freeze-dried fresh red pepper powder, seasoned anchovy powder, disodium succinate, garlic base, pepper powder, seasoned amino acid soy sauce powder, mixed seasoned soy sauce powder, onion flavor powder, chili flavor powder, roasted seafood powder, gelatinized corn powder, disodium 5''-ribonucleotide, mixed preparation (dextrin, caramel color III), spicy seasoning powder, acidity regulator, dried seaweed (miyeok), squid flavor flakes, dried carrot, dried kelp.',
 '面条/小麦粉（小麦：澳大利亚产、美国产）、马铃薯淀粉（德国产）、棕榈油（马来西亚产）、变性淀粉、植物风味油、蛋壳钙、精制盐、海鲜膏、麸质肽、面条用碱剂（碳酸钾、碳酸钠、磷酸氢二钠）、混合制剂（偏磷酸钠、聚磷酸钠、磷酸二氢钠、焦磷酸钠）、低聚绿茶风味液、维生素B2。汤料/精制盐、贻贝风味底料粉、海鲜蔬菜粉、贻贝提取物粉、调味料、白糖、鲜味高汤粉、炒制调味粉、葡萄糖、冷冻干燥鲜辣椒粉、调味凤尾鱼粉、琥珀酸二钠、大蒜底料、胡椒粉、调味氨基酸酱油粉、混合调味酱油粉、洋葱风味粉、辣椒风味粉、烤海鲜粉、糊化玉米粉、5''-核糖核苷酸二钠、混合制剂（糊精、焦糖色素III）、辣味调味粉、酸度调节剂、干海带芽、鱿鱼风味片、干胡萝卜、干海带。',
 '麺/小麦粉（小麦：オーストラリア産、アメリカ産）、じゃがいもでん粉（ドイツ産）、パーム油（マレーシア産）、加工でん粉、植物性風味油、卵殻カルシウム、精製塩、海鮮ペースト、グルテンペプチド、麺用アルカリ剤（炭酸カリウム、炭酸ナトリウム、リン酸二ナトリウム）、混合製剤（メタリン酸ナトリウム、ポリリン酸ナトリウム、リン酸二水素ナトリウム、ピロリン酸ナトリウム）、オリゴ緑茶風味液、ビタミンB2。スープ類/精製塩、ムール貝風味ベース粉、海鮮野菜粉、ムール貝エキス粉、調味料、砂糖、旨味だし粉、炒め調味粉、ぶどう糖、冷凍乾燥唐辛子粉、調味いりこ粉、コハク酸二ナトリウム、にんにくベース、こしょう、調味アミノ酸醤油粉、複合調味醤油粉、玉ねぎ風味粉、チリ風味粉、焼き海鮮粉、糊化とうもろこし粉、5''-リボヌクレオチド二ナトリウム、混合製剤（デキストリン、カラメル色素III）、辛味調味粉、酸度調節剤、乾燥わかめ、いか風味フレーク、乾燥にんじん、乾燥昆布。',
 '계란, 대두, 밀, 새우, 쇠고기, 오징어, 조개류(홍합 포함) 함유',
 'Contains egg, soybean, wheat, shrimp, beef, squid, shellfish (including mussel)',
 '含有鸡蛋、大豆、小麦、虾、牛肉、鱿鱼、贝类（含贻贝）成分',
 '卵・大豆・小麦・えび・牛肉・いか・貝類（むらさきいがい含む）を含む',
 '우유, 메밀, 땅콩, 고등어, 게, 돼지고기, 토마토, 호두, 닭고기, 조개류(굴, 전복 포함), 잣을 사용한 제품과 같은 시설에서 제조',
 'Manufactured in a facility that also processes milk, buckwheat, peanuts, mackerel, crab, pork, tomato, walnut, chicken, pine nuts, and shellfish (including oyster, abalone)',
 '本产品与含有牛奶、荞麦、花生、鲭鱼、蟹、猪肉、番茄、核桃、鸡肉、松子、贝类（含牡蛎、鲍鱼）的产品在同一设施生产',
 '牛乳・そば・落花生・さば・かに・豚肉・トマト・くるみ・鶏肉・松の実・貝類（かき・あわび含む）を使用した製品と同じ施設で製造',
 120, 490, 1760, 83, 5,
 14, 0, 8, 5,
 8, 161,
 '직사광선을 피하고 서늘하고 건조한 곳에 보관하십시오. 개봉 후에는 즉시 조리해 드십시오.',
 'Store away from direct sunlight in a cool, dry place. Cook immediately after opening.',
 '请避光并存放在阴凉干燥处。开封后请立即烹饪食用。',
 '直射日光を避け、涼しく乾燥した場所に保管してください。開封後はすぐに調理してお召し上がりください。'
),
(3, '너구리큰사발면', 'Neoguri Cup', '浣熊大碗面', 'ノグリカップ',
 'https://nongshimmall.com/product/detail.html?product_no=2486&cate_no=162&display_group=1',
 '면/소맥분(밀:호주산,미국산), 팜유(말레이시아산), 감자전분(덴마크산), 변성전분, 난각칼슘, 정제소금, 식물성풍미유, 면류첨가알칼리제(탄산칼륨, 탄산나트륨, 제이인산나트륨), 혼합제제(메타인산나트륨, 폴리인산나트륨, 제일인산나트륨, 피로인산나트륨), 올리고녹차풍미액, 비타민B2. 스프/해물채소분말, 정제소금, 복합조미간장분말, 조미소고기분말, 설탕, 매운맛분말, 조미돈지분말, 홍합지미베이스분말, 5''-리보뉴클레오티드이나트륨, 시원한육수분말, 조미양념분, 홍합추출물분말, 칠리맛풍미분, 멸치조미분, 혼합제제(변성전분, 덱스트린), 진한맛조미분, 육맛조미분, 간장조미분말, 시골추출물분말, 양파풍미분, 호박산이나트륨, 후레바부스터분말, 매운양념분말, 후추가루, 마늘베이스, 건조어육, 건미역, 너구리형어묵, 건다시마, 건파.',
 'Noodles/Wheat flour (wheat: Australia, USA), palm oil (Malaysia), potato starch (Denmark), modified starch, eggshell calcium, refined salt, vegetable flavor oil, noodle alkaline agent (potassium carbonate, sodium carbonate, disodium phosphate), mixed preparation (sodium metaphosphate, sodium polyphosphate, monosodium phosphate, sodium pyrophosphate), oligo green tea flavor extract, vitamin B2. Soup/seafood vegetable powder, refined salt, mixed seasoned soy sauce powder, seasoned beef powder, sugar, spicy powder, seasoned pork fat powder, mussel extract base powder, disodium 5''-ribonucleotide, savory broth powder, seasoning, mussel extract powder, chili flavor powder, seasoned anchovy powder, mixed preparation (modified starch, dextrin), rich flavor seasoning, meat flavor seasoning, soy sauce seasoning powder, extract powder, onion flavor powder, disodium succinate, flavor booster powder, spicy seasoning powder, pepper powder, garlic base, dried fish meat, dried seaweed (miyeok), raccoon-shaped fish cake, dried kelp, dried green onion.',
 '面条/小麦粉（小麦：澳大利亚产、美国产）、棕榈油（马来西亚产）、马铃薯淀粉（丹麦产）、变性淀粉、蛋壳钙、精制盐、植物风味油、面条用碱剂（碳酸钾、碳酸钠、磷酸氢二钠）、混合制剂（偏磷酸钠、聚磷酸钠、磷酸二氢钠、焦磷酸钠）、低聚绿茶风味液、维生素B2。汤料/海鲜蔬菜粉、精制盐、混合调味酱油粉、调味牛肉粉、白糖、辣味粉、调味猪油粉、贻贝风味底料粉、5''-核糖核苷酸二钠、鲜味高汤粉、调味料、贻贝提取物粉、辣椒风味粉、调味凤尾鱼粉、混合制剂（变性淀粉、糊精）、浓郁调味粉、肉味调味粉、酱油调味粉、提取物粉、洋葱风味粉、琥珀酸二钠、风味增强粉、辣味调味粉、胡椒粉、大蒜底料、干鱼肉、干海带芽、浣熊形鱼糕、干海带、干葱。',
 '麺/小麦粉（小麦：オーストラリア産、アメリカ産）、パーム油（マレーシア産）、じゃがいもでん粉（デンマーク産）、加工でん粉、卵殻カルシウム、精製塩、植物性風味油、麺用アルカリ剤（炭酸カリウム、炭酸ナトリウム、リン酸二ナトリウム）、混合製剤（メタリン酸ナトリウム、ポリリン酸ナトリウム、リン酸二水素ナトリウム、ピロリン酸ナトリウム）、オリゴ緑茶風味液、ビタミンB2。スープ/海鮮野菜粉、精製塩、複合調味醤油粉、調味牛肉粉、砂糖、辛味粉、調味豚脂粉、ムール貝風味ベース粉、5''-リボヌクレオチド二ナトリウム、旨味だし粉、調味料、ムール貝エキス粉、チリ風味粉、調味いりこ粉、混合製剤（加工でん粉、デキストリン）、濃厚調味粉、肉風味調味粉、醤油調味粉、エキス粉、玉ねぎ風味粉、コハク酸二ナトリウム、フレーバーブースター粉、辛味調味粉、こしょう、にんにくベース、乾燥魚肉、乾燥わかめ、たぬき型かまぼこ、乾燥昆布、乾燥ねぎ。',
 '밀, 대두, 계란, 우유, 새우, 돼지고기, 쇠고기, 오징어, 조개류(홍합 포함) 함유',
 'Contains wheat, soybean, egg, milk, shrimp, pork, beef, squid, shellfish (including mussel)',
 '含有小麦、大豆、鸡蛋、牛奶、虾、猪肉、牛肉、鱿鱼、贝类（含贻贝）成分',
 '小麦・大豆・卵・牛乳・えび・豚肉・牛肉・いか・貝類（むらさきいがい含む）を含む',
 '메밀, 땅콩, 고등어, 게, 토마토, 호두, 닭고기, 조개류(굴, 전복 포함), 잣을 사용한 제품과 같은 시설에서 제조. 석유 등 냄새가 나는 곳에 함께 보관하지 마십시오.',
 'Manufactured in a facility that also processes buckwheat, peanuts, mackerel, crab, tomato, walnut, chicken, pine nuts, and shellfish (including oyster, abalone). Do not store near items with strong odors such as petroleum products.',
 '本产品与含有荞麦、花生、鲭鱼、蟹、番茄、核桃、鸡肉、松子、贝类（含牡蛎、鲍鱼）的产品在同一设施生产。请勿与石油等有异味的物品放在一起保管。',
 'そば・落花生・さば・かに・トマト・くるみ・鶏肉・松の実・貝類（かき・あわび含む）を使用した製品と同じ施設で製造。石油など臭いの強いものと一緒に保管しないでください。',
 111, 515, 1590, 72, 5,
 21, 0, 11, 5,
 9, 162,
 '직사광선을 피하고 서늘하고 건조한 곳에 보관하십시오. 개봉 후에는 즉시 조리해 드십시오.',
 'Store away from direct sunlight in a cool, dry place. Cook immediately after opening.',
 '请避光并存放在阴凉干燥处。开封后请立即烹饪食用。',
 '直射日光を避け、涼しく乾燥した場所に保管してください。開封後はすぐに調理してお召し上がりください。'
);
