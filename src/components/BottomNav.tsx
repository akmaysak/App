import React from 'react';
import { motion } from 'motion/react';
import { PlayCircle, Library, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: 'library' | 'player' | 'settings';
  setActiveTab: (tab: 'library' | 'player' | 'settings') => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'player', icon: PlayCircle, label: 'Now Playing' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface-bg to-transparent pointer-events-none">
      <nav className="max-w-md mx-auto h-20 rounded-[32px] bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-around px-2 pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1.5 w-24 h-full relative transition-all",
                isActive ? "text-white" : "text-white/30 hover:text-white/50"
              )}
            >
              <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[9px] font-extrabold uppercase tracking-[0.2em]",
                isActive ? "text-white" : "text-white/20"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute bottom-3 w-1.5 h-1.5 bg-brand-blue rounded-full shadow-[0_0_10px_#2563eb]" 
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
