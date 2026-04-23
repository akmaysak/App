/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MediaProvider } from './components/MediaProvider';
import LibraryView from './components/LibraryView';
import PlayerView from './components/PlayerView';
import BottomNav from './components/BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Github, Heart } from 'lucide-react';

function SettingsView() {
  return (
    <div className="flex flex-col h-full bg-surface-panel p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
      <div className="space-y-4">
        <section className="bg-black/40 border border-border-subtle rounded-[24px] p-6">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mb-4">Core Module</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-6 font-medium">
            MaysMelody Media Player v1.2.0. Geometric logic enabled. 
            High-performance stand-alone media container.
          </p>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 text-[9px] font-extrabold uppercase tracking-[0.2em] px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <Github size={12} />
              <span>Source</span>
            </button>
            <button className="flex items-center space-x-2 text-[9px] font-extrabold uppercase tracking-[0.2em] px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors text-brand-blue">
              <Heart size={12} fill="currentColor" />
              <span>Support</span>
            </button>
          </div>
        </section>

        <section className="bg-black/40 border border-border-subtle rounded-[24px] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider">Interface Calibration</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Dark Matter Mode</span>
            </div>
            <div className="w-12 h-6 bg-brand-blue rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
            </div>
          </div>
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider">Audio Fidelity</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">Lossless Engine</span>
            </div>
            <div className="w-12 h-6 bg-white/10 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="p-6 bg-white/5">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-[72%] h-full bg-brand-blue shadow-[0_0_8px_#2563eb]" />
              </div>
              <span className="text-[10px] font-mono text-white/40">72%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Storage Density</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-blue">84GB / 128GB</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'library' | 'player' | 'settings'>('library');

  return (
    <MediaProvider>
      <div className="h-screen w-full flex items-center justify-center bg-surface-bg p-4 sm:p-6 overflow-hidden">
        {/* Geometric Balance Container */}
        <div className="w-full h-full max-w-md bg-surface-panel rounded-[32px] border border-border-subtle flex flex-col relative overflow-hidden shadow-2xl geometric-shadow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex-1 overflow-hidden"
            >
              {activeTab === 'library' && <LibraryView />}
              {activeTab === 'player' && <PlayerView />}
              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>

          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </MediaProvider>
  );
}

