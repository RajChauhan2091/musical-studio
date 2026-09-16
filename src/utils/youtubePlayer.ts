/**
 * YouTube IFrame Audio Player Controller
 * Enables real streaming playback for YouTube Music & YouTube Playlists
 * (such as playlist PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4 and trending singles)
 */

export interface YouTubePlayerState {
  isReady: boolean;
  isPlaying: boolean;
  isBuffering?: boolean;
  hasEnded?: boolean;
  hasError?: boolean;
  currentTime: number;
  duration: number;
  loadedFraction: number; // 0.0 - 1.0 (buffer chunk progress)
  bufferedPercent: number; // 0 - 100%
  bufferedSeconds: number;
  currentChunkIndex?: number;
  currentTitle?: string;
  currentAuthor?: string;
  currentVideoId?: string;
}

class YouTubePlayerController {
  private player: any = null;
  private isReady: boolean = false;
  private isPlaying: boolean = false;
  private isBuffering: boolean = false;
  private hasEnded: boolean = false;
  private currentVideoId: string | null = null;
  private currentPlaylistId: string | null = null;
  private pendingAction: (() => void) | null = null;
  private pollInterval: any = null;
  private listeners: ((state: YouTubePlayerState) => void)[] = [];
  private volume: number = 85;
  private isMuted: boolean = false;
  private errorCount: number = 0;
  private lastLoadedFraction: number = 0;
  private playRequestDebounceTimer: any = null;
  private containerId: string = 'yt-audio-container';
  private visualDisplayConfig: {
    visible: boolean;
    rect?: { top: number; left: number; width: number; height: number };
    mode?: 'theater' | 'pip' | 'fullscreen';
    borderRadius?: string;
  } = { visible: false };

  constructor() {
    // Lazy init via loadAPI
  }

  public initAPI(containerId: string = 'yt-audio-container'): Promise<void> {
    this.containerId = containerId;
    return new Promise((resolve) => {
      if (this.player && this.isReady) {
        resolve();
        return;
      }

      // Ensure container exists outside of React tree in document.body with valid rendering area
      let elem = document.getElementById(containerId);
      if (!elem) {
        elem = document.createElement('div');
        elem.id = containerId;
        elem.style.position = 'fixed';
        elem.style.bottom = '0px';
        elem.style.right = '0px';
        elem.style.width = '240px';
        elem.style.height = '180px';
        elem.style.opacity = '0.001';
        elem.style.pointerEvents = 'none';
        elem.style.zIndex = '-9999';
        elem.style.overflow = 'hidden';
        document.body.appendChild(elem);
      }

      // Check if API script is already added
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubeIframeAPIReady = () => {
          this.createPlayer(containerId, resolve);
        };
      } else if ((window as any).YT && (window as any).YT.Player) {
        this.createPlayer(containerId, resolve);
      } else {
        // Wait briefly if script is loading
        const checkInterval = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(checkInterval);
            this.createPlayer(containerId, resolve);
          }
        }, 100);
      }
    });
  }

  private createPlayer(containerId: string, onDone: () => void) {
    if (this.player) {
      onDone();
      return;
    }

    try {
      this.player = new (window as any).YT.Player(containerId, {
        height: '180',
        width: '240',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            this.isReady = true;
            this.player.setVolume(this.volume);
            if (this.isMuted) {
              this.player.mute();
            } else {
              this.player.unMute();
            }
            this.startPolling();
            if (this.pendingAction) {
              const action = this.pendingAction;
              this.pendingAction = null;
              action();
            }
            onDone();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
            const stateCode = event.data;
            if (stateCode === 1) {
              this.isPlaying = true;
              this.isBuffering = false;
              this.hasEnded = false;
              this.errorCount = 0;
              this.notify();
            } else if (stateCode === 0) {
              this.isPlaying = false;
              this.isBuffering = false;
              this.hasEnded = true;
              this.notify();
              this.hasEnded = false;
            } else if (stateCode === 2) {
              this.isPlaying = false;
              this.isBuffering = false;
              this.notify();
            } else if (stateCode === 3) {
              this.isBuffering = true;
              this.hasEnded = false;
              this.notify();
            } else if (stateCode === 5) {
              // Cued / chunk loaded
              this.isBuffering = false;
              this.notify();
            }
          },
          onError: (e: any) => {
            console.warn('YouTube Player stream notice (code ' + e?.data + ')');
            this.errorCount++;
            this.isBuffering = false;
            // Notify subscribers without crashing or switching to synth beeps
            this.notify(true);
          }
        }
      });
    } catch (err) {
      console.warn('Error creating YouTube player:', err);
      onDone();
    }
  }

  /**
   * Progressive Chunk-Wise Video Stream Loader
   * Debounces fast clicks and immediately loads initial audio chunk
   */
  public async playVideo(videoId: string) {
    if (!videoId) return;
    this.currentVideoId = videoId;
    this.currentPlaylistId = null;
    this.isBuffering = true;
    this.hasEnded = false;
    this.notify();

    if (this.playRequestDebounceTimer) {
      clearTimeout(this.playRequestDebounceTimer);
    }

    if (!this.isReady || !this.player) {
      this.pendingAction = () => this.playVideo(videoId);
      await this.initAPI();
      return;
    }

    this.playRequestDebounceTimer = setTimeout(() => {
      try {
        if (typeof this.player.loadVideoById === 'function') {
          // Request chunk 1 with progressive streaming
          this.player.loadVideoById({
            videoId: videoId,
            startSeconds: 0,
            suggestedQuality: 'small'
          });
          if (typeof this.player.unMute === 'function' && !this.isMuted) {
            this.player.unMute();
          }
          this.player.playVideo();
          this.isPlaying = true;
          this.isBuffering = true;
          this.hasEnded = false;
          this.notify();
        }
      } catch (err) {
        console.warn('Playback error in playVideo:', err);
        this.notify(true);
      }
    }, 40);
  }

  /**
   * Progressive Chunk-Wise Playlist Stream Loader
   */
  public async playPlaylist(playlistId: string, startIndex: number = 0) {
    if (!playlistId) return;
    const isSamePlaylist = this.currentPlaylistId === playlistId;
    this.currentPlaylistId = playlistId;
    this.isBuffering = true;
    this.hasEnded = false;
    this.notify();

    if (this.playRequestDebounceTimer) {
      clearTimeout(this.playRequestDebounceTimer);
    }

    if (!this.isReady || !this.player) {
      this.pendingAction = () => this.playPlaylist(playlistId, startIndex);
      await this.initAPI();
      return;
    }

    this.playRequestDebounceTimer = setTimeout(() => {
      try {
        if (isSamePlaylist && typeof this.player.playVideoAt === 'function') {
          try {
            this.player.playVideoAt(startIndex);
            this.isPlaying = true;
            this.isBuffering = true;
            this.hasEnded = false;
            this.notify();
            return;
          } catch (e) {
            // fallback to loadPlaylist
          }
        }

        if (typeof this.player.loadPlaylist === 'function') {
          this.player.loadPlaylist({
            list: playlistId,
            listType: 'playlist',
            index: startIndex,
            suggestedQuality: 'small'
          });
          if (typeof this.player.unMute === 'function' && !this.isMuted) {
            this.player.unMute();
          }
          this.player.playVideo();
          this.isPlaying = true;
          this.isBuffering = true;
          this.hasEnded = false;
          this.notify();
        }
      } catch (err) {
        console.warn('Playback error in playPlaylist:', err);
        this.notify(true);
      }
    }, 40);
  }

  public pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
        this.isPlaying = false;
        this.isBuffering = false;
        this.notify();
      } catch (e) {}
    }
  }

  public resume() {
    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        if (typeof this.player.unMute === 'function' && !this.isMuted) {
          this.player.unMute();
        }
        this.player.playVideo();
        this.isPlaying = true;
        this.notify();
      } catch (e) {}
    }
  }

  public stop() {
    if (this.player && typeof this.player.stopVideo === 'function') {
      try {
        this.player.stopVideo();
        this.isPlaying = false;
        this.isBuffering = false;
        this.notify();
      } catch (e) {}
    }
  }

  public nextTrack() {
    if (this.player && typeof this.player.nextVideo === 'function') {
      try {
        this.player.nextVideo();
      } catch (e) {}
    }
  }

  public prevTrack() {
    if (this.player && typeof this.player.previousVideo === 'function') {
      try {
        this.player.previousVideo();
      } catch (e) {}
    }
  }

  public seekTo(seconds: number) {
    if (this.player && typeof this.player.seekTo === 'function') {
      try {
        this.player.seekTo(seconds, true);
      } catch (e) {}
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.round(vol * 100);
    if (this.player && typeof this.player.setVolume === 'function') {
      try {
        this.player.setVolume(this.volume);
      } catch (e) {}
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.player) {
      try {
        if (muted && typeof this.player.mute === 'function') {
          this.player.mute();
        } else if (!muted && typeof this.player.unMute === 'function') {
          this.player.unMute();
        }
      } catch (e) {}
    }
  }

  public getCurrentTime(): number {
    if (this.player && typeof this.player.getCurrentTime === 'function') {
      try {
        return this.player.getCurrentTime() || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  public getDuration(): number {
    if (this.player && typeof this.player.getDuration === 'function') {
      try {
        return this.player.getDuration() || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  /**
   * Returns current chunk buffer fraction (0.0 to 1.0)
   */
  public getVideoLoadedFraction(): number {
    if (this.player && typeof this.player.getVideoLoadedFraction === 'function') {
      try {
        const fraction = this.player.getVideoLoadedFraction() || 0;
        this.lastLoadedFraction = fraction;
        return fraction;
      } catch (e) {
        return this.lastLoadedFraction;
      }
    }
    return this.lastLoadedFraction;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Adjusts the YouTube Player iframe geometry and display mode.
   * Enables watching real music videos on the main screen in theater/PiP/fullscreen modes.
   */
  public setVisualDisplay(config: {
    visible: boolean;
    rect?: { top: number; left: number; width: number; height: number };
    mode?: 'theater' | 'pip' | 'fullscreen';
    borderRadius?: string;
  }) {
    this.visualDisplayConfig = config;
    const elem = document.getElementById(this.containerId);
    if (!elem) return;

    if (!config.visible || !config.rect) {
      elem.style.position = 'fixed';
      elem.style.top = 'auto';
      elem.style.left = 'auto';
      elem.style.bottom = '0px';
      elem.style.right = '0px';
      elem.style.width = '240px';
      elem.style.height = '180px';
      elem.style.opacity = '0.001';
      elem.style.pointerEvents = 'none';
      elem.style.zIndex = '-9999';
      elem.style.borderRadius = '0px';
      elem.style.boxShadow = 'none';
      elem.style.border = 'none';
      elem.style.transform = 'none';
    } else {
      elem.style.position = 'fixed';
      elem.style.top = `${config.rect.top}px`;
      elem.style.left = `${config.rect.left}px`;
      elem.style.width = `${config.rect.width}px`;
      elem.style.height = `${config.rect.height}px`;
      elem.style.bottom = 'auto';
      elem.style.right = 'auto';
      elem.style.opacity = '1';
      elem.style.pointerEvents = 'auto';
      elem.style.zIndex = '45';
      elem.style.borderRadius = config.borderRadius || '16px';
      elem.style.overflow = 'hidden';
      elem.style.backgroundColor = '#000000';
    }
  }

  public getVisualDisplay() {
    return this.visualDisplayConfig;
  }

  public subscribe(cb: (state: YouTubePlayerState) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify(hasError: boolean = false) {
    const videoData = this.player?.getVideoData?.() || {};
    const curTime = this.getCurrentTime();
    const dur = this.getDuration();
    const loadedFrac = this.getVideoLoadedFraction();
    const bufferedPercent = Math.min(100, Math.max(0, Math.round(loadedFrac * 100)));
    const bufferedSecs = dur > 0 ? loadedFrac * dur : 0;
    const currentChunkIdx = Math.floor(curTime / 15) + 1;

    const state: YouTubePlayerState = {
      isReady: this.isReady,
      isPlaying: this.isPlaying,
      isBuffering: this.isBuffering,
      hasEnded: this.hasEnded,
      hasError: hasError,
      currentTime: curTime,
      duration: dur,
      loadedFraction: loadedFrac,
      bufferedPercent: bufferedPercent,
      bufferedSeconds: bufferedSecs,
      currentChunkIndex: currentChunkIdx,
      currentTitle: videoData.title || undefined,
      currentAuthor: videoData.author || undefined,
      currentVideoId: videoData.video_id || undefined
    };

    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (e) {}
    });
  }

  private startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      if (this.isPlaying || this.isBuffering) {
        this.notify();
      }
    }, 200);
  }

  public extractPlaylistOrVideoId(url: string): { type: 'playlist' | 'video' | null; id: string | null } {
    if (!url) return { type: null, id: null };

    const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (playlistMatch && playlistMatch[1]) {
      return { type: 'playlist', id: playlistMatch[1] };
    }

    const videoMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
    if (videoMatch && videoMatch[1]) {
      return { type: 'video', id: videoMatch[1] };
    }

    if (url.length >= 11 && !url.includes('/') && !url.includes('.')) {
      if (url.startsWith('PL') || url.startsWith('RD') || url.startsWith('OLAK')) {
        return { type: 'playlist', id: url };
      }
      return { type: 'video', id: url };
    }

    return { type: null, id: null };
  }
}

export const youtubePlayer = new YouTubePlayerController();
