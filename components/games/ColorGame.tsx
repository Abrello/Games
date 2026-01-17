
import React, { useState } from 'react';

interface ColorGameProps {
  balance: number;
  isGuest: boolean;
  onPlay: (amount: number, isWin: boolean, multiplier: number, details: string) => void;
}

const ColorGame: React.FC<ColorGameProps> = ({ balance, isGuest, onPlay }) => {
  const [bet, setBet] = useState(10);
  const [selected, setSelected] = useState<'Green' | 'Yellow'>('Green');
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<'Green' | 'Yellow' | null>(null);

  const startDuel = () => {
    if (bet > balance || playing) return;
    setPlaying(true);
    setResult(null);

    setTimeout(() => {
      // PROBABILITY LOGIC
      const winProbability = isGuest ? 0.70 : 0.30;
      const userWins = Math.random() < winProbability;
      
      const outcome = userWins ? selected : (selected === 'Green' ? 'Yellow' : 'Green');
      setResult(outcome);
      
      onPlay(bet, userWins, 1.90, `Landed on ${outcome}`);
      setPlaying(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto glass rounded-[2.5rem] p-10 border-slate-800 text-center space-y-8">
      <div className="flex justify-center items-center gap-12 py-8 relative">
        <div className={`w-32 h-32 rounded-3xl transition-all duration-300 ${playing ? 'animate-pulse scale-90' : 'scale-100'} ${result === 'Green' ? 'ring-4 ring-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : ''} bg-emerald-500 shadow-2xl shadow-emerald-500/20 flex items-center justify-center`}>
           <span className="text-emerald-950 font-black">GREEN</span>
        </div>
        <div className="text-2xl font-black text-slate-800">VS</div>
        <div className={`w-32 h-32 rounded-3xl transition-all duration-300 ${playing ? 'animate-pulse scale-90' : 'scale-100'} ${result === 'Yellow' ? 'ring-4 ring-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]' : ''} bg-amber-500 shadow-2xl shadow-amber-500/20 flex items-center justify-center`}>
           <span className="text-amber-950 font-black">YELLOW</span>
        </div>
        
        {playing && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px] rounded-3xl font-black text-white italic">Choosing...</div>}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setSelected('Green')}
            className={`py-4 rounded-2xl font-black text-xs transition-all ${selected === 'Green' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            SELECT GREEN (1.9x)
          </button>
          <button 
            onClick={() => setSelected('Yellow')}
            className={`py-4 rounded-2xl font-black text-xs transition-all ${selected === 'Yellow' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-500 hover:text-white'}`}
          >
            SELECT YELLOW (1.9x)
          </button>
        </div>

        <div className="flex gap-2">
          <input 
            type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}
            className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-mono font-bold focus:border-emerald-500 text-center outline-none"
          />
        </div>

        <button 
          onClick={startDuel}
          disabled={playing || bet > balance}
          className={`w-full ${isGuest ? 'bg-amber-500' : 'bg-emerald-500'} text-slate-950 py-5 rounded-2xl font-black text-sm tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50`}
        >
          {playing ? 'SYSTEM PROCESSING...' : 'CONFIRM SELECTION'}
        </button>
      </div>
    </div>
  );
};

export default ColorGame;
