import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  Heart,
  Layers,
  Move,
  Palette,
  RotateCcw,
  Sparkles,
  Type as TypeIcon,
  Undo2,
  Redo2,
  Eye,
} from 'lucide-react';
import {
  BaseShape,
  ExportPreset,
  FontFamily,
  IconId,
  LayoutStyle,
  LogoConfig,
} from '../types/logo';
import {
  COLOR_PALETTES,
  EXPORT_PRESETS,
  FONT_OPTIONS,
  LAYOUT_STYLE_METADATA,
} from '../data/ceremoniesData';
import { ICON_CATALOG, LogoSvgRenderer, CeremonialIcon } from './LogoSvgRenderer';
import { downloadRasterFile, downloadSvgFile } from '../utils/exportLogo';

interface LogoEditorModalProps {
  initialLogo: LogoConfig;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (logo: LogoConfig) => void;
}

export const LogoEditorModal: React.FC<LogoEditorModalProps> = ({
  initialLogo,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [history, setHistory] = useState<LogoConfig[]>([initialLogo]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'matn' | 'rang' | 'belgi' | 'shakl' | 'ai'>('matn');

  // Export settings
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset>(EXPORT_PRESETS[0]);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'jpg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // AI prompt state inside editor
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const currentLogo = history[historyIndex];

  const updateLogo = (patch: Partial<LogoConfig>) => {
    const updated: LogoConfig = {
      ...currentLogo,
      ...patch,
    };
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(updated);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReset = () => {
    setHistory([initialLogo]);
    setHistoryIndex(0);
  };

  const handleOneClickDownload = async (overrideFormat?: 'png' | 'svg' | 'jpg') => {
    if (!svgRef.current) return;
    const fmt = overrideFormat || exportFormat;
    setIsExporting(true);
    setExportSuccess(null);

    const safeName =
      currentLogo.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'marosim-logotipi';
    const fileName = `${safeName}-${selectedPreset.width}x${selectedPreset.height}`;

    try {
      if (fmt === 'svg') {
        downloadSvgFile(svgRef.current, safeName);
      } else {
        await downloadRasterFile(svgRef.current, currentLogo, {
          format: fmt,
          width: selectedPreset.width,
          height: selectedPreset.height,
          fileName,
        });
      }
      setExportSuccess(`${fmt.toUpperCase()} fayl yuklab olindi!`);
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiError(null);
    setAiMessage(null);

    try {
      const response = await fetch('/api/ai/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI xizmatida xatolik yuz berdi');
      }

      updateLogo({
        title: data.title || currentLogo.title,
        subtitle: data.subtitle || currentLogo.subtitle,
        motto: data.motto || currentLogo.motto,
        layoutStyle: (data.layoutStyle as LayoutStyle) || currentLogo.layoutStyle,
        shape: (data.shape as BaseShape) || currentLogo.shape,
        iconId: (data.iconId as IconId) || currentLogo.iconId,
        primaryColor: data.primaryColor || currentLogo.primaryColor,
        secondaryColor: data.secondaryColor || currentLogo.secondaryColor,
        goldColor: data.goldColor || currentLogo.goldColor,
        bgColor: data.bgColor || currentLogo.bgColor,
        fontFamily: (data.fontFamily as FontFamily) || currentLogo.fontFamily,
        customSvgPath: data.customSvgPath || undefined,
      });

      setAiMessage(data.explanation || "Yangi AI logotip muharrirga yuklandi!");
    } catch (err: any) {
      setAiError(err.message || "AI bilan bog'lanishda xatolik");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070E1A] text-slate-100 flex flex-col">
      {/* Top Studio Bar */}
      <div className="border-b border-slate-800/80 bg-[#0A1324]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kutubxonaga qaytish</span>
          </button>
          <div className="hidden sm:block h-5 w-px bg-slate-800" />
          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-white">
              Logotip yasash va tahrirlash studiyasi
            </h2>
            <p className="text-xs text-slate-400">
              {currentLogo.styleNameUz} · {currentLogo.title}
            </p>
          </div>
        </div>

        {/* History & Favorite Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Orqaga qaytarish (Undo)"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Oldinga qaytarish (Redo)"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Dastlabki holatga tiklash"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tiklash</span>
          </button>

          <button
            onClick={() => onToggleFavorite(currentLogo)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              isFavorite
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{isFavorite ? 'Sevimlilarda' : 'Saqlash'}</span>
          </button>

          <button
            onClick={() => handleOneClickDownload()}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Yuklanmoqda...' : 'Yuklab olish'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Center Live SVG Preview & Export Panel (5 cols on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <div className="rounded-2xl border border-slate-800/90 bg-[#0B1528] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Jonli vektor ko‘rinish (100% SVG sifat)</span>
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={currentLogo.transparentBg}
                  onChange={(e) => updateLogo({ transparentBg: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500"
                />
                <span>Shaffof fon</span>
              </label>
            </div>

            {/* Interactive Canvas Box (shows checkerboard when transparent) */}
            <div
              className={`aspect-square w-full max-w-[380px] mx-auto rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-3 transition-colors ${
                currentLogo.transparentBg
                  ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950'
                  : 'bg-slate-950'
              }`}
            >
              <LogoSvgRenderer
                config={currentLogo}
                svgRef={svgRef}
                className="w-full h-full drop-shadow-xl"
              />
            </div>

            {/* Quick Format & Size Export Bar */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Tayyor o‘lchamni tanlang:
                </span>
                <span className="text-xs font-mono text-amber-400 tabular-nums">
                  {selectedPreset.width} × {selectedPreset.height} px
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {EXPORT_PRESETS.map((preset) => {
                  const active = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`text-left p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        active
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{preset.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
                        {preset.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Format Selector & Instant Download Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['png', 'svg', 'jpg'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                        exportFormat === fmt
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleOneClickDownload()}
                  disabled={isExporting}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {exportFormat.toUpperCase()} yuklab olish ({selectedPreset.aspectLabel})
                  </span>
                </button>
              </div>

              {exportSuccess && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{exportSuccess}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls Panel (7 cols on desktop) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800/90 bg-[#0B1528] overflow-hidden">
          {/* Segmented Control Tabs */}
          <div className="border-b border-slate-800 bg-slate-900/60 p-2 flex flex-wrap gap-1.5">
            {[
              { id: 'matn', label: 'Matn va Shrift', icon: TypeIcon },
              { id: 'rang', label: 'Ranglar va Palitra', icon: Palette },
              { id: 'belgi', label: 'Belgi (Ikonka)', icon: Move },
              { id: 'shakl', label: 'Shakl va Uslub', icon: Layers },
              { id: 'ai', label: 'AI bilan yasash', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 space-y-6">
            {/* TAB 1: MATN VA SHRIFT */}
            {activeTab === 'matn' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Asosiy marosim nomi
                    </label>
                    <input
                      type="text"
                      value={currentLogo.title}
                      onChange={(e) => updateLogo({ title: e.target.value })}
                      placeholder="Masalan: NAVRO'Z AYYOMI"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Sana yoki lenta yozuvi
                    </label>
                    <input
                      type="text"
                      value={currentLogo.subtitle}
                      onChange={(e) => updateLogo({ subtitle: e.target.value })}
                      placeholder="Masalan: 21-MART"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Shior yoki tabrik matni
                  </label>
                  <input
                    type="text"
                    value={currentLogo.motto}
                    onChange={(e) => updateLogo({ motto: e.target.value })}
                    placeholder="Masalan: Har kuning Navro'z bo'lsin!"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Dynamic Jubilee / Independence Year Number */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-amber-400">
                      Yubiley / Mustaqillik yilligi raqami (ixtiyoriy)
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Masalan: 35 yillik, 50 yosh, 60 yillik yubiley uchun markaziy raqam
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={2050}
                      value={currentLogo.anniversaryNumber || ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                        updateLogo({
                          anniversaryNumber: val,
                          title: val
                            ? `MUSTAQILLIK ${val} YILLIGI`
                            : currentLogo.title,
                        });
                      }}
                      placeholder="35"
                      className="w-24 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-mono tabular-nums focus:outline-none focus:border-amber-500"
                    />
                    {currentLogo.anniversaryNumber && (
                      <button
                        onClick={() => updateLogo({ anniversaryNumber: undefined })}
                        className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
                      >
                        O‘chirish
                      </button>
                    )}
                  </div>
                </div>

                {/* Font Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Shrift uslubini tanlang
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {FONT_OPTIONS.map((font) => {
                      const active = currentLogo.fontFamily === font.id;
                      return (
                        <button
                          key={font.id}
                          onClick={() => updateLogo({ fontFamily: font.id })}
                          className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                            active
                              ? 'border-amber-500 bg-amber-500/10 text-white'
                              : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className="text-sm font-semibold truncate"
                            style={{ fontFamily: font.id }}
                          >
                            {font.label}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{font.styleSample}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Size & Letter Spacing Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300 font-medium">Yozuv o‘lchami</span>
                      <span className="font-mono text-amber-400 tabular-nums">
                        {Math.round(currentLogo.fontSizeScale * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.35"
                      step="0.05"
                      value={currentLogo.fontSizeScale}
                      onChange={(e) =>
                        updateLogo({ fontSizeScale: parseFloat(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300 font-medium">Harflar oralig‘i</span>
                      <span className="font-mono text-amber-400 tabular-nums">
                        {currentLogo.letterSpacing} px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="0.5"
                      value={currentLogo.letterSpacing}
                      onChange={(e) =>
                        updateLogo({ letterSpacing: parseFloat(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RANGLAR VA PALITRA */}
            {activeTab === 'rang' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2.5">
                    Tayyor milliy va bayramona palitralar
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() =>
                          updateLogo({
                            primaryColor: pal.primaryColor,
                            secondaryColor: pal.secondaryColor,
                            goldColor: pal.goldColor,
                            bgColor: pal.bgColor,
                          })
                        }
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-amber-500/60 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-medium text-slate-200">{pal.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: pal.primaryColor }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: pal.secondaryColor }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: pal.goldColor }}
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: pal.bgColor }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">Asosiy rang</label>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={currentLogo.primaryColor}
                        onChange={(e) => updateLogo({ primaryColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300 uppercase">
                        {currentLogo.primaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">Ikkinchi rang</label>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={currentLogo.secondaryColor}
                        onChange={(e) => updateLogo({ secondaryColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300 uppercase">
                        {currentLogo.secondaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">Oltin / Hoshiya</label>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={currentLogo.goldColor}
                        onChange={(e) => updateLogo({ goldColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300 uppercase">
                        {currentLogo.goldColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5">Fon rangi</label>
                    <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <input
                        type="color"
                        value={currentLogo.bgColor}
                        onChange={(e) => updateLogo({ bgColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-slate-300 uppercase">
                        {currentLogo.bgColor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BELGI (IKONKA) KUTUBXONASI VA JOYLASHUVI */}
            {activeTab === 'belgi' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2.5">
                    Marosim ramzi (ikonka) tanlang
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[290px] overflow-y-auto pr-1">
                    {ICON_CATALOG.map((item) => {
                      const active = currentLogo.iconId === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => updateLogo({ iconId: item.id })}
                          className={`flex flex-col items-center p-3 rounded-xl border transition-colors cursor-pointer ${
                            active
                              ? 'border-amber-500 bg-amber-500/15 text-white'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <svg viewBox="0 0 100 100" className="w-11 h-11 mb-1.5">
                            <CeremonialIcon
                              iconId={item.id}
                              primary={currentLogo.primaryColor}
                              secondary={currentLogo.secondaryColor}
                              gold={currentLogo.goldColor}
                            />
                          </svg>
                          <span className="text-xs font-medium text-center line-clamp-1">
                            {item.nameUz}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scale & Position Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Belgi kattaligi</span>
                      <span className="font-mono text-amber-400 tabular-nums">
                        {Math.round(currentLogo.iconScale * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.5"
                      step="0.05"
                      value={currentLogo.iconScale}
                      onChange={(e) =>
                        updateLogo({ iconScale: parseFloat(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Gorizontal siljitish (X)</span>
                      <span className="font-mono text-amber-400 tabular-nums">
                        {currentLogo.iconOffsetX} px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="2"
                      value={currentLogo.iconOffsetX}
                      onChange={(e) =>
                        updateLogo({ iconOffsetX: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Vertikal siljitish (Y)</span>
                      <span className="font-mono text-amber-400 tabular-nums">
                        {currentLogo.iconOffsetY} px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="2"
                      value={currentLogo.iconOffsetY}
                      onChange={(e) =>
                        updateLogo({ iconOffsetY: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHAKL VA KOMPOZITSIYA USLUBI */}
            {activeTab === 'shakl' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2.5">
                    Asosiy geometrik shakl
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        { id: 'circle', label: 'Dumaloq' },
                        { id: 'square', label: 'Kvadrat' },
                        { id: 'shield', label: 'Qalqon (Gerb)' },
                        { id: 'ribbon', label: 'Nishon / Rozetka' },
                      ] as { id: BaseShape; label: string }[]
                    ).map((sh) => {
                      const active = currentLogo.shape === sh.id;
                      return (
                        <button
                          key={sh.id}
                          onClick={() => updateLogo({ shape: sh.id })}
                          className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                            active
                              ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                              : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {sh.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2.5">
                    Bezak va joylashuv uslubi (10 xil kompozitsiya)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {LAYOUT_STYLE_METADATA.map((st) => {
                      const active = currentLogo.layoutStyle === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() =>
                            updateLogo({
                              layoutStyle: st.id,
                              shape: st.defaultShape,
                            })
                          }
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-colors cursor-pointer ${
                            active
                              ? 'border-amber-500 bg-amber-500/15 text-white'
                              : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {st.nameUz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-3 border-t border-slate-800">
                  <label className="inline-flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentLogo.showRibbon}
                      onChange={(e) => updateLogo({ showRibbon: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500"
                    />
                    <span>Pastki tantanali lentani ko‘rsatish</span>
                  </label>

                  <label className="inline-flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentLogo.showStars}
                      onChange={(e) => updateLogo({ showStars: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500"
                    />
                    <span>Yulduzli bezaklarni ko‘rsatish</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 5: AI BILAN YASASH */}
            {activeTab === 'ai' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Sun’iy intellekt (Gemini) yordamida logotip yaratish</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Xohlagan marosim, ranglar va ramzlarni o‘zbek tilida yozing. AI siz uchun
                    mos ranglar palitrasi, shior, kompozitsiya va vektor belgini avtomatik
                    ravishda ushbu muharrirga yuklaydi.
                  </p>
                </div>

                <form onSubmit={handleAiGenerate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Logotip tavsifini kiriting
                    </label>
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Masalan: Navro'zga yashil va oltin logotip, tepasida lola va bahor quyoshi bo'lsin..."
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Quick Prompt Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Navro'zga yashil va oltin logotip, tepasida lola",
                      "Mustaqillikning 35 yilligiga Humo qushi va oltin gulchambar",
                      "O'qituvchilar kuniga kitob, oltin pero va ma'rifat nuri",
                      "8-mart Xotin-qizlar kuniga pushti-oltin atirgul nishon",
                    ].map((sample) => (
                      <button
                        type="button"
                        key={sample}
                        onClick={() => setAiPrompt(sample)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingAi || !aiPrompt.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isGeneratingAi
                        ? 'AI logotipni loyihalamoqda...'
                        : 'AI orqali logotip yaratish'}
                    </span>
                  </button>
                </form>

                {aiMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                    {aiMessage}
                  </div>
                )}

                {aiError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                    {aiError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
