
import React, { useState } from 'react';
import { Game } from '../types';
import { getSportsInsight } from '../services/geminiService';

interface GameCardProps {
  game: Game;
  onBetClick: (game: Game, selection: 'A' | 'Draw' | 'B') => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onBetClick }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getSportsInsight(game);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="glass rounded-xl p-5 hover:border-emerald-500/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{game.sport} • {game.league}</span>
          <div className="text-white font-bold flex flex-col mt-1">
            <span className="text-lg">{game.teamA}</span>
            <span className="text-slate-500 text-xs italic">vs</span>
            <span className="text-lg">{game.teamB}</span>
          </div>
        </div>
        <div className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-slate-400">
          LIVE {game.startTime}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button 
          onClick={() => onBetClick(game, 'A')}
          className="bg-slate-800/50 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500/50 p-2 rounded-lg flex flex-col items-center transition-all"
        >
          <span className="text-[10px] text-slate-500 font-bold">1</span>
          <span className="text-emerald-400 font-mono font-bold">{game.oddsA.toFixed(2)}</span>
        </button>
        {game.oddsDraw ? (
          <button 
            onClick={() => onBetClick(game, 'Draw')}
            className="bg-slate-800/50 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500/50 p-2 rounded-lg flex flex-col items-center transition-all"
          >
            <span className="text-[10px] text-slate-500 font-bold">X</span>
            <span className="text-emerald-400 font-mono font-bold">{game.oddsDraw.toFixed(2)}</span>
          </button>
        ) : (
          <div className="p-2 flex items-center justify-center text-slate-600">—</div>
        )}
        <button 
          onClick={() => onBetClick(game, 'B')}
          className="bg-slate-800/50 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500/50 p-2 rounded-lg flex flex-col items-center transition-all"
        >
          <span className="text-[10px] text-slate-500 font-bold">2</span>
          <span className="text-emerald-400 font-mono font-bold">{game.oddsB.toFixed(2)}</span>
        </button>
      </div>

      <div className="border-t border-slate-800 pt-4 mt-2">
        {!insight ? (
          <button 
            onClick={fetchInsight}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors py-1"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <svg className="animate-spin h-3 w-3 text-emerald-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ANALYZING MATCH...
              </span>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                GET SMART INSIGHT
              </>
            )}
          </button>
        ) : (
          <div className="text-xs bg-slate-900/50 p-3 rounded-lg border border-emerald-500/20 text-slate-300 animate-in fade-in slide-in-from-top-1">
            <span className="text-emerald-400 font-bold block mb-1">AI ANALYST:</span>
            {insight}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
