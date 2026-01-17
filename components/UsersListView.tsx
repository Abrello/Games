
import React from 'react';
import { User } from '../types';

interface UsersListViewProps {
  onBack: () => void;
}

const UsersListView: React.FC<UsersListViewProps> = ({ onBack }) => {
  const users: User[] = JSON.parse(localStorage.getItem('10x_users') || '[]');
  const onlineUsers = users.filter(u => u.lastActive && (Date.now() - u.lastActive) < 300000);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <button onClick={onBack} className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors mb-4">
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         Back to Games
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
          <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
          ARENA PLAYERS
        </h2>
        <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          {onlineUsers.length} ONLINE NOW
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.length === 0 ? (
          <div className="col-span-full glass p-12 text-center text-slate-600 font-black uppercase text-xs tracking-widest italic">The arena is quiet...</div>
        ) : (
          users.map(u => {
            const isOnline = u.lastActive && (Date.now() - u.lastActive) < 300000;
            return (
              <div key={u.id} className="glass rounded-2xl p-5 border-slate-800 flex items-center gap-4 hover:border-slate-700 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden relative border border-slate-800">
                  {u.profilePicture ? (
                    <img src={u.profilePicture} className="w-full h-full object-cover" alt="pfp" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-emerald-500 text-lg">
                      {u.fullName?.[0]}
                    </div>
                  )}
                  {isOnline && <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></span>}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-white font-bold truncate text-sm">{u.fullName}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">{u.phoneNumber.slice(0, 7)}****</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UsersListView;
