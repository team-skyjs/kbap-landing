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

/** Allergen chips. Only Shrimp and Soybean have a capture (the QA account's list). */
export const ALLERGENS = ['shrimp', 'crab', 'shellfish', 'soybean', 'peanut', 'wheat', 'egg', 'milk'];
export const ALLERGENS_CAPTURED = ['shrimp', 'soybean'];

/** Reviews flag chips; the selected one is the visitor's language's country. */
export const FLAGS = ['us', 'jp', 'th', 'vn', 'cn', 'tw', 'es', 'id', 'ru', 'kr'];
export const LANG_FLAG = { en: 'us', ja: 'jp', th: 'th', vi: 'vn', 'zh-Hans': 'cn', 'zh-Hant': 'tw', es: 'es', id: 'id', ru: 'ru', ko: 'kr' };

export const dishName = (d, lang) => d.name[lang] ?? d.name.en;
