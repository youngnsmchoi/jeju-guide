'use client'
// 편의점 먹거리 허브 공통 — 삼각김밥·김밥·도시락 포장지 QR코드(FOOD QR) 읽는 법 안내
// 실제 상품(급식대가뉴정석도시락) 화면을 예시로 각 항목의 의미를 설명

import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/lib/types'

type InfoTab = 'nutrition' | 'ingredients' | 'allergen' | 'safety' | 'contact' | 'storage'
const INFO_TABS: InfoTab[] = ['nutrition', 'ingredients', 'allergen', 'safety', 'contact', 'storage']

const EXAMPLE_URL = 'https://foodqr.kr/01/08801771034643?92=01'

type NutrientRow = { label: string; value: string; sub?: string; subValue?: string; percent?: string; level: 'caution' | 'good' | 'neutral' }

const NUTRIENT_ROWS: NutrientRow[] = [
  { label: '나트륨', value: '1440mg', percent: '72%', level: 'caution' },
  { label: '탄수화물', value: '112g', sub: '당류', subValue: '17g', percent: '35%', level: 'neutral' },
  { label: '지방', value: '15g', sub: '포화지방', subValue: '6g', percent: '28%', level: 'neutral' },
  { label: '콜레스테롤', value: '160mg', percent: '53%', level: 'caution' },
  { label: '단백질', value: '38g', percent: '69%', level: 'good' },
]

const LABEL: Record<Lang, {
  title: string
  step1Title: string
  step1Desc: string
  step2Title: string
  step2Desc: string
  linkLabel: string
  exampleNote: string
  tabNutrition: string
  tabIngredients: string
  tabAllergen: string
  tabSafety: string
  tabContact: string
  tabStorage: string
  nutritionTitle: string
  nutritionKcal: string
  nutritionFootnote: string
  legendCaution: string
  legendGood: string
  legendNeutral: string
  cautionTip: string
  ingredientsTitle: string
  ingredientsExample: string
  ingredientsDesc: string
  allergenTitle: string
  allergenExample: string
  allergenDesc: string
  safetyTitle: string
  safetyExample: string[]
  safetyDesc: string
  contactTitle: string
  contactExample: string[]
  contactDesc: string
  storageTitle: string
  storageExample: string
  storageDesc: string
}> = {
  ko: {
    title: '📱 QR코드로 상세 정보 확인하기',
    step1Title: '① 번역 앱으로 상품 바로 스캔하기',
    step1Desc: '파파고·구글 번역 카메라로 포장지를 비추면, 그 자리에서 바로 한글이 번역됩니다. 빠르게 훑어볼 때 좋습니다.',
    step2Title: '② 포장지 QR코드 스캔하기',
    step2Desc: '삼각김밥·김밥·도시락 포장지에는 QR코드가 있습니다. 스캔하면 영양표시·원재료명·알레르기 등 상세 정보가 나오는 사이트로 연결됩니다. 이 사이트도 한국어만 지원되니, 번역 앱 카메라로 화면을 다시 비추면 번역해서 볼 수 있어요.',
    linkLabel: '🔗 아래 링크는 예시 화면입니다 (실제로는 각 상품 포장지의 QR코드를 스캔하세요) →',
    exampleNote: '아래는 실제 도시락 상품(급식대가뉴정석도시락) 페이지를 예시로 각 항목의 의미를 설명한 것입니다.',
    tabNutrition: '영양표시',
    tabIngredients: '원재료명',
    tabAllergen: '알레르기 유발물질 표기',
    tabSafety: '소비자 안전을 위한 주의사항',
    tabContact: '문의처',
    tabStorage: '보관방법 또는 취급방법',
    nutritionTitle: '영양표시',
    nutritionKcal: 'kcal',
    nutritionFootnote: '1일 영양성분 기준치에 대한 비율(%)은 2,000kcal 기준이므로 개인의 필요 열량에 따라 다를 수 있습니다.',
    legendCaution: '🔴 주의: %가 30% 이상이면 과다 섭취 주의가 필요한 성분',
    legendGood: '🟢 양호: %가 높을수록 오히려 좋은 성분',
    legendNeutral: '⚪ 일반: 특별히 주의할 필요 없는 성분',
    cautionTip: '⚠️ %는 하루 권장 섭취량(2,000kcal 기준) 대비 이 제품 하나에 들어있는 비율입니다. 나트륨·포화지방·콜레스테롤은 %가 높을수록(예: 30% 이상) 이 한 끼로 하루 권장량의 많은 부분을 채운다는 뜻이니, 다른 식사에서는 싱겁고 담백한 메뉴를 고르는 것이 좋습니다.',
    ingredientsTitle: '원재료명',
    ingredientsExample: '정제수, 쌀[국산], 양념육(간장불고기)[돼지고기(앞다리살:외국산), 소스(양조간장(탈지대두:인도산)), 주정(발효주정), 설탕, 카라멜색소Ⅲ], 양념육(매콤한불고기)[돼지고기(앞다리:외국산), 소스(고추장(소맥분(밀:미국산,호주산)))], 알가열제품[전란액, 마요네즈, 소스, 변성전분, 옥수수기름(옥배유)], 볶음김치[김치, 옥수수기름(옥배유), 설탕, 고춧가루, L-글루탐산나트륨(향미증진제)], 즉석섭취식품(단호박샐러드)[호박, 샐러드베이스, 당근, 설탕, 결정과당], 어묵, 혼합식용유, 대파, 소스1, 옥수수기름(옥배유), 당근, 조미김, 천연향신료(다진마늘), 설탕, 소스2, 참기름, 발효식초, 혼합간장, 가공소금, 기타 농산가공품(볶음참깨), 기타 농산가공품(검정볶음깨), 카라멜색소Ⅲ(착색료)',
    ingredientsDesc: '실제로 들어간 모든 재료를 원료 함량이 많은 순서대로 표기한 것입니다. 특정 재료(돼지고기, 소고기 등)를 피해야 한다면 여기서 직접 확인할 수 있습니다.',
    allergenTitle: '알레르기 유발물질 표기',
    allergenExample: '우유, 대두, 밀, 조개류(굴), 닭고기, 돼지고기, 쇠고기, 계란 함유',
    allergenDesc: '이 제품에 실제로 들어간 알레르기 유발 성분입니다. 해당 알레르기가 있다면 반드시 피해야 합니다.',
    safetyTitle: '소비자 안전을 위한 주의사항',
    safetyExample: [
      '이 제품은 알류(메추리알), 아황산류, 토마토, 메밀, 고등어, 게, 복숭아, 호두, 오징어, 땅콩, 잣, 조개류(전복,홍합)를 사용한 제품과 같은 제조시설에서 제조하고 있습니다.',
      '보관방법 미준수시 변질될 우려가 있으니 구매후 바로 드세요.',
      '본 제품은 소비자분쟁해결기준(공정위고시)에 의거 교환 및 보상받을 수 있습니다.',
      '부정·불량식품신고는 국번없이 1399',
    ],
    safetyDesc: '첫 문장이 특히 중요합니다 — 이건 "직접 들어간" 재료가 아니라, 같은 공장에서 다른 제품도 만들어서 미량 섞일 수 있는 재료입니다. 알레르기가 심한 사람은 이것도 함께 확인해야 합니다.',
    contactTitle: '문의처',
    contactExample: [
      '고객센터 : 1577-7461',
      'F1.원푸드림 / 1577-7461',
      'F2.푸드플래닛 / 033)733-6680',
      'F3.BGF푸드전북 / 1558-9261',
      'F4.BGF푸드제주 / 064)711-5604',
    ],
    contactDesc: '실제 문제(이물질, 맛 이상 등)가 발생했을 때 연락할 곳입니다. 제조원이 여러 곳으로 나오는 건 같은 상품을 지역별 공장에서 나눠 생산하기 때문이며, 상품 자체는 동일합니다.',
    storageTitle: '보관방법 또는 취급방법',
    storageExample: '냉장보관(0~10℃)',
    storageDesc: '이 온도를 지키지 않으면 식중독 위험이 있습니다. 구매 후 바로 먹거나, 계속 냉장 보관해야 합니다.',
  },
  en: {
    title: '📱 Check Detailed Info via QR Code',
    step1Title: '① Scan the product directly with a translation app',
    step1Desc: 'Point Papago or Google Translate\'s camera at the package to translate the Korean text on the spot. Good for a quick check.',
    step2Title: '② Scan the QR code on the package',
    step2Desc: 'Triangle kimbap, gimbap, and bento packages have a QR code printed on them. Scanning it takes you to a site with detailed nutrition facts, ingredients, and allergen info. That site is Korean-only too, so point your translation app\'s camera at the screen again to translate it.',
    linkLabel: '🔗 The link below is a sample screen (in real life, scan the QR code on each product\'s package) →',
    exampleNote: 'Below, we use a real bento product page (Geupsikdaega New Jeongseok Bento) as an example to explain what each section means.',
    tabNutrition: 'Nutrition Facts',
    tabIngredients: 'Ingredients',
    tabAllergen: 'Allergen Labeling',
    tabSafety: 'Consumer Safety Precautions',
    tabContact: 'Contact Information',
    tabStorage: 'Storage / Handling',
    nutritionTitle: 'Nutrition Facts',
    nutritionKcal: 'kcal',
    nutritionFootnote: 'The %Daily Value is based on a 2,000 kcal diet, so it may vary depending on your individual calorie needs.',
    legendCaution: '🔴 Caution: 30% or higher means a nutrient to watch for overconsumption',
    legendGood: '🟢 Good: higher % is actually beneficial for this nutrient',
    legendNeutral: '⚪ Neutral: no special caution needed',
    cautionTip: '⚠️ The % shows how much of your daily recommended intake (based on 2,000 kcal) this single product provides. For sodium, saturated fat, and cholesterol, a higher % (e.g. 30%+) means this one meal already covers a large share of your daily limit — so it\'s a good idea to choose lighter, less salty options for your other meals.',
    ingredientsTitle: 'Ingredients',
    ingredientsExample: 'Purified water, rice [domestic], seasoned meat (soy-sauce bulgogi) [pork (foreleg: imported), sauce (brewed soy sauce (defatted soybean: Indian)), fermented alcohol, sugar, caramel color III], seasoned meat (spicy bulgogi) [pork (foreleg: imported), sauce (gochujang (wheat flour (wheat: US, Australian)))], heated egg product [whole egg liquid, mayonnaise, sauce, modified starch, corn oil (corn germ oil)], stir-fried kimchi [kimchi, corn oil (corn germ oil), sugar, red pepper powder, monosodium L-glutamate (flavor enhancer)], ready-to-eat food (sweet pumpkin salad) [pumpkin, salad base, carrot, sugar, crystalline fructose], fish cake, mixed cooking oil, green onion, sauce 1, corn oil (corn germ oil), carrot, seasoned laver, natural spice (minced garlic), sugar, sauce 2, sesame oil, fermented vinegar, mixed soy sauce, processed salt, other agricultural processed products (roasted sesame), other agricultural processed products (roasted black sesame), caramel color III (coloring)',
    ingredientsDesc: 'This lists every ingredient actually used, in order of quantity. If you need to avoid a specific ingredient (pork, beef, etc.), you can check it directly here.',
    allergenTitle: 'Allergen Labeling',
    allergenExample: 'Contains milk, soybean, wheat, shellfish (oyster), chicken, pork, beef, egg',
    allergenDesc: 'These are allergens actually contained in this product. If you have any of these allergies, you must avoid it.',
    safetyTitle: 'Consumer Safety Precautions',
    safetyExample: [
      'This product is manufactured in the same facility as products containing eggs (quail eggs), sulfites, tomato, buckwheat, mackerel, crab, peach, walnut, squid, peanut, pine nut, and shellfish (abalone, mussel).',
      'May spoil if storage instructions are not followed — eat right after purchase.',
      'This product is eligible for exchange or compensation under the Consumer Dispute Resolution Standards (Fair Trade Commission notice).',
      'To report fraudulent or substandard food, call 1399 (no area code needed).',
    ],
    safetyDesc: 'The first line matters most — these ingredients weren\'t directly added, but the factory also makes other products containing them, so trace amounts could mix in. If you have a severe allergy, check this too.',
    contactTitle: 'Contact Information',
    contactExample: [
      'Customer Center: 1577-7461',
      'F1. Onefoodream / 1577-7461',
      'F2. Food Planet / 033-733-6680',
      'F3. BGF Food Jeonbuk / 1558-9261',
      'F4. BGF Food Jeju / 064-711-5604',
    ],
    contactDesc: 'These are contacts for reporting actual issues (foreign objects, off flavors, etc). Multiple manufacturers are listed because the same product is made at different regional factories — the product itself is identical.',
    storageTitle: 'Storage / Handling Instructions',
    storageExample: 'Refrigerate (0-10°C)',
    storageDesc: 'Not keeping this temperature range risks food poisoning. Eat it right after buying, or keep it refrigerated at all times.',
  },
  zh: {
    title: '📱 用QR码查询详细信息',
    step1Title: '① 用翻译App直接扫描商品',
    step1Desc: '用Papago或谷歌翻译的相机对准包装，即可当场翻译韩文。适合快速查看。',
    step2Title: '② 扫描包装上的QR码',
    step2Desc: '三角饭团、紫菜卷、便当的包装上都印有QR码。扫描后会连接到显示营养成分、原材料、过敏原等详细信息的网站。该网站也只支持韩语，可以再次用翻译App的相机对准屏幕翻译查看。',
    linkLabel: '🔗 下方链接为示例画面（实际请扫描各商品包装上的QR码）→',
    exampleNote: '以下以真实便当商品页面（급식대가뉴정석도시락）为例，说明各项目的含义。',
    tabNutrition: '营养标示',
    tabIngredients: '原材料名称',
    tabAllergen: '过敏原标示',
    tabSafety: '消费者安全注意事项',
    tabContact: '咨询处',
    tabStorage: '保管方法或处理方法',
    nutritionTitle: '营养标示',
    nutritionKcal: 'kcal',
    nutritionFootnote: '1日营养成分基准值比例(%)以2,000kcal为基准，可能因个人所需热量而有所不同。',
    legendCaution: '🔴 注意：比例达到30%以上，需注意摄入过量的成分',
    legendGood: '🟢 良好：比例越高反而越好的成分',
    legendNeutral: '⚪ 一般：无需特别注意的成分',
    cautionTip: '⚠️ 比例(%)表示这一件商品占每日建议摄入量（以2,000kcal为基准）的比重。钠、饱和脂肪、胆固醇的比例越高（例如30%以上），说明这一餐已经占去每日限量的很大一部分，建议其他餐次选择清淡少盐的菜品。',
    ingredientsTitle: '原材料名称',
    ingredientsExample: '净化水、大米[国产]、调味肉(酱油烤肉)[猪肉(前腿肉:进口)、酱汁(酿造酱油(脱脂大豆:印度产))、酒精(发酵酒精)、白糖、焦糖色素Ⅲ]、调味肉(辣味烤肉)[猪肉(前腿:进口)、酱汁(辣椒酱(小麦粉(小麦:美国产,澳大利亚产)))]、加热鸡蛋制品[全蛋液、蛋黄酱、酱汁、变性淀粉、玉米油(玉米胚芽油)]、炒泡菜[泡菜、玉米油(玉米胚芽油)、白糖、辣椒粉、L-谷氨酸钠(增味剂)]、即食食品(南瓜沙拉)[南瓜、沙拉底料、胡萝卜、白糖、结晶果糖]、鱼糕、混合食用油、大葱、酱汁1、玉米油(玉米胚芽油)、胡萝卜、调味紫菜、天然香辛料(蒜蓉)、白糖、酱汁2、香油、发酵食醋、混合酱油、加工盐、其他农产加工品(炒芝麻)、其他农产加工品(炒黑芝麻)、焦糖色素Ⅲ(着色料)',
    ingredientsDesc: '这里列出了实际使用的所有原材料，按含量从多到少排列。如果需要避开特定食材(猪肉、牛肉等)，可以在这里直接确认。',
    allergenTitle: '过敏原标示',
    allergenExample: '含有牛奶、大豆、小麦、贝类(牡蛎)、鸡肉、猪肉、牛肉、鸡蛋',
    allergenDesc: '这些是实际包含在该产品中的过敏原成分。如果您对其中任何一项过敏，务必避免食用。',
    safetyTitle: '消费者安全注意事项',
    safetyExample: [
      '本产品与含有卵类(鹌鹑蛋)、亚硫酸盐类、西红柿、荞麦、鲭鱼、蟹、桃子、核桃、鱿鱼、花生、松子、贝类(鲍鱼,贻贝)的产品在同一生产设施中制造。',
      '未按保管方法保存可能变质，请购买后立即食用。',
      '本产品可根据消费者纠纷解决基准(公平交易委员会公告)进行换货或赔偿。',
      '虚假·不良食品举报请拨打1399(无需区号)',
    ],
    safetyDesc: '第一句话尤其重要——这些不是直接添加的原料，而是同一工厂还生产含有这些成分的其他产品，可能混入微量。过敏严重者也应确认这一项。',
    contactTitle: '咨询处',
    contactExample: [
      '客服中心 : 1577-7461',
      'F1.原食梦 / 1577-7461',
      'F2.食品星球 / 033)733-6680',
      'F3.BGF食品全北 / 1558-9261',
      'F4.BGF食品济州 / 064)711-5604',
    ],
    contactDesc: '这是发生实际问题(异物、味道异常等)时可以联系的地方。列出多个制造商是因为同一商品在不同地区工厂分别生产，商品本身是相同的。',
    storageTitle: '保管方法或处理方法',
    storageExample: '冷藏保管(0~10℃)',
    storageDesc: '不遵守此温度可能有食物中毒风险。请购买后立即食用，或持续冷藏保管。',
  },
  ja: {
    title: '📱 QRコードで詳細情報を確認',
    step1Title: '① 翻訳アプリで商品を直接スキャン',
    step1Desc: 'Papagoやgoogle翻訳のカメラをパッケージにかざすと、その場で韓国語が翻訳されます。手早く確認したいときに便利です。',
    step2Title: '② パッケージのQRコードをスキャン',
    step2Desc: 'おにぎり・海苔巻き・弁当のパッケージにはQRコードが印刷されています。スキャンすると栄養成分・原材料名・アレルギー情報などの詳細が見られるサイトにつながります。このサイトも韓国語のみ対応なので、翻訳アプリのカメラで画面をもう一度かざすと翻訳して見られます。',
    linkLabel: '🔗 下のリンクはサンプル画面です（実際は各商品パッケージのQRコードをスキャンしてください）→',
    exampleNote: '以下は実際の弁当商品ページ（급식대가뉴정석도시락）を例に、各項目の意味を説明したものです。',
    tabNutrition: '栄養表示',
    tabIngredients: '原材料名',
    tabAllergen: 'アレルギー物質表示',
    tabSafety: '消費者安全のための注意事項',
    tabContact: 'お問い合わせ先',
    tabStorage: '保管方法または取扱方法',
    nutritionTitle: '栄養表示',
    nutritionKcal: 'kcal',
    nutritionFootnote: '1日栄養成分基準値に対する比率(%)は2,000kcal基準のため、個人の必要熱量により異なる場合があります。',
    legendCaution: '🔴 注意：比率が30%以上だと過剰摂取に注意が必要な成分',
    legendGood: '🟢 良好：比率が高いほどむしろ良い成分',
    legendNeutral: '⚪ 通常：特に注意の必要がない成分',
    cautionTip: '⚠️ 比率(%)は、1日の推奨摂取量(2,000kcal基準)に対してこの製品1つに含まれる割合です。ナトリウム・飽和脂肪・コレステロールは比率が高いほど(例：30%以上)、この一食で1日の推奨量のかなりの部分を占めるという意味なので、他の食事では薄味で軽めのメニューを選ぶのがおすすめです。',
    ingredientsTitle: '原材料名',
    ingredientsExample: '精製水、米[国産]、味付け肉(醤油プルコギ)[豚肉(前脚肉:外国産)、ソース(醸造醤油(脱脂大豆:インド産))、酒精(発酵酒精)、砂糖、カラメル色素Ⅲ]、味付け肉(辛口プルコギ)[豚肉(前脚:外国産)、ソース(コチュジャン(小麦粉(小麦:米国産,オーストラリア産)))]、加熱卵製品[全卵液、マヨネーズ、ソース、加工でんぷん、コーン油(コーン胚芽油)]、炒めキムチ[キムチ、コーン油(コーン胚芽油)、砂糖、唐辛子粉、L-グルタミン酸ナトリウム(調味料)]、即席摂取食品(かぼちゃサラダ)[かぼちゃ、サラダベース、にんじん、砂糖、結晶果糖]、練り物、混合食用油、長ねぎ、ソース1、コーン油(コーン胚芽油)、にんじん、味付け海苔、天然香辛料(にんにくみじん切り)、砂糖、ソース2、ごま油、発酵酢、混合醤油、加工塩、その他農産加工品(炒りごま)、その他農産加工品(炒り黒ごま)、カラメル色素Ⅲ(着色料)',
    ingredientsDesc: '実際に使われている全ての原材料を含有量の多い順に表記したものです。特定の食材(豚肉、牛肉など)を避けたい場合は、ここで直接確認できます。',
    allergenTitle: 'アレルギー物質表示',
    allergenExample: '牛乳、大豆、小麦、貝類(牡蠣)、鶏肉、豚肉、牛肉、卵を含む',
    allergenDesc: 'この製品に実際に含まれるアレルギー物質です。該当するアレルギーがある場合は必ず避けてください。',
    safetyTitle: '消費者安全のための注意事項',
    safetyExample: [
      'この製品は、卵類(うずらの卵)、亜硫酸類、トマト、そば、さば、かに、桃、くるみ、いか、落花生、松の実、貝類(あわび,ムール貝)を使用した製品と同じ製造施設で製造しています。',
      '保管方法を守らないと変質のおそれがあるので、購入後すぐにお召し上がりください。',
      '本製品は消費者紛争解決基準(公正取引委員会告示)により交換及び補償を受けることができます。',
      '不正・不良食品の申告は市外局番なしで1399',
    ],
    safetyDesc: '最初の文が特に重要です——これは「直接入っている」原材料ではなく、同じ工場で他の製品も作っているため微量混入する可能性がある原材料です。重いアレルギーがある方はこちらも確認してください。',
    contactTitle: 'お問い合わせ先',
    contactExample: [
      'お客様センター : 1577-7461',
      'F1.ワンフードリム / 1577-7461',
      'F2.フードプラネット / 033)733-6680',
      'F3.BGFフード全北 / 1558-9261',
      'F4.BGFフード済州 / 064)711-5604',
    ],
    contactDesc: '実際の問題(異物混入、味の異常など)が発生した際に連絡する先です。製造元が複数表示されるのは、同じ商品を地域別の工場で分担生産しているためで、商品自体は同一です。',
    storageTitle: '保管方法または取扱方法',
    storageExample: '冷蔵保管(0~10℃)',
    storageDesc: 'この温度を守らないと食中毒の危険があります。購入後すぐに食べるか、常に冷蔵保管してください。',
  },
}

function levelClass(level: NutrientRow['level']) {
  if (level === 'caution') return 'text-red-600'
  if (level === 'good') return 'text-emerald-600'
  return 'text-gray-700'
}

function tabLabel(L: (typeof LABEL)[Lang], tab: InfoTab): string {
  return {
    nutrition: L.tabNutrition,
    ingredients: L.tabIngredients,
    allergen: L.tabAllergen,
    safety: L.tabSafety,
    contact: L.tabContact,
    storage: L.tabStorage,
  }[tab]
}

export default function FoodQrSection() {
  const { lang } = useLang()
  const L = LABEL[lang]
  const [tab, setTab] = useState<InfoTab>('nutrition')

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 space-y-3">
      <p className="text-base font-bold text-gray-900">{L.title}</p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-1.5">
        <p className="text-sm font-bold text-gray-800">{L.step1Title}</p>
        <p className="text-xs text-gray-600 leading-relaxed">{L.step1Desc}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-1.5">
        <p className="text-sm font-bold text-gray-800">{L.step2Title}</p>
        <p className="text-xs text-gray-600 leading-relaxed">{L.step2Desc}</p>
      </div>

      <a
        href={EXAMPLE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 hover:bg-blue-100 transition-colors"
      >
        <p className="text-sm font-bold text-blue-800 break-all">{L.linkLabel}</p>
        <p className="text-xs text-blue-600 mt-1 break-all">{EXAMPLE_URL}</p>
      </a>

      <p className="text-xs text-gray-400 leading-relaxed">{L.exampleNote}</p>

      {/* 가로 스크롤 탭 */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {INFO_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap
              ${tab === t ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
            {tabLabel(L, t)}
          </button>
        ))}
      </div>

      {tab === 'nutrition' && (
        <>
          {/* 영양표시 — foodqr.kr 실물 스타일 재현 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
              <span className="text-sm font-bold">{L.nutritionTitle}</span>
              <span className="text-sm font-bold">735{L.nutritionKcal}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {NUTRIENT_ROWS.map((row, i) => (
                <div key={i} className="px-4 py-2 flex items-center justify-between text-xs">
                  <div className="text-gray-700">
                    <span>{row.label} {row.value}</span>
                    {row.sub && <span className="block text-gray-400 pl-2">{row.sub} {row.subValue}</span>}
                  </div>
                  {row.percent && <span className={`font-bold ${levelClass(row.level)}`}>{row.percent}</span>}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 px-4 py-2 leading-relaxed">{L.nutritionFootnote}</p>
          </div>

          <details className="bg-white rounded-xl border border-gray-200 px-3 py-2">
            <summary className="text-xs font-medium text-gray-500 cursor-pointer">{L.legendCaution.split(':')[0]} / {L.legendGood.split(':')[0]} / {L.legendNeutral.split(':')[0]}</summary>
            <div className="space-y-1 pt-2">
              <p className="text-xs text-red-600">{L.legendCaution}</p>
              <p className="text-xs text-emerald-600">{L.legendGood}</p>
              <p className="text-xs text-gray-500">{L.legendNeutral}</p>
            </div>
          </details>

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">{L.cautionTip}</p>
        </>
      )}

      {tab === 'ingredients' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.ingredientsTitle}</p>
          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{L.ingredientsExample}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{L.ingredientsDesc}</p>
        </div>
      )}

      {tab === 'allergen' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.allergenTitle}</p>
          <p className="text-xs text-amber-800 leading-relaxed bg-amber-50 rounded-lg px-3 py-2">{L.allergenExample}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{L.allergenDesc}</p>
        </div>
      )}

      {tab === 'safety' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.safetyTitle}</p>
          <ul className="space-y-1">
            {L.safetyExample.map((line, i) => (
              <li key={i} className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{line}</li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 leading-relaxed">{L.safetyDesc}</p>
        </div>
      )}

      {tab === 'contact' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.contactTitle}</p>
          <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2 space-y-0.5">
            {L.contactExample.map((line, i) => <p key={i}>{line}</p>)}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{L.contactDesc}</p>
        </div>
      )}

      {tab === 'storage' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-2">
          <p className="text-sm font-bold text-gray-800">{L.storageTitle}</p>
          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">{L.storageExample}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{L.storageDesc}</p>
        </div>
      )}
    </div>
  )
}
