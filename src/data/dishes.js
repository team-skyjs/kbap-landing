/**
 * Demo data, from the D-24 design build (kbap-design/bridge/figma-plugin/builds/D-24-src).
 *
 * HERO_MENU is the test menu Kbap QA scanned for the captures, so the hero and the
 * phone screens tell one story. Names are the app's own strings per language
 * (read off scan-result-list-<lang>.png); Korean names and prices are the place
 * and are never translated. Verdicts match the capture account's avoid list (Shrimp).
 */
export const HERO_MENU = [
  { ko: '갓김치', price: '7,000', verdict: 'caution', name: { en: 'Mustard Leaf Kimchi', ja: 'からし菜キムチ', es: 'Kimchi de hojas de mostaza', th: 'กิมจิใบมัสตาร์ด', ru: 'Кимчи из горчичной зелени', 'zh-Hant': '芥菜泡菜', 'zh-Hans': '芥菜泡菜', vi: 'Kimchi cải bẹ xanh', id: 'Kimchi sawi hijau' } },
  { ko: '제육볶음', price: '10,000', verdict: 'safe', name: { en: 'Spicy Stir-fried Pork', ja: '韓国風豚肉の辛炒め', es: 'Cerdo salteado picante', th: 'หมูผัดเผ็ดเกาหลี', ru: 'Острая свинина по-корейски', 'zh-Hant': '韓式辣炒豬肉', 'zh-Hans': '韩式辣炒猪肉', vi: 'Thịt heo xào cay', id: 'Tumis Daging Babi Pedas' } },
  { ko: '새우튀김', price: '12,000', verdict: 'danger', name: { en: 'Fried Shrimp', ja: 'えびフライ', es: 'Camarones fritos', th: 'กุ้งทอด', ru: 'Жареные креветки', 'zh-Hant': '炸蝦', 'zh-Hans': '炸虾', vi: 'Tôm chiên', id: 'Udang Goreng' } },
  { ko: '청국장찌개', price: '9,000', verdict: 'safe', name: { en: 'Fermented Soybean Paste Stew', ja: '納豆チゲ', es: 'Guiso de pasta de soja fermentada', th: 'ซุปเต้าเจี้ยวถั่วเหลืองหมัก', ru: 'Суп из ферментированной сои', 'zh-Hant': '發酵黃豆醬湯', 'zh-Hans': '发酵大豆酱汤', vi: 'Canh tương đậu nành lên men', id: 'Sup Pasta Kedelai Fermentasi' } },
];

/** Hero cycles through these after the scan (desktop shows them as a rail). */
export const HERO_CYCLE = ['en', 'ja', 'es', 'th'];

/**
 * Spice gauge tiles (prod photos in /assets/food/<img>.webp).
 * ponytail: spice levels are the design's, not pulled from the catalog; check them
 * against the server's dish data before launch.
 */
export const SPICE_DISHES = [
  { img: 'bulgogi', spice: 0, ko: '불고기', name: { en: 'Bulgogi (marinated beef)', ja: 'プルコギ', es: 'Bulgogi (res marinada)', ru: 'Пулькоги', th: 'บุลโกกิ' } },
  { img: 'samgyeop', spice: 0, ko: '삼겹살', name: { en: 'Grilled pork belly', ja: 'サムギョプサル', es: 'Panceta a la parrilla', ru: 'Свиная грудинка на гриле', th: 'หมูสามชั้นย่าง' } },
  { img: 'japchae', spice: 0, ko: '잡채', name: { en: 'Glass noodles with vegetables', ja: 'チャプチェ', es: 'Fideos de cristal', ru: 'Чапчхэ', th: 'จับแช' } },
  { img: 'naeng', spice: 0, ko: '물냉면', name: { en: 'Cold buckwheat noodles', ja: '水冷麺', es: 'Fideos fríos de trigo sarraceno', ru: 'Холодная гречневая лапша', th: 'บะหมี่เย็น' } },
  { img: 'bibimbap', spice: 1, ko: '전주비빔밥', name: { en: 'Jeonju bibimbap', ja: '全州ビビンバ', es: 'Bibimbap de Jeonju', ru: 'Чонджу пибимпап', th: 'บิบิมบับจอนจู', 'zh-Hant': '全州拌飯' } },
  { img: 'doenjang', spice: 1, ko: '청국장찌개', name: { en: 'Fermented soybean stew', ja: 'チョングッチャンチゲ', es: 'Guiso de soya fermentada', ru: 'Суп из ферментированной сои', th: 'ซุปถั่วเหลืองหมัก', 'zh-Hant': '清麴醬湯' } },
  { img: 'sundubu', spice: 2, ko: '순두부찌개', name: { en: 'Soft tofu stew', ja: 'スンドゥブチゲ', es: 'Guiso de tofu suave', ru: 'Сундубу-тиге', th: 'ซุปเต้าหู้อ่อน' } },
  { img: 'jeyuk', spice: 2, ko: '제육볶음', name: HERO_MENU[1].name },
  { img: 'kimchi', spice: 2, ko: '김치볶음밥', name: { en: 'Kimchi fried rice', ja: 'キムチチャーハン', es: 'Arroz frito con kimchi', ru: 'Жареный рис с кимчи', th: 'ข้าวผัดกิมจิ', vi: 'Cơm chiên kim chi', id: 'Nasi goreng kimchi', 'zh-Hans': '泡菜炒饭', 'zh-Hant': '泡菜炒飯' } },
  { img: 'tteok', spice: 3, ko: '떡볶이', name: { en: 'Spicy rice cakes', ja: 'トッポッキ', es: 'Pasteles de arroz picantes', ru: 'Токпокки', th: 'ต๊อกบกกี' } },
];

/** The capture account's avoid list: the allergy demo switches exactly this on/off. */
export const ALLERGENS_CAPTURED = ['shrimp', 'soybean'];

/** Reviews flag chips; the selected one is the visitor's language's country. */
export const FLAGS = ['us', 'jp', 'th', 'vn', 'cn', 'tw', 'es', 'id', 'ru', 'kr'];
export const LANG_FLAG = { en: 'us', ja: 'jp', th: 'th', vi: 'vn', 'zh-Hans': 'cn', 'zh-Hant': 'tw', es: 'es', id: 'id', ru: 'ru', ko: 'kr' };

export const dishName = (d, lang) => d.name[lang] ?? d.name.en;

/**
 * Reviews demo: the real reviews-nat-off-en capture, with the country toggle and
 * the cards under it drawn in HTML so each flag chip shows "<CC> only" and that
 * country's reviews. ponytail: EXAMPLE reviews and count (the page labels them as
 * examples); swap in real prod reviews when they exist. English, like the capture UI.
 */
export const REVIEW_COUNT = 240;
// Shown in English like the rest of the capture UI (the app translates reviews).
export const REVIEWS = {
  us: [
    ['jake.m', 5, 'Sweet, savory and not spicy at all. The glass noodles had a great chew and it went perfectly with rice.', '2 days ago', 14],
    ['sarahk', 5, 'Lighter than I expected and full of vegetables. Easy pick if you are new to Korean food.', '1 week ago', 6],
  ],
  jp: [
    ['yuki_t', 5, 'Tastes like a sweeter sukiyaki. The noodles stay springy even when they cool down.', '3 days ago', 11],
    ['kenji', 5, 'Gentle seasoning, good for anyone who cannot handle spice. Sesame oil smell is lovely.', '2 weeks ago', 5],
  ],
  th: [
    ['ploy.s', 5, 'Reminds me of pad woon sen but sweeter. I added a bit of chili and it was perfect.', '4 days ago', 9],
    ['nattapong', 5, 'Not spicy at all, so ask for gochujang on the side if you like heat.', '1 week ago', 3],
  ],
  vn: [
    ['minhh', 5, 'The japchae was delicious, with springy glass noodles coated in a savory, slightly sweet sauce and plenty of crisp-tender vegetables.', 'Today', 0],
    ['thao.ng', 5, 'Similar to our mien xao but sweeter. Big portion, good for sharing.', '5 days ago', 7],
  ],
  cn: [
    ['lin_w', 5, 'Like a Korean version of stir-fried glass noodles. Not oily, nice sesame fragrance.', '2 days ago', 12],
    ['chenyu', 5, 'A bit sweet for me but the texture is great. Good with kimchi on the side.', '3 weeks ago', 4],
  ],
  tw: [
    ['wei.h', 5, 'Soft and chewy noodles, light sweet soy flavor. My kids loved it.', '6 days ago', 8],
    ['yating', 5, 'Very balanced and not spicy. Would order again with rice.', '2 weeks ago', 2],
  ],
  es: [
    ['lucia.g', 5, 'Perfect glass noodles, sweet and savory at once. Great pick if you do not like spicy food.', '3 days ago', 10],
    ['pablo_r', 5, 'A light dish with lots of vegetables. Ideal for sharing.', '1 week ago', 3],
  ],
  id: [
    ['putri.a', 5, 'Like bihun goreng but sweeter. Big portion and not spicy.', '4 days ago', 9],
    ['rizky', 5, 'Light and tasty, good for anyone who avoids spicy food.', '2 weeks ago', 2],
  ],
  ru: [
    ['anya.k', 5, 'Tender glass noodles with a sweet and salty taste. Not spicy at all.', '5 days ago', 7],
    ['dmitry', 5, 'Lots of vegetables and light. Goes well with rice.', '3 weeks ago', 1],
  ],
  kr: [
    ['jiwoo', 5, 'Tastes like the japchae at a family feast. Chewy noodles, seasoned just right.', '1 day ago', 15],
    ['minseo.l', 5, 'Sweet with plenty of vegetables, and mild enough to share with kids.', '1 week ago', 4],
  ],
};
