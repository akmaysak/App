import React from 'react';
import { useMedia, type MediaFile } from './MediaProvider';
import { Plus, Music, Film, Search, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function LibraryView() {
  const { library, addMedia, currentTrack, playTrack, searchQuery, setSearchQuery } = useMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addMedia(e.target.files);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-panel p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Library</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/40">{library.length} Objects Active</p>
        </div>
        <label className="w-12 h-12 rounded-2xl bg-white/5 border border-border-subtle flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors shadow-lg group">
          <Plus className="text-white group-hover:scale-110 transition-transform" size={20} />
          <input type="file" multiple className="hidden" accept="audio/*,video/*" onChange={handleFileChange} />
        </label>
      </header>

      {/* Search Bar - Connected */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="FILTER SYSTEM..." 
          className="w-full bg-black/40 border border-border-subtle rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-brand-blue transition-all uppercase"
        />
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-2 pb-24">
        {library.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20 space-y-4">
            <div className="w-16 h-16 border border-white/5 rounded-3xl flex items-center justify-center">
              <FolderOpen size={32} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center max-w-[200px]">
              No Media Detected. Import locally.
            </p>
          </div>
        ) : (
          library.map((track, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              key={track.id}
              onClick={() => playTrack(track)}
              className={cn(
                "group flex items-center p-4 rounded-2xl border transition-all cursor-pointer",
                currentTrack?.id === track.id 
                  ? "bg-white/5 border-white/20 shadow-xl" 
                  : "bg-transparent border-transparent hover:bg-white/5 hover:border-border-subtle"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mr-4 border border-white/5",
                track.type === 'video' ? "bg-brand-blue/10 text-brand-blue" : "bg-white/10 text-white/60"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-[2px]",
                  track.type === 'video' ? "bg-brand-blue shadow-[0_0_8px_#2563eb]" : "bg-white/40"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-sm font-semibold truncate",
                  currentTrack?.id === track.id ? "text-white" : "text-white/60"
                )}>
                  {track.name}
                </h3>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-bold mt-1">
                  {track.type} • {track.artist}
                </p>
              </div>
              {currentTrack?.id === track.id && (
                <div className="flex gap-1.5 px-2">
                  {[0.4, 0.7, 0.5].map((h, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
                      transition={{ repeat: Infinity, duration: 1, delay: idx * 0.2 }}
                      className="w-1 bg-brand-blue rounded-full"
                      style={{ height: `${h * 16}px` }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
