
import React, { useState } from 'react';
import { User, ViewState } from '../types';

interface NavbarProps {
  user: User | null;
  activeView: ViewState;
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, activeView, onLogout, onNavigate }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const NavButton = ({ target, label }: { target: ViewState; label: string }) => (
    <button 
      onClick={() => onNavigate(target)}
      className={`text-[10px] font-black tracking-widest transition-all px-3 py-2 rounded-lg ${
        activeView === target ? 'bg-emerald-500 text-slate-950' : 'text-slate-500 hover:text-white hover:bg-slate-900'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-900 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('GAMES')}
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950">10X</div>
            <span className="text-lg font-black tracking-tighter text-white hidden sm:block">SPORTS</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <NavButton target="GAMES" label="MAIN PAGE" />
            {user && (
              <>
                <NavButton target="USERS" label="USERS" />
                <NavButton target="WALLET" label="DEPOSIT" />
                <NavButton target="WALLET" label="WITHDRAW" />
                <NavButton target="INVITE" label="INVITE" />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 relative">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[8px] text-slate-500 uppercase font-black">BALANCE</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">ETB {user.balance.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 p-1 pr-4 rounded-full transition-all border border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-emerald-500/30">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} className="w-full h-full object-cover" alt="pfp" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-emerald-500">
                      {user.fullName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-wider hidden sm:block">MY ACCOUNT</span>
              </button>

              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 glass border-slate-800 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-800 mb-1">
                    <p className="text-white text-xs font-bold truncate">{user.fullName}</p>
                    <p className="text-slate-500 text-[10px] truncate">{user.phoneNumber}</p>
                  </div>
                  <button onClick={() => { onNavigate('PROFILE'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">Edit Profile</button>
                  <button onClick={() => { onNavigate('HISTORY'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">Betting Logs</button>
                  {user.role === 'ADMIN' && (
                    <button onClick={() => { onNavigate('ADMIN'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-amber-500 hover:bg-amber-500/10 rounded-xl">Admin Console</button>
                  )}
                  <div className="h-px bg-slate-800 my-1"></div>
                  <button onClick={() => { onLogout(); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl">Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => onNavigate('AUTH')} className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">LOGIN</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
