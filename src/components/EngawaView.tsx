import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Wind, Bell, Flame, Moon, Compass, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface EngawaViewProps {
  onBreezeTriggered?: () => void;
  activeView: 'engawa' | 'stars' | 'stillLife';
  onViewChange: (view: 'engawa' | 'stars' | 'stillLife') => void;
}

export const EngawaView: React.FC<EngawaViewProps> = ({
  onBreezeTriggered,
  activeView,
  onViewChange,
}) => {
  const [shojiOpenPercent, setShojiOpenPercent] = useState<number>(85); // 0 (closed) to 100 (wide open)
  const [moonBrightness, setMoonBrightness] = useState<number>(90);
  const [lanternActive, setLanternActive] = useState<boolean>(true);
  const [moonPhase, setMoonPhase] = useState<'full' | 'oboro' | 'izayoi'>('full');

  const views = {
    engawa: {
      title: '縁側と庭園の全景',
      desc: '濡れ縁から満開の枝垂れ桜、庭園の石灯籠、満月を仰ぎ見る構図',
      imgSrc: '/src/assets/images/yozakura_moon_engawa_1792127080589.jpg',
    },
    stars: {
      title: '夜桜と満天の星',
      desc: '月明かりに照らされた桜の枝越しに、無数の星が瞬く壮大な夜空',
      imgSrc: '/src/assets/images/night_sakura_stars_1792127080831.jpg',
    },
    stillLife: {
      title: '盃と月光の静物',
      desc: '風化した古い木の縁側に置かれた朱の盃、水面に宿る金の月',
      imgSrc: '/src/assets/images/sakazuki_moon_sake_1792127080457.jpg',
    },
  };

  const currentViewData = views[activeView];

  const handleShojiChange = (val: number) => {
    setShojiOpenPercent(val);
    sound.playShojiSlide();
  };

  const handleWindGust = () => {
    sound.playWindChime();
    onBreezeTriggered?.();
  };

  const handleShishiOdoshi = () => {
    sound.playShishiOdoshi();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Frame Container */}
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-stone-800 bg-[#070a12] shadow-2xl">
        {/* The Nihonga Masterpiece Visual Canvas */}
        <div className="relative w-full aspect-[16/9] min-h-[340px] sm:min-h-[460px] md:min-h-[520px] overflow-hidden select-none">
          {/* Main Artwork Image with Zero-Broken-Image fallback container */}
          <div className="absolute inset-0 bg-[#070b14]">
            <img
              src={currentViewData.imgSrc}
              alt={currentViewData.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              style={{
                filter: `brightness(${0.75 + (moonBrightness / 100) * 0.4}) contrast(${1.02})`,
              }}
            />
          </div>

          {/* Lunar Radiance Overlay (Dynamic brightness and glow) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              opacity: (moonBrightness / 100) * 0.45,
              background:
                moonPhase === 'oboro'
                  ? 'radial-gradient(circle at 45% 25%, rgba(254, 240, 138, 0.45) 0%, rgba(147, 197, 253, 0.15) 35%, transparent 70%)'
                  : 'radial-gradient(circle at 45% 20%, rgba(254, 243, 199, 0.55) 0%, rgba(253, 230, 138, 0.25) 30%, transparent 65%)',
            }}
          />

          {/* Warm Andon Lantern Glow in Tatami Room */}
          {lanternActive && (
            <div
              className="absolute left-0 bottom-0 w-2/5 h-3/5 pointer-events-none transition-opacity duration-500"
              style={{
                background: 'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.15) 45%, transparent 75%)',
              }}
            />
          )}

          {/* Sliding Traditional Shoji Screen (障子戸) Overlay */}
          {/* Left Shoji Screen */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#e8ded0]/95 shadow-[10px_0_25px_rgba(0,0,0,0.85)] z-20 border-r-4 border-[#2b201a] transition-all duration-300 ease-out"
            style={{
              width: `${(100 - shojiOpenPercent) * 0.5}%`,
            }}
          >
            {/* Shoji Lattice Grids (障子の組子) */}
            <div className="w-full h-full relative opacity-80 border-l border-r border-[#3e2c22] bg-[radial-gradient(#d5c4af_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-6 border border-[#2b201a]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border border-[#443026]/70 shadow-inner" />
                ))}
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-10 rounded-full bg-[#1b1410] border border-[#785746]" />
            </div>
          </div>

          {/* Right Shoji Screen */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-[#e8ded0]/95 shadow-[-10px_0_25px_rgba(0,0,0,0.85)] z-20 border-l-4 border-[#2b201a] transition-all duration-300 ease-out"
            style={{
              width: `${(100 - shojiOpenPercent) * 0.5}%`,
            }}
          >
            <div className="w-full h-full relative opacity-80 border-l border-r border-[#3e2c22] bg-[radial-gradient(#d5c4af_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-6 border border-[#2b201a]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border border-[#443026]/70 shadow-inner" />
                ))}
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-10 rounded-full bg-[#1b1410] border border-[#785746]" />
            </div>
          </div>

          {/* Nihonga Signature Stamp (落款 / 朱印) in lower corner */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center select-none opacity-85 hover:opacity-100 transition-opacity">
            <div className="px-1.5 py-2 bg-[#991b1b] rounded text-[11px] font-serif text-amber-100 shadow-md border border-red-950 tategaki leading-tight">
              月見
            </div>
            <span className="text-[10px] text-amber-200/60 font-serif mt-1">望月庵</span>
          </div>

          {/* Current view subtitle watermark */}
          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-stone-700/60 text-xs text-stone-200 font-serif flex items-center gap-2">
            <span className="text-amber-400">❖</span>
            <span>{currentViewData.title}</span>
          </div>

          {/* Ambient Breeze Prompt */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={handleWindGust}
              className="px-3.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-md text-stone-200 hover:text-white border border-stone-700/80 text-xs font-serif flex items-center gap-1.5 shadow-lg transition-all"
              title="夜風を吹かせて花びらを舞わせます"
            >
              <Wind className="w-3.5 h-3.5 text-pink-300" />
              <span>夜風を呼ぶ</span>
            </button>
            <button
              onClick={handleShishiOdoshi}
              className="px-3.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-md text-stone-200 hover:text-white border border-stone-700/80 text-xs font-serif flex items-center gap-1.5 shadow-lg transition-all"
              title="庭園の鹿威し（ししおどし）を鳴らします"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>鹿威し</span>
            </button>
          </div>
        </div>

        {/* View Switcher Ribbon & Veranda Controls */}
        <div className="p-4 sm:p-6 bg-[#111622] border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* View Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-stone-800 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => {
                onViewChange('engawa');
                sound.playKotoNote(1);
              }}
              className={`px-3.5 py-2 text-xs font-serif rounded-lg whitespace-nowrap transition-all ${
                activeView === 'engawa'
                  ? 'bg-[#2a221b] text-amber-100 shadow border border-amber-600/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              縁側の眺め
            </button>
            <button
              onClick={() => {
                onViewChange('stars');
                sound.playKotoNote(3);
              }}
              className={`px-3.5 py-2 text-xs font-serif rounded-lg whitespace-nowrap transition-all ${
                activeView === 'stars'
                  ? 'bg-[#2a221b] text-amber-100 shadow border border-amber-600/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              夜桜と星空
            </button>
            <button
              onClick={() => {
                onViewChange('stillLife');
                sound.playKotoNote(5);
              }}
              className={`px-3.5 py-2 text-xs font-serif rounded-lg whitespace-nowrap transition-all ${
                activeView === 'stillLife'
                  ? 'bg-[#2a221b] text-amber-100 shadow border border-amber-600/40 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              盃の佇まい
            </button>
          </div>

          {/* Environmental Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-serif text-stone-300 w-full md:w-auto justify-end">
            {/* Shoji Open Slider */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400">障子の開き</span>
              <input
                type="range"
                min="0"
                max="100"
                value={shojiOpenPercent}
                onChange={(e) => handleShojiChange(Number(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
              <span className="tabular-nums w-8 text-right text-stone-400">{shojiOpenPercent}%</span>
            </div>

            {/* Moon Glow Slider */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400">月光</span>
              <input
                type="range"
                min="40"
                max="100"
                value={moonBrightness}
                onChange={(e) => setMoonBrightness(Number(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
            </div>

            {/* Andon Lantern Toggle */}
            <button
              onClick={() => {
                setLanternActive(!lanternActive);
                sound.playWaterDrop();
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                lanternActive
                  ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                  : 'bg-black/30 border-stone-800 text-stone-500'
              }`}
              title="和室の行灯（あんどん）の点灯・消灯"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>行灯 {lanternActive ? '点灯' : '消灯'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
