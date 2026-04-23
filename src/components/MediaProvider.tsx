import React, { createContext, useContext, useState, useEffect } from 'react';

export type MediaType = 'audio' | 'video';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  duration?: number;
  thumbnail?: string;
  artist?: string;
}

interface MediaContextType {
  library: MediaFile[];
  currentTrack: MediaFile | null;
  isPlaying: boolean;
  addMedia: (files: FileList) => void;
  playTrack: (track: MediaFile) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<MediaFile[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MediaFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Clean up Object URLs on unmount
  useEffect(() => {
    return () => {
      library.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [library]);

  const addMedia = (files: FileList) => {
    const newFiles: MediaFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name.split('.').slice(0, -1).join('.') || file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'audio',
      artist: 'Local Media',
    }));
    setLibrary((prev) => [...prev, ...newFiles]);
  };

  const playTrack = (track: MediaFile) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const filteredLibrary = library.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlay = () => setIsPlaying(!isPlaying);

  // Background Media Session API Integration
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: currentTrack.artist || 'Local Media',
        album: 'MaysMelody Media Player',
        artwork: [
          { src: 'https://picsum.photos/seed/maysmelody/96/96', sizes: '96x96', type: 'image/png' },
          { src: 'https://picsum.photos/seed/maysmelody/512/512', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
      
      // Update playback state for the OS
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [currentTrack, isPlaying, library]);

  const nextTrack = () => {
    if (!currentTrack || library.length === 0) return;
    const index = library.findIndex((t) => t.id === currentTrack.id);
    const next = library[(index + 1) % library.length];
    if (next) playTrack(next);
  };

  const prevTrack = () => {
    if (!currentTrack || library.length === 0) return;
    const index = library.findIndex((t) => t.id === currentTrack.id);
    const prev = library[(index - 1 + library.length) % library.length];
    if (prev) playTrack(prev);
  };

  return (
    <MediaContext.Provider
      value={{
        library: filteredLibrary,
        currentTrack,
        isPlaying,
        addMedia,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}


export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error('useMedia must be used within a MediaProvider');
  return context;
};
