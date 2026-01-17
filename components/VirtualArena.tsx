
import React, { useState, useEffect, useRef } from 'react';
import { VirtualGameType } from '../types';
import DiceGame from './games/DiceGame';
import ColorGame from './games/ColorGame';
import AviatorGame from './games/AviatorGame';
import ChickenRoad from './games/ChickenRoad';

interface VirtualArenaProps {
  userBalance: number;
  isGuest: boolean;
  onRequestAuth: () => void;
  onResult: (type: VirtualGameType, amount: number, isWin: boolean, multiplier: number, details: string) => void;
}

export type CrashState = 'WAITING' | 'FLYING' | 'CRASHED';

export interface FakePlayer {
  id: string;
  name: string;
  bet: number;
  cashoutMultiplier: number | null;
  targetMultiplier: number;
  isLoser: boolean;
  hasLost: boolean;
}

const FAKE_NAMES = [
  'Abebe_251', 'Makeda_Queen', 'Dawit.Bet', 'Selam_99', 'Elias.X', 'Tewodros_7',
  'Zelalem_Win', 'Hana_Bet', 'Kebede_Pro', 'Biniyam.10x', 'Sara_Gold', 'Yonas_Fast',
  'Millionaire_ET', 'Bet_Master', 'Speedy_G', 'Sky_High', 'Jet_Setter', 'Lucky_Charm'
];

const VirtualArena: React.FC<VirtualArenaProps> = ({ userBalance, isGuest, onRequestAuth, onResult }) => {
  const [activeTab, setActiveTab] = useState<VirtualGameType>(VirtualGameType.AVIATOR);

  // Crash Game Global State
  const [crashMultiplier, setCrashMultiplier] = useState(1.0);
  const [crashState, setCrashState] = useState<CrashState>('WAITING');
  const [crashCountdown, setCrashCountdown] = useState(5);
  const [crashLiveBets, setCrashLiveBets] = useState<FakePlayer[]>([]);
  
  const crashMultiplierRef = useRef<number>(1.0);
  const crashPointRef = useRef<number>(1.0);
  const intervalsRef = useRef<{ multiplier: number | null; countdown: number | null }>({ multiplier: null, countdown: null });

  useEffect(() => {
    startWaitingPhase();
    return () => stopIntervals();
  }, []);

  const stopIntervals = () => {
    if (intervalsRef.current.multiplier) clearInterval(intervalsRef.current.multiplier);
    if (intervalsRef.current.countdown) clearInterval(intervalsRef.current.countdown);
  };

  const generateFakeBets = () => {
    const count = Math.floor(Math.random() * 10) + 10;
    const players: FakePlayer[] = [];
    for (let i = 0; i < count; i++) {
      const isLoser = Math.random() < 0.50; // 50% chance to be a designated loser
      players.push({
        id: Math.random().toString(36).substr(2, 5),
        name: FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)],
        bet: Math.floor(Math.random() * 1000) + 50,
        cashoutMultiplier: null,
        targetMultiplier: isLoser ? 999.0 : (Math.random() * 3 + 1.1),
        isLoser: isLoser,
        hasLost: false
      });
    }
    setCrashLiveBets(players);
  };

  const startWaitingPhase = () => {
    stopIntervals();
    setCrashState('WAITING');
    setCrashCountdown(5);
    setCrashMultiplier(1.0);
    crashMultiplierRef.current = 1.0;
    generateFakeBets();

    intervalsRef.current.countdown = window.setInterval(() => {
      setCrashCountdown(prev => {
        if (prev <= 1) {
          startFlyingPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlyingPhase = () => {
    stopIntervals();
    setCrashState('FLYING');

    // House edge simulation
    const isInstantCrash = Math.random() < 0.10; // 10% chance to crash at 1.00
    if (isInstantCrash) {
      crashPointRef.current = 1.00;
      handleCrash();
      return;
    }

    // Normal flight logic
    crashPointRef.current = Math.random() * 10 + 1.05;

    // Timing Requirement: 1.00 to 2.00 in 10 seconds.
    // 10s = 10,000ms. With 50ms interval, that's 200 ticks.
    // Total increase = 1.0. Increase per tick = 1.0 / 200 = 0.005.
    const TICK_INCREMENT = 0.005;

    intervalsRef.current.multiplier = window.setInterval(() => {
      const current = crashMultiplierRef.current;
      const next = current + TICK_INCREMENT;
      
      crashMultiplierRef.current = next;
      setCrashMultiplier(next);

      // Handle Fake Player Cashouts
      setCrashLiveBets(currentBets => currentBets.map(p => {
        if (!p.cashoutMultiplier && next >= p.targetMultiplier && next < crashPointRef.current) {
          return { ...p, cashoutMultiplier: next };
        }
        return p;
      }));

      if (next >= crashPointRef.current) {
        handleCrash();
      }
    }, 50);
  };

  const handleCrash = () => {
    stopIntervals();
    setCrashState('CRASHED');
    setCrashLiveBets(current => current.map(p => {
      if (!p.cashoutMultiplier) return { ...p, hasLost: true };
      return p;
    }));

    setTimeout(() => {
      startWaitingPhase();
    }, 3000);
  };

  const handlePlay = (type: VirtualGameType, amount: number, isWin: boolean, multiplier: number, details: string) => {
    onResult(type, amount, isWin, multiplier, details);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {isGuest && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-black italic">!</div>
             <div>
               <h4 className="text-amber-500 text-xs font-black uppercase">Practice Arena (5000 ETB)</h4>
               <p className="text-slate-500 text-[10px] font-bold">You are playing with demo credits. No real deposits required.</p>
             </div>
           </div>
           <button onClick={onRequestAuth} className="bg-amber-500 text-slate-950 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Login for Real Mode</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-1 justify-center md:justify-start">
          {Object.values(VirtualGameType).map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-3 rounded-xl text-[9px] font-black transition-all uppercase tracking-tighter ${
                activeTab === type 
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                : 'text-slate-500 hover:text-white hover:bg-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="px-6 py-2 flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${isGuest ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></span>
           <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
             {isGuest ? 'Demo Engine Sync' : 'Real-Time Server'}
           </span>
        </div>
      </div>

      <div className="animate-in fade-in zoom-in-95 duration-500">
        {activeTab === VirtualGameType.DICE && (
          <DiceGame balance={userBalance} onPlay={(a, w, m, d) => handlePlay(VirtualGameType.DICE, a, w, m, d)} isGuest={isGuest} />
        )}
        {activeTab === VirtualGameType.COLOR && (
          <ColorGame balance={userBalance} onPlay={(a, w, m, d) => handlePlay(VirtualGameType.COLOR, a, w, m, d)} isGuest={isGuest} />
        )}
        {(activeTab === VirtualGameType.AVIATOR || activeTab === VirtualGameType.JETX) && (
          <AviatorGame 
            balance={userBalance} 
            onPlay={(a, w, m, d) => handlePlay(activeTab, a, w, m, d)} 
            title={activeTab === VirtualGameType.AVIATOR ? "AVIATOR" : "JET-X"} 
            isGuest={isGuest}
            multiplier={crashMultiplier}
            gameState={crashState}
            countdown={crashCountdown}
            liveBets={crashLiveBets}
          />
        )}
        {activeTab === VirtualGameType.WALKER && (
          <ChickenRoad balance={userBalance} onPlay={(a, w, m, d) => handlePlay(VirtualGameType.WALKER, a, w, m, d)} isGuest={isGuest} />
        )}
      </div>
    </div>
  );
};

export default VirtualArena;
