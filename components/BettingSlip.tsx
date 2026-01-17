
import React from 'react';
import { Bet } from '../types';

interface BettingSlipProps {
  bets: Bet[];
  balance: number;
  onRemove: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onPlaceBets: () => void;
}

const BettingSlip: React.FC<BettingSlipProps> = ({ bets, balance, onRemove, onUpdateAmount, onPlaceBets }) => {
  const totalStake = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const potentialWinnings = bets.reduce((sum, bet) => sum + (bet.amount * bet.odds), 0);

  return (
    <div className="glass rounded-xl p-6 sticky top-24 border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          BET SLIP
          <span className="bg-emerald-500 text-slate-900 px-2 py-0.5 rounded text-xs font-black">{bets.length}</span>
        </h3>
        <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Clear All</button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {bets.map(bet => (
          <div key={bet.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 relative group">
            <button 
              onClick={() => onRemove(bet.id)}
              className="absolute top-2 right-2 text-slate-600 hover:text-rose-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-[10px] text-emerald-400 font-bold mb-1">Selection: {bet.selection === 'A' ? 'Team 1' : bet.selection === 'B' ? 'Team 2' : 'Draw'}</div>
            <div className="text-sm font-bold text-white mb-2 leading-tight">{bet.teamNames}</div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded border border-slate-700">
                <span className="text-slate-500 text-[10px]">$</span>
                <input 
                  type="number" 
                  value={bet.amount}
                  onChange={(e) => onUpdateAmount(bet.id, Number(e.target.value))}
                  className="bg-transparent text-white font-mono font-bold w-16 focus:outline-none text-sm"
                />
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Odds</div>
                <div className="text-emerald-400 font-mono font-bold">{bet.odds.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-slate-800 pt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 font-medium">Total Stake</span>
          <span className="text-white font-mono font-bold">${totalStake.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 font-medium">Potential Returns</span>
          <span className="text-emerald-400 font-mono font-bold text-lg">${potentialWinnings.toFixed(2)}</span>
        </div>

        <button 
          onClick={onPlaceBets}
          disabled={totalStake <= 0 || totalStake > balance}
          className={`w-full py-4 rounded-xl font-black text-sm tracking-widest transition-all ${
            totalStake > balance 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
          }`}
        >
          {totalStake > balance ? 'INSUFFICIENT FUNDS' : 'PLACE BETS NOW'}
        </button>
      </div>
    </div>
  );
};

export default BettingSlip;
