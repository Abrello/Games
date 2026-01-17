
import React, { useState, useEffect } from 'react';
import { getGameStrategy } from '../../services/geminiService';
import { VirtualGameType } from '../../types';

interface DiceGameProps {
  balance: number;
  isGuest: boolean;
  onPlay: (amount: number, isWin: boolean, multiplier: number, details: string) => void;
}

const DiceGame: React.FC<DiceGameProps> = ({ balance, isGuest, onPlay }) => {
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(50);
  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    getGameStrategy(VirtualGameType.DICE).then(setInsight);
  }, []);

  const rollDice = () => {
    if (bet > balance || rolling) return;
    
    setRolling(true);
    setTimeout(() => {
      // RNG LOGIC
      // Demo: 70% chance to roll > target
      // Real: 30% chance to roll > target
      const winProb = isGuest ? 0.70 : 0.30;
      const userWins = Math.random() < winProb;
      
      let roll: number;
      if (userWins) {
        // Roll between (target + 1) and 100
        roll = Math.floor(Math.random() * (100 - target)) + target + 1;
      } else {
        // Roll between 1 and target
        roll = Math.floor(Math.random() * target) + 1;
      }
      
      const multiplier = 98 / (100 - target);
      setLastRoll(roll);
      onPlay(bet, userWins, multiplier, `Rolled ${roll} (Mode: ${isGuest ? 'Demo' : 'Real'})`);
      setRolling(false);
    }, 800);
  };

  const currentMultiplier = (98 / (100 - target)).toFixed(2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 glass rounded-3xl p-6 border-slate-800">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">Amount</label>
            <div className="flex gap-2">
              <input 
                type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
              <button onClick={() => setBet(bet * 2)} className="bg-slate-800 px-3 rounded-xl text-[10px] font-bold">2X</button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3">Roll Over ({target})</label>
            <input 
              type="range" min="5" max="95" value={target} 
              onChange={(e) => setTarget(Number(e.target.value))}
              className={`w-full ${isGuest ? 'accent-amber-500' : 'accent-emerald-500'}`}
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-bold uppercase">Payout</span>
            <span className="text-emerald-400 font-black">{currentMultiplier}x</span>
          </div>

          <button 
            onClick={rollDice}
            disabled={rolling || bet > balance}
            className={`w-full ${isGuest ? 'bg-amber-500' : 'bg-emerald-500'} text-slate-950 py-5 rounded-2xl font-black text-sm tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50`}
          >
            {rolling ? 'ROLLING...' : isGuest ? 'DEMO ROLL' : 'ROLL DICE'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="glass rounded-3xl h-[300px] flex flex-col items-center justify-center border-slate-800 relative overflow-hidden">
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black uppercase ${isGuest ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isGuest ? 'DEMO ARENA' : 'REAL ARENA'}
          </div>
          
          <div className={`text-8xl font-black transition-all duration-500 ${rolling ? 'scale-110 blur-sm' : 'scale-100'} ${lastRoll && lastRoll > target ? 'text-emerald-500' : 'text-slate-200'}`}>
            {rolling ? '??' : lastRoll || '00'}
          </div>
          <div className="text-xs font-bold text-slate-500 mt-4 uppercase tracking-[0.3em]">Result Output</div>
        </div>

        <div className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800">
          <p className="text-xs text-slate-400 italic">"AI Strategist: {insight}"</p>
        </div>
      </div>
    </div>
  );
};

export default DiceGame;
