/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SakuraCanvas } from './components/SakuraCanvas';
import { HeaderBar } from './components/HeaderBar';
import { EngawaView } from './components/EngawaView';
import { SakazukiExperience } from './components/SakazukiExperience';
import { SakeAccompaniment } from './components/SakeAccompaniment';
import { PoetrySection } from './components/PoetrySection';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { sound } from './utils/soundEngine';
import { Moon, Sparkles, Wind, Bell } from 'lucide-react';

export default function App() {
  const [breezeLevel, setBreezeLevel] = useState<'gentle' | 'breeze' | 'blizzard'>('gentle');
  const [activeSection, setActiveSection] = useState<string>('engawa');
  const [activeView, setActiveView] = useState<'engawa' | 'stars' | 'stillLife'>('engawa');

  const triggerBreeze = () => {
    setBreezeLevel('breeze');
    sound.playWindChime();
    setTimeout(() => {
      setBreezeLevel('gentle');
    }, 4500);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090f] text-[#ede8df] washi-pattern relative selection:bg-amber-800/40 pb-28">
      {/* Falling Sakura Canvas Layer */}
      <SakuraCanvas intensity={breezeLevel} interactive={true} />

      {/* Top Bar Navigation */}
      <HeaderBar
        onBreezeClick={triggerBreeze}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Viewport */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 flex flex-col gap-16 relative z-20">
        {/* Section 1: Veranda & Night Garden Panorama (縁側の眺め) */}
        <section id="engawa" className="scroll-mt-24">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-amber-300/80 uppercase font-serif">
              <span>古民家の縁側</span>
              <span aria-hidden="true" className="text-amber-500/40">·</span>
              <span>夜桜と満月</span>
              <span aria-hidden="true" className="text-amber-500/40">·</span>
              <span>満天の星</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif text-stone-100 tracking-wider mt-2">
              月光浴びる夜桜の庵
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-xl mx-auto font-serif leading-relaxed">
              古いお屋敷の奥深い静寂のなか、障子の隙間から庭の枝垂れ桜と冴え渡る満月を仰ぐ。遠くで時折響く鹿威しの音に、夜の更けゆくを覚える。
            </p>
          </div>

          <EngawaView
            onBreezeTriggered={triggerBreeze}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </section>

        {/* Section 2: Interactive Sakazuki Experience (月映しの盃) */}
        <section id="sakazuki" className="scroll-mt-24 pt-4">
          <SakazukiExperience onPetalDrift={triggerBreeze} />
        </section>

        {/* Section 3: Seasonal Sweets & Accompaniments (茶托と酒肴) */}
        <section id="accompaniment" className="scroll-mt-24">
          <SakeAccompaniment />
        </section>

        {/* Section 4: Poetry & Tanzaku Scroll (短冊と詩情) */}
        <section id="poetry" className="scroll-mt-24">
          <PoetrySection />
        </section>

        {/* Quiet Cultural Wabi-Sabi Footer */}
        <footer className="mt-16 pt-8 pb-4 border-t border-stone-800/80 text-center font-serif text-xs text-stone-500 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-amber-400/60">
            <span>❖</span>
            <span>花見酒</span>
            <span>·</span>
            <span>月見酒</span>
            <span>·</span>
            <span>雪月花</span>
            <span>❖</span>
          </div>
          <p className="text-[11px] text-stone-500 max-w-md mx-auto leading-relaxed">
            月映しの盃　一口で解ける　金の輪が残る　今夜だけでいい
          </p>
          <div className="text-[10px] text-stone-600 mt-1">
            静謐なる日本画風の意匠 — 望月庵
          </div>
        </footer>
      </main>

      {/* Floating Bottom Ambient Audio Bar */}
      <AudioPlayerBar />
    </div>
  );
}
