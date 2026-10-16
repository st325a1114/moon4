import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Feather, Moon, Wind } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface SakeType {
  id: string;
  name: string;
  ruby: string;
  type: string;
  flavor: string;
  colorAccent: string;
  liquidGradient: string;
  alcohol: string;
  notes: string;
}

const SAKE_VARIETIES: SakeType[] = [
  {
    id: 'mochizuki',
    name: '望月',
    ruby: 'もちづき',
    type: '純米大吟醸',
    flavor: '月光のように透き通り、米のふくよかな甘みと澄んだ余韻',
    colorAccent: '#fbbf24',
    liquidGradient: 'radial-gradient(circle, rgba(254, 243, 199, 0.28) 0%, rgba(217, 119, 6, 0.15) 60%, rgba(180, 83, 9, 0.28) 100%)',
    alcohol: '15度',
    notes: '満月の夜にのみ汲み上げる名水で仕込んだ、水鏡のように月を映す酒。',
  },
  {
    id: 'yozakura',
    name: '夜桜',
    ruby: 'よざくら',
    type: '花見吟醸・桜花仕込み',
    flavor: 'ほのかな桜の香りと華やかな吟醸香、春の宵にほどける口当たり',
    colorAccent: '#f472b6',
    liquidGradient: 'radial-gradient(circle, rgba(251, 207, 232, 0.35) 0%, rgba(244, 114, 182, 0.18) 60%, rgba(190, 24, 93, 0.25) 100%)',
    alcohol: '14.5度',
    notes: '八重桜の花弁を浮かべ、夜風に揺れる花びらを愛でながら酌み交わす。',
  },
  {
    id: 'oborozuki',
    name: '朧月夜',
    ruby: 'おぼろづきよ',
    type: '雫採り原酒・金箔散らし',
    flavor: 'とろりとした濃厚な旨みと、金の輪が幾重にも残る芳醇な深み',
    colorAccent: '#eab308',
    liquidGradient: 'radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(202, 138, 4, 0.22) 55%, rgba(161, 98, 7, 0.35) 100%)',
    alcohol: '16度',
    notes: '袋吊りの雫だけを集め、舞い散る金箔が盃の中で銀河のように輝く。',
  },
];

interface SakazukiExperienceProps {
  onPetalDrift?: () => void;
}

export const SakazukiExperience: React.FC<SakazukiExperienceProps> = ({ onPetalDrift }) => {
  const [selectedSake, setSelectedSake] = useState<SakeType>(SAKE_VARIETIES[0]);
  const [sakeLevel, setSakeLevel] = useState<number>(100); // 0 to 100%
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [hasPetalInCup, setHasPetalInCup] = useState<boolean>(true);
  const [hasGoldDust, setHasGoldDust] = useState<boolean>(true);
  const [sippedMessage, setSippedMessage] = useState<string>('月が盃に静かに宿っています。');
  const [tokkuriTilt, setTokkuriTilt] = useState<boolean>(false);

  const cupRef = useRef<HTMLDivElement | null>(null);

  // Trigger ripple effect in the cup
  const triggerRipple = (clientX?: number, clientY?: number) => {
    sound.playWaterDrop();
    let x = 50;
    let y = 50;
    if (cupRef.current && clientX !== undefined && clientY !== undefined) {
      const rect = cupRef.current.getBoundingClientRect();
      x = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
      y = Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100));
    }
    const newRipple = { id: Date.now() + Math.random(), x, y };
    setRipples((prev) => [...prev.slice(-4), newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 2500);
  };

  // Pour Sake into the cup
  const handlePour = () => {
    if (isPouring) return;
    setIsPouring(true);
    setTokkuriTilt(true);
    sound.playSakePour();

    setTimeout(() => {
      setSakeLevel(100);
      triggerRipple();
      setSippedMessage(`「${selectedSake.name}」を満たしました。満月が揺れ、金の輪が広がります。`);
    }, 600);

    setTimeout(() => {
      setTokkuriTilt(false);
      setIsPouring(false);
    }, 1500);
  };

  // Sip / savor sake (たしなむ)
  const handleSip = () => {
    if (sakeLevel <= 0) {
      setSippedMessage('盃は空になりました。徳利からお酒を注ぎ、再び月を呼びましょう。');
      sound.playWaterDrop();
      return;
    }
    sound.playSip();
    triggerRipple();

    const poeticMusings = [
      '月映しの盃、一口で解ける。胸の濁りがすっと澄み渡る...',
      '金の輪が静かに揺れ、夜風が袖をかすめる。昔話みたいに夜が深い...',
      '盃に浮かぶ花びらが唇に触れ、春の宵の甘美な名残がひろがる...',
      '遠くで鹿威しが鳴り、静寂がまたひとつ深まってゆく...',
      '今夜だけでいい、このまま時が止まればと、盃を傾ける...',
    ];

    const nextLevel = Math.max(0, sakeLevel - 35);
    setSakeLevel(nextLevel);

    const randomMusing = poeticMusings[Math.floor(Math.random() * poeticMusings.length)];
    setSippedMessage(nextLevel === 0 ? '盃を干しました。底に残る金色の光が静かに瞬いています。' : randomMusing);
  };

  const handleCupClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sakeLevel > 0) {
      triggerRipple(e.clientX, e.clientY);
      sound.playKotoNote(Math.floor(Math.random() * 5));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Upper poetic context banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-amber-200/75 uppercase font-serif">
          <span>花見酒</span>
          <span aria-hidden="true" className="text-amber-500/40">·</span>
          <span>月映しの盃</span>
          <span aria-hidden="true" className="text-amber-500/40">·</span>
          <span>静夜の宴</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 tracking-wider mt-2">
          盃に月を愛で、宵をたしなむ
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-lg mx-auto font-serif leading-relaxed">
          朱塗りの盃に注がれた美酒。水鏡のように満月が揺らめき、散りかかる花びらが金の輪を描きます。
        </p>
      </div>

      {/* Main Sake Table Surface / Urushi Tray */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-gradient-to-b from-[#1c1613] via-[#14100e] to-[#0a0807] p-6 sm:p-10 border border-[#b45309]/25 shadow-2xl overflow-hidden">
        {/* Subtle wood grain and gold powder texture */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Tokkuri (Ceramic Carafe) & Sake Selector */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative group cursor-pointer" onClick={handlePour}>
              {/* Tokkuri Carafe Graphic */}
              <motion.div
                animate={{
                  rotate: tokkuriTilt ? -35 : 0,
                  x: tokkuriTilt ? 60 : 0,
                  y: tokkuriTilt ? 20 : 0,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className="relative inline-block"
              >
                <div className="w-20 h-32 relative mx-auto drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)]">
                  {/* Ceramic Tokkuri Body SVG */}
                  <svg viewBox="0 0 100 160" className="w-full h-full filter drop-shadow">
                    <defs>
                      <linearGradient id="tokkuriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#453d37" />
                        <stop offset="35%" stopColor="#2e2722" />
                        <stop offset="70%" stopColor="#63584e" />
                        <stop offset="100%" stopColor="#1a1512" />
                      </linearGradient>
                      <linearGradient id="goldSpecks" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    {/* Tokkuri lip */}
                    <ellipse cx="50" cy="18" rx="14" ry="7" fill="#786c62" />
                    <ellipse cx="50" cy="16" rx="11" ry="5" fill="#1f1a16" />
                    {/* Neck */}
                    <path d="M 39 18 C 39 35, 36 45, 30 65 C 20 88, 18 115, 24 138 C 28 148, 72 148, 76 138 C 82 115, 80 88, 70 65 C 64 45, 61 35, 61 18 Z" fill="url(#tokkuriGrad)" />
                    {/* Golden glaze flecks */}
                    <path d="M 35 75 Q 50 65 65 78 Q 72 105 60 125 Q 40 135 32 110 Z" fill="url(#goldSpecks)" opacity="0.45" />
                    {/* Base rim */}
                    <ellipse cx="50" cy="142" rx="26" ry="7" fill="#1c1613" />
                  </svg>

                  {/* Liquid stream during pour */}
                  <AnimatePresence>
                    {tokkuriTilt && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 110 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-8 -bottom-16 w-1.5 bg-gradient-to-b from-amber-100/90 via-white/80 to-amber-200/90 rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-2 text-xs text-amber-300/80 font-serif flex items-center justify-center gap-1 group-hover:text-amber-200 transition-colors">
                  <span>徳利から注ぐ</span>
                </div>
              </motion.div>
            </div>

            {/* Sake Type Selector */}
            <div className="mt-5 w-full">
              <div className="text-[11px] text-stone-400 font-serif tracking-widest uppercase mb-2">
                銘柄の選択
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                {SAKE_VARIETIES.map((sake) => (
                  <button
                    key={sake.id}
                    onClick={() => {
                      setSelectedSake(sake);
                      sound.playKotoNote(Math.floor(Math.random() * 5));
                    }}
                    className={`px-3 py-2 text-left rounded-lg transition-all text-xs font-serif border ${
                      selectedSake.id === sake.id
                        ? 'bg-[#291e17] border-amber-500/50 text-amber-100 shadow-md'
                        : 'bg-black/25 border-stone-800/80 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-stone-100">{sake.name}</span>
                      <span className="text-[10px] text-amber-400/80">{sake.type}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 truncate mt-0.5">{sake.flavor}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: The Sacred Vermilion Sakazuki (朱塗りの盃) */}
          <div className="md:col-span-8 flex flex-col items-center">
            {/* The Lacquer Sake Cup Container */}
            <div className="relative p-6 sm:p-8 flex items-center justify-center">
              {/* Wooden Veranda Table Tray */}
              <div
                ref={cupRef}
                onClick={handleCupClick}
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full cursor-pointer select-none transition-transform duration-300 hover:scale-[1.01]"
                style={{
                  background: 'radial-gradient(circle, #8a1313 0%, #680d0d 55%, #380606 82%, #1e0303 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 2px 10px rgba(254, 202, 202, 0.25), inset 0 -6px 20px rgba(0, 0, 0, 0.8), 0 0 0 4px #b45309, 0 0 0 6px #78350f',
                }}
              >
                {/* Gold rim accent on the cup border (金覆輪) */}
                <div className="absolute inset-1 rounded-full border border-amber-400/40 pointer-events-none" />

                {/* Sake Liquid Surface */}
                <AnimatePresence>
                  {sakeLevel > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{
                        opacity: sakeLevel / 100,
                        scale: 0.82 + (sakeLevel / 100) * 0.12,
                      }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-3 rounded-full overflow-hidden transition-all duration-700 pointer-events-none"
                      style={{
                        background: selectedSake.liquidGradient,
                        boxShadow: 'inset 0 0 25px rgba(245, 158, 11, 0.35)',
                      }}
                    >
                      {/* Reflected Full Moon in the sake liquid (月映し) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.04, 0.98, 1],
                            rotate: [0, 1.5, -1.5, 0],
                            opacity: [0.85, 0.95, 0.88, 0.85],
                          }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                          className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full"
                          style={{
                            background: 'radial-gradient(circle, #fffbeb 10%, #fef3c7 40%, #fde68a 70%, rgba(251, 191, 36, 0.15) 100%)',
                            boxShadow: '0 0 35px 12px rgba(253, 230, 138, 0.45), inset 0 0 20px rgba(251, 191, 36, 0.4)',
                          }}
                        >
                          {/* Delicate lunar mare texture (月の影・兎の餅つき) */}
                          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_35%_40%,#78350f_0%,transparent_50%)]" />
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_65%_60%,#92400e_0%,transparent_40%)]" />
                        </motion.div>
                      </div>

                      {/* Golden Ring of reflection ("金の輪が残る") */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-amber-300/40 animate-pulse pointer-events-none" />
                        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-amber-400/20 pointer-events-none" />
                      </div>

                      {/* Floating Cherry Blossom Petal (桜の花びら) */}
                      {hasPetalInCup && (
                        <motion.div
                          animate={{
                            x: [0, 8, -6, 0],
                            y: [0, -6, 8, 0],
                            rotate: [15, 25, 10, 15],
                          }}
                          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute top-1/3 right-1/4 w-7 h-9 pointer-events-auto cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playWaterDrop();
                            triggerRipple();
                            onPetalDrift?.();
                          }}
                          title="盃に浮かぶ桜の花びら（触れると波紋が広がります）"
                        >
                          <svg viewBox="0 0 30 40" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            <path
                              d="M 15 2 C 24 10, 28 25, 15 38 C 2 25, 6 10, 15 2 Z"
                              fill="url(#sakuraPetalGrad)"
                            />
                            <defs>
                              <linearGradient id="sakuraPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fff5f7" />
                                <stop offset="60%" stopColor="#fbcfe8" />
                                <stop offset="100%" stopColor="#f472b6" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </motion.div>
                      )}

                      {/* Floating Gold Leaf Dust (金箔) */}
                      {hasGoldDust && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[
                            { top: '25%', left: '30%', size: 4 },
                            { top: '65%', left: '70%', size: 5 },
                            { top: '40%', left: '60%', size: 3 },
                            { top: '75%', left: '35%', size: 4 },
                            { top: '30%', left: '45%', size: 2 },
                          ].map((speck, idx) => (
                            <motion.div
                              key={idx}
                              animate={{
                                opacity: [0.4, 0.9, 0.3],
                                scale: [0.9, 1.2, 0.9],
                              }}
                              transition={{ duration: 3 + idx, repeat: Infinity }}
                              className="absolute rounded-sm bg-gradient-to-tr from-amber-200 to-yellow-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]"
                              style={{
                                top: speck.top,
                                left: speck.left,
                                width: speck.size,
                                height: speck.size,
                                transform: 'rotate(25deg)',
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Animated Concentric Ripples */}
                      {ripples.map((rip) => (
                        <motion.div
                          key={rip.id}
                          initial={{ scale: 0.1, opacity: 0.9 }}
                          animate={{ scale: 2.8, opacity: 0 }}
                          transition={{ duration: 2.2, ease: 'easeOut' }}
                          className="absolute w-20 h-20 rounded-full border border-amber-200/70 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                          style={{
                            top: `${rip.y}%`,
                            left: `${rip.x}%`,
                            boxShadow: '0 0 10px rgba(254, 240, 138, 0.5)',
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty Cup Base / Lacquer Center mark */}
                {sakeLevel === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-amber-200/50 font-serif">
                    <Moon className="w-8 h-8 stroke-amber-400/40 mb-2 animate-pulse" />
                    <span className="text-xs tracking-widest">盃が干されました</span>
                    <span className="text-[11px] text-stone-400 mt-1">「徳利から注ぐ」で満月が満ちます</span>
                  </div>
                )}
              </div>
            </div>

            {/* Poetic feedback note / Current state */}
            <div className="min-h-[48px] flex items-center justify-center text-center px-4 py-2 mt-2">
              <p className="text-xs sm:text-sm font-serif text-amber-100/90 tracking-wide transition-all duration-300">
                {sippedMessage}
              </p>
            </div>

            {/* Interactive Sake Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
              {/* Action 1: Pour Sake */}
              <button
                onClick={handlePour}
                disabled={isPouring}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-700/80 to-amber-600/80 hover:from-amber-600 hover:to-amber-500 text-amber-50 text-xs sm:text-sm font-serif tracking-wider shadow-md hover:shadow-amber-900/30 transition-all border border-amber-400/30 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPouring ? 'animate-spin' : ''}`} />
                <span>お酒を注ぐ</span>
              </button>

              {/* Action 2: Sip Sake (たしなむ) */}
              <button
                onClick={handleSip}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2c1d17] hover:bg-[#38261e] text-stone-200 hover:text-white text-xs sm:text-sm font-serif tracking-wider shadow-sm transition-all border border-stone-700/70"
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>盃を傾ける（たしなむ）</span>
              </button>

              {/* Action 3: Ripple / Stir */}
              <button
                onClick={() => {
                  triggerRipple();
                  sound.playKotoNote(2);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-black/40 hover:bg-black/60 text-stone-300 text-xs font-serif tracking-wider transition-all border border-stone-800"
                title="水面を揺らして波紋を広げます"
              >
                <Wind className="w-3.5 h-3.5 text-stone-400" />
                <span>波紋を起こす</span>
              </button>

              {/* Action 4: Toggle Flower Petal */}
              <button
                onClick={() => {
                  setHasPetalInCup(!hasPetalInCup);
                  sound.playWaterDrop();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-serif tracking-wider transition-all border ${
                  hasPetalInCup
                    ? 'bg-pink-950/40 border-pink-700/40 text-pink-200'
                    : 'bg-black/40 border-stone-800 text-stone-400'
                }`}
                title="桜の花びらを浮かべる / すくう"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>花びら {hasPetalInCup ? '在り' : '無し'}</span>
              </button>

              {/* Action 5: Toggle Gold Leaf */}
              <button
                onClick={() => {
                  setHasGoldDust(!hasGoldDust);
                  sound.playWaterDrop();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-serif tracking-wider transition-all border ${
                  hasGoldDust
                    ? 'bg-amber-950/40 border-amber-600/40 text-amber-200'
                    : 'bg-black/40 border-stone-800 text-stone-400'
                }`}
                title="金箔を散らす / 控える"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>金箔 {hasGoldDust ? '在り' : '無し'}</span>
              </button>
            </div>

            {/* Subtle Sake Meter */}
            <div className="flex items-center gap-3 mt-4 text-[11px] text-stone-400 font-serif">
              <span>盃の残量</span>
              <div className="w-32 h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-500"
                  style={{ width: `${sakeLevel}%` }}
                />
              </div>
              <span className="tabular-nums text-stone-300">{sakeLevel}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
