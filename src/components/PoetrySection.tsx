import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Feather, BookOpen, Music, Plus, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface PoemItem {
  id: string;
  category: '今宵の歌' | '古典和歌' | '自詠の短冊';
  title: string;
  author: string;
  lines: string[];
  explanation: string;
}

const INITIAL_POEMS: PoemItem[] = [
  {
    id: 'song-theme',
    category: '今宵の歌',
    title: '月映しの盃',
    author: '夜の詠み人',
    lines: [
      '樋の縁で 月が揺れる',
      '君の後ろ姿が ふっと消える',
      '言葉を呑んで 瞳が合った',
      '胸の奥の 濁りが澄み渡るね',
      'このままじゃ 家帰れない',
      '月映しの盃 一口で解ける',
      '月映しの盃 金の輪が残る',
      '月映しの盃 今夜だけでいい',
      '古い障子が ぽつり鳴れば',
      '笑うたびに袖が触れて',
      '昔話みたいに夜が深い',
      'もうすこし ここに...',
    ],
    explanation: '古民家の縁側、夜桜と月を肴に盃を酌み交わす。一口ごとに心の靄が晴れ、金の輪が水面にいつまでも残る、儚くも愛おしい夜の情景。',
  },
  {
    id: 'saigyo',
    category: '古典和歌',
    title: '望月の花',
    author: '西行法師',
    lines: [
      '願はくは',
      '花の下にて',
      '春死なむ',
      'そのきさらぎの',
      '望月のころ',
    ],
    explanation: '満開の桜の下、釈迦が入滅した如月十五夜の清らかな満月の光を浴びながら命を終えたいと願う、究極の美意識を詠んだ名歌。',
  },
  {
    id: 'narihira',
    category: '古典和歌',
    title: '春の心',
    author: '在原業平',
    lines: [
      '世の中に',
      'たえて桜の',
      'なかりせば',
      '春の心は',
      'のどけからまし',
    ],
    explanation: 'この世に桜というものが全くなかったなら、散るのを惜しんで落ち着かない春の心も、のどかであったろうに。',
  },
  {
    id: 'ooe',
    category: '古典和歌',
    title: '月見の情',
    author: '大江千里',
    lines: [
      '月見れば',
      '千々にものこそ',
      '悲しけれ',
      '我が身ひとつの',
      '秋にはあらねど',
    ],
    explanation: '月を見つめていると、様々な思いが湧き上がり切なく胸に迫る。決して私一人だけに訪れた夜ではないはずなのに。',
  },
];

export const PoetrySection: React.FC = () => {
  const [poems, setPoems] = useState<PoemItem[]>(INITIAL_POEMS);
  const [selectedPoem, setSelectedPoem] = useState<PoemItem>(INITIAL_POEMS[0]);
  const [activeTab, setActiveTab] = useState<'今宵の歌' | '古典和歌' | '自詠の短冊'>('今宵の歌');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customAuthor, setCustomAuthor] = useState<string>('');
  const [customVerse, setCustomVerse] = useState<string>('');

  const filteredPoems = poems.filter((p) => p.category === activeTab);

  const handleSelectPoem = (poem: PoemItem) => {
    setSelectedPoem(poem);
    sound.playKotoNote(Math.floor(Math.random() * 5));
  };

  const handleSaveVerse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVerse.trim()) return;

    const lines = customVerse
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const newPoem: PoemItem = {
      id: `custom-${Date.now()}`,
      category: '自詠の短冊',
      title: customTitle.trim() || '無題の夜',
      author: customAuthor.trim() || '今宵の旅人',
      lines: lines.length > 0 ? lines : [customVerse.trim()],
      explanation: '今宵の月と桜を仰ぎ見て、心に浮かんだ言の葉を短冊に留めた一句。',
    };

    setPoems([newPoem, ...poems]);
    setSelectedPoem(newPoem);
    setActiveTab('自詠の短冊');
    setIsComposing(false);
    setCustomTitle('');
    setCustomAuthor('');
    setCustomVerse('');
    sound.playWaterDrop();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-amber-200/75 uppercase font-serif">
          <span>風雅なる詞</span>
          <span aria-hidden="true" className="text-amber-500/40">·</span>
          <span>短冊の言の葉</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 tracking-wider mt-2">
          夜桜と月に寄せる詩情
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1 font-serif">
          静寂のなかで味わう「月映しの盃」の歌と、古より伝わる月見・花見の名歌。
        </p>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="flex p-1 bg-black/40 rounded-xl border border-stone-800">
          {(['今宵の歌', '古典和歌', '自詠の短冊'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                sound.playKotoNote(2);
              }}
              className={`px-4 py-2 text-xs font-serif rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-[#291e17] text-amber-100 border border-amber-600/40 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setIsComposing(!isComposing);
            sound.playWaterDrop();
          }}
          className="px-3.5 py-2 rounded-xl bg-amber-900/40 hover:bg-amber-800/50 border border-amber-500/40 text-amber-200 text-xs font-serif flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>短冊に詠む</span>
        </button>
      </div>

      {/* Verse Composition Modal/Drawer */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 rounded-2xl bg-[#17120e] border border-amber-600/30 overflow-hidden shadow-2xl"
          >
            <form onSubmit={handleSaveVerse} className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="font-serif text-sm text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  今宵の短冊に一句を認める
                </span>
                <span className="text-xs text-stone-400 font-serif">月見・夜桜の想いを筆に託す</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif text-stone-400 mb-1">題名（任意）</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="例：朧夜の盃"
                    className="w-full px-3 py-2 bg-black/40 border border-stone-800 rounded-lg text-xs font-serif text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif text-stone-400 mb-1">詠み人（雅号・名前）</label>
                  <input
                    type="text"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    placeholder="例：風流人"
                    className="w-full px-3 py-2 bg-black/40 border border-stone-800 rounded-lg text-xs font-serif text-stone-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-400 mb-1">和歌・俳句・詩（改行で句を分かちます）</label>
                <textarea
                  rows={3}
                  value={customVerse}
                  onChange={(e) => setCustomVerse(e.target.value)}
                  placeholder="花の色は 移りにけりな いたづらに..."
                  className="w-full px-3 py-2 bg-black/40 border border-stone-800 rounded-lg text-xs font-serif text-stone-200 focus:outline-none focus:border-amber-500/60 leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-4 py-2 rounded-lg bg-black/30 hover:bg-black/50 text-stone-400 text-xs font-serif transition-colors"
                >
                  取り消す
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 text-xs font-serif shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>短冊に墨書きする</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Poetry Display Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left: Scroll Selection List */}
        <div className="md:col-span-5 flex flex-col gap-2.5">
          {filteredPoems.length === 0 ? (
            <div className="p-8 text-center bg-black/20 rounded-xl border border-stone-800 text-xs font-serif text-stone-500">
              まだ短冊がありません。「短冊に詠む」から歌を認めてみましょう。
            </div>
          ) : (
            filteredPoems.map((poem) => (
              <div
                key={poem.id}
                onClick={() => handleSelectPoem(poem)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedPoem.id === poem.id
                    ? 'bg-[#211a14] border-amber-600/50 shadow-lg text-amber-100'
                    : 'bg-black/25 border-stone-800/80 hover:bg-black/40 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-serif text-sm font-medium text-stone-100">
                    {poem.title}
                  </span>
                  <span className="text-[11px] text-amber-400/80 font-serif">
                    {poem.author}
                  </span>
                </div>
                <div className="text-xs font-serif text-stone-400 line-clamp-2 leading-relaxed">
                  {poem.lines.slice(0, 2).join('　')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: The Traditional Tanzaku (短冊) Washi Parchment Card */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#251f18] via-[#1c1712] to-[#120f0c] border border-amber-500/20 shadow-2xl relative overflow-hidden min-h-[380px]">
          {/* Gold leaf flecks on washi texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(245,158,11,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute top-2 right-2 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

          {/* Traditional Tanzaku Hanging Ribbon Accent */}
          <div className="w-8 h-2.5 bg-red-900/60 rounded-full mb-6 border border-amber-600/30" />

          {/* Vertical Writing Japanese Calligraphy (縦書き短冊) */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 py-4 max-w-full overflow-x-auto">
            {/* The Poetry Lines in Japanese Tategaki (Right-to-Left vertical) */}
            <div className="flex flex-row-reverse gap-4 sm:gap-6 text-stone-100 font-serif leading-loose tracking-[0.28em] select-none">
              {selectedPoem.lines.map((line, idx) => (
                <div
                  key={idx}
                  className="tategaki text-base sm:text-lg text-stone-200 transition-opacity hover:text-amber-200 whitespace-nowrap min-h-[140px]"
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Author / Title in smaller vertical script with Red Seal (朱肉印) */}
            <div className="flex flex-col items-center justify-between border-l border-amber-600/20 pl-4 py-2 self-stretch select-none">
              <div className="tategaki text-xs text-stone-400 tracking-[0.3em]">
                {selectedPoem.title}
              </div>
              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="tategaki text-[11px] text-amber-300/80 tracking-widest">
                  {selectedPoem.author}
                </span>
                {/* Vermilion Stamp (朱印) */}
                <div className="w-6 h-6 rounded bg-[#991b1b] border border-amber-400/30 flex items-center justify-center text-[10px] text-amber-100 font-serif shadow">
                  印
                </div>
              </div>
            </div>
          </div>

          {/* Footnote commentary */}
          <div className="mt-8 pt-4 border-t border-stone-800/80 text-center w-full">
            <p className="text-xs font-serif text-stone-400 leading-relaxed max-w-md mx-auto">
              {selectedPoem.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
