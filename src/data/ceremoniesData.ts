import {
  CeremonyInfo,
  ColorPalette,
  ExportPreset,
  FontFamily,
  IconId,
  LayoutStyle,
  LogoConfig,
  BaseShape,
} from '../types/logo';

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'uzbek-flag-palette',
    name: "O'zbekiston bayrog'i",
    primaryColor: '#007791',
    secondaryColor: '#1EB53A',
    goldColor: '#F59E0B',
    bgColor: '#061524',
  },
  {
    id: 'royal-navy-gold',
    name: "Shohona ko'k va oltin",
    primaryColor: '#1E3A8A',
    secondaryColor: '#38BDF8',
    goldColor: '#D4AF37',
    bgColor: '#070E1A',
  },
  {
    id: 'navruz-spring',
    name: "Navro'z bahori",
    primaryColor: '#047857',
    secondaryColor: '#34D399',
    goldColor: '#FBBF24',
    bgColor: '#051B14',
  },
  {
    id: 'samarkand-turquoise',
    name: 'Samarqand firuzasi',
    primaryColor: '#0F766E',
    secondaryColor: '#2DD4BF',
    goldColor: '#EAB308',
    bgColor: '#041719',
  },
  {
    id: 'teachers-crimson-gold',
    name: "Ma'rifat yoquti",
    primaryColor: '#881337',
    secondaryColor: '#FB7185',
    goldColor: '#F59E0B',
    bgColor: '#18070E',
  },
  {
    id: 'silk-road-purple',
    name: 'Ipak yo‘li shukuhi',
    primaryColor: '#4C1D95',
    secondaryColor: '#A78BFA',
    goldColor: '#FBBF24',
    bgColor: '#110926',
  },
];

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'social-1-1',
    name: 'Telegram / Instagram profil',
    subtitle: '1024 × 1024 px (1:1)',
    width: 1024,
    height: 1024,
    aspectLabel: '1:1',
  },
  {
    id: 'google-biz',
    name: 'Google Biznes profili',
    subtitle: '720 × 720 px (1:1)',
    width: 720,
    height: 720,
    aspectLabel: '720p',
  },
  {
    id: 'banner-16-9',
    name: 'Tadbir va sahna banneri',
    subtitle: '1920 × 1080 px (16:9)',
    width: 1920,
    height: 1080,
    aspectLabel: '16:9',
  },
  {
    id: 'print-hd',
    name: 'Chop etish (Yuqori sifat)',
    subtitle: '2048 × 2048 px (HD)',
    width: 2048,
    height: 2048,
    aspectLabel: '2K HD',
  },
];

export const FONT_OPTIONS: { id: FontFamily; label: string; styleSample: string }[] = [
  { id: 'Playfair Display', label: 'Playfair Display (Mumtoz)', styleSample: 'Tantanali serif' },
  { id: 'Montserrat', label: 'Montserrat (Zamonaviy)', styleSample: 'Aniq geometrik' },
  { id: 'Cinzel', label: 'Cinzel (Shohona)', styleSample: 'Monumental' },
  { id: 'Oswald', label: 'Oswald (Mustahkam)', styleSample: 'Tik va jiddiy' },
  { id: 'Cormorant Garamond', label: 'Cormorant (Nafis)', styleSample: 'Badiiy klassika' },
];

export const LAYOUT_STYLE_METADATA: { id: LayoutStyle; nameUz: string; defaultShape: BaseShape }[] = [
  { id: 'circular-badge', nameUz: 'Dumaloq nishon', defaultShape: 'circle' },
  { id: 'ribbon-crest', nameUz: 'Tantanali lenta', defaultShape: 'circle' },
  { id: 'laurel-wreath', nameUz: 'Oltin gulchambar', defaultShape: 'circle' },
  { id: 'gold-ornate', nameUz: 'Oltin hoshiyali', defaultShape: 'ribbon' },
  { id: 'minimalist', nameUz: 'Minimalist uslub', defaultShape: 'square' },
  { id: 'flag-emblem', nameUz: 'Bayroqli timsol', defaultShape: 'circle' },
  { id: 'uzbek-pattern', nameUz: "An'anaviy o'zbek naqshli", defaultShape: 'square' },
  { id: 'modern-geometric', nameUz: 'Zamonaviy geometrik', defaultShape: 'circle' },
  { id: 'typographic-seal', nameUz: 'Yozuvli muhr', defaultShape: 'circle' },
  { id: 'royal-shield', nameUz: 'Gerbli qalqon', defaultShape: 'shield' },
];

// Helper to generate 10 rich, distinct logos for any ceremony
function buildCeremonyLogos(params: {
  ceremonyId: string;
  titles: string[];
  subtitles: string[];
  mottos: string[];
  icons: IconId[];
  palettes: { primary: string; secondary: string; gold: string; bg: string }[];
  anniversaryNumber?: number;
}): LogoConfig[] {
  const styles = LAYOUT_STYLE_METADATA;
  const fonts: FontFamily[] = [
    'Playfair Display',
    'Montserrat',
    'Cinzel',
    'Cormorant Garamond',
    'Montserrat',
    'Oswald',
    'Cinzel',
    'Montserrat',
    'Playfair Display',
    'Cinzel',
  ];

  return styles.map((styleMeta, index) => {
    const pal = params.palettes[index % params.palettes.length];
    const iconId = params.icons[index % params.icons.length];
    const title = params.titles[index % params.titles.length];
    const subtitle = params.subtitles[index % params.subtitles.length];
    const motto = params.mottos[index % params.mottos.length];

    return {
      id: `${params.ceremonyId}-logo-${index + 1}`,
      ceremonyId: params.ceremonyId,
      styleNameUz: `${index + 1}. ${styleMeta.nameUz}`,
      title,
      subtitle,
      motto,
      layoutStyle: styleMeta.id,
      shape: styleMeta.defaultShape,
      iconId,
      primaryColor: pal.primary,
      secondaryColor: pal.secondary,
      goldColor: pal.gold,
      bgColor: pal.bg,
      transparentBg: false,
      fontFamily: fonts[index],
      fontSizeScale: 1,
      letterSpacing: index === 4 ? 2 : 1,
      iconScale: 1,
      iconOffsetX: 0,
      iconOffsetY: 0,
      showRibbon: index !== 4 && index !== 8,
      showStars: index % 2 === 0,
      anniversaryNumber: params.anniversaryNumber,
    };
  });
}

const navruzLogos = buildCeremonyLogos({
  ceremonyId: 'navruz',
  titles: [
    "NAVRO'Z AYYOMI",
    "NAVRO'ZI OLAM",
    'BAHOR AYYOMI',
    "NAVRO'Z MUBORAK",
    "SHARQ YANGI YILI",
    "NAVRO'Z — 2026",
    'MILLIY TIKLANISH',
    'YASHARISH FASLI',
    "NAVRO'Z TANTANASI",
    "OBOD YURT NAVRO'ZI",
  ],
  subtitles: ['21-MART', 'BAHOR BAYRAMI', '21-MART · 2026', 'YANGILANISH KUNI'],
  mottos: [
    'Har kuning Navro‘z bo‘lsin, jonajon O‘zbekiston!',
    'Yasharish, mehr-oqibat va qut-baraka ayyomi',
    'Tabiat uyg‘onishi va milliy qadriyatlar timsoli',
    'Olam nurga to‘lsin sen bilan, Navro‘z!',
  ],
  icons: ['tulip', 'sumalak', 'sun-spring', 'tulip', 'sumalak', 'uzbek-flag', 'sun-spring', 'tulip', 'sumalak', 'humo-bird'],
  palettes: [
    { primary: '#047857', secondary: '#34D399', gold: '#FBBF24', bg: '#051B14' },
    { primary: '#0F766E', secondary: '#2DD4BF', gold: '#F59E0B', bg: '#041A1C' },
    { primary: '#15803D', secondary: '#86EFAC', gold: '#EAB308', bg: '#071E12' },
    { primary: '#0369A1', secondary: '#38BDF8', gold: '#FBBF24', bg: '#061524' },
    { primary: '#065F46', secondary: '#F43F5E', gold: '#FDE047', bg: '#061A14' },
  ],
});

const mustaqillikLogos = buildCeremonyLogos({
  ceremonyId: 'mustaqillik',
  titles: [
    'MUSTAQILLIK KUNI',
    "O'ZBEKISTON — 35 YIL",
    'ISTIQLOL AYYOMI',
    'BUYUK MUSTAQILLIK',
    'YANGI O‘ZBEKISTON',
    'OZOD VA OBOD VATAN',
    'MILLIY ISTIQLOL',
    'MUSTAQILLIK SHUKUHI',
    'HUR O‘ZBEKISTON',
    'VATANIM IFTIXORIM',
  ],
  subtitles: ['1-SENTABR', '1991 — 2026', 'DAVLAT BAYRAMI', '1-SENTABR · TANTANA'],
  mottos: [
    'Aziz va yagonamsan, jonajon O‘zbekistonim!',
    'Yangi O‘zbekiston — yangi marralar sari!',
    'Erk, tinchlik va farovonlik timsoli',
    'Bir bo‘lsak — yagona xalqmiz, birlashsak — Vatanmiz!',
  ],
  icons: ['humo-bird', 'uzbek-flag', 'sun-spring', 'humo-bird', 'uzbek-flag', 'uzbek-flag', 'humo-bird', 'star-glory', 'humo-bird', 'uzbek-flag'],
  palettes: [
    { primary: '#0284C7', secondary: '#22C55E', gold: '#F59E0B', bg: '#071226' },
    { primary: '#1E3A8A', secondary: '#38BDF8', gold: '#D4AF37', bg: '#070E1A' },
    { primary: '#0F766E', secondary: '#34D399', gold: '#FBBF24', bg: '#041719' },
    { primary: '#1D4ED8', secondary: '#60A5FA', gold: '#FDE047', bg: '#091128' },
  ],
});

const teachersLogos = buildCeremonyLogos({
  ceremonyId: 'oqituvchilar',
  titles: [
    'USTOZ VA MURABBIYLAR',
    "O'QITUVCHILAR KUNI",
    'AZIZ USTOZLARGA',
    "TA'ZIM SIZGA, USTOZ",
    "MA'RIFAT MASH'ALI",
    'USTOZ — OTADAY ULUG‘',
    'ILM VA ZIYOLAR KUNI',
    'SHARAFLI KASB BAYRAMI',
    'USTOZLAR AYYOMI',
    'BILIM FIDOYILARI',
  ],
  subtitles: ['1-OKTABR', '1-OKTABR · BAYRAM', 'UMUMXALQ BAYRAMI', 'EHTIROM KUNI'],
  mottos: [
    'Haq yo‘lida kim senga bir harf o‘qitmish ranj ila...',
    'Kelajak bunyodkorlariga yuksak ehtirom!',
    'Ilm nuri bilan qalblarni munavvar etgan zotlar',
    'Sizga ming ta’zim, aziz va mo‘tabar Ustozlar!',
  ],
  icons: ['book-quill', 'torch-knowledge', 'owl-wisdom', 'tulip', 'book-quill', 'torch-knowledge', 'owl-wisdom', 'book-quill', 'rose-flower', 'torch-knowledge'],
  palettes: [
    { primary: '#1E3A8A', secondary: '#60A5FA', gold: '#F59E0B', bg: '#081024' },
    { primary: '#881337', secondary: '#FB7185', gold: '#FBBF24', bg: '#1A0810' },
    { primary: '#0F766E', secondary: '#2DD4BF', gold: '#D4AF37', bg: '#05181B' },
    { primary: '#4C1D95', secondary: '#C084FC', gold: '#F59E0B', bg: '#120824' },
  ],
});

const yangiYilLogos = buildCeremonyLogos({
  ceremonyId: 'yangi-yil',
  titles: ['YANGI YIL BAYRAMI', 'XUSH KELDING 2027', 'YANGI YIL MUBORAK', 'QISHKI ERTAK'],
  subtitles: ['1-YANVAR', '2027 YIL', 'BAYRAM TANTANASI'],
  mottos: ['Yangi yilda yangi zafarlar va baxt tilaymiz!', 'Xonadoningizga fayz-u baraka kelsin'],
  icons: ['snow-fir', 'star-glory', 'celebration-cake'],
  palettes: [
    { primary: '#1E3A8A', secondary: '#38BDF8', gold: '#FBBF24', bg: '#060F22' },
    { primary: '#065F46', secondary: '#34D399', gold: '#F59E0B', bg: '#051912' },
  ],
});

const vatanHimoyachilariLogos = buildCeremonyLogos({
  ceremonyId: 'vatan-himoyachilari',
  titles: ['VATAN HIMOYACHILARI', 'MARD O‘G‘LONLAR KUNI', 'QUROLLI KUCHLARIMIZ', 'JASORAT VA SHON-SHARAF'],
  subtitles: ['14-YANVAR', 'SHONLI SANA', '14-YANVAR · BAYRAM'],
  mottos: ['Tinchligimiz va osoyishtaligimiz qalqonlari!', 'Vatan himoyasi — muqaddas burch'],
  icons: ['star-glory', 'uzbek-flag', 'humo-bird'],
  palettes: [
    { primary: '#14532D', secondary: '#4ADE80', gold: '#D4AF37', bg: '#07170E' },
    { primary: '#1E3A8A', secondary: '#60A5FA', gold: '#F59E0B', bg: '#081226' },
  ],
});

const xotinQizlarLogos = buildCeremonyLogos({
  ceremonyId: 'xotin-qizlar',
  titles: ['XOTIN-QIZLAR KUNI', '8-MART AYYOMI', 'MO‘TABAR AYOLLAR', 'BAHOR VA NAFOSAT'],
  subtitles: ['8-MART', 'BAHOR BAYRAMI', '8-MART · EHTIROM'],
  mottos: ['Sen baribir muqaddassan, muqaddas ayol!', 'Go‘zallik va mehr-muhabbat timsoli'],
  icons: ['rose-flower', 'tulip', 'sun-spring'],
  palettes: [
    { primary: '#9D174D', secondary: '#F472B6', gold: '#FBBF24', bg: '#1D0814' },
    { primary: '#6B21A8', secondary: '#C084FC', gold: '#F59E0B', bg: '#160824' },
  ],
});

const xotiraLogos = buildCeremonyLogos({
  ceremonyId: 'xotira-qadrlash',
  titles: ['XOTIRA VA QADRLASH', '9-MAY — EHTIROM KUNI', 'XOTIRA MUQADDAS', 'TINCHLIK QADRI'],
  subtitles: ['9-MAY', 'UMUMXALQ KUNI', 'SHON-SHARAF VA XOTIRA'],
  mottos: ['Inson qadri ulug‘, xotira muqaddas!', 'Ajdodlar jasorati mangu barhayot'],
  icons: ['eternal-flame', 'star-glory', 'tulip'],
  palettes: [
    { primary: '#1E293B', secondary: '#94A3B8', gold: '#F59E0B', bg: '#090D16' },
    { primary: '#7F1D1D', secondary: '#F87171', gold: '#D4AF37', bg: '#190808' },
  ],
});

const bayroqLogos = buildCeremonyLogos({
  ceremonyId: 'bayroq-kuni',
  titles: ['DAVLAT BAYROG‘I KUNI', 'MILLIY G‘URURIMIZ', 'HILPIRAGIN BAYROG‘IM', '18-NOYABR — BAYROQ KUNI'],
  subtitles: ['18-NOYABR', '1991 — 2026', 'MUQADDAS RAMZ'],
  mottos: ['Yuksaklarda hilpirayver, Vatanim bayrog‘i!', 'Milliy o‘zlik va istiqlol timsoli'],
  icons: ['uzbek-flag', 'humo-bird', 'star-glory'],
  palettes: [
    { primary: '#0284C7', secondary: '#1EB53A', gold: '#F59E0B', bg: '#061524' },
    { primary: '#1E3A8A', secondary: '#38BDF8', gold: '#D4AF37', bg: '#071022' },
  ],
});

const konstitutsiyaLogos = buildCeremonyLogos({
  ceremonyId: 'konstitutsiya',
  titles: ['KONSTITUTSIYA KUNI', 'BAXTIMIZ QOMUSI', 'ASOSIY QONUNIMIZ', 'ADOLAT VA TARAQQIYOT'],
  subtitles: ['8-DEKABR', 'DAVLAT BAYRAMI', 'QOMUSIMIZ KUNI'],
  mottos: ['Inson qadri, huquqi va erkinligi kafolati!', 'Yangi O‘zbekistonning mustahkam poydevori'],
  icons: ['scales-constitution', 'book-quill', 'humo-bird'],
  palettes: [
    { primary: '#1E3A8A', secondary: '#60A5FA', gold: '#D4AF37', bg: '#070F22' },
    { primary: '#0F766E', secondary: '#2DD4BF', gold: '#F59E0B', bg: '#051619' },
  ],
});

const hayitLogos = buildCeremonyLogos({
  ceremonyId: 'hayit-bayrami',
  titles: ['HAYIT AYYOMI MUBORAK', 'RAMAZON HAYITI', 'QURBON HAYITI', 'Ibrohimiy Mehr Ayyomi'],
  subtitles: ['MUBORAK AYYOM', 'SHUKRONALIK KUNI', 'HAYIT MUBORAK'],
  mottos: ['Yurtimizga tinchlik, xonadonlarga qut-baraka!', 'Mehr-oqibat, saxovat va ezgulik bayrami'],
  icons: ['crescent-mosque', 'lantern-ramadan', 'sun-spring'],
  palettes: [
    { primary: '#065F46', secondary: '#34D399', gold: '#D4AF37', bg: '#041812' },
    { primary: '#1E3A8A', secondary: '#38BDF8', gold: '#FBBF24', bg: '#071024' },
  ],
});

const mustaqillikYilligiLogos = buildCeremonyLogos({
  ceremonyId: 'mustaqillik-yilligi',
  titles: [
    'MUSTAQILLIK 35 YILLIGI',
    'ISTIQLOLGA 35 YIL',
    'SHONLI 35 YILLIK',
    'O‘ZBEKISTON — 35 YOSHDA',
  ],
  subtitles: ['35 YILLIK YUBILEY', '1991 — 2026', 'BUYUK TO‘Y'],
  mottos: ['Yangi O‘zbekiston — shonli 35 yillik parvoz!', 'Aziz va yagonamsan, jonajon O‘zbekistonim!'],
  icons: ['humo-bird', 'uzbek-flag', 'sun-spring'],
  palettes: [
    { primary: '#1E3A8A', secondary: '#0099B5', gold: '#F59E0B', bg: '#070E1A' },
    { primary: '#047857', secondary: '#34D399', gold: '#D4AF37', bg: '#051812' },
  ],
  anniversaryNumber: 35,
});

const toyYubileyLogos = buildCeremonyLogos({
  ceremonyId: 'toy-tugilgan-kun',
  titles: [
    'VISOL OQSHOMI',
    'MUBORAK YUBILEY — 60',
    'TUG‘ILGAN KUNINGIZ BILAN',
    'BITIRUV KECHASI — 2026',
    'BAXT TO‘YI MUBORAK',
    'SHUKRONA KUNI',
  ],
  subtitles: ['BAXT KECHASI', 'QUTLUG‘ SANA', 'TANTANALI MAROSIM', 'OQ YO‘L, BITIRUVCHI'],
  mottos: [
    'Ikki yosh baxtli bo‘lsin, qo‘sha qarisin!',
    'Umringiz uzoq, rizqingiz butun bo‘lsin',
    'Mustaqil hayot sari oq yo‘l va yuksak parvoz!',
  ],
  icons: ['wedding-rings', 'celebration-cake', 'graduation-cap', 'rose-flower'],
  palettes: [
    { primary: '#701A75', secondary: '#F472B6', gold: '#D4AF37', bg: '#19071B' },
    { primary: '#1E3A8A', secondary: '#60A5FA', gold: '#FBBF24', bg: '#081124' },
  ],
});

export const CEREMONIES_DATA: CeremonyInfo[] = [
  {
    id: 'navruz',
    title: "Navro'z umumxalq bayrami",
    dateLabel: '21-mart',
    month: 3,
    day: 21,
    category: 'milliy',
    description:
      "Sumalak, bahor lolalari, porloq quyosh va milliy o'zbek naqshlari uyg'unligidagi 10 xil Navro'z logotipi.",
    keywords: ['navroz', 'navruz', '21-mart', 'bahor', 'sumalak', 'lola'],
    defaultLogo: navruzLogos[0],
    logos: navruzLogos,
  },
  {
    id: 'mustaqillik',
    title: 'Mustaqillik kuni',
    dateLabel: '1-sentabr',
    month: 9,
    day: 1,
    category: 'davlat',
    description:
      "O'zbekiston bayrog'i, Humo qushi, 12 yulduz va oltin gulchambarlar bilan bezatilgan 10 xil tantanali gerb va logotip.",
    keywords: ['mustaqillik', '1-sentabr', 'istiqlol', 'humo', 'vatan'],
    defaultLogo: mustaqillikLogos[0],
    logos: mustaqillikLogos,
  },
  {
    id: 'oqituvchilar',
    title: "O'qituvchi va murabbiylar kuni",
    dateLabel: '1-oktabr',
    month: 10,
    day: 1,
    category: 'davlat',
    description:
      "Kitob, oltin qalam, ma'rifat mash'ali va ehtirom ramzlari aks etgan 10 xil ustozlar bayrami logotiplari.",
    keywords: ['oqituvchi', 'ustoz', 'murabbiy', '1-oktabr', 'kitob', 'maktab'],
    defaultLogo: teachersLogos[0],
    logos: teachersLogos,
  },
  {
    id: 'bayroq-kuni',
    title: "O'zbekiston Davlat bayrog'i kuni",
    dateLabel: '18-noyabr',
    month: 11,
    day: 18,
    category: 'davlat',
    description:
      "Moviy, oq, yashil ranglar, yarim oy va 12 yulduzli milliy bayrog'imiz qabul qilingan kun uchun maxsus timsollar.",
    keywords: ['bayroq', '18-noyabr', 'ramz', 'hilol'],
    defaultLogo: bayroqLogos[0],
    logos: bayroqLogos,
  },
  {
    id: 'konstitutsiya',
    title: 'Konstitutsiya kuni',
    dateLabel: '8-dekabr',
    month: 12,
    day: 8,
    category: 'davlat',
    description:
      "Asosiy Qomusimiz, adolat tarozisi va oltin qalqon unsurlari bilan yaratilgan rasmiy bayram nishonlari.",
    keywords: ['konstitutsiya', '8-dekabr', 'qomus', 'qonun'],
    defaultLogo: konstitutsiyaLogos[0],
    logos: konstitutsiyaLogos,
  },
  {
    id: 'yangi-yil',
    title: 'Yangi yil bayrami',
    dateLabel: '1-yanvar',
    month: 1,
    day: 1,
    category: 'milliy',
    description:
      "Bayram archasi, oltin qor parchalari va yangi yil shukuhini aks ettiruvchi tantanali logotiplar.",
    keywords: ['yangi yil', '1-yanvar', 'archa', 'qor'],
    defaultLogo: yangiYilLogos[0],
    logos: yangiYilLogos,
  },
  {
    id: 'vatan-himoyachilari',
    title: 'Vatan himoyachilari kuni',
    dateLabel: '14-yanvar',
    month: 1,
    day: 14,
    category: 'davlat',
    description:
      "Jasorat yulduzi, dafna yaproqlari va Qurolli Kuchlarimiz shon-sharafini ifodalovchi nishonlar.",
    keywords: ['vatan himoyachilari', '14-yanvar', 'armiya', 'jasorat'],
    defaultLogo: vatanHimoyachilariLogos[0],
    logos: vatanHimoyachilariLogos,
  },
  {
    id: 'xotin-qizlar',
    title: 'Xalqaro xotin-qizlar kuni',
    dateLabel: '8-mart',
    month: 3,
    day: 8,
    category: 'milliy',
    description:
      "Atirgul, bahor lolalari va nafis ranglar uyg'unligidagi ayollar bayrami logotiplari.",
    keywords: ['8-mart', 'xotin-qizlar', 'ayollar', 'ona', 'atirgul'],
    defaultLogo: xotinQizlarLogos[0],
    logos: xotinQizlarLogos,
  },
  {
    id: 'xotira-qadrlash',
    title: 'Xotira va qadrlash kuni',
    dateLabel: '9-may',
    month: 5,
    day: 9,
    category: 'davlat',
    description:
      "Mangulik olovi, dafna chambari va tinchlik osmoni timsollari mujassam bo'lgan logotiplar.",
    keywords: ['9-may', 'xotira', 'qadrlash', 'tinchlik'],
    defaultLogo: xotiraLogos[0],
    logos: xotiraLogos,
  },
  {
    id: 'hayit-bayrami',
    title: "Ro'za hayiti va Qurbon hayiti",
    dateLabel: 'Muborak Hayit ayyomlari',
    category: 'milliy',
    description:
      "Oltin hilol, sharqona fonus va Samarqand gumbazlari uslubidagi muqaddas Hayit bayrami logotiplari.",
    keywords: ['hayit', 'ramazon', 'qurbon', 'masjid', 'fonus'],
    defaultLogo: hayitLogos[0],
    logos: hayitLogos,
  },
  {
    id: 'mustaqillik-yilligi',
    title: 'Mustaqillik yilligi (35 yillik)',
    dateLabel: 'Yillik raqamini o‘zgartirish mumkin',
    month: 9,
    day: 1,
    category: 'davlat',
    hasDynamicYear: true,
    description:
      "Mustaqillikning 35 yilligi (yoki istalgan yubiley sanasi) uchun raqami jonli o'zgaradigan maxsus tantanali gerblar.",
    keywords: ['yillik', '35 yillik', 'yubiley', 'mustaqillik'],
    defaultLogo: mustaqillikYilligiLogos[0],
    logos: mustaqillikYilligiLogos,
  },
  {
    id: 'toy-tugilgan-kun',
    title: "To'y, tug'ilgan kun, yubiley va bitiruv",
    dateLabel: 'Oilaviy va shaxsiy tantanalar',
    category: 'shaxsiy',
    description:
      "Nikoh to'yi, 50/60/70 yillik yubiley, tug'ilgan kun va maktab/OTM bitiruv kechalari uchun shohona monogramma va nishonlar.",
    keywords: ['toy', 'tugilgan kun', 'yubiley', 'bitiruv', 'nikoh', 'tort'],
    defaultLogo: toyYubileyLogos[0],
    logos: toyYubileyLogos,
  },
];

// Calculate the closest upcoming holiday from CEREMONIES_DATA based on current date
export function getUpcomingHoliday(now = new Date()): {
  ceremony: CeremonyInfo;
  daysLeft: number;
} {
  const datedCeremonies = CEREMONIES_DATA.filter(
    (c) => typeof c.month === 'number' && typeof c.day === 'number'
  );

  let bestCeremony = datedCeremonies[0];
  let minDays = 9999;

  const currentYear = now.getFullYear();
  const todayMidnight = new Date(currentYear, now.getMonth(), now.getDate());

  for (const c of datedCeremonies) {
    let target = new Date(currentYear, (c.month as number) - 1, c.day as number);
    if (target.getTime() < todayMidnight.getTime()) {
      target = new Date(currentYear + 1, (c.month as number) - 1, c.day as number);
    }
    const diffDays = Math.round(
      (target.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < minDays) {
      minDays = diffDays;
      bestCeremony = c;
    }
  }

  return { ceremony: bestCeremony, daysLeft: minDays };
}
