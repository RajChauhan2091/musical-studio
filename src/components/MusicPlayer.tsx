import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  ListMusic,
  Youtube,
  Tv
} from 'lucide-react';
import { Track } from '../data/playlist';
import { ColorThemeId, getColorTheme } from '../data/colorTheme';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  isBuffering?: boolean;
  bufferedPercent?: number;
  liveTitle?: string;
  liveArtist?: string;
  isVideoOpen?: boolean;
  onToggleVideo?: () => void;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  isRepeat: boolean;
  onToggleRepeat: () => void;
  onOpenPlaylist: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  colorThemeId?: ColorThemeId;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  isBuffering = false,
  bufferedPercent = 0,
  liveTitle,
  liveArtist,
  isVideoOpen = false,
  onToggleVideo,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  onOpenPlaylist,
  currentTime,
  duration,
  onSeek,
  colorThemeId = 'amber_gold'
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragTime, setDragTime] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [hoverTime, setHoverTime] = useState<number>(0);
  const [hoverPos, setHoverPos] = useState<number>(0);
  
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activeColorTheme = getColorTheme(colorThemeId);

  const formatTime = (seconds: number) => {
    const safeSecs = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(safeSecs / 60);
    const secs = Math.floor(safeSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const safeDuration = duration > 0 ? duration : (currentTrack.duration || 240);
  const activeTime = isDragging ? dragTime : currentTime;
  const progressPercent = safeDuration > 0 ? Math.min(100, Math.max(0, (activeTime / safeDuration) * 100)) : 0;
  const safeBufferedPercent = Math.min(100, Math.max(progressPercent, bufferedPercent));

  const calculateTimeFromEvent = useCallback((e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    return ratio * safeDuration;
  }, [safeDuration]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    const newTime = calculateTimeFromEvent(e);
    setDragTime(newTime);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const timeAtCursor = ratio * safeDuration;
    
    setHoverTime(timeAtCursor);
    setHoverPos(Math.max(0, Math.min(100, ratio * 100)));

    if (isDragging) {
      const newTime = calculateTimeFromEvent(e);
      setDragTime(newTime);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isDragging) {
      const newTime = calculateTimeFromEvent(e);
      onSeek(newTime);
      setIsDragging(false);
    }
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDragging]);

  const displayTitle = liveTitle || currentTrack.title;
  const displayArtist = liveArtist || currentTrack.artist;

  return (
    <div className="fixed bottom-2.5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[96vw] max-w-lg sm:max-w-xl px-1 sm:px-4 pointer-events-auto select-none">
      <div 
        className="relative rounded-full px-2.5 sm:px-6 py-2 sm:py-3 shadow-2xl flex items-center justify-between gap-1.5 sm:gap-4 border border-white/20 bg-slate-950/85 backdrop-blur-2xl transition-all duration-300 hover:border-white/40"
        style={{
          boxShadow: `0 20px 50px -10px rgba(0, 0, 0, 0.9), 0 0 30px ${activeColorTheme.lightGlowHex}, inset 0 1px 2px rgba(255, 255, 255, 0.15)`
        }}
      >
        {/* Track Artwork & Metadata */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Vinyl Disc Artwork with YouTube Badge (Opens Playlist on click) */}
          <div 
            onClick={onOpenPlaylist}
            className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-slate-900 border border-white/30 hover:border-white shrink-0 shadow-lg transition-transform hover:scale-105 cursor-pointer group"
            title="Click to open 11 Cassettes & 500+ Songs"
          >
            <img 
              src={currentTrack.cassetteCover} 
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white border border-black/50 shadow-sm" />
            </div>

            {/* Red YouTube Pin Badge */}
            <div className="absolute bottom-0 right-0 p-0.5 bg-red-600 rounded-full border border-slate-950 shadow-sm">
              <Youtube className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex flex-col justify-center flex-1">
            {/* Title & Artist Row (Opens Playlist on Click) */}
            <div 
              onClick={onOpenPlaylist}
              className="cursor-pointer group/title"
              title="Click to open 11 Cassettes & 500+ Songs"
            >
              {/* Title Row with LIVE / Status Badge */}
              <div className="flex items-center gap-1.5">
                <span 
                  className="font-bold text-xs sm:text-sm text-white group-hover/title:underline transition-colors truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[200px]"
                >
                  {displayTitle}
                </span>
                {isBuffering ? (
                  <span 
                    className="px-1.5 py-0.2 rounded-full font-mono font-bold text-[8px] sm:text-[9px] uppercase tracking-wider animate-pulse shadow-sm shrink-0"
                    style={{
                      backgroundColor: activeColorTheme.accentHex,
                      color: activeColorTheme.id === 'dhaba_ruby' || activeColorTheme.id === 'midnight_purple' ? '#ffffff' : '#020617'
                    }}
                  >
                    LOAD
                  </span>
                ) : isPlaying ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono font-black text-[8px] sm:text-[9px] uppercase tracking-wider shadow-sm flex items-center gap-0.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block mr-0.5" />
                    LIVE
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white/80 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider shrink-0">
                    PAUSE
                  </span>
                )}
              </div>

              {/* Artist & Movie Info */}
              <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-white/75 truncate mt-0.5 max-w-[130px] xs:max-w-[170px] sm:max-w-[240px]">
                <span className="truncate">{displayArtist}</span>
                {currentTrack.movieOrAlbum && (
                  <>
                    <span className="text-white/40">•</span>
                    <span 
                      className="font-semibold truncate hidden xs:inline"
                      style={{ color: activeColorTheme.accentHex }}
                    >
                      {currentTrack.movieOrAlbum}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Scrub Bar directly under song info - Isolated from popup clicks */}
            <div 
              className="flex items-center gap-1.5 sm:gap-2 mt-0.5 w-full max-w-[140px] xs:max-w-[190px] sm:max-w-56"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div 
                ref={progressBarRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  const newTime = calculateTimeFromEvent(e);
                  onSeek(newTime);
                }}
                className="relative flex-1 h-3 flex items-center cursor-pointer group/bar"
              >
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative pointer-events-none">
                  {/* Progressive Loaded Buffer Chunk Track */}
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full bg-white/35 transition-all duration-300"
                    style={{ 
                      width: `${safeBufferedPercent}%`
                    }}
                    title={`Buffered: ${Math.round(safeBufferedPercent)}%`}
                  />

                  {/* Played Progress Track */}
                  <div 
                    className="absolute top-0 left-0 h-full rounded-full z-10 transition-all duration-75"
                    style={{ 
                      width: `${progressPercent}%`,
                      backgroundColor: activeColorTheme.accentHex
                    }}
                  />
                </div>
                {/* Scrub Ball */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-white shadow-md z-20 transition-transform group-hover/bar:scale-125 pointer-events-none"
                  style={{ 
                    left: `${progressPercent}%`,
                    marginLeft: '-4px',
                    backgroundColor: activeColorTheme.accentHex
                  }}
                />

                {/* Hover time tooltip */}
                {isHovering && !isDragging && (
                  <div 
                    className="absolute -top-6 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900/95 border border-white/20 text-[9px] font-mono text-white pointer-events-none shadow-lg whitespace-nowrap z-30"
                    style={{ left: `${hoverPos}%` }}
                  >
                    {formatTime(hoverTime)}
                  </div>
                )}
              </div>

              {/* Current Time / End Time Display */}
              <span 
                className="font-mono text-[8.5px] sm:text-[9.5px] text-white/60 shrink-0 cursor-default whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-white/90 font-medium">{formatTime(activeTime)}</span>
                <span className="text-white/40 mx-0.5">/</span>
                <span>{formatTime(safeDuration)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Playback Controls matching Image 2 */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          <button
            onClick={onToggleShuffle}
            className={`p-1.5 rounded-full text-xs transition-colors hidden sm:flex ${
              isShuffle ? 'bg-white/20' : 'text-white/60 hover:text-white'
            }`}
            style={isShuffle ? { color: activeColorTheme.accentHex } : undefined}
            title="Shuffle (S)"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`p-1.5 rounded-full text-xs transition-colors hidden sm:flex ${
              isRepeat ? 'bg-white/20' : 'text-white/60 hover:text-white'
            }`}
            style={isRepeat ? { color: activeColorTheme.accentHex } : undefined}
            title="Repeat Track (R)"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPrev}
            className="p-1 sm:p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            title="Previous Track (P / ←)"
          >
            <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </button>

          {/* Main Red Play / Pause Circle matching Image 2 */}
          <button
            onClick={onPlayPause}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-500 text-white transition-transform active:scale-90 shadow-xl border border-red-400 hover:scale-105 shrink-0"
            style={{ 
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.6)'
            }}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="p-1 sm:p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
            title="Next Track (N / →)"
          >
            <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </button>

          {/* Toggle Video Screen (MV) Button */}
          {onToggleVideo && (
            <button
              onClick={onToggleVideo}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1 border shadow-md ml-0.5 ${
                isVideoOpen
                  ? 'text-white border-white/40'
                  : 'text-white/80 hover:text-white hover:bg-white/10 border-white/20'
              }`}
              style={
                isVideoOpen
                  ? {
                      backgroundColor: activeColorTheme.accentHex,
                      color: activeColorTheme.id === 'amber_gold' || activeColorTheme.id === 'neon_cyan' || activeColorTheme.id === 'punjab_emerald' ? '#020617' : '#ffffff',
                      borderColor: activeColorTheme.accentHex,
                      boxShadow: `0 0 12px ${activeColorTheme.lightGlowHex}`
                    }
                  : undefined
              }
              title={isVideoOpen ? 'Hide Video Screen (V)' : 'Show Music Video Screen (V)'}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px] uppercase font-mono tracking-wider">
                {isVideoOpen ? 'Video ON' : 'Video'}
              </span>
            </button>
          )}

          {/* Open Full Cassette Drawer */}
          <button
            onClick={onOpenPlaylist}
            className="p-1.5 sm:p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95 ml-0.5"
            title="Cassette Rack & Song Library (C)"
          >
            <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
