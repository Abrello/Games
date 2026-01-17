
import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onBetClick: (game: Game, selection: 'A' | 'Draw' | 'B') => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onBetClick }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
          ACTIVE FIXTURES
        </h2>
        <div className="flex gap-2">
          {['ALL', 'FOOTBALL', 'NBA', 'ESPORTS'].map(cat => (
            <button key={cat} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-400 hover:text-white transition-colors">
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map(game => (
          <GameCard key={game.id} game={game} onBetClick={onBetClick} />
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
