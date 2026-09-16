import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Search, 
  Disc3, 
  Youtube, 
  ExternalLink, 
  Music, 
  ListMusic, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Volume2,
  LayoutGrid,
  List,
  Shuffle,
  Filter,
  Check
} from 'lucide-react';
import { 
  Track, 
  USER_PLAYLISTS, 
  ALL_SONGS, 
  SongItem, 
  CASSETTE_GENRES, 
  DEFAULT_YOUTUBE_PLAYLIST_ID,
  areTitlesMatching,
  normalizeSongTitle,
  findMatchingSong
} from '../data/playlist';
import { ColorThemeId, getColorTheme } from '../data/colorTheme';

interface CassetteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tracks?: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onPlayYouTubePlaylist: (playlistId: string, startIndex?: number, videoId?: string) => void;
  onAddCustomTrack?: (track: Track) => void;
  colorThemeId?: ColorThemeId;
}

export const CassetteDrawer: React.FC<CassetteDrawerProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onPlayYouTubePlaylist,
  colorThemeId = 'amber_gold'
}) => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'all_songs'>('playlists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(USER_PLAYLISTS[0].id);
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false);
  const [visibleChunkCount, setVisibleChunkCount] = useState<number>(1);
  const CHUNK_SIZE = 36;

  const activeColorTheme = getColorTheme(colorThemeId);
  const isDarkTheme = activeColorTheme.id === 'dhaba_ruby' || activeColorTheme.id === 'midnight_purple';
  const themeTextColor = isDarkTheme ? '#ffffff' : '#020617';

  // Reset chunk count on filter / search changes
  useEffect(() => {
    setVisibleChunkCount(1);
  }, [selectedGenre, searchQuery, activeTab]);

  // Filtered Songs across all playlists
  const filteredSongs = useMemo(() => {
    return ALL_SONGS.filter((s) => {
      const matchesGenre = selectedGenre === 'all' || s.genre === selectedGenre;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesGenre;
      const normQ = normalizeSongTitle(q);
      const matchesSearch =
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.movieOrAlbum.toLowerCase().includes(q) ||
        s.vibe.toLowerCase().includes(q) ||
        (normQ && (normalizeSongTitle(s.title).includes(normQ) || normalizeSongTitle(s.artist).includes(normQ)));
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchQuery]);

  // Filtered Playlists
  const filteredPlaylists = useMemo(() => {
    return USER_PLAYLISTS.filter((pl) => {
      const matchesGenre = selectedGenre === 'all' || pl.genre === selectedGenre;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesGenre;
      const normQ = normalizeSongTitle(q);
      const matchesSearch =
        pl.title.toLowerCase().includes(q) ||
        pl.hindiTitle.toLowerCase().includes(q) ||
        pl.subtitle.toLowerCase().includes(q) ||
        pl.description.toLowerCase().includes(q) ||
        pl.genreLabel.toLowerCase().includes(q) ||
        pl.songs.some(s => 
          s.title.toLowerCase().includes(q) || 
          s.artist.toLowerCase().includes(q) ||
          (normQ && (normalizeSongTitle(s.title).includes(normQ) || normalizeSongTitle(s.artist).includes(normQ)))
        );
      return matchesGenre && matchesSearch;
    });
  }, [selectedGenre, searchQuery]);

  if (!isOpen) return null;

  const isSongActive = (song: Track | SongItem) => {
    return (
      currentTrack.id === song.id ||
      areTitlesMatching(currentTrack.title, song.title)
    );
  };

  const handlePlaySong = (song: Track | SongItem) => {
    const trackObj: Track = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      movieOrAlbum: song.movieOrAlbum,
      year: song.year,
      duration: song.duration,
      cassetteCover: song.cassetteCover,
      genre: song.genre,
      vibe: song.vibe,
      bpm: 120,
      style: 'modern_pop',
      instrument: 'sitar_tumbi',
      youtubePlaylistId: 'playlistId' in song ? song.playlistId : (song as Track).youtubePlaylistId,
      youtubeVideoId: 'youtubeVideoId' in song ? song.youtubeVideoId : (song as Track).youtubeVideoId,
      playlistIndex: 'playlistIndex' in song ? song.playlistIndex : (song as Track).playlistIndex || 0
    };
    onSelectTrack(trackObj);
  };

  const handlePlayRandomSong = () => {
    if (filteredSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length);
      handlePlaySong(filteredSongs[randomIndex]);
    }
  };

  const selectedGenreObj = CASSETTE_GENRES.find(g => g.id === selectedGenre) || CASSETTE_GENRES[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[94vh] bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 rounded-3xl sm:rounded-[2.5rem] p-3.5 sm:p-6 shadow-2xl flex flex-col border border-white/15 overflow-hidden"
        style={{
          boxShadow: `0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px ${activeColorTheme.lightGlowHex}, inset 0 1px 2px rgba(255, 255, 255, 0.25)`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10 shrink-0 gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div 
              className="p-2 sm:p-2.5 rounded-2xl border shadow-md shrink-0"
              style={{
                backgroundColor: activeColorTheme.lightGlowHex,
                borderColor: `${activeColorTheme.accentHex}40`,
                color: activeColorTheme.accentHex
              }}
            >
              <Disc3 className="w-4 h-4 sm:w-6 sm:h-6 animate-spin-slow" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 flex-wrap">
                <span className="px-2 sm:px-2.5 py-0.5 bg-red-600/30 border border-red-500/40 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-300 flex items-center gap-1">
                  <Youtube className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" /> 11 Playlists • 506 Songs
                </span>
                <span 
                  className="hidden md:inline text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold"
                  style={{
                    backgroundColor: activeColorTheme.lightGlowHex,
                    color: activeColorTheme.accentHex,
                    borderColor: `${activeColorTheme.accentHex}40`
                  }}
                >
                  HQ Desi Audio
                </span>
              </div>
              <h2 className="text-xs sm:text-base md:text-lg font-bold font-truck tracking-wide text-white truncate">
                <span className="inline sm:hidden">हाईवे कैसेट लाइब्रेरी (11 Playlists)</span>
                <span className="hidden sm:inline">हाईवे कैसेट रैक (11 Curated Playlists & 500+ Song Catalog)</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 hover:text-white transition-colors shrink-0 shadow-sm"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: TAB SWITCHER + SEARCH + VIEW MODE TOGGLE */}
        <div className="pt-2 sm:pt-3 pb-2 space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 flex-wrap">
            {/* Primary Tab Switcher */}
            <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-950/70 border border-white/15 rounded-xl sm:rounded-2xl shrink-0">
              <button
                onClick={() => setActiveTab('playlists')}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 ${
                  activeTab === 'playlists'
                    ? 'shadow-md ring-1 ring-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={activeTab === 'playlists' ? { backgroundColor: activeColorTheme.accentHex, color: themeTextColor } : undefined}
              >
                <ListMusic className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>11 Playlists</span>
                <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-md ${activeTab === 'playlists' ? 'bg-black/20 text-current font-mono font-bold' : 'bg-white/15 text-white/80'}`}>
                  11
                </span>
              </button>

              <button
                onClick={() => setActiveTab('all_songs')}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 ${
                  activeTab === 'all_songs'
                    ? 'shadow-md ring-1 ring-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={activeTab === 'all_songs' ? { backgroundColor: activeColorTheme.accentHex, color: themeTextColor } : undefined}
              >
                <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>All Songs</span>
                <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-md ${activeTab === 'all_songs' ? 'bg-black/20 text-current font-mono font-bold' : 'bg-white/15 text-white/80'}`}>
                  506
                </span>
              </button>
            </div>

            {/* Quick Actions: Random Shuffle + Card/List View Toggle + Play Station */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
              <button
                onClick={handlePlayRandomSong}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm border"
                style={{
                  backgroundColor: activeColorTheme.lightGlowHex,
                  color: activeColorTheme.accentHex,
                  borderColor: `${activeColorTheme.accentHex}40`
                }}
                title="Play a random track from current filter"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Random</span>
              </button>

              {/* View Mode Toggle: Card Grid vs Dense List */}
              <div className="flex items-center bg-slate-950/70 border border-white/15 p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    viewMode === 'grid'
                      ? 'shadow-sm font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                  style={viewMode === 'grid' ? { backgroundColor: activeColorTheme.accentHex, color: themeTextColor } : undefined}
                  title="Card / Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[11px] px-1 hidden md:inline font-bold">Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    viewMode === 'list'
                      ? 'shadow-sm font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                  style={viewMode === 'list' ? { backgroundColor: activeColorTheme.accentHex, color: themeTextColor } : undefined}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="text-[11px] px-1 hidden md:inline font-bold">List</span>
                </button>
              </div>

              {/* YouTube Live Station Button */}
              <button
                onClick={() => onPlayYouTubePlaylist(DEFAULT_YOUTUBE_PLAYLIST_ID, 0)}
                className="p-1.5 sm:px-3 sm:py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg sm:rounded-xl flex items-center gap-1 shadow-md transition-all active:scale-95 whitespace-nowrap border border-red-400/50"
                title="Play Station #1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden xs:inline">Station #1</span>
              </button>
            </div>
          </div>

          {/* Search Bar + Genre Filter Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search 500+ songs, artists, movies (Kabira, 295, Pasoori, Arijit...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-7 py-1.5 sm:py-2 bg-slate-950/60 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-all shadow-inner"
                style={{
                  caretColor: activeColorTheme.accentHex
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Genre Selector Dropdown Button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all shadow-sm ${
                  selectedGenre !== 'all'
                    ? 'font-bold'
                    : 'bg-slate-950/60 border-white/20 text-white/90 hover:bg-white/10'
                }`}
                style={
                  selectedGenre !== 'all'
                    ? {
                        backgroundColor: activeColorTheme.accentHex,
                        borderColor: activeColorTheme.accentHex,
                        color: themeTextColor
                      }
                    : undefined
                }
              >
                <Filter className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[85px] sm:max-w-[140px] truncate">
                  {selectedGenreObj.name}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ${showGenreDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Genre Dropdown Menu */}
              {showGenreDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowGenreDropdown(false)} 
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 max-h-72 overflow-y-auto custom-scrollbar bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl p-1.5 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] uppercase font-bold text-white/50 px-2.5 py-1 tracking-wider border-b border-white/10 mb-1">
                      Filter by Genre ({CASSETTE_GENRES.length})
                    </div>
                    {CASSETTE_GENRES.map((genre) => {
                      const count = genre.id === 'all' 
                        ? ALL_SONGS.length 
                        : ALL_SONGS.filter(t => t.genre === genre.id).length;
                      const isSelected = selectedGenre === genre.id;

                      return (
                        <button
                          key={genre.id}
                          onClick={() => {
                            setSelectedGenre(genre.id);
                            setShowGenreDropdown(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'font-bold'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                          style={
                            isSelected
                              ? {
                                  backgroundColor: activeColorTheme.accentHex,
                                  color: themeTextColor
                                }
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-sm">{genre.icon}</span>
                            <span className="truncate">{genre.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                              isSelected ? 'bg-black/20 text-current' : 'bg-white/10 text-white/60'
                            }`}>
                              {count}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Clean Genre Pills Rack: Single Horizontal Swipeable Slider to prevent screen crowding */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0 flex-nowrap -mx-1 px-1">
            {CASSETTE_GENRES.map((genre) => {
              const count = genre.id === 'all' 
                ? ALL_SONGS.length 
                : ALL_SONGS.filter(t => t.genre === genre.id).length;
              const isSelected = selectedGenre === genre.id;
              
              return (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    isSelected
                      ? 'shadow-md font-bold'
                      : 'bg-white/5 border border-white/10 text-white/75 hover:bg-white/15 hover:text-white'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: activeColorTheme.accentHex,
                          color: themeTextColor
                        }
                      : undefined
                  }
                >
                  <span>{genre.icon}</span>
                  <span className="whitespace-nowrap">{genre.name}</span>
                  <span className={`text-[9px] px-1 rounded font-mono ${
                    isSelected ? 'bg-black/20 text-current' : 'bg-white/10 text-white/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 11 HIGHWAY PLAYLISTS (CARD VIEW OR LIST VIEW) */}
        {/* ========================================================================= */}
        {activeTab === 'playlists' && (
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1.5 sm:pr-3 mt-1">
            {filteredPlaylists.length === 0 ? (
              <div className="py-16 text-center text-white/60 text-sm font-medium">
                <Music className="w-8 h-8 text-white/30 mx-auto mb-2" />
                No playlists found matching "{searchQuery}".
              </div>
            ) : viewMode === 'grid' ? (
              /* --- PLAYLISTS GRID / CARD VIEW --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-2">
                {filteredPlaylists.map((pl, idx) => {
                  const isCurrentlyPlayingPlaylist = currentTrack.youtubePlaylistId === pl.playlistId;
                  const isExpanded = expandedPlaylistId === pl.id;

                  return (
                    <div
                      key={pl.id}
                      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden ${
                        isCurrentlyPlayingPlaylist
                          ? 'bg-slate-800/90 shadow-xl'
                          : 'bg-slate-950/50 hover:bg-slate-900/80 border-white/15 hover:border-white/30 shadow-md'
                      }`}
                      style={
                        isCurrentlyPlayingPlaylist
                          ? {
                              borderColor: activeColorTheme.accentHex,
                              boxShadow: `0 0 20px ${activeColorTheme.lightGlowHex}`
                            }
                          : undefined
                      }
                    >
                      {/* Card Cover Art Banner */}
                      <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                        <img
                          src={pl.coverImage}
                          alt={pl.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        
                        {/* Station Number Badge */}
                        <div 
                          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/20 font-mono text-[10px] font-bold"
                          style={{ color: activeColorTheme.accentHex }}
                        >
                          TAPE #{idx < 9 ? `0${idx + 1}` : idx + 1}
                        </div>

                        {/* Song Count Badge */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-red-600/90 backdrop-blur-md border border-red-400/40 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                          <Youtube className="w-3 h-3 text-white" /> {pl.songs.length} Tracks
                        </div>

                        {/* Active Playing Pulse Indicator */}
                        {isCurrentlyPlayingPlaylist && isPlaying && (
                          <div 
                            className="absolute bottom-2 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md"
                            style={{
                              backgroundColor: activeColorTheme.accentHex,
                              color: themeTextColor
                            }}
                          >
                            <Volume2 className="w-3 h-3 animate-pulse" /> Active Station
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="font-bold text-sm text-white line-clamp-1 transition-colors">
                            {pl.title}
                          </h3>
                          <p 
                            className="text-xs font-semibold truncate mt-0.5"
                            style={{ color: activeColorTheme.accentHex }}
                          >
                            {pl.hindiTitle}
                          </p>
                          <p className="text-[11px] text-white/60 line-clamp-2 mt-1 italic">
                            {pl.description}
                          </p>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setExpandedPlaylistId(isExpanded ? null : pl.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                              isExpanded
                                ? 'font-bold'
                                : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                            }`}
                            style={
                              isExpanded
                                ? {
                                    backgroundColor: activeColorTheme.accentHex,
                                    color: themeTextColor,
                                    borderColor: activeColorTheme.accentHex
                                  }
                                : undefined
                            }
                          >
                            <Music className="w-3 h-3" />
                            <span>{isExpanded ? 'Hide' : 'View'} Tracks</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <a
                              href={pl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
                              title="Open on YouTube Music"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => onPlayYouTubePlaylist(pl.playlistId, 0, pl.youtubeVideoId)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm transition-transform active:scale-95 ${
                                isCurrentlyPlayingPlaylist && isPlaying
                                  ? ''
                                  : 'bg-red-600 hover:bg-red-500 text-white border-red-400'
                              }`}
                              style={
                                isCurrentlyPlayingPlaylist && isPlaying
                                  ? {
                                      backgroundColor: activeColorTheme.accentHex,
                                      color: themeTextColor,
                                      borderColor: activeColorTheme.accentHex
                                    }
                                  : undefined
                              }
                            >
                              {isCurrentlyPlayingPlaylist && isPlaying ? (
                                <>
                                  <Pause className="w-3 h-3 fill-current" />
                                  <span>Pause</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Play</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* If expanded in grid view, show the songs drawer for this card */}
                      {isExpanded && (
                        <div className="p-3 bg-slate-950 border-t border-white/15 space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                          <div className="text-[10px] text-white/70 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span style={{ color: activeColorTheme.accentHex }}>Tracks ({pl.songs.length})</span>
                            <button
                              onClick={() => handlePlaySong(pl.songs[0])}
                              className="text-[9px] text-white/80 hover:text-white underline"
                            >
                              Play From Start
                            </button>
                          </div>
                          {pl.songs.map((song, sIdx) => {
                            const isCurrent = isSongActive(song);
                            return (
                              <div
                                key={song.id}
                                onClick={() => handlePlaySong(song)}
                                className={`p-2 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${
                                  isCurrent
                                    ? 'font-bold'
                                    : 'bg-white/5 hover:bg-white/10 text-white/80'
                                }`}
                                style={
                                  isCurrent
                                    ? {
                                        backgroundColor: activeColorTheme.accentHex,
                                        color: themeTextColor
                                      }
                                    : undefined
                                }
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="font-mono text-[10px] opacity-60">
                                    {(sIdx + 1) < 10 ? `0${sIdx + 1}` : sIdx + 1}
                                  </span>
                                  <span className="truncate">{song.title}</span>
                                </div>
                                <Play className="w-3 h-3 shrink-0 opacity-75" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* --- PLAYLISTS ACCORDION / LIST VIEW --- */
              <div className="space-y-3 pb-2">
                {filteredPlaylists.map((pl, idx) => {
                  const isCurrentlyPlayingPlaylist = currentTrack.youtubePlaylistId === pl.playlistId;
                  const isExpanded = expandedPlaylistId === pl.id;

                  return (
                    <div
                      key={pl.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isCurrentlyPlayingPlaylist
                          ? 'bg-slate-800/80 shadow-xl'
                          : 'bg-slate-950/50 border-white/15 hover:border-white/30'
                      }`}
                      style={
                        isCurrentlyPlayingPlaylist
                          ? {
                              borderColor: activeColorTheme.accentHex,
                              boxShadow: `0 0 20px ${activeColorTheme.lightGlowHex}`
                            }
                          : undefined
                      }
                    >
                      {/* Playlist Header Row */}
                      <div 
                        onClick={() => setExpandedPlaylistId(isExpanded ? null : pl.id)}
                        className="p-3 sm:p-3.5 cursor-pointer flex items-center justify-between gap-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-mono text-white/50 w-5 text-center font-bold">
                            {idx < 9 ? `0${idx + 1}` : idx + 1}
                          </span>

                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-white/20 shrink-0 shadow-md">
                            <img
                              src={pl.coverImage}
                              alt={pl.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {isCurrentlyPlayingPlaylist && isPlaying && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full animate-ping"
                                  style={{ backgroundColor: activeColorTheme.accentHex }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                {pl.title}
                              </h4>
                              <span className="text-[9px] bg-red-600/90 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <Youtube className="w-2.5 h-2.5" /> {pl.songs.length} Tracks
                              </span>
                              {isCurrentlyPlayingPlaylist && (
                                <span 
                                  className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"
                                  style={{
                                    backgroundColor: activeColorTheme.accentHex,
                                    color: themeTextColor
                                  }}
                                >
                                  <Volume2 className="w-2.5 h-2.5 animate-pulse" /> Active Station
                                </span>
                              )}
                            </div>
                            <p 
                              className="text-[11px] font-semibold truncate mt-0.5"
                              style={{ color: activeColorTheme.accentHex }}
                            >
                              {pl.hindiTitle} • <span className="text-white/70 font-normal">{pl.subtitle}</span>
                            </p>
                          </div>
                        </div>

                        {/* Right Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPlaylistId(isExpanded ? null : pl.id);
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
                              isExpanded 
                                ? 'font-bold'
                                : 'bg-white/10 hover:bg-white/20 text-white/90 border-white/15'
                            }`}
                            style={
                              isExpanded
                                ? {
                                    backgroundColor: activeColorTheme.accentHex,
                                    color: themeTextColor,
                                    borderColor: activeColorTheme.accentHex
                                  }
                                : undefined
                            }
                          >
                            <Music className="w-3 h-3" />
                            <span className="hidden xs:inline">{isExpanded ? 'Hide' : 'All Songs'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlayYouTubePlaylist(pl.playlistId, 0, pl.youtubeVideoId);
                            }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 border ${
                              isCurrentlyPlayingPlaylist && isPlaying
                                ? ''
                                : 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-md'
                            }`}
                            style={
                              isCurrentlyPlayingPlaylist && isPlaying
                                ? {
                                    backgroundColor: activeColorTheme.accentHex,
                                    color: themeTextColor,
                                    borderColor: activeColorTheme.accentHex
                                  }
                                : undefined
                            }
                            title="Stream Full Playlist"
                          >
                            {isCurrentlyPlayingPlaylist && isPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Songs in List View */}
                      {isExpanded && (
                        <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-white/10 space-y-2">
                          <div className="text-[10px] text-white/70 uppercase tracking-widest font-bold px-2 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 mb-1 bg-white/5 rounded-lg">
                            <span 
                              className="font-black flex items-center gap-1.5"
                              style={{ color: activeColorTheme.accentHex }}
                            >
                              <Sparkles className="w-3.5 h-3.5" /> ALL SONGS IN THIS PLAYLIST ({pl.songs.length} SONGS)
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (pl.songs.length > 0) handlePlaySong(pl.songs[0]);
                              }}
                              className="px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                              style={{
                                backgroundColor: activeColorTheme.lightGlowHex,
                                color: activeColorTheme.accentHex,
                                borderColor: `${activeColorTheme.accentHex}40`
                              }}
                            >
                              <Play className="w-2.5 h-2.5 fill-current" /> Play From #1
                            </button>
                          </div>

                          <div className="space-y-1.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-2 sm:pr-3">
                            {pl.songs.map((song, sIdx) => {
                              const isCurrentSongActive = isSongActive(song);
                              const minutes = Math.floor(song.duration / 60);
                              const seconds = song.duration % 60;
                              const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                              return (
                                <div
                                  key={song.id}
                                  onClick={() => handlePlaySong(song)}
                                  className={`p-2 sm:p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-3 text-xs transition-all border group ${
                                    isCurrentSongActive
                                      ? 'text-white font-bold shadow-md'
                                      : 'bg-white/5 hover:bg-white/10 text-white/85 border-transparent hover:border-white/10'
                                  }`}
                                  style={
                                    isCurrentSongActive
                                      ? {
                                          backgroundColor: activeColorTheme.lightGlowHex,
                                          borderColor: `${activeColorTheme.accentHex}80`,
                                          boxShadow: `0 0 12px ${activeColorTheme.lightGlowHex}`
                                        }
                                      : undefined
                                  }
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="font-mono text-white/50 text-[11px] w-6 text-center font-bold">
                                      {(sIdx + 1) < 10 ? `0${sIdx + 1}` : sIdx + 1}
                                    </span>

                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/50 border border-white/20 shrink-0">
                                      <img
                                        src={song.cassetteCover}
                                        alt={song.title}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                      />
                                      {isCurrentSongActive && isPlaying && (
                                        <div 
                                          className="absolute inset-0 flex items-center justify-center"
                                          style={{ backgroundColor: activeColorTheme.lightGlowHex }}
                                        >
                                          <span 
                                            className="w-2 h-2 rounded-full animate-ping"
                                            style={{ backgroundColor: activeColorTheme.accentHex }}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-white truncate text-xs sm:text-[13px]">
                                          {song.title}
                                        </span>
                                        {isCurrentSongActive && (
                                          <span 
                                            className="text-[8px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider"
                                            style={{
                                              backgroundColor: activeColorTheme.accentHex,
                                              color: themeTextColor
                                            }}
                                          >
                                            {isPlaying ? 'Playing' : 'Paused'}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-white/65 text-[10.5px] truncate mt-0.5">
                                        {song.artist} <span className="font-semibold" style={{ color: activeColorTheme.accentHex }}>• {song.movieOrAlbum} ({song.year})</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2.5 shrink-0">
                                    <span className="text-[10px] text-white/50 font-mono hidden sm:inline">
                                      {formattedDuration}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePlaySong(song);
                                      }}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 border ${
                                        isCurrentSongActive && isPlaying
                                          ? ''
                                          : 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-sm'
                                      }`}
                                      style={
                                        isCurrentSongActive && isPlaying
                                          ? {
                                              backgroundColor: activeColorTheme.accentHex,
                                              color: themeTextColor,
                                              borderColor: activeColorTheme.accentHex
                                            }
                                          : undefined
                                      }
                                    >
                                      {isCurrentSongActive && isPlaying ? (
                                        <Pause className="w-3 h-3 fill-current" />
                                      ) : (
                                        <Play className="w-3 h-3 fill-current ml-0.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ALL SONGS (CARD GRID VIEW OR LIST VIEW WITH CHUNK-WISE STREAMING) */}
        {/* ========================================================================= */}
        {activeTab === 'all_songs' && (() => {
          const totalCount = filteredSongs.length;
          const maxChunks = Math.ceil(totalCount / CHUNK_SIZE) || 1;
          const visibleSongs = filteredSongs.slice(0, visibleChunkCount * CHUNK_SIZE);
          const hasMoreChunks = visibleSongs.length < totalCount;
          const loadedChunkPercentage = totalCount > 0 ? Math.round((visibleSongs.length / totalCount) * 100) : 100;

          return (
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1.5 sm:pr-3 mt-1 flex flex-col justify-between">
              {totalCount === 0 ? (
                <div className="py-16 text-center text-white/60 text-sm font-medium">
                  <Music className="w-8 h-8 text-white/30 mx-auto mb-2" />
                  No songs found matching "{searchQuery}".
                </div>
              ) : (
                <>
                  {/* Chunk Stream Buffer Header */}
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1 sm:py-1.5 mb-2 bg-slate-950/70 border border-white/10 rounded-xl text-[10px] sm:text-[11px] shrink-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span 
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shrink-0" 
                        style={{ backgroundColor: activeColorTheme.accentHex }} 
                      />
                      <span className="text-white/80 font-medium truncate">
                        Catalog: <span className="font-bold text-white">{visibleSongs.length}</span> of <span className="font-bold text-white">{totalCount}</span> songs
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex items-center w-20 h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${loadedChunkPercentage}%`,
                            backgroundColor: activeColorTheme.accentHex
                          }}
                        />
                      </div>
                      <span className="font-mono text-[9px] sm:text-[10px] text-white/60">
                        {loadedChunkPercentage}% loaded
                      </span>
                    </div>
                  </div>

                  {viewMode === 'grid' ? (
                    /* --- ALL SONGS CARD / GRID VIEW --- */
                    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 pb-2">
                      {visibleSongs.map((song, idx) => {
                        const isCurrentlyPlaying = isSongActive(song);
                        const minutes = Math.floor(song.duration / 60);
                        const seconds = song.duration % 60;
                        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                        return (
                          <div
                            key={song.id}
                            onClick={() => handlePlaySong(song)}
                            className={`group relative rounded-2xl p-2 sm:p-2.5 cursor-pointer transition-all duration-200 flex flex-col justify-between border ${
                              isCurrentlyPlaying
                                ? 'bg-slate-800/90 text-white shadow-xl scale-[1.01]'
                                : 'bg-slate-950/60 hover:bg-slate-900/90 border-white/10 hover:border-white/30 text-white/90 shadow-md hover:-translate-y-0.5'
                            }`}
                            style={
                              isCurrentlyPlaying
                                ? {
                                    borderColor: activeColorTheme.accentHex,
                                    boxShadow: `0 0 20px ${activeColorTheme.lightGlowHex}`
                                  }
                                : undefined
                            }
                          >
                            {/* Album Cover */}
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-white/20 shadow-md">
                              <img
                                src={song.cassetteCover}
                                alt={song.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              
                              {/* Index Badge */}
                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded bg-slate-950/80 backdrop-blur-md text-[8px] sm:text-[9px] font-mono text-white/70 font-bold border border-white/15">
                                {(idx + 1) < 10 ? `0${idx + 1}` : idx + 1}
                              </div>

                              {/* Duration Badge */}
                              <div 
                                className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded bg-slate-950/80 backdrop-blur-md text-[8px] sm:text-[9px] font-mono font-bold border border-white/15"
                                style={{ color: activeColorTheme.accentHex }}
                              >
                                {formattedDuration}
                              </div>

                              {/* Quick Hover / Active Play Button Overlay */}
                              <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center transition-opacity ${
                                isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              }`}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlaySong(song);
                                  }}
                                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90 border ${
                                    isCurrentlyPlaying && isPlaying
                                      ? 'scale-105'
                                      : 'bg-red-600 hover:bg-red-500 text-white border-red-400 group-hover:scale-105'
                                  }`}
                                  style={
                                    isCurrentlyPlaying && isPlaying
                                      ? {
                                          backgroundColor: activeColorTheme.accentHex,
                                          color: themeTextColor,
                                          borderColor: activeColorTheme.accentHex
                                        }
                                      : undefined
                                  }
                                >
                                  {isCurrentlyPlaying && isPlaying ? (
                                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Track Details */}
                            <div className="mt-2 flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <h4 className="text-xs sm:text-[13px] font-bold text-white truncate transition-colors">
                                  {song.title}
                                </h4>
                                <p 
                                  className="text-[10px] sm:text-[11px] font-semibold truncate mt-0.5"
                                  style={{ color: activeColorTheme.accentHex }}
                                >
                                  {song.artist}
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-white/50 truncate">
                                  {song.movieOrAlbum} ({song.year})
                                </p>
                              </div>

                              <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px]">
                                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-white/70 truncate max-w-[75px] sm:max-w-[85px]">
                                  {song.vibe.split(' ')[0] || 'Highway'}
                                </span>
                                {isCurrentlyPlaying && (
                                  <span 
                                    className="font-black flex items-center gap-0.5 text-[8px]"
                                    style={{ color: activeColorTheme.accentHex }}
                                  >
                                    <Volume2 className="w-2.5 h-2.5 animate-pulse" /> LIVE
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* --- ALL SONGS COMPACT LIST VIEW --- */
                    <div className="space-y-1 sm:space-y-1.5 pb-2">
                      {visibleSongs.map((song, idx) => {
                        const isCurrentlyPlaying = isSongActive(song);
                        const minutes = Math.floor(song.duration / 60);
                        const seconds = song.duration % 60;
                        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                        return (
                          <div
                            key={song.id}
                            onClick={() => handlePlaySong(song)}
                            className={`p-1.5 sm:p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2 sm:gap-3 text-xs transition-all border group ${
                              isCurrentlyPlaying
                                ? 'text-white font-bold shadow-md'
                                : 'bg-white/5 hover:bg-white/10 text-white/85 border-transparent hover:border-white/10'
                            }`}
                            style={
                              isCurrentlyPlaying
                                ? {
                                    backgroundColor: activeColorTheme.lightGlowHex,
                                    borderColor: `${activeColorTheme.accentHex}80`,
                                    boxShadow: `0 0 12px ${activeColorTheme.lightGlowHex}`
                                  }
                                : undefined
                            }
                          >
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <span className="font-mono text-white/50 text-[10px] sm:text-[11px] w-5 sm:w-6 text-center font-bold shrink-0">
                                {(idx + 1) < 10 ? `0${idx + 1}` : idx + 1}
                              </span>

                              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-black/50 border border-white/20 shrink-0">
                                <img
                                  src={song.cassetteCover}
                                  alt={song.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                {isCurrentlyPlaying && isPlaying && (
                                  <div 
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ backgroundColor: activeColorTheme.lightGlowHex }}
                                  >
                                    <span 
                                      className="w-2 h-2 rounded-full animate-ping"
                                      style={{ backgroundColor: activeColorTheme.accentHex }}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white truncate text-xs sm:text-[13px]">
                                    {song.title}
                                  </span>
                                  {isCurrentlyPlaying && (
                                    <span 
                                      className="text-[8px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider shrink-0"
                                      style={{
                                        backgroundColor: activeColorTheme.accentHex,
                                        color: themeTextColor
                                      }}
                                    >
                                      {isPlaying ? 'Playing' : 'Paused'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/65 text-[10px] sm:text-[10.5px] truncate mt-0.5">
                                  {song.artist} <span className="font-semibold" style={{ color: activeColorTheme.accentHex }}>• {song.movieOrAlbum} ({song.year})</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                              <span className="text-[10px] text-white/50 font-mono hidden sm:inline">
                                {formattedDuration}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlaySong(song);
                                }}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 border shrink-0 ${
                                  isCurrentlyPlaying && isPlaying
                                    ? ''
                                    : 'bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-sm'
                                }`}
                                style={
                                  isCurrentlyPlaying && isPlaying
                                    ? {
                                        backgroundColor: activeColorTheme.accentHex,
                                        color: themeTextColor,
                                        borderColor: activeColorTheme.accentHex
                                      }
                                    : undefined
                                }
                              >
                                {isCurrentlyPlaying && isPlaying ? (
                                  <Pause className="w-3 h-3 fill-current" />
                                ) : (
                                  <Play className="w-3 h-3 fill-current ml-0.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Progressive Chunk Loader Footer */}
                  {hasMoreChunks && (
                    <div className="my-2.5 sm:my-3 pt-2 sm:pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-950/80 p-2.5 sm:p-3 rounded-2xl border border-white/15 shrink-0">
                      <div className="text-[11px] sm:text-xs text-white/75 text-center sm:text-left">
                        Displaying <span className="font-bold text-white">{visibleSongs.length}</span> of <span className="font-bold text-white">{totalCount}</span> tracks
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setVisibleChunkCount(prev => prev + 1)}
                          className="flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1.5 border"
                          style={{
                            backgroundColor: activeColorTheme.lightGlowHex,
                            borderColor: `${activeColorTheme.accentHex}60`,
                            color: activeColorTheme.accentHex
                          }}
                        >
                          <span>Load Next (+{Math.min(CHUNK_SIZE, totalCount - visibleSongs.length)})</span>
                        </button>

                        <button
                          onClick={() => setVisibleChunkCount(maxChunks)}
                          className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 transition-colors"
                        >
                          All ({totalCount})
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
