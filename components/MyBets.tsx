
import React from 'react';
import { Bet } from '../types';

interface MyBetsProps {
  bets: Bet[];
}

const MyBets: React.FC<MyBetsProps> = ({ bets }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
        <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
        MY BETTING HISTORY
      </h2>

      {bets.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-slate-400 font-medium">No active or settled bets found.</p>
          <p className="text-slate-600 text-sm mt-1">Start betting to see your history here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bets.map(bet => (
            <div key={bet.id} className="glass rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-800">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Open</span>
                  <span className="text-slate-500 text-[10px] font-mono">#{bet.id}</span>
                </div>
                <h4 className="text-white font-bold text-lg">{bet.teamNames}</h4>
                <p className="text-slate-400 text-xs">
                  Selection: <span className="text-slate-200">{bet.selection === 'A' ? 'Team 1' : bet.selection === 'B' ? 'Team 2' : 'Draw'}</span> • 
                  Odds: <span className="text-emerald-400 font-mono font-bold">{bet.odds.toFixed(2)}</span>
                </p>
              </div>
              <div className="flex items-center gap-8 text-right min-w-[200px]">
                <div>
                  <span className="text-[10px] text-slate-500 font-black uppercase block">Stake</span>
                  <span className="text-white font-mono font-bold text-lg">${bet.amount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-black uppercase block">Potential Pay</span>
                  <span className="text-emerald-400 font-mono font-bold text-lg">${(bet.amount * bet.odds).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBets;
