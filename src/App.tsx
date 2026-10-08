/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit3,
  Heart,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import {
  CEREMONIES_DATA,
  getUpcomingHoliday,
} from './data/ceremoniesData';
import {
  BaseShape,
  CeremonyInfo,
  FontFamily,
  IconId,
  LayoutStyle,
  LogoConfig,
} from './types/logo';
import { LogoSvgRenderer } from './components/LogoSvgRenderer';
import { LogoEditorModal } from './components/LogoEditorModal';
import { downloadRasterFile } from './utils/exportLogo';

const FAVORITES_STORAGE_KEY = 'marosim_logotiplari_sevimlilar_v1';

export default function App() {
  // Navigation state: 'home' | 'ceremony' | 'favorites' | 'editor'
  const [activeView, setActiveView] = useState<'home' | 'ceremony' | 'favorites' | 'editor'>('home');
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<string>('navruz');
  const [editingLogo, setEditingLogo] = useState<LogoConfig | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'barchasi' | 'davlat' | 'milliy' | 'shaxsiy'>('barchasi');

  // Dynamic Anniversary Year (for Mustaqillik yilligi card on home & gallery)
  const [customAnniversaryYear, setCustomAnniversaryYear] = useState<number>(35);

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<LogoConfig[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick AI creator bar on home page
  const [quickAiPrompt, setQuickAiPrompt] = useState('');
  const [isGeneratingQuickAi, setIsGeneratingQuickAi] = useState(false);
  const [quickAiError, setQuickAiError] = useState<string | null>(null);

  // Hidden SVG ref for instant 1-click card download
  const [downloadingLogo, setDownloadingLogo] = useState<LogoConfig | null>(null);
  const hiddenDownloadSvgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites]);

  // Trigger download once hidden SVG renders
  useEffect(() => {
    if (downloadingLogo && hiddenDownloadSvgRef.current) {
      const safeName =
        downloadingLogo.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'marosim-logotipi';
      downloadRasterFile(hiddenDownloadSvgRef.current, downloadingLogo, {
        format: 'png',
        width: 1024,
        height: 1024,
        fileName: `${safeName}-1024x1024`,
      }).finally(() => {
        setDownloadingLogo(null);
      });
    }
  }, [downloadingLogo]);

  // Apply dynamic anniversary year to 'mustaqillik-yilligi' ceremony
  const ceremoniesWithDynamicYear = useMemo(() => {
    return CEREMONIES_DATA.map((ceremony) => {
      if (!ceremony.hasDynamicYear) return ceremony;
      const updatedLogos = ceremony.logos.map((logo) => ({
        ...logo,
        anniversaryNumber: customAnniversaryYear,
        title: `MUSTAQILLIK ${customAnniversaryYear} YILLIGI`,
        subtitle: `${customAnniversaryYear} YILLIK YUBILEY`,
      }));
      return {
        ...ceremony,
        title: `Mustaqillik yilligi (${customAnniversaryYear} yillik)`,
        defaultLogo: updatedLogos[0],
        logos: updatedLogos,
      };
    });
  }, [customAnniversaryYear]);

  const upcomingHoliday = useMemo(() => getUpcomingHoliday(new Date()), []);

  const filteredCeremonies = useMemo(() => {
    return ceremoniesWithDynamicYear.filter((c) => {
      const matchesCategory =
        categoryFilter === 'barchasi' || c.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.dateLabel.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [ceremoniesWithDynamicYear, categoryFilter, searchQuery]);

  const activeCeremony: CeremonyInfo = useMemo(() => {
    return (
      ceremoniesWithDynamicYear.find((c) => c.id === selectedCeremonyId) ||
      ceremoniesWithDynamicYear[0]
    );
  }, [ceremoniesWithDynamicYear, selectedCeremonyId]);

  const isLogoFavorite = (logoId: string) =>
    favorites.some((item) => item.id === logoId);

  const toggleFavorite = (logo: LogoConfig) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === logo.id);
      if (exists) {
        return prev.filter((item) => item.id !== logo.id);
      }
      return [logo, ...prev];
    });
  };

  const openEditorWithLogo = (logo: LogoConfig) => {
    setEditingLogo(logo);
    setActiveView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateBlankLogo = () => {
    const blankTemplate: LogoConfig = {
      ...CEREMONIES_DATA[0].defaultLogo,
      id: `custom-${Date.now()}`,
      styleNameUz: 'Maxsus logotip',
      title: 'BAYRAMINGIZ MUBORAK',
      subtitle: '2026 YIL',
      motto: 'Yurtimizga tinchlik va farovonlik tilaymiz!',
    };
    openEditorWithLogo(blankTemplate);
  };

  const handleQuickAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAiPrompt.trim()) return;
    setIsGeneratingQuickAi(true);
    setQuickAiError(null);

    try {
      const response = await fetch('/api/ai/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: quickAiPrompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI xizmatida xatolik yuz berdi');
      }

      const generatedLogo: LogoConfig = {
        id: `ai-logo-${Date.now()}`,
        ceremonyId: 'ai-generated',
        styleNameUz: 'AI yaratgan logotip',
        title: data.title || 'BAYRAM MUBORAK',
        subtitle: data.subtitle || '2026',
        motto: data.motto || 'Qutlug‘ ayyom muborak bo‘lsin!',
        layoutStyle: (data.layoutStyle as LayoutStyle) || 'laurel-wreath',
        shape: (data.shape as BaseShape) || 'circle',
        iconId: (data.iconId as IconId) || 'tulip',
        primaryColor: data.primaryColor || '#047857',
        secondaryColor: data.secondaryColor || '#34D399',
        goldColor: data.goldColor || '#F59E0B',
        bgColor: data.bgColor || '#051B14',
        transparentBg: false,
        fontFamily: (data.fontFamily as FontFamily) || 'Playfair Display',
        fontSizeScale: 1,
        letterSpacing: 1,
        iconScale: 1,
        iconOffsetX: 0,
        iconOffsetY: 0,
        showRibbon: true,
        showStars: true,
        customSvgPath: data.customSvgPath || undefined,
      };

      openEditorWithLogo(generatedLogo);
    } catch (err: any) {
      setQuickAiError(err.message || "AI orqali yaratishda xatolik yuz berdi");
    } finally {
      setIsGeneratingQuickAi(false);
    }
  };

  // Full-screen Editor Mode
  if (activeView === 'editor' && editingLogo) {
    return (
      <LogoEditorModal
        initialLogo={editingLogo}
        onClose={() => setActiveView('home')}
        isFavorite={isLogoFavorite(editingLogo.id)}
        onToggleFavorite={toggleFavorite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070E1A] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Hidden SVG for instant 1-click PNG download from any card */}
      {downloadingLogo && (
        <div className="fixed -left-[9999px] -top-[9999px] w-[1024px] h-[1024px] pointer-events-none opacity-0">
          <LogoSvgRenderer config={downloadingLogo} svgRef={hiddenDownloadSvgRef} />
        </div>
      )}

      {/* Strictly 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#070E1A]/90 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#bosh-sahifa"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('home');
            }}
            className="text-xl sm:text-2xl font-bold tracking-tight text-amber-400 font-['Cinzel',serif] whitespace-nowrap"
          >
            Marosim logotiplari
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'home' ? 'text-amber-400' : ''
              }`}
            >
              Marosimlar
            </button>
            <button
              onClick={() => {
                setSelectedCeremonyId('navruz');
                setActiveView('ceremony');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              Navro‘z (10)
            </button>
            <button
              onClick={() => {
                setSelectedCeremonyId('mustaqillik');
                setActiveView('ceremony');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              Mustaqillik (10)
            </button>
            <button
              onClick={() => {
                setSelectedCeremonyId('oqituvchilar');
                setActiveView('ceremony');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              O‘qituvchilar kuni (10)
            </button>
            <button
              onClick={() => setActiveView('favorites')}
              className={`hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'favorites' ? 'text-amber-400' : ''
              }`}
            >
              Sevimlilar ({favorites.length})
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('favorites')}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-200 cursor-pointer whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 text-amber-400" />
              <span className="tabular-nums">{favorites.length}</span>
            </button>
            <button
              onClick={handleCreateBlankLogo}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi logotip</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-8 py-8 space-y-12">
        {/* VIEW 1: HOME PAGE */}
        {activeView === 'home' && (
          <>
            {/* Hero + Upcoming Holiday ("Yaqin bayram") Spotlight */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="text-xs font-semibold text-amber-400 tracking-wide">
                  O‘zbekiston milliy bayramlari · Davlat sanalari · Tantanalar
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight font-['Playfair_Display',serif] [text-wrap:balance]">
                  Har bir bayram va tantana uchun mukammal vektor logotiplar
                </h1>
                <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                  Tayyor logotipni tanlang yoki jonli muharrirda matn, shrift, milliy
                  naqsh va ranglarni o‘zingizga moslab bir zumda PNG, SVG hamda JPG
                  formatlarida yuklab oling.
                </p>

                {/* Search & Category Filter Controls */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Bayram nomi yoki sanasini qidiring (masalan: Navro'z, 1-sentabr, To'y)..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D182E] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Interactive Category Segmented Filter */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#0B1528] border border-slate-800/90 rounded-xl w-fit">
                  {[
                    { id: 'barchasi', label: 'Barcha marosimlar (12)' },
                    { id: 'davlat', label: 'Davlat bayramlari' },
                    { id: 'milliy', label: 'Milliy va diniy' },
                    { id: 'shaxsiy', label: 'To‘y va yubiley' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCategoryFilter(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        categoryFilter === tab.id
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* "Yaqin bayram" (Upcoming Holiday) Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-amber-500/35 bg-gradient-to-br from-[#0F1E3A] to-[#081224] p-6 relative overflow-hidden">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                      <Calendar className="w-4 h-4" />
                      <span>Yaqinlashayotgan bayram</span>
                    </div>
                    <span className="text-xs font-mono text-amber-300 tabular-nums">
                      {upcomingHoliday.daysLeft === 0
                        ? 'Bugun bayram!'
                        : `${upcomingHoliday.daysLeft} kun qoldi`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="sm:col-span-5 aspect-square max-w-[160px] mx-auto w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-1.5">
                      <LogoSvgRenderer config={upcomingHoliday.ceremony.defaultLogo} />
                    </div>
                    <div className="sm:col-span-7 space-y-3">
                      <div className="text-xs text-slate-400">
                        {upcomingHoliday.ceremony.dateLabel} · 10 ta tayyor logotip
                      </div>
                      <h2 className="text-xl font-bold text-white">
                        {upcomingHoliday.ceremony.title}
                      </h2>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {upcomingHoliday.ceremony.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedCeremonyId(upcomingHoliday.ceremony.id);
                            setActiveView('ceremony');
                          }}
                          className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                        >
                          10 ta logotipni ko‘rish
                        </button>
                        <button
                          onClick={() =>
                            openEditorWithLogo(upcomingHoliday.ceremony.defaultLogo)
                          }
                          className="px-3 py-2 rounded-lg border border-slate-700 hover:border-amber-400 text-slate-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Tahrirlash
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* AI BILAN YASASH (Quick AI Generator Banner on Home) */}
            <section className="rounded-2xl border border-slate-800/90 bg-[#0B1528] p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-1.5">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>AI bilan yangi logotip yasash</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    G‘oyangizni yozing — AI logotipni muharrirga tayyorlab beradi
                  </h3>
                  <p className="text-xs text-slate-400">
                    Masalan: &ldquo;Navro‘zga yashil va oltin logotip, tepasida lola&rdquo; yoki
                    &ldquo;Mustaqillik 35 yilligiga Humo qushi va bayroqli gerb&rdquo;
                  </p>
                </div>

                <form
                  onSubmit={handleQuickAiSubmit}
                  className="lg:col-span-7 flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="text"
                    value={quickAiPrompt}
                    onChange={(e) => setQuickAiPrompt(e.target.value)}
                    placeholder="Masalan: Navro'zga yashil va oltin logotip, tepasida lola..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isGeneratingQuickAi || !quickAiPrompt.trim()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isGeneratingQuickAi ? 'Yaratilmoqda...' : 'AI bilan yasash'}
                    </span>
                  </button>
                </form>
              </div>
              {quickAiError && (
                <p className="text-xs text-rose-400 mt-3">{quickAiError}</p>
              )}
            </section>

            {/* MAROSIMLAR KARTOCHKALARI (All 12 Ceremonies Grid) */}
            <section className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-['Playfair_Display',serif]">
                    O‘zbekiston bayramlari va marosimlari kutubxonasi
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Har bir marosim ichida 10 tadan turli shakl, naqsh va kompozitsiyadagi
                    vektor logotiplar mavjud
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono tabular-nums">
                  Jami: {filteredCeremonies.length} ta marosim ·{' '}
                  {filteredCeremonies.length * 10} ta tayyor logotip
                </div>
              </div>

              {filteredCeremonies.length === 0 ? (
                <div className="rounded-2xl border border-slate-800 bg-[#0B1528] p-12 text-center space-y-3">
                  <p className="text-base font-medium text-slate-200">
                    Qidiruv bo‘yicha marosim topilmadi
                  </p>
                  <p className="text-xs text-slate-400">
                    Boshqa kalit so‘z yozib ko‘ring yoki barcha marosimlarni ko‘rsating
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('barchasi');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    Filtrlarni tozalash
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCeremonies.map((ceremony) => {
                    return (
                      <div
                        key={ceremony.id}
                        onClick={() => {
                          setSelectedCeremonyId(ceremony.id);
                          setActiveView('ceremony');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group rounded-2xl border border-slate-800/90 bg-[#0B1528] hover:border-amber-500/60 transition-all duration-150 flex flex-col overflow-hidden cursor-pointer"
                      >
                        {/* Sample SVG Logo Preview inside the Card */}
                        <div className="aspect-square w-full bg-[#060C18] p-6 flex items-center justify-center relative border-b border-slate-800/80">
                          <div className="w-full h-full max-w-[220px] max-h-[220px] transition-transform duration-200 group-hover:scale-105">
                            <LogoSvgRenderer config={ceremony.defaultLogo} />
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            {/* Unboxed clean metadata per Zero-Pill rule */}
                            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                              <span>{ceremony.dateLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-400 tabular-nums">10 ta logotip</span>
                            </div>

                            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                              {ceremony.title}
                            </h3>

                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {ceremony.description}
                            </p>
                          </div>

                          {/* Dynamic Anniversary Year Input if this is Mustaqillik Yilligi card */}
                          {ceremony.hasDynamicYear && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2"
                            >
                              <span className="text-xs text-slate-300">Yillik raqami:</span>
                              <div className="flex items-center gap-1.5">
                                {[34, 35, 36, 40].map((yr) => (
                                  <button
                                    key={yr}
                                    type="button"
                                    onClick={() => setCustomAnniversaryYear(yr)}
                                    className={`px-2 py-1 rounded text-xs font-mono tabular-nums cursor-pointer ${
                                      customAnniversaryYear === yr
                                        ? 'bg-amber-500 text-slate-950 font-bold'
                                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                                    }`}
                                  >
                                    {yr}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
                            <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                              10 ta logotipni ochish →
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditorWithLogo(ceremony.defaultLogo);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Tahrirlash
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {/* VIEW 2: CEREMONY 10 LOGOS GALLERY */}
        {activeView === 'ceremony' && (
          <section className="space-y-8">
            {/* Header & Ceremony Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveView('home')}
                  className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Barcha marosimlarga qaytish</span>
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{activeCeremony.dateLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>10 xil kompozitsiya va uslub</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white font-['Playfair_Display',serif]">
                  {activeCeremony.title} — 10 ta tayyor logotip
                </h1>
                <p className="text-sm text-slate-300 max-w-2xl">
                  {activeCeremony.description} Istalgan logotipni bir bosishda yuklab
                  olishingiz yoki muharrirda o‘zgartirishingiz mumkin.
                </p>
              </div>

              {/* If dynamic year ceremony, allow changing year live across all 10 logos */}
              {activeCeremony.hasDynamicYear && (
                <div className="p-4 rounded-xl bg-[#0B1528] border border-amber-500/40 flex items-center gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-400">
                      Mustaqillik yilligi raqami:
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Barcha 10 ta logotipda darhol o‘zgaradi
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={customAnniversaryYear}
                    onChange={(e) =>
                      setCustomAnniversaryYear(parseInt(e.target.value, 10) || 35)
                    }
                    className="w-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm tabular-nums"
                  />
                </div>
              )}
            </div>

            {/* Quick Ceremony Switcher Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {ceremoniesWithDynamicYear.map((c) => {
                const active = c.id === activeCeremony.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCeremonyId(c.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                      active
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
                        : 'bg-[#0B1528] text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>

            {/* 10 Distinct Logos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {activeCeremony.logos.map((logo) => {
                const fav = isLogoFavorite(logo.id);
                return (
                  <div
                    key={logo.id}
                    className="rounded-2xl border border-slate-800/90 bg-[#0B1528] hover:border-amber-500/50 transition-all flex flex-col overflow-hidden group"
                  >
                    {/* SVG Logo Box */}
                    <div
                      onClick={() => openEditorWithLogo(logo)}
                      className="aspect-square w-full bg-[#060C18] p-4 flex items-center justify-center relative cursor-pointer border-b border-slate-800"
                    >
                      <LogoSvgRenderer
                        config={logo}
                        className="w-full h-full transition-transform duration-200 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(logo);
                        }}
                        title="Sevimlilarga qo'shish"
                        className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            fav ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-xs font-medium text-amber-400">
                          {logo.styleNameUz}
                        </div>
                        <h3 className="text-sm font-bold text-white mt-0.5 truncate">
                          {logo.title}
                        </h3>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {logo.subtitle} · {logo.fontFamily}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => openEditorWithLogo(logo)}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Tahrirlash</span>
                        </button>
                        <button
                          onClick={() => setDownloadingLogo(logo)}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PNG (1K)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* VIEW 3: SEVIMLILAR (FAVORITES) */}
        {activeView === 'favorites' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div>
                <button
                  onClick={() => setActiveView('home')}
                  className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 hover:text-amber-300 mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Asosiy sahifaga qaytish</span>
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Playfair_Display',serif]">
                  Saqlangan sevimli logotiplar ({favorites.length})
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Yoqqan logotiplaringiz brauzer xotirasida saqlanadi va istalgan payt
                  tahrirlab yuklab olishingiz mumkin.
                </p>
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-[#0B1528] p-12 text-center space-y-4">
                <p className="text-base font-medium text-slate-200">
                  Hozircha sevimli logotiplar saqlanmagan
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Marosim logotiplarini ko‘rib chiqing va yurakcha tugmasini bosib o‘zingizga
                  yoqqan dizaynlarni shu yerga saqlab qo‘ying.
                </p>
                <button
                  onClick={() => setActiveView('home')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs cursor-pointer"
                >
                  Marosimlar kutubxonasiga o‘tish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favorites.map((logo) => (
                  <div
                    key={logo.id}
                    className="rounded-2xl border border-slate-800 bg-[#0B1528] flex flex-col overflow-hidden"
                  >
                    <div
                      onClick={() => openEditorWithLogo(logo)}
                      className="aspect-square w-full bg-[#060C18] p-5 flex items-center justify-center relative cursor-pointer border-b border-slate-800"
                    >
                      <LogoSvgRenderer config={logo} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(logo);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/90 border border-slate-700 text-amber-400 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-amber-400" />
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="text-xs text-amber-400">{logo.styleNameUz}</div>
                        <div className="text-sm font-bold text-white truncate">
                          {logo.title}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openEditorWithLogo(logo)}
                          className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 cursor-pointer"
                        >
                          Tahrirlash
                        </button>
                        <button
                          onClick={() => setDownloadingLogo(logo)}
                          className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-slate-950 cursor-pointer"
                        >
                          Yuklab olish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050B14] py-6 px-4 sm:px-8 mt-12">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Marosim logotiplari — O‘zbekiston bayramlari va tantanalari uchun vektor logotiplar
            studiyasi
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedCeremonyId('navruz');
                setActiveView('ceremony');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Navro‘z
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setSelectedCeremonyId('mustaqillik');
                setActiveView('ceremony');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Mustaqillik
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setSelectedCeremonyId('oqituvchilar');
                setActiveView('ceremony');
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              O‘qituvchilar kuni
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
