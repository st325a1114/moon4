import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Utensils } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface Snack {
  id: string;
  name: string;
  ruby: string;
  desc: string;
  pairingNote: string;
  svgIcon: React.ReactNode;
}

const SNACKS: Snack[] = [
  {
    id: 'sakuramochi',
    name: '桜餅',
    ruby: 'さくらもち',
    desc: '薄紅色の道明寺種で上品なこし餡を包み、塩漬けの桜葉で巻いた春の銘菓。',
    pairingNote: '桜葉のほのかな塩味が、辛口の吟醸酒の甘みと旨みを引き立てます。',
    svgIcon: (
      <svg viewBox="0 0 80 50" className="w-12 h-8">
        {/* Sakura Mochi Body */}
        <ellipse cx="40" cy="28" rx="28" ry="16" fill="#fbcfe8" />
        {/* Salted Sakura Leaf wrapping */}
        <path
          d="M 16 28 C 24 12, 56 12, 64 28 C 54 38, 26 38, 16 28 Z"
          fill="#3f6212"
          opacity="0.9"
        />
        <path d="M 20 27 Q 40 22 60 27" stroke="#223b07" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },
  {
    id: 'sanshoku',
    name: '花見団子',
    ruby: 'はなみだんご',
    desc: '桜色（春の息吹）、白（雪・白酒）、草色（新緑の萌芽）の三色串団子。',
    pairingNote: '昔ながらの優しい甘みが、冷酒の後口をふわりと包み込みます。',
    svgIcon: (
      <svg viewBox="0 0 80 50" className="w-12 h-8">
        {/* Skewer stick */}
        <line x1="8" y1="25" x2="72" y2="25" stroke="#78350f" strokeWidth="2.5" />
        {/* Pink Dango */}
        <circle cx="26" cy="25" r="10" fill="#f472b6" />
        {/* White Dango */}
        <circle cx="42" cy="25" r="10" fill="#fef3c7" />
        {/* Green Dango */}
        <circle cx="58" cy="25" r="10" fill="#4d7c0f" />
      </svg>
    ),
  },
  {
    id: 'konpeito',
    name: '星の金平糖',
    ruby: 'こんぺいとう',
    desc: '夜空に瞬く無数の星屑をかたどった、素朴で愛らしい糖菓子。',
    pairingNote: '口に含みながら酒をすすると、まるで夜空の星を飲んでいるような心地。',
    svgIcon: (
      <svg viewBox="0 0 80 50" className="w-12 h-8">
        <polygon
          points="40,10 44,20 54,20 46,26 49,36 40,30 31,36 34,26 26,20 36,20"
          fill="#fbbf24"
        />
        <polygon
          points="20,24 22,30 28,30 23,34 25,40 20,36 15,40 17,34 12,30 18,30"
          fill="#67e8f9"
        />
        <polygon
          points="62,24 64,30 70,30 65,34 67,40 62,36 57,40 59,34 54,30 60,30"
          fill="#f472b6"
        />
      </svg>
    ),
  },
];

export const SakeAccompaniment: React.FC = () => {
  const [selectedSnack, setSelectedSnack] = useState<Snack>(SNACKS[0]);
  const [tastedCount, setTastedCount] = useState<number>(0);

  const handleTaste = (snack: Snack) => {
    setSelectedSnack(snack);
    setTastedCount((c) => c + 1);
    sound.playWaterDrop();
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-10 p-6 rounded-2xl bg-gradient-to-r from-[#171310] via-[#1a1512] to-[#171310] border border-amber-600/20 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <span className="text-xs text-amber-400 font-serif tracking-widest uppercase">
            茶托と酒肴
          </span>
          <h3 className="text-lg font-serif text-stone-100 mt-0.5">
            縁側のお茶請け・花見菓子
          </h3>
        </div>
        <div className="text-xs text-stone-400 font-serif">
          月見酒に寄り添う、季節の甘味
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
        {SNACKS.map((snack) => (
          <button
            key={snack.id}
            onClick={() => handleTaste(snack)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col items-center sm:items-start ${
              selectedSnack.id === snack.id
                ? 'bg-[#291e17] border-amber-500/50 shadow-md text-amber-100'
                : 'bg-black/25 border-stone-800 hover:bg-black/40 text-stone-300'
            }`}
          >
            <div className="mb-2 p-2 rounded-lg bg-black/40 border border-stone-800">
              {snack.svgIcon}
            </div>
            <div className="font-serif font-medium text-sm text-stone-100">
              {snack.name}
            </div>
            <div className="text-[11px] text-amber-400/80 font-serif mt-0.5">
              {snack.ruby}
            </div>
          </button>
        ))}
      </div>

      {/* Selected detail */}
      <div className="mt-4 p-4 rounded-xl bg-black/30 border border-stone-800/80 text-xs font-serif text-stone-300">
        <p className="leading-relaxed text-stone-200">{selectedSnack.desc}</p>
        <div className="mt-2 text-amber-300/80 flex items-center gap-1.5 pt-2 border-t border-stone-800/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>相性の妙：{selectedSnack.pairingNote}</span>
        </div>
      </div>
    </div>
  );
};
