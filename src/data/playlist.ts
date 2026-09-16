import { 
  PLAYLIST_1_SONGS, 
  PLAYLIST_2_SONGS,
  PLAYLIST_3_SONGS, 
  PLAYLIST_4_SONGS,
  PLAYLIST_5_SONGS, 
  PLAYLIST_6_SONGS,
  PLAYLIST_7_SONGS, 
  PLAYLIST_8_SONGS,
  PLAYLIST_9_SONGS, 
  PLAYLIST_10_SONGS, 
  PLAYLIST_11_SONGS 
} from './songs';

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  movieOrAlbum: string;
  year: string;
  duration: number;
  cassetteCover: string;
  genre: string;
  vibe: string;
  playlistId?: string;
  youtubeVideoId?: string;
  playlistIndex: number;
}

export interface PlaylistItem {
  id: string;
  playlistId: string;
  youtubeVideoId?: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  description: string;
  url: string;
  coverImage: string;
  genre: 'highway_bollywood' | 'punjabi_express' | 'desi_drive' | 'superhits' | '90s_nostalgia' | '00s_party' | '10s_bangers' | 'romantic_melodies' | 'punjabi_bangers' | 'indie_coke_studio' | 'midnight_lofi';
  genreLabel: string;
  vibe: string;
  songs: SongItem[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  movieOrAlbum: string;
  year: string;
  duration: number; // in seconds
  cassetteCover: string;
  genre: string;
  vibe: string;
  bpm: number;
  style: 'bollywood_90s' | 'lofi' | 'punjabi' | 'ghazal' | 'acoustic_roadtrip' | 'modern_pop';
  instrument: 'harmonium' | 'flute' | 'sitar_tumbi' | 'guitar' | 'synth_lead' | 'rhodes_lofi';
  youtubePlaylistId?: string;
  youtubeVideoId?: string;
  playlistIndex?: number;
}

// 11 Complete Curated Highway Playlists with 506 Distinct, Non-Repeating Tracks
export const USER_PLAYLISTS: PlaylistItem[] = [
  {
    id: 'playlist-1',
    playlistId: 'PLNpX_wbJbbl3WoNR8HZent1yNNOQVgpPj',
    title: 'Highway Hits & Bollywood Melodies',
    hindiTitle: 'हाईवे हिट्स और बॉलीवुड धुनें',
    subtitle: 'Curated Highway Tape 1',
    description: 'The ultimate Hindi highway playlist with trending Bollywood road trip songs',
    url: 'https://music.youtube.com/playlist?list=PLNpX_wbJbbl3WoNR8HZent1yNNOQVgpPj&si=7xsuJ-QkVhEh5Aeg',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    genre: 'highway_bollywood',
    genreLabel: 'Highway Bollywood',
    vibe: 'Pure highway cruising vibes with melodious Bollywood tunes',
    songs: PLAYLIST_1_SONGS.map(s => ({ ...s, playlistId: 'PLNpX_wbJbbl3WoNR8HZent1yNNOQVgpPj' }))
  },
  {
    id: 'playlist-2',
    playlistId: 'PLbkAv_1W3Fj13VbIjGmdroAyv1BBSr8Kh',
    title: 'Ultimate Punjabi & Roadtrip Mix',
    hindiTitle: 'अल्टीमेट पंजाबी और रोडट्रिप मिक्स',
    subtitle: 'Curated Highway Tape 2',
    description: 'High-octane GT Road Punjabi beats, dholak rhythms and truck driver anthems',
    url: 'https://music.youtube.com/playlist?list=PLbkAv_1W3Fj13VbIjGmdroAyv1BBSr8Kh&si=RQzrpTm0i-Tze6Vl',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    genre: 'punjabi_express',
    genreLabel: 'Punjabi Express',
    vibe: 'Heavy dhol and turbocharged Punjabi road energy',
    songs: PLAYLIST_2_SONGS.map(s => ({ ...s, playlistId: 'PLbkAv_1W3Fj13VbIjGmdroAyv1BBSr8Kh' }))
  },
  {
    id: 'playlist-3',
    playlistId: 'PL0KsqW7V9vI3tB7kM1xRkU4_r_oK-bZ1r',
    title: 'Desi Drive & Dhabha Beats',
    hindiTitle: 'देसी ड्राइव और ढाबा बीट्स',
    subtitle: 'Curated Highway Tape 3',
    description: 'Soulful dhabha chai stops and midnight open asphalt vibes',
    url: 'https://music.youtube.com/playlist?list=PL0KsqW7V9vI3tB7kM1xRkU4_r_oK-bZ1r',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
    genre: 'desi_drive',
    genreLabel: 'Desi Drive',
    vibe: 'Raw acoustic melodies, soulful vocals and midnight highway warmth',
    songs: PLAYLIST_3_SONGS.map(s => ({ ...s, playlistId: 'PL0KsqW7V9vI3tB7kM1xRkU4_r_oK-bZ1r' }))
  },
  {
    id: 'playlist-4',
    playlistId: 'PLNpX_wbJbbl0X8z5UqYvJqR9Z_w3mK_2p',
    title: 'All-Time Highway Superhits',
    hindiTitle: 'ऑल-टाइम हाईवे सुपरहिट्स',
    subtitle: 'Curated Highway Tape 4',
    description: 'The definitive collection of timeless Hindi highway & travel superhits',
    url: 'https://music.youtube.com/playlist?list=PLNpX_wbJbbl0X8z5UqYvJqR9Z_w3mK_2p',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    genre: 'superhits',
    genreLabel: 'Superhits',
    vibe: 'Sing-along chorus and universal road anthems for every journey',
    songs: PLAYLIST_4_SONGS.map(s => ({ ...s, playlistId: 'PLNpX_wbJbbl0X8z5UqYvJqR9Z_w3mK_2p' }))
  },
  {
    id: 'playlist-5',
    playlistId: 'PL90s_Nostalgia_Golden_Pop_Tape',
    title: '90s Cassette Nostalgia & Golden Pop',
    hindiTitle: '90s कैसेट नॉस्टेल्जिया',
    subtitle: 'Curated Highway Tape 5',
    description: 'Gold-era T-Series cassette tracks, Nadeem-Shravan hits, Kumar Sanu & Alka Yagnik classics',
    url: 'https://music.youtube.com/playlist?list=PL90s_Nostalgia_Golden_Pop_Tape',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    genre: '90s_nostalgia',
    genreLabel: '90s Nostalgia',
    vibe: 'Vintage magnetic tape warmth with harmonium, dholak and pure melodic romance',
    songs: PLAYLIST_5_SONGS.map(s => ({ ...s, playlistId: 'PL90s_Nostalgia_Golden_Pop_Tape' }))
  },
  {
    id: 'playlist-6',
    playlistId: 'PL00s_Bollywood_Party_Highway',
    title: '2000s Bollywood Party & High Speed',
    hindiTitle: '2000s बॉलीवुड पार्टी स्पीड',
    subtitle: 'Curated Highway Tape 6',
    description: 'Pritam, Vishal-Shekhar, Shankar-Ehsaan-Loy high tempo bangers and wedding dancefloor anthems',
    url: 'https://music.youtube.com/playlist?list=PL00s_Bollywood_Party_Highway',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    genre: '00s_party',
    genreLabel: '00s Party',
    vibe: 'High tempo, brass horns, disco beats and unstoppable highway party energy',
    songs: PLAYLIST_6_SONGS.map(s => ({ ...s, playlistId: 'PL00s_Bollywood_Party_Highway' }))
  },
  {
    id: 'playlist-7',
    playlistId: 'PL10s_EDM_Bass_Bangers_Highway',
    title: '2010s Bollywood EDM & Bass Bangers',
    hindiTitle: '2010s ईडीएम और बास बैंगर्स',
    subtitle: 'Curated Highway Tape 7',
    description: 'Club drops, Badshah raps, Honey Singh anthems and festival EDM Bollywood remixes',
    url: 'https://music.youtube.com/playlist?list=PL10s_EDM_Bass_Bangers_Highway',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    genre: '10s_bangers',
    genreLabel: '10s Bangers',
    vibe: 'Earth-shaking subwoofers, heavy synth drops and explosive festival dance rhythms',
    songs: PLAYLIST_7_SONGS.map(s => ({ ...s, playlistId: 'PL10s_EDM_Bass_Bangers_Highway' }))
  },
  {
    id: 'playlist-8',
    playlistId: 'PL_Romantic_Sufi_Highway_Melodies',
    title: 'Romantic Highway & Starry Melodies',
    hindiTitle: 'रोमांटिक हाईवे और सूफी धुनें',
    subtitle: 'Curated Highway Tape 8',
    description: 'Arijit Singh, Atif Aslam, Mohit Chauhan & Mithoon soulful highway ballads for twilight journeys',
    url: 'https://music.youtube.com/playlist?list=PL_Romantic_Sufi_Highway_Melodies',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    genre: 'romantic_melodies',
    genreLabel: 'Romantic & Sufi',
    vibe: 'Gentle acoustic strings, deep poetic verses and starry night windscreen reflections',
    songs: PLAYLIST_8_SONGS.map(s => ({ ...s, playlistId: 'PL_Romantic_Sufi_Highway_Melodies' }))
  },
  {
    id: 'playlist-9',
    playlistId: 'PL_Punjabi_Truck_Bass_Urban_Beats',
    title: 'Punjabi Truck Bass & Urban Beats',
    hindiTitle: 'पंजाबी ट्रक बास और अर्बन बीट्स',
    subtitle: 'Curated Highway Tape 9',
    description: 'Sidhu Moose Wala, Karan Aujla, Shubh, Diljit & AP Dhillon heavyweight GT Road sound systems',
    url: 'https://music.youtube.com/playlist?list=PL_Punjabi_Truck_Bass_Urban_Beats',
    coverImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
    genre: 'punjabi_bangers',
    genreLabel: 'Punjabi Bangers',
    vibe: 'Defiant, booming 808s, raw swagger and roaring GT Road diesel power',
    songs: PLAYLIST_9_SONGS.map(s => ({ ...s, playlistId: 'PL_Punjabi_Truck_Bass_Urban_Beats' }))
  },
  {
    id: 'playlist-10',
    playlistId: 'PL_Indie_CokeStudio_Fusion_Tape',
    title: 'Desi Highway Express & Coke Studio',
    hindiTitle: 'देसी इंडी और कोक स्टूडियो',
    subtitle: 'Curated Highway Tape 10',
    description: 'Coke Studio gems, The Local Train, Ritviz, Prateek Kuhad and soulful indie fusion',
    url: 'https://music.youtube.com/playlist?list=PL_Indie_CokeStudio_Fusion_Tape',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    genre: 'indie_coke_studio',
    genreLabel: 'Indie & Coke Studio',
    vibe: 'Modern acoustic guitars, folk percussions, classical vocal chops and intimate vibes',
    songs: PLAYLIST_10_SONGS.map(s => ({ ...s, playlistId: 'PL_Indie_CokeStudio_Fusion_Tape' }))
  },
  {
    id: 'playlist-11',
    playlistId: 'PL_Midnight_LoFi_Acoustics_Highway',
    title: 'Midnight Lo-Fi & Unplugged Acoustics',
    hindiTitle: 'मिडनाइट लो-फाई और अनप्लग्ड',
    subtitle: 'Curated Highway Tape 11',
    description: 'Late-night chill beats, rain soundscapes, gentle acoustic guitars and peaceful driving lullabies',
    url: 'https://music.youtube.com/playlist?list=PL_Midnight_LoFi_Acoustics_Highway',
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    genre: 'midnight_lofi',
    genreLabel: 'Midnight Lo-Fi',
    vibe: 'Warm vinyl crackle, mellow Rhodes electric piano, gentle rain and peaceful road trance',
    songs: PLAYLIST_11_SONGS.map(s => ({ ...s, playlistId: 'PL_Midnight_LoFi_Acoustics_Highway' }))
  }
];

// Combine all 506 unique songs across 11 playlists into ALL_SONGS
export const ALL_SONGS: (SongItem & Track)[] = USER_PLAYLISTS.flatMap(playlist => 
  playlist.songs.map((song) => {
    let bpm = 110;
    let style: Track['style'] = 'modern_pop';
    let instrument: Track['instrument'] = 'synth_lead';

    if (playlist.genre === 'highway_bollywood') {
      bpm = 105;
      style = 'acoustic_roadtrip';
      instrument = 'guitar';
    } else if (playlist.genre === 'punjabi_express' || playlist.genre === 'punjabi_bangers') {
      bpm = 125;
      style = 'punjabi';
      instrument = 'sitar_tumbi';
    } else if (playlist.genre === '90s_nostalgia') {
      bpm = 115;
      style = 'bollywood_90s';
      instrument = 'harmonium';
    } else if (playlist.genre === 'midnight_lofi') {
      bpm = 85;
      style = 'lofi';
      instrument = 'rhodes_lofi';
    } else if (playlist.genre === 'romantic_melodies') {
      bpm = 92;
      style = 'ghazal';
      instrument = 'flute';
    }

    return {
      ...song,
      bpm,
      style,
      instrument,
      youtubePlaylistId: playlist.playlistId,
      playlistIndex: song.playlistIndex
    };
  })
);

export const DEFAULT_YOUTUBE_PLAYLIST_ID = 'PLNpX_wbJbbl3WoNR8HZent1yNNOQVgpPj';

// Title normalization and robust song matching helpers
export const normalizeSongTitle = (title: string): string => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthetical annotations like (Simmba), (Encore), (Unplugged), (Lo-Fi)
    .replace(/\[.*?\]/g, '')
    .replace(/[^a-z0-9]/g, '') // remove whitespace, punctuation, hyphens
    .trim();
};

export const areTitlesMatching = (titleA: string, titleB: string): boolean => {
  if (!titleA || !titleB) return false;
  const a = normalizeSongTitle(titleA);
  const b = normalizeSongTitle(titleB);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a))) return true;
  return false;
};

export const findMatchingSong = (
  query: { id?: string; title?: string },
  songsList: (SongItem | Track)[] = ALL_SONGS
): (SongItem | Track) | undefined => {
  if (query.id) {
    const byId = songsList.find(s => s.id === query.id);
    if (byId) return byId;
  }
  if (query.title) {
    const rawQ = query.title.toLowerCase().trim();
    // 1. Exact match
    const byExact = songsList.find(s => s.title.toLowerCase().trim() === rawQ);
    if (byExact) return byExact;
    // 2. Normalized match
    const byNorm = songsList.find(s => areTitlesMatching(s.title, query.title!));
    if (byNorm) return byNorm;
  }
  return undefined;
};

// Initial playlist track list (starts with all songs from all 11 playlists)
export const TRACKS: Track[] = ALL_SONGS;

export const TRUCK_SHAYARI = [
  'देखो मगर प्यार से 💫',
  'बुरी नज़र वाले तेरा मुँह काला 🧿',
  'समय से पहले भाग्य से ज्यादा कभी नहीं मिलता ✨',
  'हंस मत पगली प्यार हो जाएगा 😉',
  'मालिक की गाड़ी ड्राइवर का पसीना, चलती है रोड पर बनकर हसीना 🚛',
  'दम है तो क्रॉस कर, वरना बर्दाश्त कर 🔥',
  'जलने वाले जलते रहो, हम यूँ ही आगे बढ़ते रहेंगे 🚀',
  'लटक मत पटक दूंगी ⚠️',
  'घर कब आओगे? दिल बेचैन है ❤️',
  'माँ का आशीर्वाद हमेशा साथ है 🙏',
  'स्पीड 40 की, दिल 100 का 🛣️',
  'रुक जाना नहीं तू कहीं हार के 🎵',
  'रास्ते लंबे हैं, मगर हौसला उससे भी लंबा है 🚚✨',
  'मंज़िल का पता नहीं, सफ़र का मज़ा पूरा है ❤️‍🔥',
  'टायर घूमते रहे, किस्मत भी एक दिन घूमेगी 🛣️🔥',
  'हॉर्न छोटा सही, पर अंदाज़ हमारा बड़ा है 📯😎',
  'रात काली हो तो क्या, हेडलाइट अपना सूरज है 🌙💡',
  'धूल रास्तों की हो या ज़िंदगी की, सफ़र रुकना नहीं चाहिए 🚛',
  'पीछे लिखा है “बुरी नज़र वाले”, आगे लिखा है “सपने बड़े वाले” 👀✨',
  'घर से दूर हूँ, मगर घर की याद हमेशा साथ चलती है 🏠❤️',
  'स्टीयरिंग हाथ में, सपने आँखों में और मंज़िल दिल में ❤️🛣️',
  'हाईवे की खामोशी में भी इंजन अपनी कहानी सुनाता है 🔥',
  'जहाँ लोग रास्ता देखते हैं, हम वहीं रास्ता बनाते हैं 🚚⚡',
  'मोड़ कितने भी आएँ, सफ़र अपना सीधा रहेगा 🛣️💪',
  'रफ्तार से नहीं, हौसले से पहचान बनती है 👑',
  'रातों की ड्राइव और दिल की बातें — दोनों का कोई हिसाब नहीं 🌙❤️',
  'जिस सड़क ने थकाया है, वही एक दिन मंज़िल तक पहुँचाएगी ✨',
  'डीज़ल की खुशबू और मिट्टी की महक — यही तो अपना सफ़र है 🚛❤️',
  'हाईवे पर अकेले हैं, मगर सपने हजार साथ हैं 🌌',
  'ब्रेक मंज़िल पर लगेगा, हौसलों पर नहीं 🔥',
  'ज़िंदगी भी ट्रक जैसी है — लोड कितना भी हो, चलना पड़ता है 🚚💯',
  'देख मगर प्यार से, ट्रक है दिलदार से 😎🚚',
  'बुरी नज़र वाले, तेरा भी भला हो 👀🙏',
  'माँ की दुआ साथ है, इसलिए सफ़र बेखौफ है ❤️🙏',
  'हॉर्न प्लीज़ नहीं, दिल से रास्ता दीजिए 📯❤️',
  'जलने वालों को धुआँ, चलने वालों को रास्ता 🔥🛣️',
  'अपना टाइम आएगा नहीं… अपना ट्रक पहुँच जाएगा 🚛😎',
  'लोड भारी है साहब, मगर सपने उससे भारी हैं 💪✨',
  'सड़क अपनी, अंदाज़ अपना, सफ़र अपना 🚚👑',
  'रास्ते पूछते हैं — कहाँ जाना है? हम कहते हैं — जहाँ किस्मत ले जाए 🛣️',
  'पीछे मत देख मुसाफिर, तेरी कहानी अभी बाकी है ❤️‍🔥'
];

export const TRUCK_CABIN_TITLES = [
  'ट्रक वाला',
  'HORN OK PLEASE',
  'राजहंस एक्सप्रेस',
  'शेर-ए-पंजाब',
  'माँ का लाडला',
  'धूम धड़ाका',
  'हाईवे का राजा',
  'सफ़र का साथी'
];

export const HORN_SOUNDS = [
  { id: 'nagin', name: 'नागिन धुन (Nagin Melody)', desc: 'The legendary multi-tone snake charmer melody' },
  { id: 'classic_double', name: 'टाटा डबल पीप (Tata Dual Beep)', desc: 'Classic heavy diesel dual-pressure tone' },
  { id: 'dhoom', name: 'धूम एक्सप्रेस (Dhoom Fast Pulse)', desc: 'High tempo 4-tone overtake melody' },
  { id: 'heavy_pressure', name: 'जीटी रोड ब्लास्ट (GT Heavy Air)', desc: 'Deep resonant highway train & truck blast' },
  { id: 'tiranga', name: 'तिरंगा धुन (Patriotic Melody)', desc: 'Nostalgic brass trumpet fanfare' }
];

export const CASSETTE_GENRES = [
  { id: 'all', name: 'All Collections', icon: '📼' },
  { id: 'highway_bollywood', name: 'Highway Bollywood', icon: '🚗' },
  { id: 'punjabi_express', name: 'Punjabi Express', icon: '🥁' },
  { id: 'desi_drive', name: 'Desi Drive', icon: '🛣️' },
  { id: 'superhits', name: 'Superhits', icon: '🌟' },
  { id: '90s_nostalgia', name: '90s Nostalgia', icon: '📻' },
  { id: '00s_party', name: '00s Party', icon: '🎉' },
  { id: '10s_bangers', name: '10s Bangers', icon: '🔥' },
  { id: 'romantic_melodies', name: 'Romantic & Sufi', icon: '☕' },
  { id: 'punjabi_bangers', name: 'Punjabi Bangers', icon: '💥' },
  { id: 'indie_coke_studio', name: 'Indie & Coke Studio', icon: '🎸' },
  { id: 'midnight_lofi', name: 'Midnight Lo-Fi', icon: '🌙' }
];
