
import React, { useState, useEffect } from 'react';
import { CrashState, FakePlayer } from '../VirtualArena';

interface AviatorGameProps {
  balance: number;
  isGuest: boolean;
  onPlay: (amount: number, isWin: boolean, multiplier: number, details: string) => void;
  title?: string;
  multiplier: number;
  gameState: CrashState;
  countdown: number;
  liveBets: FakePlayer[];
}

const AviatorGame: React.FC<AviatorGameProps> = ({ 
  balance, 
  onPlay, 
  title = "AVIATOR", 
  isGuest,
  multiplier,
  gameState,
  countdown,
  liveBets
}) => {
  const [betInput, setBetInput] = useState(10);
  const [queuedBet, setQueuedBet] = useState<number | null>(null);
  const [activeBet, setActiveBet] = useState<number | null>(null);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [betStatus, setBetStatus] = useState<string | null>(null);

  useEffect(() => {
    if (gameState === 'FLYING') {
      if (queuedBet !== null) {
        setActiveBet(queuedBet);
        setQueuedBet(null);
        setBetStatus("BET ACCEPTED");
      }
    } else if (gameState === 'WAITING') {
      setActiveBet(null);
      setHasCashedOut(false);
      setBetStatus(null);
    } else if (gameState === 'CRASHED') {
      if (activeBet !== null && !hasCashedOut) {
        setBetStatus("LOST!");
        onPlay(activeBet, false, 0, `${title} Crashed at ${multiplier.toFixed(2)}x`);
      }
    }
  }, [gameState]);

  const handlePlaceBet = () => {
    if (betInput > balance) return;
    setQueuedBet(betInput);
    setBetStatus("BET ACCEPTED");
  };

  const handleCancelBet = () => {
    setQueuedBet(null);
    setBetStatus(null);
  };

  const handleCashout = () => {
    if (gameState !== 'FLYING' || activeBet === null || hasCashedOut) return;
    setHasCashedOut(true);
    setBetStatus(`YOU WON!`);
    onPlay(activeBet, true, multiplier, `${title} Cashout at ${multiplier.toFixed(2)}x`);
  };

  const isJetX = title === 'JET-X';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar: Live Bets */}
      <div className="w-full lg:w-72 glass rounded-3xl p-6 border-slate-800 flex flex-col h-[600px] order-2 lg:order-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Arena Live</h4>
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
            {liveBets.length + (activeBet ? 1 : 0)} Online
          </span>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-1 space-y-2 custom-scrollbar">
          {activeBet && (
            <div className={`p-3 rounded-xl flex flex-col gap-1 border transition-all ${hasCashedOut ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white">YOU</span>
                <span className="text-[10px] font-bold text-slate-300 font-mono">ETB {activeBet.toFixed(0)}</span>
              </div>
              {hasCashedOut && (
                 <div className="flex justify-between items-center animate-in fade-in">
                   <span className="text-[9px] font-bold text-yellow-400">{(multiplier).toFixed(2)}x</span>
                   <span className="text-[10px] font-black text-yellow-400">ETB {(activeBet * multiplier).toFixed(2)}</span>
                 </div>
              )}
            </div>
          )}

          {liveBets.map((player) => (
            <div key={player.id} className={`bg-slate-900/50 border border-slate-800/50 p-3 rounded-xl flex flex-col gap-1 transition-all ${player.cashoutMultiplier ? 'border-emerald-500/20 bg-emerald-500/5' : ''} ${player.hasLost ? 'opacity-40 grayscale' : ''}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-300 truncate max-w-[100px]">{player.name}</span>
                <span className="text-[10px] font-bold text-slate-500 font-mono">ETB {player.bet.toFixed(0)}</span>
              </div>
              {player.cashoutMultiplier && (
                 <div className="flex justify-between items-center animate-in fade-in">
                   <span className="text-[9px] font-bold text-emerald-500">{(player.cashoutMultiplier).toFixed(2)}x</span>
                   <span className="text-[10px] font-black text-emerald-400">ETB {(player.bet * player.cashoutMultiplier).toFixed(2)}</span>
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="flex-grow grid grid-cols-1 gap-6 order-1 lg:order-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl h-[450px] flex flex-col items-center justify-center border-slate-800 relative overflow-hidden bg-slate-950/50">
            <div className="absolute top-4 left-4 z-20">
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isGuest ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-emerald-400'}`}>
                {isGuest ? 'DEMO MODE' : 'REAL ARENA'}
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {gameState === 'WAITING' ? (
                <>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Round Starting</div>
                  <div className="text-7xl font-black text-white tabular-nums">{countdown}s</div>
                  <div className="w-48 h-1 bg-slate-900 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 ease-linear" style={{ width: `${(countdown / 5) * 100}%` }}></div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`text-8xl font-black tabular-nums transition-all ${gameState === 'CRASHED' ? 'text-rose-600 scale-90' : 'text-white'}`}>
                    {multiplier.toFixed(2)}x
                  </div>
                  {gameState === 'CRASHED' && <div className="text-rose-500 font-black uppercase tracking-[0.3em] mt-4 animate-bounce">Flew Away!</div>}
                </>
              )}
            </div>

            {gameState === 'FLYING' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                  className="absolute bottom-20 left-10 w-24 h-24 flex items-center justify-center transition-all duration-100"
                  style={{ transform: `translate(${multiplier * 20}px, ${-Math.min(multiplier * 25, 200)}px)` }}
                >
                  <div className={`w-12 h-12 ${isJetX ? 'bg-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.7)]' : 'bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.7)]'} rounded-xl rotate-45 animate-pulse`}></div>
                  <div className="absolute -left-40 w-40 h-1.5 bg-gradient-to-l from-emerald-500/50 to-transparent"></div>
                </div>
              </div>
            )}
          </div>

          <div className="glass rounded-3xl p-8 border-slate-800 flex flex-col justify-center space-y-6">
            <div className="text-center">
              <h3 className="text-white font-black text-3xl tracking-tighter italic">{title}</h3>
              {betStatus && (
                <p className={`text-[14px] font-black uppercase tracking-[0.2em] mt-2 py-1.5 rounded-xl animate-pulse ${betStatus === 'YOU WON!' ? 'text-yellow-400 bg-yellow-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
                  {betStatus}
                </p>
              )}
            </div>

            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Stake (ETB)</label>
              <input 
                type="number" value={betInput} onChange={(e) => setBetInput(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-white font-mono font-black text-center focus:border-emerald-500 outline-none text-2xl"
                disabled={queuedBet !== null || (activeBet !== null && !hasCashedOut)}
              />
            </div>

            <div className="space-y-3">
              {gameState === 'FLYING' && activeBet !== null && !hasCashedOut ? (
                <button 
                  onClick={handleCashout} 
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-6 rounded-3xl font-black text-sm tracking-widest shadow-2xl shadow-emerald-500/40 active:scale-95 transition-all flex flex-col items-center border-b-4 border-emerald-700"
                >
                  <span className="text-[10px] uppercase tracking-widest mb-1 font-bold">CASHOUT NOW</span>
                  <span className="text-2xl">{(activeBet * multiplier).toFixed(2)} ETB</span>
                </button>
              ) : queuedBet !== null ? (
                <button 
                  onClick={handleCancelBet} 
                  className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-500 py-6 rounded-3xl font-black text-sm tracking-widest transition-all active:scale-95 flex flex-col items-center"
                >
                   <span className="text-[10px] uppercase tracking-widest mb-1">CANCEL BET</span>
                   <span className="text-lg">STAKE: {queuedBet}</span>
                </button>
              ) : (
                <button 
                  onClick={handlePlaceBet}
                  disabled={betInput > balance || (activeBet !== null && !hasCashedOut)}
                  className={`w-full ${isJetX ? 'bg-amber-500 border-amber-700' : 'bg-emerald-500 border-emerald-700'} text-slate-950 py-6 rounded-3xl font-black text-sm tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50 border-b-4`}
                >
                  {gameState === 'WAITING' ? 'PLACE BET' : 'BET FOR NEXT'}
                </button>
              )}
            </div>

            <div className="px-5 py-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${activeBet ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
              </div>
              <span className="text-[11px] font-black text-white uppercase italic">
                {activeBet ? (hasCashedOut ? 'WON' : 'FLYING') : 'SPECTATING'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviatorGame;
