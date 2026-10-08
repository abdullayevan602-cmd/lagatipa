export type LayoutStyle =
  | 'circular-badge'    // 1. Dumaloq nishon
  | 'ribbon-crest'      // 2. Lenta bilan bezatilgan nishon
  | 'laurel-wreath'     // 3. Gulchambar (Dafna/paxta/bug'doy chambari)
  | 'gold-ornate'       // 4. Oltin hoshiyali muhtasham ramka
  | 'minimalist'        // 5. Minimalist zamonaviy
  | 'flag-emblem'       // 6. O'zbekiston bayrog'i uyg'unligidagi emblema
  | 'uzbek-pattern'     // 7. An'anaviy o'zbek naqshli (islimiy / sakkiz qirrali yulduz)
  | 'modern-geometric'  // 8. Zamonaviy geometrik uslub
  | 'typographic-seal'  // 9. Yozuvli markaziy muhr
  | 'royal-shield';     // 10. Tantanali qalqon / emblema

export type BaseShape = 'circle' | 'square' | 'shield' | 'ribbon';

export type IconId =
  | 'tulip'             // Lola va bahor guli
  | 'sumalak'           // Doshqozon va sumalak / bahor niholi
  | 'sun-spring'        // Quyosh va navro'z nuri
  | 'humo-bird'         // Baxt va erk timsoli Humo qushi
  | 'uzbek-flag'        // O'zbekiston bayrog'i (yarim oy va 12 yulduz)
  | 'book-quill'        // Ochiq kitob va oltin pero
  | 'torch-knowledge'   // Ma'rifat mash'ali va gul
  | 'owl-wisdom'        // Donishmandlik va ilm ramzi
  | 'snow-fir'          // Yangi yil archasi va qor parchasi
  | 'star-glory'        // Vatan himoyachilari yulduzi va dafna
  | 'rose-flower'       // 8-mart nafis atirgul
  | 'eternal-flame'     // Xotira va qadrlash kuni mangulik olovi
  | 'scales-constitution' // Konstitutsiya kitobi va tarozi
  | 'crescent-mosque'   // Hayit bayrami yarim oy va gumbaz
  | 'lantern-ramadan'   // Hayit fonusi va yulduzlar
  | 'wedding-rings'     // To'y uzuklari va muhabbat
  | 'celebration-cake'  // Tug'ilgan kun / Yubiley toji va torti
  | 'graduation-cap'    // Bitiruv kechasi akademik qalpog'i
  | 'custom';           // AI yaratgan maxsus SVG shakl

export type FontFamily =
  | 'Playfair Display'
  | 'Montserrat'
  | 'Cinzel'
  | 'Oswald'
  | 'Cormorant Garamond';

export interface LogoConfig {
  id: string;
  ceremonyId: string;
  styleNameUz: string;
  title: string;
  subtitle: string;
  motto: string;
  layoutStyle: LayoutStyle;
  shape: BaseShape;
  iconId: IconId;
  customSvgPath?: string;
  primaryColor: string;
  secondaryColor: string;
  goldColor: string;
  bgColor: string;
  transparentBg: boolean;
  fontFamily: FontFamily;
  fontSizeScale: number;     // 0.7 to 1.4
  letterSpacing: number;     // -1 to 8
  iconScale: number;         // 0.6 to 1.5
  iconOffsetX: number;       // -60 to 60
  iconOffsetY: number;       // -60 to 60
  showRibbon: boolean;
  showStars: boolean;
  anniversaryNumber?: number; // Masalan Mustaqillik 35 yilligi uchun
}

export interface CeremonyInfo {
  id: string;
  title: string;
  dateLabel: string;
  month?: number; // 1-12 for upcoming holiday calculation
  day?: number;   // 1-31
  category: 'davlat' | 'milliy' | 'shaxsiy';
  description: string;
  keywords: string[];
  hasDynamicYear?: boolean;
  defaultLogo: LogoConfig;
  logos: LogoConfig[];
}

export interface ColorPalette {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  goldColor: string;
  bgColor: string;
}

export interface ExportPreset {
  id: string;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  aspectLabel: string;
}
