
import React, { useState } from 'react';

interface MultiplierGameProps {
  balance: number;
  onPlay: (amount: number, isWin: boolean, multiplier: number, details: string) => void;
}

const MultiplierGame: React.FC<MultiplierGameProps> = ({ balance, onPlay }) => {
  const [bet, setBet] = useState(10);
  const [loading, setLoading] = useState(false);

  const startRace = () => {
    if (bet > balance || loading) return;
    setLoading(true);

    setTimeout(() => {
      const lucky = Math.random();
      let isWin = false;
      let mult = 0;
      
      if (lucky > 0.95) { mult = 10; isWin = true; }
      else if (lucky > 0.8) { mult = 3; isWin = true; }
      else if (lucky > 0.6) { mult = 1.5; isWin = true; }

      onPlay(bet, isWin, mult, isWin ? `${mult}x Lucky Bonus!` : 'Algorithm Reset');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto glass rounded-3xl p-10 border-slate-800 text-center">
      <div className="mb-8">
        <div className={`text-6xl font-black mb-2 transition-all ${loading ? 'animate-pulse text-emerald-400' : 'text-white'}`}>
          {loading ? 'X.XX' : '1.00'}
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Current Multiplier Velocity</p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <input 
            type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}
            className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 text-center"
          />
        </div>

        <button 
          onClick={startRace}
          disabled={loading || bet > balance}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-5 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'CALCULATING...' : 'START MULTIPLIER'}
        </button>

        <div className="grid grid-cols-3 gap-2">
          {[1.5, 3, 10].map(m => (
            <div key={m} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-600 font-bold block mb-1">PROB</span>
              <span className="text-emerald-400 font-black">{m}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiplierGame;
