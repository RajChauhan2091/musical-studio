import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Moon, 
  Sun, 
  CloudRain, 
  Share2, 
  Info,
  Palette,
  Check,
  Tv
} from 'lucide-react';
import { COLOR_THEMES, ColorThemeId, getColorTheme } from '../data/colorTheme';

interface TopBarProps {
  listenersCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isVideoOpen?: boolean;
  onToggleVideo?: () => void;
  onHonk?: () => void;
  onOpenHornModal?: () => void;
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
  colorThemeId?: ColorThemeId;
  onSelectColorTheme?: (colorTheme: ColorThemeId) => void;
  onOpenInfo: () => void;
  selectedHornName: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  listenersCount,
  isMuted,
  onToggleMute,
  isVideoOpen = false,
  onToggleVideo,
  currentTheme,
  onSelectTheme,
  colorThemeId = 'amber_gold',
  onSelectColorTheme,
  onOpenInfo
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const activeColorTheme = getColorTheme(colorThemeId);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).toLowerCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Horn Ok Please - ट्रक वाला Highway Radio',
        text: 'Listen to nostalgic Bollywood highway tunes & honk authentic truck horns!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2.5 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between pointer-events-auto select-none gap-1 sm:gap-3">
      {/* Zone 1: Time and Highway Location in Frosted Glass Pill (Image 2) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 backdrop-blur-xl bg-slate-900/60 border border-white/25 shadow-lg">
          <span className="text-[11px] sm:text-sm font-mono tracking-tight font-bold text-white drop-shadow-sm whitespace-nowrap">
            {timeStr || '09:31 pm'}
          </span>
          <span className="text-white/40 text-[10px] sm:text-xs">•</span>
          <span 
            className="text-[9px] sm:text-[11px] font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-full border whitespace-nowrap"
            style={{
              backgroundColor: activeColorTheme.lightGlowHex,
              color: activeColorTheme.accentHex,
              borderColor: `${activeColorTheme.accentHex}40`
            }}
          >
            <span className="inline sm:hidden">NH 44</span>
            <span className="hidden sm:inline">NH 44 • GT ROAD</span>
          </span>
        </div>
      </div>

      {/* Zone 2: Live Listeners On The Highway (Image 2) */}
      <div className="flex items-center shrink-0">
        <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 border border-white/20 bg-slate-900/60 text-[11px] sm:text-sm shadow-xl backdrop-blur-2xl">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-400"></span>
          </span>
          <span className="font-bold text-white tracking-wide font-mono text-[11px] sm:text-sm whitespace-nowrap">
            {listenersCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Zone 3: Controls & Actions (Image 2 & Image 1) */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Theme Colors & Atmosphere Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 text-xs text-white font-bold backdrop-blur-xl bg-slate-900/70 hover:bg-slate-800/90 border shadow-lg transition-all"
            style={{
              borderColor: `${activeColorTheme.accentHex}50`,
              boxShadow: `0 4px 14px ${activeColorTheme.lightGlowHex}`
            }}
            title="Theme Colors & Highway Atmosphere"
          >
            <span className="text-xs">{activeColorTheme.icon}</span>
            <span 
              className="font-bold uppercase tracking-wider text-[10px] sm:text-[11px] hidden xs:inline"
              style={{ color: activeColorTheme.accentHex }}
            >
              {activeColorTheme.shortName}
            </span>
          </button>

          {/* Theme Colors Modal / Dropdown exactly matching Image 1 & 2 */}
          {themeDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setThemeDropdownOpen(false)} 
              />
              <div 
                className="absolute right-0 mt-2 w-64 rounded-2xl p-2.5 shadow-2xl border border-white/20 z-50 animate-in fade-in duration-150 backdrop-blur-2xl bg-slate-900/95"
                style={{
                  boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px ${activeColorTheme.lightGlowHex}`,
                  borderColor: `${activeColorTheme.accentHex}40`
                }}
              >
                {/* Header matching Image 1: "THEME COLORS" */}
                <div className="px-2.5 py-1 text-[11px] font-bold text-white/50 uppercase tracking-widest border-b border-white/10 mb-1.5 flex items-center justify-between">
                  <span>THEME COLORS</span>
                  <span className="text-[10px] text-white/40 font-mono">5 STYLES</span>
                </div>

                <div className="space-y-1">
                  {COLOR_THEMES.map((themeItem) => {
                    const isSelected = colorThemeId === themeItem.id;
                    return (
                      <button
                        key={themeItem.id}
                        onClick={() => {
                          onSelectColorTheme?.(themeItem.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'text-white shadow-md ring-1 ring-white/40'
                            : 'text-white/90 hover:bg-white/10'
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: themeItem.accentHex,
                                color: themeItem.id === 'amber_gold' || themeItem.id === 'neon_cyan' || themeItem.id === 'punjab_emerald' ? '#020617' : '#ffffff'
                              }
                            : undefined
                        }
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-sm">{themeItem.icon}</span>
                          <span className="truncate">{themeItem.name}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 shrink-0 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sky Atmosphere presets */}
                <div className="px-2.5 pt-2 pb-1 text-[10px] font-bold text-white/40 uppercase tracking-wider border-t border-white/10 mt-2 mb-1">
                  HIGHWAY SKY
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => { onSelectTheme('midnight'); setThemeDropdownOpen(false); }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 ${
                      currentTheme === 'midnight' ? 'bg-white/20 text-indigo-300 border border-white/20' : 'text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Night</span>
                  </button>
                  <button
                    onClick={() => { onSelectTheme('monsoon'); setThemeDropdownOpen(false); }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 ${
                      currentTheme === 'monsoon' ? 'bg-white/20 text-cyan-300 border border-white/20' : 'text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <CloudRain className="w-3 h-3" />
                    <span>Rain</span>
                  </button>
                  <button
                    onClick={() => { onSelectTheme('sunset'); setThemeDropdownOpen(false); }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 ${
                      currentTheme === 'sunset' ? 'bg-white/20 text-amber-300 border border-white/20' : 'text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Sunset</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Global Sound Mute/Unmute */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 sm:p-2 rounded-full transition-colors backdrop-blur-xl border shadow-lg ${
            isMuted ? 'bg-red-500/30 text-red-200 border-red-400/50' : 'bg-slate-900/60 text-white hover:text-amber-300 border-white/25'
          }`}
          title={isMuted ? 'Unmute All Audio (M)' : 'Mute All Audio (M)'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Watch Video (MV) Screen Button */}
        {onToggleVideo && (
          <button
            onClick={onToggleVideo}
            className={`p-1.5 sm:p-2 rounded-full transition-all backdrop-blur-xl border shadow-lg ${
              isVideoOpen
                ? 'text-white border-white/40 ring-1 ring-white/50'
                : 'bg-slate-900/60 text-white hover:text-amber-300 border-white/25'
            }`}
            style={
              isVideoOpen
                ? {
                    backgroundColor: activeColorTheme.accentHex,
                    color: activeColorTheme.id === 'amber_gold' || activeColorTheme.id === 'neon_cyan' || activeColorTheme.id === 'punjab_emerald' ? '#020617' : '#ffffff',
                    borderColor: activeColorTheme.accentHex,
                    boxShadow: `0 0 14px ${activeColorTheme.lightGlowHex}`
                  }
                : undefined
            }
            title={isVideoOpen ? 'Hide Video Screen (V)' : 'Show Music Video Screen (V)'}
          >
            <Tv className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={handleShare}
            className="p-1.5 sm:p-2 rounded-full text-white hover:text-amber-300 transition-colors hidden sm:flex backdrop-blur-xl bg-slate-900/60 border border-white/25 shadow-lg"
            title="Share Radio"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          {copiedNotification && (
            <div className="absolute right-0 top-full mt-1.5 px-2.5 py-1 bg-emerald-500/90 text-white font-bold text-[10px] rounded-xl whitespace-nowrap shadow-lg border border-emerald-300/50 animate-in fade-in z-50">
              Link Copied!
            </div>
          )}
        </div>

        {/* Info & Shortcuts Modal Button */}
        <button
          onClick={onOpenInfo}
          className="p-1.5 sm:p-2 rounded-full text-white hover:text-amber-300 transition-colors backdrop-blur-xl bg-slate-900/60 border border-white/25 shadow-lg"
          title="Shortcuts & Story"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 sm:p-2 rounded-full text-white hover:text-amber-300 transition-colors hidden md:flex backdrop-blur-xl bg-slate-900/60 border border-white/25 shadow-lg"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
