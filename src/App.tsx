/**
 * Horn Ok Please - ट्रक वाला (Desi Highway Radio)
 * An interactive web experience recreating the nostalgic Indian highway atmosphere,
 * 90s Bollywood tunes, multi-tone pressure truck horns, and dhaba vibes.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { TruckScene } from './components/TruckScene';
import { MusicPlayer } from './components/MusicPlayer';
import { CassetteDrawer } from './components/CassetteDrawer';
import { LiveHighwayTicker } from './components/LiveHighwayTicker';
import { InfoModal } from './components/InfoModal';
import { HighwayVideoScreen } from './components/HighwayVideoScreen';
import { 
  TRACKS, 
  Track, 
  HORN_SOUNDS, 
  DEFAULT_YOUTUBE_PLAYLIST_ID, 
  USER_PLAYLISTS, 
  ALL_SONGS,
  areTitlesMatching,
  normalizeSongTitle,
  findMatchingSong 
} from './data/playlist';
import { ColorThemeId, getColorTheme } from './data/colorTheme';
import { audioEngine } from './utils/audioEngine';
import { youtubePlayer } from './utils/youtubePlayer';

export default function App() {
  // Playlist & Player State
  const [tracks, setTracks] = useState<Track[]>(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(TRACKS[0].duration);
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<'youtube' | 'synth'>('youtube');
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  // Horn & Effects State
  const [selectedHorn, setSelectedHorn] = useState<string>('nagin');
  const [honkCount, setHonkCount] = useState<number>(19);
  const [isHornShaking, setIsHornShaking] = useState<boolean>(false);

  // Highway Atmosphere & Color Theme State
  const [theme, setTheme] = useState<string>('midnight'); // 'midnight' | 'monsoon' | 'sunset'
  const [colorTheme, setColorTheme] = useState<ColorThemeId>('amber_gold');
  const [listenersCount, setListenersCount] = useState<number>(674);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [liveSongTitle, setLiveSongTitle] = useState<string | undefined>(undefined);
  const [liveArtist, setLiveArtist] = useState<string | undefined>(undefined);

  // Modals
  const [isCassetteOpen, setIsCassetteOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  const currentTrack = tracks[currentTrackIndex] || TRACKS[0];

  // Dynamically update root CSS variables for theme-aware scrollbars, glows, and accents
  useEffect(() => {
    const active = getColorTheme(colorTheme);
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', active.accentHex);
    root.style.setProperty('--theme-glow', active.lightGlowHex);
    root.style.setProperty('--theme-border', `${active.accentHex}80`);
  }, [colorTheme]);

  // Initialize YouTube Player on first mount/interaction
  useEffect(() => {
    // Mount YouTube API early
    youtubePlayer.initAPI('yt-audio-container');

    const handleFirstUserInteraction = () => {
      audioEngine.init();
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction);
    window.addEventListener('keydown', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, []);

  // Store mutable refs to eliminate stale closures in async events and callbacks
  const handleNextTrackRef = useRef<() => void>(() => {});
  const userWantsPlaybackRef = useRef<boolean>(false);
  const tracksRef = useRef<Track[]>(tracks);
  const currentTrackIndexRef = useRef<number>(currentTrackIndex);
  const isShuffleRef = useRef<boolean>(isShuffle);
  const isRepeatRef = useRef<boolean>(isRepeat);
  const lastAdvanceTimeRef = useRef<number>(0);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  // Play Track by Index with optional list and mode override
  const playTrackByIndex = useCallback((index: number, modeOverride?: 'youtube' | 'synth', listOverride?: Track[]) => {
    const currentList = listOverride || tracksRef.current;
    if (!currentList || currentList.length === 0) return;

    const safeIndex = Math.min(Math.max(0, index), currentList.length - 1);
    const trackToPlay = currentList[safeIndex];
    if (!trackToPlay) return;

    userWantsPlaybackRef.current = true;
    if (listOverride) {
      setTracks(listOverride);
      tracksRef.current = listOverride;
    }
    setCurrentTrackIndex(safeIndex);
    currentTrackIndexRef.current = safeIndex;
    setDuration(trackToPlay.duration || 210);
    setCurrentTime(0);
    setIsPlaying(true);
    setIsBuffering(true);
    setLiveSongTitle(trackToPlay.title);
    setLiveArtist(trackToPlay.artist);

    const activeMode = modeOverride || audioMode;

    if (activeMode === 'youtube') {
      audioEngine.stopTrack();
      if (trackToPlay.youtubeVideoId) {
        youtubePlayer.playVideo(trackToPlay.youtubeVideoId);
      } else if (trackToPlay.youtubePlaylistId && trackToPlay.youtubePlaylistId.length >= 24 && !trackToPlay.youtubePlaylistId.includes('_')) {
        youtubePlayer.playPlaylist(trackToPlay.youtubePlaylistId, trackToPlay.playlistIndex || 0);
      } else {
        youtubePlayer.playPlaylist(DEFAULT_YOUTUBE_PLAYLIST_ID, trackToPlay.playlistIndex || 0);
      }
    } else {
      // Fallback Retro Synth Mode
      youtubePlayer.pause();
      audioEngine.playTrack(
        trackToPlay,
        (time) => {
          setCurrentTime(time);
        },
        () => {
          // Track ended naturally in synth mode
          handleNextTrackRef.current?.();
        }
      );
    }
  }, [audioMode]);

  // Next Track with debouncing and repeat/shuffle logic
  const handleNextTrack = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 400) return;
    lastAdvanceTimeRef.current = now;

    const currentList = tracksRef.current;
    if (!currentList || currentList.length === 0) return;
    const currentIdx = currentTrackIndexRef.current;

    let nextIndex = currentIdx;
    if (isRepeatRef.current) {
      nextIndex = currentIdx;
    } else if (isShuffleRef.current) {
      if (currentList.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * currentList.length);
        } while (nextIndex === currentIdx);
      } else {
        nextIndex = 0;
      }
    } else {
      nextIndex = (currentIdx + 1) % currentList.length;
    }

    playTrackByIndex(nextIndex);
  }, [playTrackByIndex]);

  handleNextTrackRef.current = handleNextTrack;

  // Previous Track
  const handlePrevTrack = useCallback(() => {
    const currentList = tracksRef.current;
    if (!currentList || currentList.length === 0) return;
    const currentIdx = currentTrackIndexRef.current;
    const prevIndex = (currentIdx - 1 + currentList.length) % currentList.length;
    playTrackByIndex(prevIndex);
  }, [playTrackByIndex]);

  // Subscribe to YouTube Player progress & playback states
  useEffect(() => {
    const unsubscribe = youtubePlayer.subscribe((ytState) => {
      if (audioMode === 'youtube') {
        if (!userWantsPlaybackRef.current) {
          setIsPlaying(false);
          setIsBuffering(false);
          return;
        }

        setIsPlaying(ytState.isPlaying);
        setIsBuffering(!!ytState.isBuffering);
        if (ytState.bufferedPercent !== undefined) {
          setBufferedPercent(ytState.bufferedPercent);
        }
        if (ytState.currentTime > 0) {
          setCurrentTime(ytState.currentTime);
        }
        if (ytState.duration > 0) {
          setDuration(ytState.duration);
        }
        // Auto-advance seamlessly when YouTube track finishes
        if (ytState.hasEnded && userWantsPlaybackRef.current) {
          handleNextTrackRef.current?.();
        }
        // On video error/restriction: handle gracefully via streaming playlist without dropping to synth beep tones
        if (ytState.hasError && userWantsPlaybackRef.current) {
          const currentList = tracksRef.current;
          const currentIdx = currentTrackIndexRef.current;
          const currentTrk = currentList[currentIdx];
          
          if (currentTrk?.youtubePlaylistId && currentTrk.youtubePlaylistId.length >= 24 && !currentTrk.youtubePlaylistId.includes('_')) {
            youtubePlayer.playPlaylist(currentTrk.youtubePlaylistId, currentTrk.playlistIndex || currentIdx);
          } else {
            // Stream smoothly via default verified Highway station at current index
            youtubePlayer.playPlaylist(DEFAULT_YOUTUBE_PLAYLIST_ID, currentTrk?.playlistIndex || currentIdx);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [audioMode]);

  // Live Listeners Realistic Fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setListenersCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(620, Math.min(750, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Honk Horn action
  const handleHonk = useCallback((overrideHornId?: string) => {
    const hornToPlay = overrideHornId || selectedHorn;
    audioEngine.playHorn(hornToPlay);
    setHonkCount((prev) => prev + 1);
    setIsHornShaking(true);
    setTimeout(() => setIsHornShaking(false), 450);
  }, [selectedHorn]);

  // Toggle Play / Pause
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      userWantsPlaybackRef.current = false;
      youtubePlayer.pause();
      audioEngine.pauseTrack();
      setIsPlaying(false);
      setIsBuffering(false);
    } else {
      userWantsPlaybackRef.current = true;
      if (audioMode === 'youtube') {
        if (currentTrack.youtubeVideoId) {
          if (currentTime === 0) {
            youtubePlayer.playVideo(currentTrack.youtubeVideoId);
          } else {
            youtubePlayer.resume();
          }
          setIsPlaying(true);
        } else if (currentTrack.youtubePlaylistId && currentTrack.youtubePlaylistId.length >= 24 && !currentTrack.youtubePlaylistId.includes('_')) {
          if (currentTime === 0) {
            youtubePlayer.playPlaylist(currentTrack.youtubePlaylistId, currentTrack.playlistIndex || 0);
          } else {
            youtubePlayer.resume();
          }
          setIsPlaying(true);
        } else {
          youtubePlayer.playPlaylist(DEFAULT_YOUTUBE_PLAYLIST_ID, currentTrack.playlistIndex || 0);
          setIsPlaying(true);
        }
      } else {
        // Synth Mode
        if (currentTime === 0) {
          playTrackByIndex(currentTrackIndex, 'synth');
        } else {
          audioEngine.resumeTrack();
          setIsPlaying(true);
        }
      }
    }
  }, [isPlaying, currentTime, currentTrack, currentTrackIndex, audioMode, playTrackByIndex]);

  // Play full YouTube playlist (e.g. user requested playlist)
  const handlePlayYouTubePlaylist = useCallback((playlistId: string, startIndex: number = 0, videoId?: string) => {
    setAudioMode('youtube');
    audioEngine.stopTrack();
    
    // Find target playlist
    const matchedPlaylist = USER_PLAYLISTS.find((p) => p.playlistId === playlistId || (videoId && p.youtubeVideoId === videoId));
    
    if (matchedPlaylist && matchedPlaylist.songs.length > 0) {
      const playlistTracks: Track[] = matchedPlaylist.songs.map((s) => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        movieOrAlbum: s.movieOrAlbum,
        year: s.year,
        duration: s.duration,
        cassetteCover: s.cassetteCover,
        genre: s.genre,
        vibe: s.vibe,
        bpm: 120,
        style: 'modern_pop',
        instrument: 'sitar_tumbi',
        youtubePlaylistId: s.playlistId,
        youtubeVideoId: s.youtubeVideoId,
        playlistIndex: s.playlistIndex
      }));

      playTrackByIndex(startIndex, 'youtube', playlistTracks);
      return;
    }

    const matchedIdx = tracksRef.current.findIndex((t) => (videoId && t.youtubeVideoId === videoId) || t.youtubePlaylistId === playlistId);
    if (matchedIdx !== -1) {
      playTrackByIndex(matchedIdx, 'youtube');
    } else if (videoId) {
      userWantsPlaybackRef.current = true;
      youtubePlayer.playVideo(videoId);
      setIsPlaying(true);
    } else if (playlistId) {
      userWantsPlaybackRef.current = true;
      youtubePlayer.playPlaylist(playlistId, startIndex);
      setIsPlaying(true);
    }
  }, [playTrackByIndex]);

  // Toggle Audio Engine Mode (YouTube Stream vs Retro Synth)
  const handleToggleAudioMode = useCallback((newMode: 'youtube' | 'synth') => {
    setAudioMode(newMode);
    if (isPlaying) {
      playTrackByIndex(currentTrackIndex, newMode);
    }
  }, [isPlaying, currentTrackIndex, playTrackByIndex]);

  // Seek
  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioMode === 'youtube') {
      youtubePlayer.seekTo(newTime);
    } else {
      audioEngine.seek(newTime);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    youtubePlayer.setMute(muted);
    setIsMuted(muted);
  };

  // Select Track from Drawer (plays clicked song immediately in its full playlist context)
  const handleSelectTrack = (track: Track) => {
    // 1. Check if track is part of any curated playlist
    const matchedPl = USER_PLAYLISTS.find(p => 
      (track.youtubePlaylistId && p.playlistId === track.youtubePlaylistId) ||
      p.songs.some(s => s.id === track.id || areTitlesMatching(s.title, track.title))
    );

    let targetTracksList: Track[] = tracksRef.current;

    if (matchedPl && matchedPl.songs.length > 0) {
      targetTracksList = matchedPl.songs.map((s) => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        movieOrAlbum: s.movieOrAlbum,
        year: s.year,
        duration: s.duration,
        cassetteCover: s.cassetteCover,
        genre: s.genre,
        vibe: s.vibe,
        bpm: 120,
        style: 'modern_pop',
        instrument: 'sitar_tumbi',
        youtubePlaylistId: s.playlistId,
        youtubeVideoId: s.youtubeVideoId,
        playlistIndex: s.playlistIndex
      }));
    } else {
      // Check if inside ALL_SONGS
      const matchedSong = findMatchingSong(track, ALL_SONGS);
      if (matchedSong) {
        targetTracksList = ALL_SONGS;
      }
    }

    let idx = targetTracksList.findIndex(
      (t) => t.id === track.id || areTitlesMatching(t.title, track.title)
    );

    if (idx === -1) {
      targetTracksList = [track, ...targetTracksList];
      idx = 0;
    }

    playTrackByIndex(idx, 'youtube', targetTracksList);
  };

  // Add custom track
  const handleAddCustomTrack = (newTrack: Track) => {
    const updatedList = [newTrack, ...tracksRef.current];
    playTrackByIndex(0, 'youtube', updatedList);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when inside input/form
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'KeyH') {
        e.preventDefault();
        handleHonk();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'KeyN' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextTrack();
      } else if (e.code === 'KeyP' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTrack();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        setIsCassetteOpen((prev) => !prev);
      } else if (e.code === 'KeyV') {
        e.preventDefault();
        setIsVideoOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleHonk, handlePlayPause, handleNextTrack, handlePrevTrack]);

  return (
    <div className="relative w-screen h-screen bg-black text-white font-sans overflow-hidden select-none">
      {/* Top Header Bar */}
      <TopBar
        listenersCount={listenersCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isVideoOpen={isVideoOpen}
        onToggleVideo={() => setIsVideoOpen(!isVideoOpen)}
        onHonk={handleHonk}
        onOpenHornModal={() => setIsCassetteOpen(true)}
        currentTheme={theme}
        onSelectTheme={setTheme}
        colorThemeId={colorTheme}
        onSelectColorTheme={setColorTheme}
        onOpenInfo={() => setIsInfoOpen(true)}
        selectedHornName={HORN_SOUNDS.find((h) => h.id === selectedHorn)?.name || 'Nagin'}
      />

      {/* Center Highway Truck Scene with Responsive Integrated Horn & Culture */}
      <TruckScene
        theme={theme}
        isMusicPlaying={isPlaying}
        onHonk={handleHonk}
        isHornShaking={isHornShaking}
        honkCount={honkCount}
        selectedHorn={selectedHorn}
        onSelectHorn={setSelectedHorn}
        colorThemeId={colorTheme}
      />

      {/* Main Screen Synchronized Music Video Screen */}
      <HighwayVideoScreen
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        currentTime={currentTime}
        duration={duration}
        bufferedPercent={bufferedPercent}
        onPlayPause={handlePlayPause}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        colorThemeId={colorTheme}
        onHonk={handleHonk}
      />

      {/* Bottom Center Floating Glassmorphic Music Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        bufferedPercent={bufferedPercent}
        liveTitle={liveSongTitle}
        liveArtist={liveArtist}
        isVideoOpen={isVideoOpen}
        onToggleVideo={() => setIsVideoOpen(!isVideoOpen)}
        onPlayPause={handlePlayPause}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        isRepeat={isRepeat}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        onOpenPlaylist={() => setIsCassetteOpen(true)}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        colorThemeId={colorTheme}
      />

      {/* Live Highway Driver Ticker & Salute */}
      <LiveHighwayTicker onHonkResponse={handleHonk} colorThemeId={colorTheme} />

      {/* Cassette Rack / Playlist Drawer Modal */}
      <CassetteDrawer
        isOpen={isCassetteOpen}
        onClose={() => setIsCassetteOpen(false)}
        tracks={tracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
        onPlayYouTubePlaylist={handlePlayYouTubePlaylist}
        onAddCustomTrack={handleAddCustomTrack}
        colorThemeId={colorTheme}
      />

      {/* Info & Keyboard Shortcuts Modal */}
      <InfoModal 
        isOpen={isInfoOpen} 
        onClose={() => setIsInfoOpen(false)} 
        colorThemeId={colorTheme}
      />
    </div>
  );
}
