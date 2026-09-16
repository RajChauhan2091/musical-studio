import React, { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb, Sparkles, Edit3, Check } from 'lucide-react';
import { TRUCK_SHAYARI } from '../data/playlist';
import { ColorThemeId, getColorTheme } from '../data/colorTheme';
import { HornButton } from './HornButton';

const TRUCK_NAMES = [
  'ट्रक वाला',
  'रंग रंगीला',
  'हाईवे का राजा',
  'शेर-ए-पंजाब',
  'रोड प्रिंस',
  'आवारा मसीहा',
  'महाकाल एक्सप्रेस',
  'दिलदार',
  'उड़न खटोला',
  'याराना',
  'बुलबुल',
  'बुलेट राजा',
  'जय माता दी',
  'दम लगा के हईशा'
];

interface TruckSceneProps {
  theme: string;
  isMusicPlaying: boolean;
  onHonk: (hornId?: string) => void;
  isHornShaking: boolean;
  honkCount: number;
  selectedHorn: string;
  onSelectHorn: (id: string) => void;
  colorThemeId?: ColorThemeId;
}

export const TruckScene: React.FC<TruckSceneProps> = ({
  theme,
  onHonk,
  isHornShaking,
  honkCount,
  selectedHorn,
  onSelectHorn,
  colorThemeId = 'amber_gold'
}) => {
  const [shayariIndex, setShayariIndex] = useState<number>(0);
  const [isShayariFading, setIsShayariFading] = useState<boolean>(false);
  const [truckNameIndex, setTruckNameIndex] = useState<number>(0);
  const [customName, setCustomName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [showHonkEffect, setShowHonkEffect] = useState<boolean>(false);
  const [honkCoords, setHonkCoords] = useState<{ x: number; y: number } | null>(null);

  const activeColorTheme = getColorTheme(colorThemeId);

  // Automatic periodic rotation of TRUCK_SHAYARI every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsShayariFading(true);
      setTimeout(() => {
        setShayariIndex((prev) => (prev + 1) % TRUCK_SHAYARI.length);
        setIsShayariFading(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleNextTruckName = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isEditingName) return;
    setCustomName('');
    setTruckNameIndex((prev) => (prev + 1) % TRUCK_NAMES.length);
  };

  const handleSaveCustomName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsEditingName(false);
  };

  const currentDisplayName = customName.trim() ? customName : TRUCK_NAMES[truckNameIndex];

  const nextShayari = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsShayariFading(true);
    setTimeout(() => {
      setShayariIndex((prev) => (prev + 1) % TRUCK_SHAYARI.length);
      setIsShayariFading(false);
    }, 200);
  };

  const handleTruckClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHonkCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowHonkEffect(true);
    onHonk();
    setTimeout(() => setShowHonkEffect(false), 700);
  };

  const getTruckImage = () => {
    if (theme === 'monsoon') {
      return '/src/assets/images/monsoon_night_truck_1787243716693.jpg';
    }
    return '/src/assets/images/desi_highway_truck_1787243699357.jpg';
  };

  const getBackgroundImage = () => {
    if (theme === 'sunset') {
      return '/src/assets/images/highway_sunset_bg_1787247494778.jpg';
    }
    return '/src/assets/images/highway_night_bg_1787247478101.jpg';
  };

  return (
    <div
      className={`relative w-full h-full min-h-screen overflow-hidden flex flex-col items-center justify-center pt-16 pb-36 px-4 select-none ${
        isHornShaking ? 'animate-horn-shake' : ''
      }`}
    >
      {/* Immersive Cinematic Background Image Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-1000">
        <img
          src={getBackgroundImage()}
          alt="Cinematic Indian National Highway Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          style={{
            filter: theme === 'sunset' ? 'brightness(0.85) contrast(1.05)' : 'brightness(0.7) contrast(1.15) saturate(1.2)'
          }}
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90 mix-blend-multiply" />
      </div>

      {/* Main Truck Display Stage Container matching Image 2 */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
        
        {/* Top Header Badge matching Image 2 & 4: "✨ HIGHWAY SOUNDSCAPE & CULTURE" */}
        <div className="mb-2 flex flex-col items-center">
         

          {/* Interactive Main Headline matching Image 2 & 4: Click to change Truck Name / Type Custom */}
          {isEditingName ? (
            <form onSubmit={handleSaveCustomName} className="mt-2 flex items-center gap-2 z-30">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Type truck name (e.g. शेर-ए-पंजाब)..."
                autoFocus
                className="px-4 py-2 bg-slate-900/90 border-2 rounded-2xl text-2xl font-bold font-truck text-white focus:outline-none shadow-2xl text-center"
                style={{ borderColor: activeColorTheme.accentHex }}
              />
              <button
                type="submit"
                className="p-2.5 rounded-2xl shadow-lg text-slate-950 font-bold hover:scale-105 transition-all"
                style={{ backgroundColor: activeColorTheme.accentHex }}
                title="Save Truck Name"
              >
                <Check className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="relative group/name mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleNextTruckName}
                className="text-4xl sm:text-6xl font-black font-truck tracking-wide text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-3 cursor-pointer group-hover/name:brightness-110"
                style={{
                  textShadow: `0 0 30px ${activeColorTheme.accentHex}60`
                }}
                title="Click to cycle truck name / ट्रक का नाम बदलें"
              >
                <span>{currentDisplayName}</span>
                <span 
                  className="text-xs px-2.5 py-1 rounded-full border font-mono font-bold uppercase tracking-wider hidden sm:inline-flex items-center gap-1 opacity-0 group-hover/name:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: activeColorTheme.lightGlowHex,
                    borderColor: `${activeColorTheme.accentHex}60`,
                    color: activeColorTheme.accentHex
                  }}
                >
                  <RefreshCw className="w-3 h-3 animate-spin-slow" />
                  बदलें
                </span>
              </button>

              {/* Edit Custom Name Button */}
              <button
                type="button"
                onClick={() => {
                  setCustomName(currentDisplayName);
                  setIsEditingName(true);
                }}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all opacity-0 group-hover/name:opacity-100"
                title="Type your own custom truck name"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Central Truck Card Container with Nimbu-Mirchi Charm hanging */}
        <div className="relative w-full max-w-xl aspect-[16/10] sm:aspect-[16/9.5] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-950/60 backdrop-blur-md transition-transform duration-300 group cursor-pointer"
          style={{
            boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px ${activeColorTheme.lightGlowHex}`,
            borderColor: `${activeColorTheme.accentHex}40`
          }}
          onClick={handleTruckClick}
          title="Click truck to honk pressure air horn!"
        >
          {/* Dangling Nimbu-Mirchi Charm (🍋🌶️🧿) matching Image 2 */}
          <div className="absolute top-3 left-4 z-20 flex flex-col items-center animate-wiggle pointer-events-none drop-shadow-lg">
            <span 
              className="w-0.5 h-3 mb-0.5" 
              style={{ backgroundColor: activeColorTheme.accentHex }}
            />
            <span className="text-sm">🍋</span>
            <span className="text-sm -mt-1">🌶️</span>
            <span className="text-sm -mt-1">🌶️</span>
            <span className="text-xs -mt-0.5">🧿</span>
          </div>

          <img
            src={getTruckImage()}
            alt="Decorated Indian Highway Truck Art"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Headlights Toggle Beam Overlay */}
          {headlightsOn && (
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-screen" 
              style={{
                background: `linear-gradient(to top, ${activeColorTheme.lightGlowHex}, transparent, transparent)`
              }}
            />
          )}

          {/* Interactive Honk Ripple Effect at Click Coordinates */}
          {showHonkEffect && (
            <div 
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-30"
              style={{
                left: honkCoords ? `${honkCoords.x}px` : '50%',
                top: honkCoords ? `${honkCoords.y}px` : '50%'
              }}
            >
              <div 
                className="w-24 h-24 rounded-full border-4 animate-ping"
                style={{ borderColor: activeColorTheme.accentHex }}
              />
              <span 
                className="absolute text-base font-black font-truck drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] bg-slate-950/90 px-2.5 py-0.5 rounded-full border shadow-xl"
                style={{
                  color: activeColorTheme.accentHex,
                  borderColor: activeColorTheme.accentHex
                }}
              >
                पीं पीं! 📯
              </span>
            </div>
          )}

          {/* Bottom Right Beam Toggle Button matching Image 2: "💡 BEAM ON" */}
          <div className="absolute bottom-3 right-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHeadlightsOn(!headlightsOn);
              }}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-bold font-mono tracking-wider flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md ${
                headlightsOn
                  ? 'text-slate-950 shadow-md'
                  : 'bg-slate-950/80 text-white/70 border-white/20'
              }`}
              style={
                headlightsOn
                  ? {
                      backgroundColor: activeColorTheme.accentHex,
                      borderColor: activeColorTheme.accentHex,
                      color: activeColorTheme.id === 'dhaba_ruby' || activeColorTheme.id === 'midnight_purple' ? '#ffffff' : '#020617'
                    }
                  : undefined
              }
              title="Toggle High Beam Headlights"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{headlightsOn ? 'BEAM ON' : 'BEAM OFF'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Horn Button: Centers cleanly below truck on mobile & tablet, docks to left on desktop */}
        <HornButton
          onHonk={onHonk}
          selectedHorn={selectedHorn}
          onSelectHorn={onSelectHorn}
          honkCount={honkCount}
          colorThemeId={colorThemeId}
        />

        {/* Bottom Shayari Pill with Auto & Manual Cycle and Smooth Transition */}
        <div 
          onClick={nextShayari}
          className="mt-2.5 sm:mt-4 group cursor-pointer px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-xl bg-slate-900/80 hover:bg-slate-900 border border-white/20 hover:border-white/40 text-center shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-2.5 active:scale-95 max-w-[92vw] sm:max-w-md"
          style={{
            boxShadow: `0 10px 25px -5px rgba(0,0,0,0.5), 0 0 20px ${activeColorTheme.lightGlowHex}`
          }}
          title="Click to cycle truck shayari (auto-rotates every 6s) / शायरी बदलें"
        >
          <Sparkles 
            className="w-3.5 h-3.5 shrink-0 animate-pulse" 
            style={{ color: activeColorTheme.accentHex }}
          />
          <p 
            className={`text-xs sm:text-sm font-bold text-white tracking-wide font-truck drop-shadow-sm flex items-center justify-center gap-2 transition-all duration-300 transform ${
              isShayariFading ? 'opacity-0 translate-y-1 scale-95' : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            <span>{TRUCK_SHAYARI[shayariIndex]}</span>
          </p>
          <RefreshCw 
            className="w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:rotate-180 transition-all duration-500 shrink-0" 
          />
        </div>

      </div>
    </div>
  );
};
