import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { ColorThemeId, getColorTheme } from '../data/colorTheme';

const HIGHWAY_DISPATCHES = [
  '📯 Driver from Murthal just honked the Nagin tune!',
  '☕ Chai break at Highway Dhaba KM-142',
  '📻 Truck #PB65 tuned into 90s Nostalgia Radio',
  '🌧️ Light drizzle reported on Mumbai-Pune Expressway',
  '🚚 Container convoy passing through Jaipur Bypass',
  '🫓 Fresh Tandoori Parathas ready at GT Road Dhaba',
  '✨ Driver from Rajasthan flashed high beams in salute!',
  '🎶 Now Playing: Evergreen Bollywood Highway Beats'
];

interface LiveHighwayTickerProps {
  onHonkResponse: () => void;
  colorThemeId?: ColorThemeId;
}

export const LiveHighwayTicker: React.FC<LiveHighwayTickerProps> = ({ onHonkResponse, colorThemeId = 'amber_gold' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [customWaveSent, setCustomWaveSent] = useState(false);

  const activeColorTheme = getColorTheme(colorThemeId);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % HIGHWAY_DISPATCHES.length);
        setIsVisible(true);
      }, 400);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const handleSendWave = () => {
    setCustomWaveSent(true);
    onHonkResponse();
    setTimeout(() => setCustomWaveSent(false), 2500);
  };

  return (
    <div className="fixed top-12 sm:top-16 left-2.5 sm:left-6 lg:left-8 z-30 pointer-events-auto max-w-[calc(100vw-1.25rem)] sm:max-w-md">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div 
          className={`backdrop-blur-2xl bg-slate-950/70 border border-white/30 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center gap-2 text-xs text-white shadow-xl transition-all duration-300 min-w-0 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
          style={{
            boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px ${activeColorTheme.lightGlowHex}, inset 0 1px 2px rgba(255, 255, 255, 0.2)`
          }}
        >
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: activeColorTheme.accentHex }}
            />
            <span 
              className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2"
              style={{ backgroundColor: activeColorTheme.accentHex }}
            />
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium font-sans drop-shadow-sm truncate">
            {customWaveSent ? '🙌 You signaled a salute to all highway drivers!' : HIGHWAY_DISPATCHES[currentIndex]}
          </span>
        </div>

        {/* Send Highway Horn Salute button */}
        <button
          onClick={handleSendWave}
          disabled={customWaveSent}
          className="backdrop-blur-xl bg-white/20 hover:bg-white/35 border border-white/40 hover:border-white/60 p-1 sm:p-1.5 rounded-full text-white text-xs shadow-lg transition-all active:scale-95 shrink-0"
          style={{ color: '#ffffff' }}
          title="Flash High Beams / Salute other drivers"
        >
          <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </button>
      </div>
    </div>
  );
};
