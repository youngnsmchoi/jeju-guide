-- 짜파게티큰사발면 추가 — FOOD QR 바코드 없음 (제조사 정보 번역 카드 제공)
insert into link_ramen_items (
  order_num, name_ko, name_en, name_zh, name_ja,
  manufacturer_url,
  ingredients_ko, ingredients_en, ingredients_zh, ingredients_ja,
  allergens_ko, allergens_en, allergens_zh, allergens_ja,
  cross_contamination_ko, cross_contamination_en, cross_contamination_zh, cross_contamination_ja,
  storage_note_ko, storage_note_en, storage_note_zh, storage_note_ja,
  serving_size_g,
  nutrition_kcal, nutrition_sodium_mg, nutrition_carbs_g, nutrition_sugar_g,
  nutrition_fat_g, nutrition_trans_fat_g, nutrition_sat_fat_g,
  nutrition_cholesterol_mg, nutrition_protein_g, nutrition_calcium_mg
) values (
  6, '짜파게티큰사발면', 'Chapagetti Big Bowl', '炸酱面碗面', 'チャパゲティビッグボウル',
  'https://www.nongshimmall.com/product/detail.html?product_no=2725&cate_no=43&display_group=1',

  '면(소맥분(밀:호주산, 미국산), 감자전분(덴마크산), 팜유(말레이시아산), 변성전분, 식물성풍미유, 난각칼슘, 정제소금, 풍미조미소스, 면류첨가알칼리제(탄산칼륨, 탄산나트륨, 제이인산나트륨), 혼합제제(메타인산나트륨, 폴리인산나트륨, 제일인산나트륨, 피로인산나트륨), 올리고녹차풍미액, 비타민B2), 스프류(설탕, 분말짜장, 짜장풍미베이스, 볶음조미감자분, 혼합제제(덱스트린, 카라멜색소III), 짜장풍미료, 혼합제제(카라멜색소III, 덱스트린, 효소처리스테비아), 볶음조미소맥분, 짜장베이스씨에스, 야채오일분말, 전분, 볶음양파분, 육수맛조미베이스, 매운맛풍미분, 혼합제제(구아검, 잔탄검), 5''-리보뉴클레오티드이나트륨, 양파비프조미분, 비프양념분말, 대두단백, 조미볶음양파, 건양배추)',
  'Noodles (wheat flour (Australia, USA), potato starch (Denmark), palm oil (Malaysia), modified starch, vegetable flavor oil, eggshell calcium, refined salt, flavor seasoning sauce, alkaline agents for noodles (potassium carbonate, sodium carbonate, disodium phosphate), mixed preparation (sodium metaphosphate, sodium polyphosphate, monosodium phosphate, sodium pyrophosphate), oligo green tea flavor extract, vitamin B2), Soup (sugar, jjajang powder, jjajang flavor base, roasted seasoned potato powder, mixed preparation (dextrin, caramel color III), jjajang flavoring, mixed preparation (caramel color III, dextrin, enzyme-treated stevia), roasted seasoned wheat flour, jjajang base CS, vegetable oil powder, starch, roasted onion powder, broth flavor seasoning base, spicy flavor powder, mixed preparation (guar gum, xanthan gum), disodium 5''-ribonucleotide, onion beef seasoning powder, beef seasoning powder, soy protein, seasoned roasted onion, dried cabbage)',
  '面条（小麦粉（澳大利亚产、美国产）、马铃薯淀粉（丹麦产）、棕榈油（马来西亚产）、变性淀粉、植物风味油、蛋壳钙、精制盐、风味调味酱、面条用碱剂（碳酸钾、碳酸钠、磷酸氢二钠）、混合制剂（偏磷酸钠、聚磷酸钠、磷酸二氢钠、焦磷酸钠）、低聚绿茶风味液、维生素B2）、汤料（白糖、炸酱粉、炸酱风味基料、炒制调味马铃薯粉、混合制剂（糊精、焦糖色III）、炸酱风味料、混合制剂（焦糖色III、糊精、酶处理甜菊糖）、炒制调味小麦粉、炸酱基料CS、蔬菜油粉、淀粉、炒洋葱粉、汤味调味基料、辣味风味粉、混合制剂（瓜尔胶、黄原胶）、5''-肌苷酸二钠、洋葱牛肉调味粉、牛肉调味粉、大豆蛋白、调味炒洋葱、干白菜）',
  '麺（小麦粉（オーストラリア産、アメリカ産）、じゃがいもでん粉（デンマーク産）、パーム油（マレーシア産）、加工でん粉、植物性風味油、卵殻カルシウム、精製塩、風味調味ソース、麺用アルカリ剤（炭酸カリウム、炭酸ナトリウム、リン酸水素二ナトリウム）、混合製剤（メタリン酸ナトリウム、ポリリン酸ナトリウム、リン酸二水素ナトリウム、ピロリン酸ナトリウム）、オリゴ緑茶風味液、ビタミンB2）、スープ（砂糖、ジャージャン粉末、ジャージャン風味ベース、炒め調味じゃがいも粉、混合製剤（デキストリン、カラメル色素III）、ジャージャン風味料、混合製剤（カラメル色素III、デキストリン、酵素処理ステビア）、炒め調味小麦粉、ジャージャンベースCS、野菜オイルパウダー、でん粉、炒め玉ねぎ粉、だし風味調味ベース、辛味風味粉、混合製剤（グアーガム、キサンタンガム）、5''-リボヌクレオチド二ナトリウム、玉ねぎビーフ調味粉、ビーフ調味粉、大豆たんぱく、調味炒め玉ねぎ、乾燥キャベツ）',

  '밀, 대두, 돼지고기, 우유, 계란, 새우, 쇠고기 함유',
  'Contains wheat, soybean, pork, milk, egg, shrimp, beef',
  '含有小麦、大豆、猪肉、牛奶、鸡蛋、虾、牛肉',
  '小麦、大豆、豚肉、牛乳、卵、えび、牛肉を含む',

  '메밀, 땅콩, 잣, 고등어, 게, 토마토, 호두, 닭고기, 오징어, 조개류(굴, 전복, 홍합 포함)를 사용한 제품과 같은 시설에서 제조하고 있습니다.',
  'Manufactured in a facility that also processes products containing buckwheat, peanuts, pine nuts, mackerel, crab, tomato, walnut, chicken, squid, and shellfish (including oyster, abalone, mussel).',
  '本产品与含有荞麦、花生、松子、鲭鱼、蟹、番茄、核桃、鸡肉、鱿鱼、贝类（含牡蛎、鲍鱼、贻贝）的产品在同一设施生产。',
  'そば、落花生、松の実、さば、かに、トマト、くるみ、鶏肉、いか、貝類（かき、あわび、むらさきいがい含む）を使用した製品と同じ施設で製造しています。',

  '직사광선을 피하고 서늘하고 건조한 곳에 보관하십시오. 석유 등 냄새가 나는 곳에 함께 보관하지 말아주십시오. 개봉 후에는 즉시 조리해 드십시오.',
  'Store in a cool, dry place away from direct sunlight. Do not store near substances with strong odors such as petroleum. Cook immediately after opening.',
  '请置于阴凉干燥处保存，避免阳光直射。请勿与石油等有异味的物品放在一起保存。开封后请立即烹饪食用。',
  '直射日光を避け、涼しく乾燥した場所に保管してください。石油など匂いの強いものと一緒に保管しないでください。開封後はすぐに調理してお召し上がりください。',

  123,
  550, 1220, 84, 9,
  19, 0, 9,
  0, 10, 136
);
