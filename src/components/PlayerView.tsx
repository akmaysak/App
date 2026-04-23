import React, { useRef, useEffect } from 'react';
import { useMedia } from './MediaProvider';
import { Play, Pause, SkipBack, SkipForward, Maximize2, Music, Film, Volume2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PlayerView() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = useMedia();
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync state with native elements
  useEffect(() => {
    const media = currentTrack?.type === 'video' ? videoRef.current : audioRef.current;
    if (media) {
      if (isPlaying) {
        media.play().catch(e => {
          console.error("Playback failed:", e);
          if (e.name === 'NotAllowedError') {
            // User interaction required
          }
        });
      } else {
        media.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Reset state when track changes
  useEffect(() => {
    setError(null);
    setProgress(0);
    setDuration(0);
  }, [currentTrack]);

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-6 bg-surface-panel p-10">
        <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-border-subtle flex items-center justify-center">
          <Play fill="currentColor" size={32} className="ml-1 opacity-20" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Initialize Media Sequence</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onTimeUpdate = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    setProgress(e.currentTarget.currentTime);
  };

  const onLoadedMetadata = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleMediaError = () => {
    setError('MEDIA DECODE ERROR: UNSUPPORTED FORMAT');
  };

  return (
    <div className="flex flex-col h-full bg-surface-panel">
      {/* Player Core */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="relative"
          >
            {error ? (
              <div className="w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] bg-red-950/20 rounded-[48px] border border-red-500/20 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertCircle className="text-red-500" size={32} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-2">IO ERROR</h3>
                <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest">
                  {error}
                </p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-6 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Retry Session
                </button>
              </div>
            ) : (
              <div className="w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-brand-blue to-indigo-900 rounded-[48px] shadow-2xl flex items-center justify-center overflow-hidden border border-white/10 group cursor-pointer">
                {currentTrack.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={videoRef}
                      src={currentTrack.url}
                      className="w-full h-full object-cover"
                      onTimeUpdate={onTimeUpdate}
                      onLoadedMetadata={onLoadedMetadata}
                      onError={handleMediaError}
                      onEnded={nextTrack}
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10" onClick={togglePlay}>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:scale-110 transition-transform">
                          <Play fill="white" size={32} className="ml-2" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center relative bg-black/20" onClick={togglePlay}>
                    <audio
                      ref={audioRef}
                      src={currentTrack.url}
                      onTimeUpdate={onTimeUpdate}
                      onLoadedMetadata={onLoadedMetadata}
                      onError={handleMediaError}
                      onEnded={nextTrack}
                    />
                    <motion.div
                      animate={{ 
                        scale: isPlaying ? [1, 1.05, 1] : 1,
                        rotate: isPlaying ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ 
                        scale: { repeat: Infinity, duration: 3 },
                        rotate: { repeat: Infinity, duration: 6 }
                      }}
                      className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 relative z-10 shadow-[0_0_50px_rgba(37,99,235,0.2)]"
                    >
                      {isPlaying ? (
                        <div className="flex gap-1 items-end h-8">
                           {[1,2,3,4].map(i => (
                             <motion.div 
                               key={i} 
                               animate={{ height: ['20%', '100%', '20%'] }} 
                               transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                               className="w-1 bg-white rounded-full" 
                             />
                           ))}
                        </div>
                      ) : (
                        <Music className="text-white/60" size={48} />
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            )}
            {!error && currentTrack.type === 'video' && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brand-blue rounded-full text-[9px] font-extrabold tracking-[0.2em] uppercase shadow-xl z-20 pointer-events-none">
                STREAM ACTIVE
              </div>
            )}
          </motion.div>
        </AnimatePresence>


        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{currentTrack.name}</h1>
          <p className="text-base text-white/40 font-medium">{currentTrack.artist} • {formatTime(duration)}</p>
        </div>

        {/* Controls Panel */}
        <div className="w-full max-w-lg mt-10 space-y-8">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="h-1.5 bg-white/10 rounded-full relative group cursor-pointer">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(progress / duration) * 100}%` }}
              />
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                animate={{ left: `${(progress / duration) * 100}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-white/30 tracking-widest">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Logic Controls */}
          <div className="flex items-center justify-between px-6">
            <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <Volume2 size={18} />
            </button>
            
            <div className="flex items-center gap-8">
              <button onClick={prevTrack} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <SkipBack size={20} fill="currentColor" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause fill="black" size={32} /> : <Play fill="black" size={32} className="ml-1.5" />}
              </button>
              
              <button onClick={nextTrack} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
