import React from 'react';
import { IconId, LogoConfig } from '../types/logo';

export const ICON_CATALOG: { id: IconId; nameUz: string; category: string }[] = [
  { id: 'tulip', nameUz: "Bahor lolasi", category: "Navro'z" },
  { id: 'sumalak', nameUz: "Sumalak va nihol", category: "Navro'z" },
  { id: 'sun-spring', nameUz: "Navro'z quyoshi", category: "Navro'z" },
  { id: 'humo-bird', nameUz: "Humo qushi", category: "Mustaqillik" },
  { id: 'uzbek-flag', nameUz: "O'zbekiston bayrog'i", category: "Mustaqillik" },
  { id: 'book-quill', nameUz: "Kitob va oltin qalam", category: "O'qituvchilar" },
  { id: 'torch-knowledge', nameUz: "Ma'rifat mash'ali", category: "O'qituvchilar" },
  { id: 'owl-wisdom', nameUz: "Ilm va globus", category: "O'qituvchilar" },
  { id: 'star-glory', nameUz: "Jasorat yulduzi", category: "Davlat" },
  { id: 'rose-flower', nameUz: "Nafis atirgul", category: "Bayram" },
  { id: 'eternal-flame', nameUz: "Xotira olovi", category: "Davlat" },
  { id: 'scales-constitution', nameUz: "Qonun va adolat", category: "Davlat" },
  { id: 'crescent-mosque', nameUz: "Hilol va gumbaz", category: "Hayit" },
  { id: 'lantern-ramadan', nameUz: "Sharqona fonus", category: "Hayit" },
  { id: 'snow-fir', nameUz: "Archa va qor parchasi", category: "Yangi yil" },
  { id: 'wedding-rings', nameUz: "Nikoh uzuklari", category: "Marosim" },
  { id: 'celebration-cake', nameUz: "Yubiley toji", category: "Marosim" },
  { id: 'graduation-cap', nameUz: "Bitiruv qalpog'i", category: "Marosim" },
];

interface RenderIconProps {
  iconId: IconId;
  primary: string;
  secondary: string;
  gold: string;
  customSvgPath?: string;
  anniversaryNumber?: number;
}

export const CeremonialIcon: React.FC<RenderIconProps> = ({
  iconId,
  primary,
  secondary,
  gold,
  customSvgPath,
  anniversaryNumber,
}) => {
  // All icons are designed in a 100x100 coordinate space centered at (50, 50)
  switch (iconId) {
    case 'tulip':
      return (
        <g>
          {/* Radiant spring aura */}
          <circle cx="50" cy="44" r="24" fill={gold} fillOpacity="0.14" />
          {/* Stem & leaves */}
          <path
            d="M50 56 L50 86"
            stroke={secondary}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M50 82 C34 80, 26 66, 30 52 C38 58, 46 68, 50 78 Z"
            fill={secondary}
          />
          <path
            d="M50 82 C66 80, 74 66, 70 52 C62 58, 54 68, 50 78 Z"
            fill={primary}
          />
          {/* Tulip petals */}
          <path
            d="M50 16 C40 28, 38 44, 50 58 C62 44, 60 28, 50 16 Z"
            fill={gold}
          />
          <path
            d="M50 58 C36 54, 28 38, 34 22 C42 28, 46 40, 50 58 Z"
            fill={primary}
            stroke={gold}
            strokeWidth="1.2"
          />
          <path
            d="M50 58 C64 54, 72 38, 66 22 C58 28, 54 40, 50 58 Z"
            fill={secondary}
            stroke={gold}
            strokeWidth="1.2"
          />
          {/* Dewdrop & pollen */}
          <circle cx="50" cy="11" r="2.5" fill={gold} />
          <circle cx="42" cy="15" r="1.5" fill={gold} />
          <circle cx="58" cy="15" r="1.5" fill={gold} />
        </g>
      );

    case 'sumalak':
      return (
        <g>
          {/* Sunburst behind cauldron */}
          <path
            d="M26 52 A24 24 0 0 1 74 52 Z"
            fill={gold}
            fillOpacity="0.22"
          />
          {/* Wheat / Sprouting Navruz grass above */}
          <path
            d="M50 48 C50 34, 44 24, 38 18 M50 48 C50 32, 50 20, 50 14 M50 48 C50 34, 56 24, 62 18"
            stroke={secondary}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M44 46 C42 36, 34 28, 28 24 M56 46 C58 36, 66 28, 72 24"
            stroke={gold}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Traditional Qozon (Cauldron) */}
          <path
            d="M22 50 L78 50 C76 72, 64 82, 50 82 C36 82, 24 72, 22 50 Z"
            fill={primary}
            stroke={gold}
            strokeWidth="2.5"
          />
          {/* Cauldron rim & handles */}
          <rect x="19" y="47" width="62" height="5" rx="2.5" fill={gold} />
          <path
            d="M22 54 C14 54, 14 64, 24 64 M78 54 C86 54, 86 64, 76 64"
            stroke={gold}
            strokeWidth="2.5"
            fill="none"
          />
          {/* Ornamental wave on cauldron */}
          <path
            d="M32 63 Q41 58 50 63 T68 63"
            stroke={gold}
            strokeWidth="2"
            fill="none"
          />
        </g>
      );

    case 'sun-spring':
      return (
        <g>
          {/* 16-pointed Solar rays */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const angle = idx * 30;
            return (
              <path
                key={idx}
                d="M50 10 L54 26 L46 26 Z"
                fill={idx % 2 === 0 ? gold : secondary}
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}
          <circle
            cx="50"
            cy="50"
            r="22"
            fill={primary}
            stroke={gold}
            strokeWidth="2.5"
          />
          {/* Inner Traditional Uzbek 8-point star */}
          <rect
            x="37"
            y="37"
            width="26"
            height="26"
            fill="none"
            stroke={gold}
            strokeWidth="1.8"
          />
          <rect
            x="37"
            y="37"
            width="26"
            height="26"
            fill="none"
            stroke={gold}
            strokeWidth="1.8"
            transform="rotate(45 50 50)"
          />
          <circle cx="50" cy="50" r="6" fill={gold} />
        </g>
      );

    case 'humo-bird':
      return (
        <g>
          {/* Golden sun disk behind Humo */}
          <circle
            cx="50"
            cy="46"
            r="22"
            fill={gold}
            fillOpacity="0.2"
            stroke={gold}
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          {/* Humo bird majestic outstretched wings */}
          <path
            d="M50 54 C36 46, 20 34, 14 18 C24 22, 36 28, 45 40 C32 36, 18 32, 12 26 C22 34, 34 42, 46 48 C34 46, 22 44, 16 40 C26 48, 38 54, 48 58 Z"
            fill={gold}
          />
          <path
            d="M50 54 C64 46, 80 34, 86 18 C76 22, 64 28, 55 40 C68 36, 82 32, 88 26 C78 34, 66 42, 54 48 C66 46, 78 44, 84 40 C74 48, 62 54, 52 58 Z"
            fill={gold}
          />
          {/* Bird body, head, crest & flowing tail */}
          <path
            d="M50 26 C47 32, 46 44, 50 62 C54 44, 53 32, 50 26 Z"
            fill={secondary}
          />
          <circle cx="50" cy="24" r="3.5" fill={gold} />
          <path
            d="M48 20 L50 13 L52 20"
            stroke={gold}
            strokeWidth="1.8"
            fill="none"
          />
          {/* Flowing tail feathers */}
          <path
            d="M50 60 C46 72, 38 82, 30 86 M50 60 C50 74, 50 84, 50 89 M50 60 C54 72, 62 82, 70 86"
            stroke={gold}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {anniversaryNumber && (
            <text
              x="50"
              y="51"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="800"
              fontFamily="Montserrat, sans-serif"
            >
              {anniversaryNumber}
            </text>
          )}
        </g>
      );

    case 'uzbek-flag':
      return (
        <g>
          {/* Waving Uzbekistan Flag Shield / Emblem */}
          <defs>
            <clipPath id="uzFlagClip">
              <path d="M18 26 Q34 20 50 26 T82 26 L82 70 Q66 76 50 70 T18 70 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#uzFlagClip)">
            {/* Sky Blue */}
            <rect x="14" y="18" width="72" height="19" fill="#0099B5" />
            {/* Red fimbriation */}
            <rect x="14" y="37" width="72" height="2" fill="#CE1126" />
            {/* White */}
            <rect x="14" y="39" width="72" height="16" fill="#FFFFFF" />
            {/* Red fimbriation */}
            <rect x="14" y="55" width="72" height="2" fill="#CE1126" />
            {/* Green */}
            <rect x="14" y="57" width="72" height="22" fill="#1EB53A" />
            {/* Crescent Moon */}
            <circle cx="29" cy="28" r="6" fill="#FFFFFF" />
            <circle cx="31.2" cy="28" r="5" fill="#0099B5" />
            {/* 12 Stars */}
            {[
              [42, 23], [46, 23], [50, 23],
              [39, 27.5], [43, 27.5], [47, 27.5], [51, 27.5],
              [36, 32], [40, 32], [44, 32], [48, 32], [52, 32],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="1.1" fill="#FFFFFF" />
            ))}
          </g>
          {/* Golden Frame around waving flag */}
          <path
            d="M18 26 Q34 20 50 26 T82 26 L82 70 Q66 76 50 70 T18 70 Z"
            fill="none"
            stroke={gold}
            strokeWidth="2.2"
          />
          {anniversaryNumber && (
            <g transform="translate(0, 6)">
              <circle cx="50" cy="74" r="11" fill={primary} stroke={gold} strokeWidth="2" />
              <text
                x="50"
                y="78"
                textAnchor="middle"
                fill={gold}
                fontSize="11"
                fontWeight="800"
                fontFamily="Montserrat, sans-serif"
              >
                {anniversaryNumber}
              </text>
            </g>
          )}
        </g>
      );

    case 'book-quill':
      return (
        <g>
          {/* Rising Sun of Enlightenment */}
          <path
            d="M30 54 A20 20 0 0 1 70 54"
            fill={gold}
            fillOpacity="0.22"
            stroke={gold}
            strokeWidth="1.5"
          />
          {/* Rays */}
          <path
            d="M50 26 L50 18 M36 30 L31 23 M64 30 L69 23 M26 42 L19 38 M74 42 L81 38"
            stroke={gold}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Open Book */}
          <path
            d="M18 52 C28 48, 42 50, 50 56 C58 50, 72 48, 82 52 L82 76 C72 72, 58 74, 50 80 C42 74, 28 72, 18 76 Z"
            fill={primary}
            stroke={gold}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M22 47 C31 44, 42 46, 50 52 C58 46, 69 44, 78 47"
            fill="none"
            stroke={secondary}
            strokeWidth="2"
          />
          <line x1="50" y1="52" x2="50" y2="80" stroke={gold} strokeWidth="2.2" />
          {/* Golden Feather Quill */}
          <path
            d="M48 64 C54 44, 66 26, 78 16 C78 28, 70 42, 56 54 Z"
            fill={gold}
          />
          <path
            d="M44 70 L76 18"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      );

    case 'torch-knowledge':
      return (
        <g>
          {/* Laurel leaves behind torch */}
          <path
            d="M34 74 C22 64, 20 44, 30 28 M66 74 C78 64, 80 44, 70 28"
            stroke={secondary}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Torch Handle */}
          <path
            d="M44 48 L56 48 L53 84 L47 84 Z"
            fill={primary}
            stroke={gold}
            strokeWidth="2.2"
          />
          <rect x="41" y="44" width="18" height="5" rx="2" fill={gold} />
          {/* Flame of Knowledge */}
          <path
            d="M50 12 C38 24, 38 36, 50 44 C62 36, 62 24, 50 12 Z"
            fill={gold}
          />
          <path
            d="M50 20 C44 28, 44 36, 50 42 C56 36, 56 28, 50 20 Z"
            fill={secondary}
          />
        </g>
      );

    case 'owl-wisdom':
      return (
        <g>
          {/* Academic Globe & Laurel */}
          <circle
            cx="50"
            cy="48"
            r="22"
            fill={primary}
            stroke={gold}
            strokeWidth="2.5"
          />
          <ellipse
            cx="50"
            cy="48"
            rx="11"
            ry="22"
            fill="none"
            stroke={gold}
            strokeWidth="1.6"
          />
          <line x1="28" y1="48" x2="72" y2="48" stroke={gold} strokeWidth="1.6" />
          <path
            d="M32 37 Q50 42 68 37 M32 59 Q50 54 68 59"
            fill="none"
            stroke={secondary}
            strokeWidth="1.5"
          />
          {/* Graduation cap on top of globe */}
          <polygon
            points="50,14 74,24 50,32 26,24"
            fill={gold}
            stroke={primary}
            strokeWidth="1.2"
          />
          <path d="M68 26 L68 38" stroke={gold} strokeWidth="2" />
          <circle cx="68" cy="39" r="2" fill={gold} />
        </g>
      );

    case 'star-glory':
      return (
        <g>
          {/* 8-Pointed Shield Star */}
          <polygon
            points="50,12 59,35 84,35 64,51 71,76 50,61 29,76 36,51 16,35 41,35"
            fill={gold}
            stroke={primary}
            strokeWidth="1.8"
          />
          <polygon
            points="50,22 56,38 73,38 59,49 64,66 50,56 36,66 41,49 27,38 44,38"
            fill={primary}
            stroke={gold}
            strokeWidth="1.2"
          />
          <circle cx="50" cy="47" r="6" fill={gold} />
        </g>
      );

    case 'rose-flower':
      return (
        <g>
          {/* 8-March stylized floral emblem */}
          <path
            d="M50 86 L50 54"
            stroke={secondary}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M50 74 C38 72, 32 64, 34 56 C42 58, 48 66, 50 74 Z"
            fill={secondary}
          />
          <path
            d="M50 70 C62 68, 68 60, 66 52 C58 54, 52 62, 50 70 Z"
            fill={secondary}
          />
          {/* Rose Petals */}
          <circle cx="50" cy="38" r="18" fill={primary} stroke={gold} strokeWidth="2" />
          <path
            d="M38 34 C42 24, 58 24, 62 34 C66 44, 50 54, 50 54 C50 54, 34 44, 38 34 Z"
            fill={secondary}
            stroke={gold}
            strokeWidth="1.5"
          />
          <path
            d="M44 35 C46 29, 54 29, 56 35 C58 41, 50 45, 50 45 C50 45, 42 41, 44 35 Z"
            fill={gold}
          />
        </g>
      );

    case 'eternal-flame':
      return (
        <g>
          {/* Pedestal */}
          <polygon
            points="26,74 74,74 82,84 18,84"
            fill={primary}
            stroke={gold}
            strokeWidth="2"
          />
          <polygon
            points="34,66 66,66 72,74 28,74"
            fill={gold}
          />
          {/* Eternal Flame */}
          <path
            d="M50 14 C34 30, 32 50, 50 66 C68 50, 66 30, 50 14 Z"
            fill={gold}
          />
          <path
            d="M50 26 C40 38, 40 52, 50 64 C60 52, 60 38, 50 26 Z"
            fill={primary}
          />
          <path
            d="M50 38 C45 46, 45 54, 50 62 C55 54, 55 46, 50 38 Z"
            fill={secondary}
          />
        </g>
      );

    case 'scales-constitution':
      return (
        <g>
          {/* Pillar & Scales of Justice + Constitution Book */}
          <line x1="50" y1="18" x2="50" y2="76" stroke={gold} strokeWidth="3" />
          <path d="M24 32 Q50 26 76 32" stroke={gold} strokeWidth="2.8" fill="none" />
          {/* Left scale */}
          <path d="M24 32 L17 50 L31 50 Z" fill="none" stroke={secondary} strokeWidth="1.8" />
          <path d="M15 50 A9 5 0 0 0 33 50 Z" fill={gold} />
          {/* Right scale */}
          <path d="M76 32 L69 50 L83 50 Z" fill="none" stroke={secondary} strokeWidth="1.8" />
          <path d="M67 50 A9 5 0 0 0 85 50 Z" fill={gold} />
          {/* Constitution Book at base */}
          <rect
            x="32"
            y="66"
            width="36"
            height="16"
            rx="2"
            fill={primary}
            stroke={gold}
            strokeWidth="2.2"
          />
          <circle cx="50" cy="18" r="4" fill={gold} />
        </g>
      );

    case 'crescent-mosque':
      return (
        <g>
          {/* Golden Crescent */}
          <path
            d="M62 22 A24 24 0 1 0 62 68 A19 19 0 1 1 62 22 Z"
            fill={gold}
          />
          {/* Star & Samarkand Dome Silhouette */}
          <polygon
            points="66,36 69,42 76,43 71,47 72,54 66,50 60,54 61,47 56,43 63,42"
            fill={secondary}
          />
          <path
            d="M32 78 L32 66 C32 54, 42 46, 50 40 C58 46, 68 54, 68 66 L68 78 Z"
            fill={primary}
            stroke={gold}
            strokeWidth="2"
          />
          <line x1="50" y1="32" x2="50" y2="40" stroke={gold} strokeWidth="2" />
        </g>
      );

    case 'lantern-ramadan':
      return (
        <g>
          {/* Hanging Oriental Fanoos Lantern */}
          <line x1="50" y1="10" x2="50" y2="20" stroke={gold} strokeWidth="2.2" />
          <path
            d="M38 28 C38 20, 62 20, 62 28 Z"
            fill={gold}
          />
          <polygon
            points="34,28 66,28 72,46 62,72 38,72 28,46"
            fill={primary}
            stroke={gold}
            strokeWidth="2.5"
          />
          <polygon
            points="43,34 57,34 60,46 55,66 45,66 40,46"
            fill={secondary}
            fillOpacity="0.4"
            stroke={gold}
            strokeWidth="1.5"
          />
          <circle cx="50" cy="48" r="5" fill={gold} />
          <rect x="36" y="72" width="28" height="6" rx="2" fill={gold} />
        </g>
      );

    case 'snow-fir':
      return (
        <g>
          {/* New Year Tree + Star */}
          <polygon points="50,12 53,19 60,19 55,23 57,30 50,26 43,30 45,23 40,19 47,19" fill={gold} />
          <polygon
            points="50,26 68,48 58,48 74,66 62,66 78,82 22,82 38,66 26,66 42,48 32,48"
            fill={primary}
            stroke={gold}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle cx="46" cy="52" r="2.5" fill={gold} />
          <circle cx="56" cy="62" r="2.5" fill={secondary} />
          <circle cx="42" cy="72" r="2.5" fill={gold} />
          <circle cx="58" cy="74" r="2.5" fill={gold} />
        </g>
      );

    case 'wedding-rings':
      return (
        <g>
          {/* Interlocking Golden Rings + Diamond */}
          <circle
            cx="41"
            cy="54"
            r="17"
            fill="none"
            stroke={gold}
            strokeWidth="4.5"
          />
          <circle
            cx="59"
            cy="54"
            r="17"
            fill="none"
            stroke={secondary}
            strokeWidth="4.5"
          />
          {/* Diamond & Heart above */}
          <polygon
            points="41,24 49,31 41,38 33,31"
            fill={gold}
            stroke="#FFFFFF"
            strokeWidth="1"
          />
          <path
            d="M59 28 C56 23, 50 26, 59 35 C68 26, 62 23, 59 28 Z"
            fill={primary}
            stroke={gold}
            strokeWidth="1.5"
          />
        </g>
      );

    case 'celebration-cake':
      return (
        <g>
          {/* Royal Jubilee Crown & Stars */}
          <path
            d="M20 68 L26 36 L40 50 L50 26 L60 50 L74 36 L80 68 Z"
            fill={primary}
            stroke={gold}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <rect
            x="20"
            y="68"
            width="60"
            height="8"
            rx="3"
            fill={gold}
          />
          <circle cx="26" cy="32" r="3" fill={gold} />
          <circle cx="50" cy="21" r="3.5" fill={gold} />
          <circle cx="74" cy="32" r="3" fill={gold} />
          <circle cx="50" cy="54" r="4" fill={secondary} />
        </g>
      );

    case 'graduation-cap':
      return (
        <g>
          <polygon
            points="50,22 86,38 50,54 14,38"
            fill={primary}
            stroke={gold}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M30 46 L30 66 C30 74, 70 74, 70 66 L70 46"
            fill={secondary}
            stroke={gold}
            strokeWidth="2.2"
          />
          <path
            d="M78 42 L78 68"
            stroke={gold}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="78" cy="70" r="3" fill={gold} />
        </g>
      );

    case 'custom':
      if (customSvgPath) {
        return (
          <g>
            <path
              d={customSvgPath}
              fill={gold}
              stroke={secondary}
              strokeWidth="1.8"
            />
          </g>
        );
      }
      return (
        <g>
          <circle cx="50" cy="50" r="22" fill={gold} />
        </g>
      );
  }
};

interface LogoSvgRendererProps {
  config: LogoConfig;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  className?: string;
}

export const LogoSvgRenderer: React.FC<LogoSvgRendererProps> = ({
  config,
  svgRef,
  className = 'w-full h-full',
}) => {
  const {
    id,
    title,
    subtitle,
    motto,
    layoutStyle,
    shape,
    iconId,
    customSvgPath,
    primaryColor,
    secondaryColor,
    goldColor,
    bgColor,
    transparentBg,
    fontFamily,
    fontSizeScale = 1,
    letterSpacing = 1,
    iconScale = 1,
    iconOffsetX = 0,
    iconOffsetY = 0,
    showRibbon = true,
    showStars = true,
    anniversaryNumber,
  } = config;

  const uid = id.replace(/[^a-zA-Z0-9]/g, '');
  const titleFontSize = Math.round(25 * fontSizeScale);
  const subtitleFontSize = Math.round(14 * fontSizeScale);
  const mottoFontSize = Math.round(11.5 * fontSizeScale);

  // Render outer base container shape (circle, square, shield, ribbon)
  const renderBaseShape = () => {
    switch (shape) {
      case 'square':
        return (
          <g>
            <rect
              x="56"
              y="56"
              width="288"
              height="288"
              rx="38"
              fill={`url(#gradPrimary_${uid})`}
              stroke={`url(#gradGold_${uid})`}
              strokeWidth="6"
            />
            <rect
              x="70"
              y="70"
              width="260"
              height="260"
              rx="28"
              fill="none"
              stroke={goldColor}
              strokeWidth="1.5"
              strokeOpacity="0.55"
            />
          </g>
        );
      case 'shield':
        return (
          <g>
            <path
              d="M200 42 L332 86 L332 204 C332 288, 268 342, 200 366 C132 342, 68 288, 68 204 L68 86 Z"
              fill={`url(#gradPrimary_${uid})`}
              stroke={`url(#gradGold_${uid})`}
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M200 58 L316 97 L316 202 C316 276, 258 324, 200 347 C142 324, 84 276, 84 202 L84 97 Z"
              fill="none"
              stroke={goldColor}
              strokeWidth="1.6"
              strokeOpacity="0.6"
            />
          </g>
        );
      case 'ribbon':
        return (
          <g>
            {/* 12-point rosette seal */}
            <polygon
              points={Array.from({ length: 24 })
                .map((_, i) => {
                  const r = i % 2 === 0 ? 152 : 138;
                  const a = (i * 15 * Math.PI) / 180;
                  return `${(200 + r * Math.cos(a)).toFixed(1)},${(
                    195 +
                    r * Math.sin(a)
                  ).toFixed(1)}`;
                })
                .join(' ')}
              fill={`url(#gradGold_${uid})`}
            />
            <circle
              cx="200"
              cy="195"
              r="130"
              fill={`url(#gradPrimary_${uid})`}
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeOpacity="0.35"
            />
          </g>
        );
      case 'circle':
      default:
        return (
          <g>
            <circle
              cx="200"
              cy="200"
              r="148"
              fill={`url(#gradPrimary_${uid})`}
              stroke={`url(#gradGold_${uid})`}
              strokeWidth="6"
            />
            <circle
              cx="200"
              cy="200"
              r="134"
              fill="none"
              stroke={goldColor}
              strokeWidth="1.5"
              strokeDasharray={layoutStyle === 'circular-badge' ? '6 4' : undefined}
              strokeOpacity="0.65"
            />
          </g>
        );
    }
  };

  // Layout-specific decorative structural ornaments (10 distinct styles!)
  const renderStyleOrnament = () => {
    switch (layoutStyle) {
      case 'laurel-wreath':
        return (
          <g>
            {/* Left & Right Golden Laurel Wreath Branches */}
            {Array.from({ length: 9 }).map((_, idx) => {
              const t = idx / 8;
              const angleLeft = 150 + t * 95;
              const radL = (angleLeft * Math.PI) / 180;
              const lx = 200 + 118 * Math.cos(radL);
              const ly = 200 + 118 * Math.sin(radL);

              const angleRight = 30 - t * 95;
              const radR = (angleRight * Math.PI) / 180;
              const rx = 200 + 118 * Math.cos(radR);
              const ry = 200 + 118 * Math.sin(radR);
              return (
                <g key={idx}>
                  <ellipse
                    cx={lx}
                    cy={ly}
                    rx="11"
                    ry="5"
                    fill={goldColor}
                    transform={`rotate(${angleLeft - 45} ${lx} ${ly})`}
                  />
                  <ellipse
                    cx={rx}
                    cy={ry}
                    rx="11"
                    ry="5"
                    fill={goldColor}
                    transform={`rotate(${angleRight + 45} ${rx} ${ry})`}
                  />
                </g>
              );
            })}
            {/* Crossed stems at bottom */}
            <path
              d="M175 312 Q200 325 225 312"
              stroke={goldColor}
              strokeWidth="3"
              fill="none"
            />
          </g>
        );

      case 'uzbek-pattern':
        return (
          <g>
            {/* Rub el Hizb (8-pointed traditional Timurid star geometry) */}
            <rect
              x="98"
              y="98"
              width="204"
              height="204"
              rx="10"
              fill="none"
              stroke={`url(#gradGold_${uid})`}
              strokeWidth="3.5"
            />
            <rect
              x="98"
              y="98"
              width="204"
              height="204"
              rx="10"
              fill="none"
              stroke={`url(#gradGold_${uid})`}
              strokeWidth="3.5"
              transform="rotate(45 200 200)"
            />
            <circle
              cx="200"
              cy="200"
              r="95"
              fill={bgColor}
              fillOpacity="0.45"
              stroke={secondaryColor}
              strokeWidth="2"
            />
          </g>
        );

      case 'flag-emblem':
        return (
          <g>
            {/* Waving Uzbekistan National Colors Arc */}
            <path
              d="M78 190 A122 122 0 0 1 322 190"
              fill="none"
              stroke="#0099B5"
              strokeWidth="8"
            />
            <path
              d="M86 198 A114 114 0 0 1 314 198"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="6"
            />
            <path
              d="M92 205 A108 108 0 0 1 308 205"
              fill="none"
              stroke="#1EB53A"
              strokeWidth="8"
            />
          </g>
        );

      case 'gold-ornate':
        return (
          <g>
            {/* Royal Filigree Corner & Ring Ornaments */}
            {Array.from({ length: 16 }).map((_, i) => {
              const a = i * 22.5;
              return (
                <circle
                  key={i}
                  cx="200"
                  cy="58"
                  r={i % 2 === 0 ? '4.5' : '2.5'}
                  fill={goldColor}
                  transform={`rotate(${a} 200 200)`}
                />
              );
            })}
            <circle
              cx="200"
              cy="200"
              r="116"
              fill="none"
              stroke={goldColor}
              strokeWidth="2.5"
            />
          </g>
        );

      case 'modern-geometric':
        return (
          <g>
            {/* Clean Hexagon + Architectural Lines */}
            <polygon
              points="200,56 324,128 324,272 200,344 76,272 76,128"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="3.5"
            />
            <polygon
              points="200,72 310,136 310,264 200,328 90,264 90,136"
              fill="none"
              stroke={goldColor}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'minimalist':
        return (
          <g>
            {/* Ultra-clean thin golden horizon lines */}
            <line
              x1="100"
              y1="226"
              x2="300"
              y2="226"
              stroke={goldColor}
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <circle cx="200" cy="226" r="4" fill={goldColor} />
          </g>
        );

      case 'typographic-seal':
        return (
          <g>
            {/* Center-dominant horizontal banner bands */}
            <rect
              x="64"
              y="174"
              width="272"
              height="68"
              rx="10"
              fill={bgColor}
              stroke={goldColor}
              strokeWidth="2.5"
            />
            <line
              x1="80"
              y1="182"
              x2="320"
              y2="182"
              stroke={secondaryColor}
              strokeWidth="1"
            />
            <line
              x1="80"
              y1="234"
              x2="320"
              y2="234"
              stroke={secondaryColor}
              strokeWidth="1"
            />
          </g>
        );

      case 'royal-shield':
        return (
          <g>
            {/* Crest wings */}
            <path
              d="M90 140 L60 115 L72 165 Z M310 140 L340 115 L328 165 Z"
              fill={goldColor}
            />
          </g>
        );

      case 'ribbon-crest':
      case 'circular-badge':
      default:
        return (
          <g>
            <circle
              cx="200"
              cy="200"
              r="108"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />
          </g>
        );
    }
  };

  // Render Ribbon Banner at the bottom if enabled or if style uses ribbon
  const renderBottomRibbon = () => {
    if (!showRibbon && layoutStyle !== 'ribbon-crest') return null;
    return (
      <g>
        {/* Ribbon Left & Right Tails */}
        <polygon
          points="72,286 112,286 112,324 72,324 88,305"
          fill={secondaryColor}
          stroke={goldColor}
          strokeWidth="1.8"
        />
        <polygon
          points="328,286 288,286 288,324 328,324 312,305"
          fill={secondaryColor}
          stroke={goldColor}
          strokeWidth="1.8"
        />
        {/* Main Front Ribbon Wave */}
        <path
          d="M98 274 Q200 290 302 274 L294 316 Q200 332 106 316 Z"
          fill={`url(#gradGold_${uid})`}
          stroke={bgColor}
          strokeWidth="2"
        />
        <text
          x="200"
          y="303"
          textAnchor="middle"
          fill={bgColor}
          fontFamily={fontFamily}
          fontWeight="700"
          fontSize={subtitleFontSize}
          letterSpacing={`${letterSpacing + 1}px`}
        >
          {subtitle.toUpperCase()}
        </text>
      </g>
    );
  };

  // Calculate icon vertical position based on layout style
  const baseIconY =
    layoutStyle === 'typographic-seal'
      ? 118
      : layoutStyle === 'minimalist'
      ? 142
      : 148;

  const iconTransform = `translate(${200 + iconOffsetX}, ${
    baseIconY + iconOffsetY
  }) scale(${iconScale * 1.45}) translate(-50, -50)`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`gradPrimary_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={bgColor} />
        </linearGradient>
        <linearGradient id={`gradGold_${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={goldColor} />
          <stop offset="50%" stopColor="#FFF3B0" />
          <stop offset="100%" stopColor={goldColor} />
        </linearGradient>
        <radialGradient id={`gradGlow_${uid}`} cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={bgColor} stopOpacity="0" />
        </radialGradient>

        {/* Curved text paths for circular-badge & ornate styles */}
        <path
          id={`topArc_${uid}`}
          d="M 88,200 A 112,112 0 1,1 312,200"
          fill="none"
        />
        <path
          id={`bottomArc_${uid}`}
          d="M 316,204 A 116,116 0 0,1 84,204"
          fill="none"
        />
      </defs>

      {/* Canvas Background (if not transparent) */}
      {!transparentBg && (
        <rect
          x="0"
          y="0"
          width="400"
          height="400"
          rx="28"
          fill={bgColor}
        />
      )}

      {/* Subtle Ambient Glow */}
      <circle cx="200" cy="180" r="165" fill={`url(#gradGlow_${uid})`} />

      {/* Outer Base Shape */}
      {renderBaseShape()}

      {/* Style-Specific Structural Ornament */}
      {renderStyleOrnament()}

      {/* Optional Decorative Stars */}
      {showStars && (
        <g fill={goldColor}>
          <polygon points="200,66 203,73 210,73 204,77 206,84 200,80 194,84 196,77 190,73 197,73" />
          <circle cx="112" cy="196" r="3.5" />
          <circle cx="288" cy="196" r="3.5" />
        </g>
      )}

      {/* Central Ceremonial Icon */}
      <g transform={iconTransform}>
        <CeremonialIcon
          iconId={iconId}
          primary={primaryColor}
          secondary={secondaryColor}
          gold={goldColor}
          customSvgPath={customSvgPath}
          anniversaryNumber={anniversaryNumber}
        />
      </g>

      {/* Typography Rendering */}
      {layoutStyle === 'circular-badge' || layoutStyle === 'gold-ornate' ? (
        <g>
          {/* Curved Top Title */}
          <text
            fill="#FFFFFF"
            fontFamily={fontFamily}
            fontWeight="700"
            fontSize={Math.round(titleFontSize * 0.82)}
            letterSpacing={`${letterSpacing + 1.5}px`}
          >
            <textPath
              href={`#topArc_${uid}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {title.toUpperCase()}
            </textPath>
          </text>

          {/* Center-bottom Motto */}
          <text
            x="200"
            y="246"
            textAnchor="middle"
            fill={goldColor}
            fontFamily={fontFamily}
            fontWeight="600"
            fontSize={mottoFontSize}
            letterSpacing="0.8px"
          >
            {motto}
          </text>

          {!showRibbon && (
            <text
              x="200"
              y="268"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily={fontFamily}
              fontWeight="700"
              fontSize={subtitleFontSize}
              letterSpacing={`${letterSpacing}px`}
            >
              {subtitle}
            </text>
          )}
        </g>
      ) : (
        <g>
          {/* Main Straight Headline */}
          <text
            x="200"
            y={layoutStyle === 'typographic-seal' ? 206 : 228}
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily={fontFamily}
            fontWeight="700"
            fontSize={titleFontSize}
            letterSpacing={`${letterSpacing}px`}
          >
            {title}
          </text>

          {/* Motto line */}
          <text
            x="200"
            y={layoutStyle === 'typographic-seal' ? 226 : 252}
            textAnchor="middle"
            fill={goldColor}
            fontFamily={fontFamily}
            fontWeight="600"
            fontSize={mottoFontSize}
            letterSpacing="0.6px"
          >
            {motto}
          </text>

          {/* Subtitle if ribbon is hidden */}
          {!showRibbon && layoutStyle !== 'ribbon-crest' && (
            <text
              x="200"
              y="276"
              textAnchor="middle"
              fill={secondaryColor}
              fontFamily={fontFamily}
              fontWeight="700"
              fontSize={subtitleFontSize}
              letterSpacing={`${letterSpacing + 1}px`}
            >
              {subtitle.toUpperCase()}
            </text>
          )}
        </g>
      )}

      {/* Bottom Ribbon */}
      {renderBottomRibbon()}
    </svg>
  );
};
