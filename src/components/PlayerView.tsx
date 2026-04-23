import React from 'react';
import { useMedia } from './MediaProvider';
import ReactPlayer from 'react-player';
const Player = ReactPlayer as any;
import { Play, Pause, SkipBack, SkipForward, Maximize2, Music, Film, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PlayerView() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } = useMedia();
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setError(null);
    setProgress(0);
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
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                  <Maximize2 className="text-red-500 rotate-45" size={24} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-2">IO ERROR</h3>
                <p className="text-xs text-white/40 leading-relaxed uppercase tracking-tighter">
                  {error}
                </p>
              </div>
            ) : (
              <div className="w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-brand-blue to-indigo-900 rounded-[48px] shadow-2xl flex items-center justify-center overflow-hidden border border-white/10 group cursor-pointer">
                {currentTrack.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-black/20 z-0" />
                    <Player
                      url={currentTrack.url}
                      playing={isPlaying}
                      width="100%"
                      height="100%"
                      onProgress={(p: any) => setProgress(p.playedSeconds)}
                      onDuration={(d: number) => setDuration(d)}
                      onError={() => setError('UNSUPPORTED MEDIA FORMAT OR CORRUPT FILE')}
                      controls={false}
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                          <Play fill="white" size={32} className="ml-2" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-black/10" />
                    {/* Hidden Player for audio so events still work */}
                    <Player
                      url={currentTrack.url}
                      playing={isPlaying}
                      width="0px"
                      height="0px"
                      onProgress={(p: any) => setProgress(p.playedSeconds)}
                      onDuration={(d: number) => setDuration(d)}
                      onError={() => setError('AUDIO STREAM FAILURE')}
                      style={{ display: 'none' }}
                    />
                    <motion.div
                      animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 relative z-10"
                    >
                      <Music className="text-white" size={32} />
                    </motion.div>
                  </div>
                )}
              </div>
            )}
            {!error && currentTrack.type === 'video' && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brand-blue rounded-full text-[9px] font-extrabold tracking-[0.2em] uppercase shadow-xl z-20">
                4K Stream Active
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
