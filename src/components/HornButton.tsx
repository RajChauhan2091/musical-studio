import React, { useState, useEffect } from 'react';
import { Volume2, ChevronDown, Check, Sparkles } from 'lucide-react';
import { HORN_SOUNDS } from '../data/playlist';
import { ColorThemeId, getColorTheme } from '../data/colorTheme';

interface HornButtonProps {
  onHonk: (hornId?: string) => void;
  selectedHorn: string;
  onSelectHorn: (id: string) => void;
  honkCount: number;
  colorThemeId?: ColorThemeId;
}

export const HornButton: React.FC<HornButtonProps> = ({
  onHonk,
  selectedHorn,
  onSelectHorn,
  honkCount,
  colorThemeId = 'amber_gold'
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [lastHonkEffect, setLastHonkEffect] = useState(false);
  const [previewingHornId, setPreviewingHornId] = useState<string | null>(null);

  const activeColorTheme = getColorTheme(colorThemeId);

  const handleMainHonk = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPressing(true);
    setLastHonkEffect(true);
    setPreviewingHornId(selectedHorn);
    onHonk(selectedHorn);
    setTimeout(() => setIsPressing(false), 220);
    setTimeout(() => setLastHonkEffect(false), 600);
    setTimeout(() => setPreviewingHornId(null), 1200);
  };

  const handleSelectAndPlayHorn = (hornId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectHorn(hornId);
    setPreviewingHornId(hornId);
    setLastHonkEffect(true);
    onHonk(hornId);
    setTimeout(() => setLastHonkEffect(false), 600);
    setTimeout(() => setPreviewingHornId(null), 1200);
  };

  const currentHornObj = HORN_SOUNDS.find((h) => h.id === selectedHorn) || HORN_SOUNDS[0];

  useEffect(() => {
    if (!showPicker) return;
    const handleOutside = () => setShowPicker(false);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, [showPicker]);

  return (
    <div className="lg:fixed lg:left-8 lg:top-1/2 lg:-translate-y-1/2 z-30 flex flex-col items-center lg:items-start gap-1 select-none my-2.5 lg:my-0">
      {/* Main Iconic Horn Pill Button matching Image 2 */}
      <div className="relative group">
        {/* Sonic Ripple waves on honk */}
        {lastHonkEffect && (
          <>
            <div 
              className="absolute -inset-2 rounded-full border-2 animate-ping pointer-events-none" 
              style={{ borderColor: activeColorTheme.accentHex }}
            />
            <div 
              className="absolute -inset-5 rounded-full border animate-pulse pointer-events-none" 
              style={{ borderColor: `${activeColorTheme.accentHex}60` }}
            />
          </>
        )}

        <div
          className={`relative rounded-full flex items-center transition-all duration-150 shadow-2xl backdrop-blur-2xl ${
            isPressing
              ? 'scale-95 border-2 text-slate-950'
              : 'bg-slate-900/80 hover:bg-slate-900/95 border text-white'
          }`}
          style={{
            borderColor: isPressing ? activeColorTheme.accentHex : `${activeColorTheme.accentHex}40`,
            backgroundColor: isPressing ? activeColorTheme.accentHex : undefined,
            boxShadow: isPressing 
              ? `0 0 45px ${activeColorTheme.accentHex}, inset 0 2px 4px rgba(255, 255, 255, 0.8)` 
              : `0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 15px ${activeColorTheme.lightGlowHex}, inset 0 1px 2px rgba(255, 255, 255, 0.15)`
          }}
        >
          {/* Main Honk Trigger Action */}
          <button
            type="button"
            onClick={handleMainHonk}
            className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-3 focus:outline-none"
            title="Honk Truck Air Horn (Press H or click)"
          >
            <div 
              className={`p-1.5 sm:p-2 rounded-full transition-transform duration-100 ${
                isPressing 
                  ? 'bg-slate-950/30 rotate-12 scale-110' 
                  : 'group-hover:scale-105'
              }`}
              style={{
                backgroundColor: isPressing ? undefined : `${activeColorTheme.accentHex}25`,
                color: isPressing ? '#000000' : activeColorTheme.accentHex
              }}
            >
              <Volume2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase font-truck text-white drop-shadow-sm">
                  हॉर्न ओके प्लीज
                </span>
              </div>
              <div 
                className="flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold"
                style={{ color: activeColorTheme.accentHex }}
              >
                <span className="truncate max-w-[110px] sm:max-w-[160px]">
                  {currentHornObj.name}
                </span>
              </div>
            </div>
          </button>

          {/* Quick Sound Selector Toggle Arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(!showPicker);
            }}
            className="px-2.5 sm:px-3 py-2.5 sm:py-3 border-l border-white/15 hover:bg-white/10 rounded-r-full transition-colors flex items-center justify-center text-white/70 hover:text-white"
            style={{
              color: showPicker ? activeColorTheme.accentHex : undefined
            }}
            title="Select Horn Tune"
          >
            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${showPicker ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Subtext below Horn Button matching Image 2: "[H] or Space to honk (19 honks)" */}
      <div className="px-2 text-[9px] sm:text-[11px] text-white/50 font-mono text-center lg:text-left">
        <span className="text-white/80 font-bold">[H]</span> or Space to honk <span className="opacity-80">({honkCount} honks)</span>
      </div>

      {/* Horn Melody Selection Popup Menu */}
      {showPicker && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="glass-panel w-72 max-w-[88vw] rounded-3xl p-2.5 shadow-2xl border border-white/25 backdrop-blur-3xl bg-slate-900/95 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 absolute top-full left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 mt-2 z-50"
          style={{
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 20px ${activeColorTheme.lightGlowHex}`,
            borderColor: `${activeColorTheme.accentHex}40`
          }}
        >
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 border-b border-white/10">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" style={{ color: activeColorTheme.accentHex }} /> Multi-Tone Pressure Horns
            </span>
            <span className="font-mono text-[9px]">{HORN_SOUNDS.length} TUNES</span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            {HORN_SOUNDS.map((horn) => {
              const isSelected = selectedHorn === horn.id;
              const isPreviewing = previewingHornId === horn.id;

              return (
                <div
                  key={horn.id}
                  onClick={(e) => handleSelectAndPlayHorn(horn.id, e)}
                  className={`w-full p-2 rounded-2xl text-left cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'font-bold shadow-md'
                      : 'hover:bg-white/10 text-white/90 border border-transparent'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${activeColorTheme.accentHex}25`,
                          borderColor: `${activeColorTheme.accentHex}50`,
                          color: activeColorTheme.accentHex
                        }
                      : undefined
                  }
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="truncate">{horn.name}</span>
                    </div>
                    <p className="text-[10px] opacity-70 truncate font-sans">
                      {horn.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isPreviewing ? (
                      <Volume2 className="w-4 h-4 animate-bounce" style={{ color: activeColorTheme.accentHex }} />
                    ) : isSelected ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 font-mono text-white/60 transition-opacity">
                        Play
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
