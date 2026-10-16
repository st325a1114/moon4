import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Bell, Upload, Sparkles } from 'lucide-react';
import { sound } from '../utils/soundEngine';

export const AudioPlayerBar: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingCustomAudio, setIsPlayingCustomAudio] = useState<boolean>(false);
  const [customAudioName, setCustomAudioName] = useState<string>('月映しの盃（静夜の風情）');
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [ambientNightActive, setAmbientNightActive] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Start subtle night crickets on first user interaction
    const handleFirstClick = () => {
      if (ambientNightActive) {
        sound.startNightAmbience();
      }
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => {
      window.removeEventListener('click', handleFirstClick);
    };
  }, [ambientNightActive]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  const toggleNightAmbience = () => {
    if (ambientNightActive) {
      sound.stopNightAmbience();
      setAmbientNightActive(false);
    } else {
      sound.startNightAmbience();
      setAmbientNightActive(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomAudioName(file.name.replace(/\.[^/.]+$/, ''));
      setIsPlayingCustomAudio(true);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingCustomAudio) {
      audioRef.current.pause();
      setIsPlayingCustomAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingCustomAudio(true);
      }).catch(() => {
        // file prompt fallback
        fileInputRef.current?.click();
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e0c0a]/92 backdrop-blur-md border-t border-stone-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif">
        {/* Left: Audio Track & Theme */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2 text-amber-200/90">
            <Music className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium text-stone-200 truncate max-w-[200px] sm:max-w-xs">
              {customAudioName}
            </span>
          </div>

          {customAudioUrl && (
            <button
              onClick={toggleAudioPlay}
              className="p-1.5 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-200 hover:text-white"
            >
              {isPlayingCustomAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          )}

          {/* Hidden native audio element */}
          <audio
            ref={audioRef}
            loop
            onEnded={() => setIsPlayingCustomAudio(false)}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] text-stone-400 hover:text-amber-200 transition-colors flex items-center gap-1 border-b border-dashed border-stone-700 pb-0.5"
            title="お手元の音源（mp3/m4a等）を再生して月見を楽しむ"
          >
            <Upload className="w-3 h-3" />
            <span>曲を読み込む</span>
          </button>
        </div>

        {/* Right: Ambient Soundscape Controls */}
        <div className="flex items-center gap-4 text-stone-400 text-xs">
          {/* Night Ambience (鈴虫・秋の夜の虫の音) Toggle */}
          <button
            onClick={toggleNightAmbience}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              ambientNightActive
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-black/40 border-stone-800 text-stone-500'
            }`}
            title="鈴虫の微かな夜の鳴き声"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>鈴虫の音 {ambientNightActive ? '有' : '無'}</span>
          </button>

          {/* Shishi-odoshi trigger */}
          <button
            onClick={() => sound.playShishiOdoshi()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-stone-800 text-stone-300 hover:text-stone-100 transition-all"
            title="鹿威し（ししおどし）を叩く"
          >
            <Bell className="w-3 h-3 text-stone-400" />
            <span>鹿威し</span>
          </button>

          {/* Master Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-stone-800 text-stone-300 hover:text-white transition-colors"
            title={isMuted ? '音声を再開' : '消音（ミュート）'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
