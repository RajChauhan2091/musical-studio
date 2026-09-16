import React from 'react';
import { X, Keyboard, Truck } from 'lucide-react';
import { ColorThemeId, getColorTheme } from '../data/colorTheme';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorThemeId?: ColorThemeId;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, colorThemeId = 'amber_gold' }) => {
  if (!isOpen) return null;

  const activeColorTheme = getColorTheme(colorThemeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg backdrop-blur-3xl bg-slate-900/65 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col border border-white/40 overflow-hidden"
        style={{
          boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 30px ${activeColorTheme.lightGlowHex}, inset 0 1px 2px rgba(255, 255, 255, 0.4)`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-2xl bg-white/20 border border-white/40 shadow-md"
              style={{ color: activeColorTheme.accentHex }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 bg-white/20 border border-white/30 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1">
                About The Project
              </div>
              <h3 className="text-base font-bold font-truck tracking-wide text-white">
                Horn Ok Please • ट्रक वाला
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/35 border border-white/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story / Concept */}
        <div className="py-4 space-y-3 text-xs sm:text-sm text-white/90 leading-relaxed">
          <p>
            Inspired by the iconic Indian truck slogan <strong>"HORN OK PLEASE"</strong> and late-night highway journeys through roadside dhabas with Kumar Sanu & Alka Yagnik singing on the cassette deck.
          </p>
          <p className="text-white/70 text-xs">
            Synthesized with real Web Audio multi-tone pressure air horns, engine rumbles, monsoon rain soundscapes, and authentic truck art typography.
          </p>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="pt-2 pb-4">
          <div 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2.5"
            style={{ color: activeColorTheme.accentHex }}
          >
            <Keyboard className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-between">
              <span className="text-white/80 font-medium">Honk Horn</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-white/20 font-mono font-bold border border-white/30" style={{ color: activeColorTheme.accentHex }}>H</kbd>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-between">
              <span className="text-white/80 font-medium">Play / Pause</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-white/20 font-mono font-bold border border-white/30" style={{ color: activeColorTheme.accentHex }}>Space</kbd>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-between">
              <span className="text-white/80 font-medium">Next Track</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-white/20 font-mono font-bold border border-white/30" style={{ color: activeColorTheme.accentHex }}>N / →</kbd>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-between">
              <span className="text-white/80 font-medium">Previous Track</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-white/20 font-mono font-bold border border-white/30" style={{ color: activeColorTheme.accentHex }}>P / ←</kbd>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-between">
              <span className="text-white/80 font-medium">Mute / Unmute</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-white/20 font-mono font-bold border border-white/30" style={{ color: activeColorTheme.accentHex }}>M</kbd>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-between">
              <span className="text-white/80 font-medium">Cassette Rack</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-white/20 font-mono font-bold border border-white/30" style={{ color: activeColorTheme.accentHex }}>C</kbd>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-between col-span-2">
              <span className="text-white/80 font-medium">Toggle Music Video Screen (MV)</span>
              <kbd className="px-2 py-0.5 rounded-lg bg-white/20 font-mono font-bold border border-white/30" style={{ color: activeColorTheme.accentHex }}>V</kbd>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white/60">
          <span className="flex items-center gap-1 font-medium">
            Made with ❤️ for Indian Highway Lovers
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold rounded-2xl transition-all shadow-md text-slate-950"
            style={{ backgroundColor: activeColorTheme.accentHex }}
          >
            Back to Highway
          </button>
        </div>
      </div>
    </div>
  );
};
