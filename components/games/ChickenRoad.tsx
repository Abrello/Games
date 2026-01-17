
import React, { useState } from 'react';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

const DIFFICULTY_CONFIG = {
  EASY: { 
    multipliers: [1.8, 4.2, 9.5, 16.0, 24.0],
    winProb: 0.85,
    label: 'EASY',
    color: 'emerald'
  },
  MEDIUM: { 
    multipliers: [2.5, 6.0, 12.8, 22.0, 34.0],
    winProb: 0.72,
    label: 'MEDIUM',
    color: 'amber'
  },
  HARD: { 
    multipliers: [3.5, 9.2, 21.0, 38.5, 54.0],
    winProb: 0.58,
    label: 'HARD',
    color: 'rose'
  }
};

interface ChickenRoadProps {
  balance: number;
  isGuest: boolean;
  onPlay: (amount: number, isWin: boolean, multiplier: number, details: string) => void;
}

const ChickenRoad: React.FC<ChickenRoadProps> = ({ balance, isGuest, onPlay }) => {
  const [bet, setBet] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [step, setStep] = useState(0); 
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]); 

  const config = DIFFICULTY_CONFIG[difficulty];

  const startRoad = () => {
    if (bet > balance || playing) return;
    setPlaying(true);
    setStep(1);
    setRevealed([]);
  };

  const takeStep = () => {
    if (!playing) return;
    
    // Adjusted probability logic based on difficulty and real/demo mode
    const baseProb = config.winProb;
    const finalProb = isGuest ? baseProb : (baseProb * 0.75); 
    
    const isSafe = Math.random() < finalProb;
    
    if (isSafe) {
      if (step === 5) {
        onPlay(bet, true, config.multipliers[4], `Walker Man completed ${difficulty} mission!`);
        reset();
      } else {
        setRevealed([...revealed, step]);
        setStep(step + 1);
      }
    } else {
      onPlay(bet, false, 0, `Walker Man fell on step ${step} (${difficulty})`);
      reset();
    }
  };

  const cashOut = () => {
    if (!playing || step <= 1) return;
    const mult = config.multipliers[step - 2];
    onPlay(bet, true, mult, `Walker Man extracted at Step ${step-1} (${difficulty})`);
    reset();
  };

  const reset = () => {
    setPlaying(false);
    setStep(0);
    setRevealed([]);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-4 justify-between">
           {[1, 2, 3, 4, 5].map(s => (
             <div 
               key={s} 
               className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                 step === s ? 'border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' : revealed.includes(s) ? 'border-emerald-900 bg-emerald-900/10' : 'border-slate-800 bg-slate-900/50'
               }`}
             >
                <div className="mb-2">
                  {step === s ? (
                    <div className="text-3xl animate-bounce">🚶‍♂️</div>
                  ) : revealed.includes(s) ? (
                    <div className="text-xl opacity-50">✔️</div>
                  ) : (
                    <div className="text-xl opacity-10">⭕</div>
                  )}
                </div>
                <span className={`text-[10px] font-black ${step >= s ? 'text-white' : 'text-slate-700'}`}>MILE {s}</span>
                <span className="text-[10px] font-black text-emerald-500/80">{config.multipliers[s-1].toFixed(1)}x</span>
             </div>
           ))}
        </div>
        <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
           <div 
             className={`h-full ${difficulty === 'EASY' ? 'bg-emerald-500' : difficulty === 'MEDIUM' ? 'bg-amber-500' : 'bg-rose-500'} transition-all duration-500`} 
             style={{ width: `${(step / 5) * 100}%` }}
           ></div>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 border-slate-800 space-y-6 text-center">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-slate-800 mb-2">
           <span className="text-3xl">🤖</span>
        </div>
        <h3 className="text-white font-black text-xl tracking-tighter uppercase italic">WALKER MAN</h3>
        
        {!playing ? (
          <div className="space-y-4">
            <div className="flex bg-slate-900/50 p-1 rounded-xl gap-1">
               {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
                 <button 
                  key={d} 
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 text-[8px] font-black rounded-lg transition-all ${difficulty === d ? 'bg-slate-700 text-white shadow-inner' : 'text-slate-500 hover:text-white'}`}
                 >
                   {d}
                 </button>
               ))}
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase">Input Stake (ETB)</label>
              <input 
                type="number" value={bet} onChange={(e) => setBet(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono font-bold text-center text-xl outline-none focus:border-emerald-500"
              />
            </div>
            <button onClick={startRoad} className={`w-full ${isGuest ? 'bg-amber-500' : 'bg-emerald-500'} text-slate-950 font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all`}>
              BEGIN MISSION
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
               <span className="text-[9px] font-black text-slate-500 uppercase">Locked Odds</span>
               <span className="text-emerald-400 font-black text-lg">{step > 1 ? config.multipliers[step-2].toFixed(2) : '1.00'}x</span>
            </div>
            <button 
              onClick={takeStep}
              className={`w-full ${difficulty === 'EASY' ? 'bg-emerald-500' : difficulty === 'MEDIUM' ? 'bg-amber-500' : 'bg-rose-500'} text-slate-950 font-black py-5 rounded-xl shadow-lg animate-pulse uppercase tracking-widest text-xs border-b-4 border-black/20`}
            >
              MOVE TO MILE {step}
            </button>
            <button 
              onClick={cashOut}
              disabled={step < 2}
              className="w-full bg-slate-800 text-white font-black py-3 rounded-xl disabled:opacity-30 uppercase tracking-widest text-[9px] hover:bg-slate-700 transition-colors"
            >
              SECURE PROFIT ({(bet * (config.multipliers[step - 2] || 1)).toFixed(2)} ETB)
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/50">
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
             Risk Level: <span className={difficulty === 'HARD' ? 'text-rose-500' : difficulty === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'}>{difficulty} (Target {config.multipliers[4].toFixed(0)}x)</span>
           </p>
        </div>
      </div>
    </div>
  );
};

export default ChickenRoad;
