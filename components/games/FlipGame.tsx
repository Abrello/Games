
import React, { useState } from 'react';

interface FlipGameProps {
  balance: number;
  onPlay: (amount: number, isWin: boolean, multiplier: number, details: string) => void;
}

const FlipGame: React.FC<FlipGameProps> = ({ balance, onPlay }) => {
  const [bet, setBet] = useState(10);
  const [side, setSide] = useState<'Heads' | 'Tails'>('Heads');
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const flip = () => {
    if (bet > balance || flipping) return;
    setFlipping(true);
    setResult(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'Heads' : 'Tails';
      const isWin = outcome === side;
      setResult(outcome);
      onPlay(bet, isWin, 1.95, `Flipped ${outcome} (Bet on ${side})`);
      setFlipping(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="space-y-8">
        <div className="flex justify-center">
          <div className={`w-40 h-40 rounded-full border-4 border-emerald-500/30 flex items-center justify-center transition-all duration-1000 ${flipping ? 'rotate-[720deg] scale-75' : 'rotate-0 scale-100'}`}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <span className="text-slate-950 text-4xl font-black">{flipping ? '?' : result?.[0] || side[0]}</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-white font-black text-xl mb-1 uppercase tracking-tight">Neon Flip</h3>
          <p className="text-slate-500 text-xs">Double your money in a second</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 border-slate-800 space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-4 text-center">Select Side</label>
          <div className="flex gap-4">
            <button 
              onClick={() => setSide('Heads')}
              className={`flex-1 py-4 rounded-2xl font-black transition-all ${side === 'Heads' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
            >
              HEADS
            </button>
            <button 
              onClick={() => setSide('Tails')}
              className={`flex-1 py-4 rounded-2xl font-black transition-all ${side === 'Tails' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
            >
              TAILS
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">Stake Amount</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
             <input 
              type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-8 pr-4 py-4 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button 
          onClick={flip}
          disabled={flipping || bet > balance}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-5 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50"
        >
          {flipping ? 'FLIPPING...' : 'PLACE BET'}
        </button>
      </div>
    </div>
  );
};

export default FlipGame;
