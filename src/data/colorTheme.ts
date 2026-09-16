export type ColorThemeId = 
  | 'amber_gold' 
  | 'neon_cyan' 
  | 'dhaba_ruby' 
  | 'punjab_emerald' 
  | 'midnight_purple';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  shortName: string;
  icon: string;
  primaryColor: string;      // Tailwind class or hex
  accentHex: string;         // Hex code for glowing effects
  borderGlowClass: string;
  textAccentClass: string;
  bgAccentClass: string;
  buttonActiveClass: string;
  lightGlowHex: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'amber_gold',
    name: 'Golden Highway (Classic)',
    shortName: 'Golden',
    icon: '✨',
    primaryColor: 'amber-400',
    accentHex: '#f59e0b',
    borderGlowClass: 'border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    textAccentClass: 'text-amber-300',
    bgAccentClass: 'bg-amber-400',
    buttonActiveClass: 'bg-amber-400 text-slate-950',
    lightGlowHex: 'rgba(245, 158, 11, 0.4)'
  },
  {
    id: 'neon_cyan',
    name: 'Neon GT Express (Cyan)',
    shortName: 'Cyan Neon',
    icon: '⚡',
    primaryColor: 'cyan-400',
    accentHex: '#06b6d4',
    borderGlowClass: 'border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    textAccentClass: 'text-cyan-300',
    bgAccentClass: 'bg-cyan-400',
    buttonActiveClass: 'bg-cyan-400 text-slate-950',
    lightGlowHex: 'rgba(6, 182, 212, 0.4)'
  },
  {
    id: 'dhaba_ruby',
    name: 'Dhaba Sunset (Ruby / Rose)',
    shortName: 'Ruby Rose',
    icon: '🔥',
    primaryColor: 'rose-500',
    accentHex: '#f43f5e',
    borderGlowClass: 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.35)]',
    textAccentClass: 'text-rose-300',
    bgAccentClass: 'bg-rose-500',
    buttonActiveClass: 'bg-rose-500 text-white',
    lightGlowHex: 'rgba(244, 63, 94, 0.4)'
  },
  {
    id: 'punjab_emerald',
    name: 'Punjab Royal Emerald',
    shortName: 'Emerald',
    icon: '🌿',
    primaryColor: 'emerald-400',
    accentHex: '#10b981',
    borderGlowClass: 'border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    textAccentClass: 'text-emerald-300',
    bgAccentClass: 'bg-emerald-400',
    buttonActiveClass: 'bg-emerald-400 text-slate-950',
    lightGlowHex: 'rgba(16, 185, 129, 0.4)'
  },
  {
    id: 'midnight_purple',
    name: 'Midnight Synthwave (Purple)',
    shortName: 'Purple',
    icon: '🔮',
    primaryColor: 'violet-400',
    accentHex: '#a855f7',
    borderGlowClass: 'border-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
    textAccentClass: 'text-purple-300',
    bgAccentClass: 'bg-purple-500',
    buttonActiveClass: 'bg-purple-500 text-white',
    lightGlowHex: 'rgba(168, 85, 247, 0.4)'
  }
];

export const getColorTheme = (id: string = 'amber_gold'): ColorTheme => {
  return COLOR_THEMES.find(t => t.id === id) || COLOR_THEMES[0];
};
