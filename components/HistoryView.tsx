
import React from 'react';
import { GameOutcome } from '../types';

interface HistoryViewProps {
  history: GameOutcome[];
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors mb-4">
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         Back to Games
      </button>

      <h2 className="text-2xl font-extrabold text-white flex items-center gap-3 mb-8">
        <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
        ARENA LOGS
      </h2>

      {history.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center border-slate-800">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No game data found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(item => (
            <div key={item.id} className="glass rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-900 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${item.status === 'WIN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                  {item.status === 'WIN' ? 'W' : 'L'}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-tight">{item.gameType}</h4>
                  <p className="text-[10px] text-slate-500 font-bold">{item.details} • {item.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 justify-between w-full md:w-auto md:text-right">
                <div>
                  <span className="text-[10px] text-slate-600 font-black uppercase block">Stake</span>
                  <span className="text-slate-300 font-mono text-sm">${item.betAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 font-black uppercase block">Payout</span>
                  <span className={`font-mono font-black text-sm ${item.payout > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                    ${item.payout.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
