import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  X, 
  Minimize2, 
  Maximize2, 
  Tv, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Sparkles,
  ExternalLink,
  Move
} from 'lucide-react';
import { Track } from '../data/playlist';
import { ColorThemeId, getColorTheme } from '../data/colorTheme';
import { youtubePlayer, YouTubePlayerState } from '../utils/youtubePlayer';

export type VideoDisplayMode = 'theater' | 'pip' | 'fullscreen';

interface HighwayVideoScreenProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  bufferedPercent?: number;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  colorThemeId?: ColorThemeId;
  onHonk?: () => void;
}

export const HighwayVideoScreen: React.FC<HighwayVideoScreenProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  bufferedPercent = 0,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  colorThemeId = 'amber_gold',
  onHonk
}) => {
  const [mode, setMode] = useState<VideoDisplayMode>('theater');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<any>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);

  const activeColorTheme = getColorTheme(colorThemeId);

  // Sync Video Positioning & Frame Geometry with the YouTube Player
  const updateVideoPosition = useCallback(() => {
    if (!isOpen || !videoBoxRef.current) {
      youtubePlayer.setVisualDisplay({ visible: false });
      return;
    }

    const rect = videoBoxRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      youtubePlayer.setVisualDisplay({
        visible: true,
        rect: {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        mode: mode,
        borderRadius: mode === 'fullscreen' ? '0px' : '16px'
      });
    }
  }, [isOpen, mode]);

  // Keep frame updated on window resize, mode change, scroll, or opening
  useEffect(() => {
    if (!isOpen) {
      youtubePlayer.setVisualDisplay({ visible: false });
      return;
    }

    updateVideoPosition();

    const handleResize = () => {
      updateVideoPosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    const animationFrameId = requestAnimationFrame(updateVideoPosition);
    const interval = setInterval(updateVideoPosition, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      cancelAnimationFrame(animationFrameId);
      clearInterval(interval);
      youtubePlayer.setVisualDisplay({ visible: false });
    };
  }, [isOpen, mode, updateVideoPosition]);

  // Auto-hide overlay controls in theater/fullscreen on idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && mode !== 'pip') {
        setShowControls(false);
      }
    }, 3500);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    youtubePlayer.setMute(newMuted);
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const safeDuration = duration > 0 ? duration : (currentTrack.duration || 240);
  const progressPercent = safeDuration > 0 ? Math.min(100, Math.max(0, (currentTime / safeDuration) * 100)) : 0;
  const safeBufferedPercent = Math.min(100, Math.max(progressPercent, bufferedPercent));

  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed Backdrop (Only for Theater & Fullscreen Modes) */}
      {mode !== 'pip' && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Main Video Screen Container */}
      <div 
        onMouseMove={handleMouseMove}
        className={`fixed z-45 transition-all duration-300 flex flex-col select-none ${
          mode === 'fullscreen'
            ? 'inset-0 w-screen h-screen bg-black'
            : mode === 'pip'
            ? 'bottom-20 sm:bottom-24 right-2 sm:right-6 w-[86vw] max-w-xs sm:w-96 rounded-2xl shadow-2xl border bg-slate-950/95 backdrop-blur-2xl'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-3xl sm:max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border bg-slate-950/95 backdrop-blur-2xl'
        }`}
        style={
          mode !== 'fullscreen'
            ? {
                borderColor: `${activeColorTheme.accentHex}60`,
                boxShadow: `0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px ${activeColorTheme.lightGlowHex}`
              }
            : undefined
        }
      >
        {/* Top Video Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/10 bg-slate-900/80 rounded-t-2xl sm:rounded-t-3xl">
          {/* Left Title & Live Pulse */}
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="p-1 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: activeColorTheme.lightGlowHex, color: activeColorTheme.accentHex }}
            >
              <Tv className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                  {currentTrack.title}
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-[8px] font-mono font-black text-white uppercase tracking-wider flex items-center gap-0.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  MV
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/70 truncate">
                {currentTrack.artist} {currentTrack.movieOrAlbum ? `• ${currentTrack.movieOrAlbum}` : ''}
              </p>
            </div>
          </div>

          {/* Right Mode Switchers & Close Button */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {/* PiP Mode Toggle */}
            <button
              onClick={() => setMode(mode === 'pip' ? 'theater' : 'pip')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                mode === 'pip' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={mode === 'pip' ? 'Expand to Center' : 'Minimize to PiP (Float in Corner)'}
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            {/* Theater / Fullscreen Toggle */}
            <button
              onClick={() => setMode(mode === 'fullscreen' ? 'theater' : 'fullscreen')}
              className={`p-1.5 rounded-lg text-xs transition-colors hidden sm:flex ${
                mode === 'fullscreen' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={mode === 'fullscreen' ? 'Restore Window' : 'Full Cinema Screen'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Close Button (Switches to Audio-Only Mode) */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-red-500/30 transition-colors ml-1"
              title="Close Video Screen (Audio continues playing)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport Stage */}
        <div className="relative w-full flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[190px] sm:min-h-[300px] md:min-h-[380px]">
          {/* Target Element Anchor for YouTube Iframe Placement */}
          <div 
            ref={videoBoxRef}
            className="w-full h-full aspect-video max-h-[75vh] flex items-center justify-center bg-black relative"
          >
            {/* Fallback Artwork & Loading Spinner during Initial Buffering */}
            {isBuffering && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-none">
                <div 
                  className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mb-3 shadow-lg"
                  style={{ borderColor: `${activeColorTheme.accentHex}40`, borderTopColor: activeColorTheme.accentHex }}
                />
                <span className="text-xs font-bold text-white/90 uppercase tracking-widest font-mono">
                  Streaming High-Res MV...
                </span>
              </div>
            )}
          </div>

          {/* Quick Click-To-Play / Pause Video Overlay Tap Zone */}
          <div 
            onClick={onPlayPause}
            className="absolute inset-0 z-20 cursor-pointer"
          />

          {/* Controls Bar Overlay */}
          <div 
            className={`absolute bottom-0 left-0 right-0 z-30 p-2.5 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-200 pointer-events-auto ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Progress Scrubber */}
            <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
              <span className="text-[10px] font-mono text-white/70 w-8 text-right">
                {formatTime(currentTime)}
              </span>

              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  onSeek(ratio * safeDuration);
                }}
                className="relative flex-1 h-3 flex items-center cursor-pointer group/vidbar"
              >
                <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden relative">
                  {/* Buffer Track */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
                    style={{ width: `${safeBufferedPercent}%` }}
                  />
                  {/* Played Track */}
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ 
                      width: `${progressPercent}%`,
                      backgroundColor: activeColorTheme.accentHex
                    }}
                  />
                </div>
                {/* Scrub Ball */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white shadow-md z-10 transition-transform group-hover/vidbar:scale-125"
                  style={{ 
                    left: `${progressPercent}%`,
                    marginLeft: '-5px',
                    backgroundColor: activeColorTheme.accentHex
                  }}
                />
              </div>

              <span className="text-[10px] font-mono text-white/70 w-8">
                {formatTime(safeDuration)}
              </span>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onPrev(); }}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                  title="Previous Video"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
                  className="p-2 rounded-full text-white bg-red-600 hover:bg-red-500 shadow-md transition-transform active:scale-95 border border-red-400"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                  title="Next Video"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors ml-1"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Center Vibe / Mood Badge */}
              <div className="hidden md:flex items-center gap-1 text-[10px] font-medium text-white/80 px-2 py-0.5 rounded-full bg-white/10">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{currentTrack.vibe || 'Desi Highway Express'}</span>
              </div>

              {/* Right Highway Horn Quick Honk */}
              {onHonk && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onHonk();
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-white shadow-md flex items-center gap-1 border transition-transform active:scale-95"
                  style={{
                    backgroundColor: activeColorTheme.accentHex,
                    color: activeColorTheme.id === 'amber_gold' || activeColorTheme.id === 'neon_cyan' || activeColorTheme.id === 'punjab_emerald' ? '#020617' : '#ffffff',
                    borderColor: activeColorTheme.accentHex
                  }}
                  title="Honk Truck Horn to the Beat!"
                >
                  <span>📯 Honk to Beat</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
