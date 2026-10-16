import React from 'react';
import { Wind } from 'lucide-react';
import { sound } from '../utils/soundEngine';

interface HeaderBarProps {
  onBreezeClick: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onBreezeClick,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0d1017]/90 backdrop-blur-md border-b border-stone-800/80 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#engawa"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('engawa');
          }}
          className="text-lg sm:text-xl font-serif font-bold tracking-widest text-amber-100 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="text-amber-400">❖</span>
          <span>月映しの庵</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-serif text-stone-300">
          <button
            onClick={() => onNavigate('engawa')}
            className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeSection === 'engawa' ? 'text-amber-300 border-b border-amber-400' : ''
            }`}
          >
            縁側の眺望
          </button>
          <button
            onClick={() => onNavigate('sakazuki')}
            className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeSection === 'sakazuki' ? 'text-amber-300 border-b border-amber-400' : ''
            }`}
          >
            月映しの盃
          </button>
          <button
            onClick={() => onNavigate('accompaniment')}
            className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeSection === 'accompaniment' ? 'text-amber-300 border-b border-amber-400' : ''
            }`}
          >
            茶托と酒肴
          </button>
          <button
            onClick={() => onNavigate('poetry')}
            className={`hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeSection === 'poetry' ? 'text-amber-300 border-b border-amber-400' : ''
            }`}
          >
            短冊と詩情
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onBreezeClick();
              sound.playWindChime();
            }}
            className="px-4 py-2 text-xs font-serif font-medium text-amber-50 bg-[#2b211a] hover:bg-[#382b22] border border-amber-600/40 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Wind className="w-3.5 h-3.5 text-pink-300" />
            <span>夜風を吹かせる</span>
          </button>
        </div>
      </div>
    </header>
  );
};
