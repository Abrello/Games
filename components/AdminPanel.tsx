
import React, { useState, useEffect } from 'react';
import { User, Transaction, Game } from '../types';

interface AdminPanelProps {
  onUpdate: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'MATCHES' | 'FINANCE' | 'SYSTEM'>('USERS');
  const [users, setUsers] = useState<User[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [matches, setMatches] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [adjustmentAmt, setAdjustmentAmt] = useState('');
  
  // Modal states for editing
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingMatch, setEditingMatch] = useState<Game | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(JSON.parse(localStorage.getItem('10x_users') || '[]'));
    setTxs(JSON.parse(localStorage.getItem('10x_txs') || '[]'));
    setMatches(JSON.parse(localStorage.getItem('10x_matches') || '[]'));
  };

  const updateUsers = (newUsers: User[]) => {
    localStorage.setItem('10x_users', JSON.stringify(newUsers));
    setUsers(newUsers);
    onUpdate();
  };

  const updateMatches = (newMatches: Game[]) => {
    localStorage.setItem('10x_matches', JSON.stringify(newMatches));
    setMatches(newMatches);
    onUpdate();
  };

  const handleUserAction = (userId: string, action: 'BAN' | 'UNBAN' | 'VERIFY' | 'FREEZE' | 'UNFREEZE' | 'DELETE' | 'LOGOUT') => {
    if (action === 'DELETE') {
      if (!confirm("Are you absolutely sure? This cannot be undone.")) return;
      const updated = users.filter(u => u.id !== userId);
      updateUsers(updated);
      setEditingUser(null);
      return;
    }

    const updated = users.map(u => {
      if (u.id === userId) {
        if (action === 'BAN') return { ...u, isSuspended: true };
        if (action === 'UNBAN') return { ...u, isSuspended: false };
        if (action === 'VERIFY') return { ...u, isVerified: true };
        if (action === 'FREEZE') return { ...u, isWalletFrozen: true };
        if (action === 'UNFREEZE') return { ...u, isWalletFrozen: false };
        if (action === 'LOGOUT') return { ...u, lastActive: 0 }; // Effectively kills "Online" status
      }
      return u;
    });
    updateUsers(updated);
  };

  const adjustBalance = (userId: string, amount: number) => {
    const updated = users.map(u => {
      if (u.id === userId) return { ...u, balance: Math.max(0, u.balance + amount) };
      return u;
    });
    updateUsers(updated);
    if (editingUser?.id === userId) {
      setEditingUser(prev => prev ? { ...prev, balance: Math.max(0, prev.balance + amount) } : null);
    }
  };

  const changeUserPassword = (userId: string) => {
    const newPass = prompt("Enter new security PIN for this user:");
    if (newPass && newPass.length >= 4) {
      const updated = users.map(u => {
        if (u.id === userId) return { ...u, password: newPass };
        return u;
      });
      updateUsers(updated);
      alert("Password updated successfully.");
    }
  };

  const handleTx = (txId: string, status: 'COMPLETED' | 'REJECTED') => {
    const allTxs = JSON.parse(localStorage.getItem('10x_txs') || '[]');
    const txIndex = allTxs.findIndex((t: Transaction) => t.id === txId);
    if (txIndex === -1) return;

    const tx = allTxs[txIndex];
    tx.status = status;
    localStorage.setItem('10x_txs', JSON.stringify(allTxs));
    setTxs(allTxs);

    if (status === 'COMPLETED' && tx.type === 'DEPOSIT') {
      adjustBalance(tx.userId, tx.amount);
    } else if (status === 'REJECTED' && tx.type === 'WITHDRAW') {
      // Refund the withdrawal if rejected
      adjustBalance(tx.userId, tx.amount);
    }
    loadData();
    onUpdate();
  };

  const saveMatch = (match: Game) => {
    const exists = matches.findIndex(m => m.id === match.id);
    let newMatches;
    if (exists !== -1) {
      newMatches = [...matches];
      newMatches[exists] = match;
    } else {
      newMatches = [...matches, match];
    }
    updateMatches(newMatches);
    setEditingMatch(null);
  };

  const deleteMatch = (matchId: string) => {
    if (!confirm("Delete this match/game?")) return;
    const newMatches = matches.filter(m => m.id !== matchId);
    updateMatches(newMatches);
  };

  const filteredUsers = users.filter(u => 
    u.phoneNumber.includes(search) || u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = users.filter(u => u.lastActive && (Date.now() - u.lastActive) < 300000).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
            10X Master Panel
          </h2>
          <div className="flex gap-4 mt-1">
             <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Control Terminal</span>
             <span className="text-emerald-500 text-[10px] font-black uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               {onlineCount} Users Online
             </span>
          </div>
        </div>
        <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
           {(['USERS', 'MATCHES', 'FINANCE', 'SYSTEM'] as const).map(tab => (
             <button 
               key={tab} onClick={() => setActiveTab(tab)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === tab ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-white'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass rounded-[2.5rem] border-slate-800 min-h-[600px] overflow-hidden">
        {activeTab === 'USERS' && (
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <input 
                  type="text" placeholder="Search phone or name..." 
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                {users.length} Total Registered Users
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-600 uppercase border-b border-slate-900">
                    <th className="px-4 py-4">User Details</th>
                    <th className="px-4 py-4">Wallet</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {filteredUsers.map(u => {
                    const isOnline = u.lastActive && (Date.now() - u.lastActive) < 300000;
                    return (
                      <tr key={u.id} className="hover:bg-slate-900/30 group transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-amber-500 border border-slate-700 relative">
                              {u.fullName?.[0] || 'U'}
                              {isOnline && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></span>}
                            </div>
                            <div>
                              <div className="text-white text-sm font-bold flex items-center gap-2">
                                {u.fullName}
                                {isOnline && <span className="text-[8px] font-black text-emerald-500 uppercase">Online</span>}
                              </div>
                              <div className="text-slate-500 text-[10px] font-mono">{u.phoneNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-emerald-400 font-mono font-bold text-sm">ETB {u.balance.toFixed(2)}</div>
                          <div className="text-[8px] text-slate-500 font-black uppercase">Last Login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {u.isSuspended && <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-black rounded border border-rose-500/20">SUSPENDED</span>}
                            {u.isVerified && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded border border-emerald-500/20">VERIFIED</span>}
                            {u.isWalletFrozen && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded border border-amber-500/20">FROZEN</span>}
                            {!u.isSuspended && !u.isVerified && !u.isWalletFrozen && <span className="text-slate-700 text-[8px] font-black italic">Standard</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button onClick={() => setEditingUser(u)} className="p-2 text-slate-500 hover:text-white transition-colors" title="Edit User & Balance">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            </button>
                            <button onClick={() => handleUserAction(u.id, u.isSuspended ? 'UNBAN' : 'BAN')} className={`px-3 py-1 text-[8px] font-black rounded ${u.isSuspended ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                              {u.isSuspended ? 'RESTORE' : 'SUSPEND'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'MATCHES' && (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Manage Sports & Games</h3>
              <button 
                onClick={() => setEditingMatch({ id: Math.random().toString(36).substr(2, 6), sport: 'FOOTBALL', league: '', teamA: '', teamB: '', startTime: '00:00', oddsA: 1.0, oddsB: 1.0 })}
                className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20"
              >
                + ADD NEW FIXTURE
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {matches.map(m => (
                 <div key={m.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-[4rem] group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{m.sport} • {m.league}</span>
                        <div className="text-white font-bold text-sm mt-1">{m.teamA} <span className="text-slate-500 italic mx-1">v</span> {m.teamB}</div>
                        <div className="text-slate-600 text-[9px] font-mono mt-0.5">Start: {m.startTime}</div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingMatch(m)} className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Edit Odds"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => deleteMatch(m.id)} className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-colors" title="Delete"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-slate-800">
                          <div className="text-[7px] text-slate-600 font-black uppercase">Home</div>
                          <div className="text-xs font-mono font-black text-emerald-400">{m.oddsA}</div>
                       </div>
                       <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-slate-800">
                          <div className="text-[7px] text-slate-600 font-black uppercase">Draw</div>
                          <div className="text-xs font-mono font-black text-emerald-400">{m.oddsDraw || '—'}</div>
                       </div>
                       <div className="bg-slate-950/80 p-2 rounded-xl text-center border border-slate-800">
                          <div className="text-[7px] text-slate-600 font-black uppercase">Away</div>
                          <div className="text-xs font-mono font-black text-emerald-400">{m.oddsB}</div>
                       </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50">
                      <span className={`text-[8px] font-black uppercase flex items-center gap-1.5 ${m.isDisabled ? 'text-rose-500' : 'text-emerald-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.isDisabled ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                        {m.isDisabled ? 'PAUSED' : 'ACTIVE'}
                      </span>
                      <button 
                        onClick={() => saveMatch({...m, isDisabled: !m.isDisabled})}
                        className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
                      >
                        {m.isDisabled ? 'Activate' : 'Pause'}
                      </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'FINANCE' && (
          <div className="p-8 space-y-6">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Financial Settlements</h3>
            <div className="grid grid-cols-1 gap-4">
               {txs.filter(t => t.status === 'PENDING').length === 0 ? (
                 <div className="text-center py-20 text-slate-600 font-black uppercase text-xs">No pending requests</div>
               ) : (
                 txs.filter(t => t.status === 'PENDING').map(t => (
                   <div key={t.id} className="glass p-6 rounded-3xl border-slate-800 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-left-4 transition-all">
                      <div className="w-full md:w-40 aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                        {t.screenshot ? (
                          <img src={t.screenshot} className="w-full h-full object-cover" alt="receipt" />
                        ) : (
                          <div className="text-rose-500 font-black text-[9px] uppercase tracking-tighter">Withdrawal Req</div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black ${t.type === 'DEPOSIT' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>{t.type}</span>
                          <span className="text-white font-bold text-sm">{t.userPhone}</span>
                        </div>
                        <div className="text-emerald-400 font-mono font-black text-xl mt-1 leading-none">ETB {t.amount.toFixed(2)}</div>
                        <div className="text-[8px] text-slate-500 font-black mt-2 uppercase tracking-widest italic">{t.timestamp}</div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => handleTx(t.id, 'COMPLETED')} className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-all">Approve</button>
                         <button onClick={() => handleTx(t.id, 'REJECTED')} className="bg-rose-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-all">Reject</button>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        )}

        {activeTab === 'SYSTEM' && (
           <div className="p-12 text-center space-y-8 max-w-lg mx-auto">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 mb-4">
                 <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-white font-black text-2xl tracking-tighter uppercase">Danger Zone</h3>
              <p className="text-slate-500 text-xs leading-relaxed uppercase font-black tracking-widest">Global system overrides. Use with caution.</p>
              <div className="grid grid-cols-1 gap-4">
                 <button onClick={() => { if(confirm("Reset all user data?")) { localStorage.clear(); window.location.reload(); } }} className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20">Wipe Database</button>
                 <button className="w-full bg-slate-900 border border-slate-800 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Toggle Maintenance Mode</button>
                 <button className="w-full border border-slate-800 text-slate-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Export Transaction Logs (CSV)</button>
              </div>
           </div>
        )}
      </div>

      {/* MODALS */}
      {editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
           <div className="glass w-full max-w-lg rounded-[2.5rem] p-10 border-emerald-500/20 relative animate-in zoom-in-95">
              <button onClick={() => setEditingUser(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center font-black text-amber-500 text-2xl">{editingUser.fullName?.[0] || 'U'}</div>
                <div>
                  <h3 className="text-white font-black text-2xl tracking-tight leading-none">{editingUser.fullName}</h3>
                  <p className="text-slate-500 text-xs font-mono mt-2">{editingUser.phoneNumber}</p>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleUserAction(editingUser.id, 'VERIFY')} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-[10px] font-black text-emerald-500 uppercase hover:bg-emerald-500/5 transition-all">KYC VERIFICATION</button>
                    <button onClick={() => handleUserAction(editingUser.id, editingUser.isWalletFrozen ? 'UNFREEZE' : 'FREEZE')} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-[10px] font-black text-amber-500 uppercase hover:bg-amber-500/5 transition-all">{editingUser.isWalletFrozen ? 'UNFREEZE' : 'FREEZE'} WALLET</button>
                    <button onClick={() => handleUserAction(editingUser.id, 'LOGOUT')} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:bg-slate-100/5 transition-all">FORCE LOGOUT</button>
                    <button onClick={() => handleUserAction(editingUser.id, 'DELETE')} className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-[10px] font-black text-rose-500 uppercase hover:bg-rose-500/20 transition-all">DELETE AGENT</button>
                 </div>

                 <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Adjust Current Balance (ETB {editingUser.balance.toFixed(2)})</label>
                    <div className="flex gap-2">
                       <input 
                        type="number" 
                        placeholder="Amount..." 
                        value={adjustmentAmt} 
                        onChange={(e) => setAdjustmentAmt(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm font-mono flex-grow outline-none focus:border-emerald-500" 
                       />
                       <button onClick={() => { adjustBalance(editingUser.id, parseFloat(adjustmentAmt)); setAdjustmentAmt(''); }} className="bg-emerald-500 text-slate-950 px-4 rounded-xl text-[10px] font-black uppercase">+</button>
                       <button onClick={() => { adjustBalance(editingUser.id, -parseFloat(adjustmentAmt)); setAdjustmentAmt(''); }} className="bg-rose-500 text-white px-4 rounded-xl text-[10px] font-black uppercase">-</button>
                    </div>
                 </div>

                 <button 
                  onClick={() => changeUserPassword(editingUser.id)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                 >
                   CHANGE SECURITY PIN
                 </button>
              </div>
           </div>
        </div>
      )}

      {editingMatch && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
           <div className="glass w-full max-w-lg rounded-[2.5rem] p-10 border-emerald-500/20 relative animate-in zoom-in-95">
              <button onClick={() => setEditingMatch(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              
              <h3 className="text-white font-black text-2xl uppercase mb-8 tracking-tight">{editingMatch.teamA ? 'Modify Fixture' : 'Create New Fixture'}</h3>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Team A (Home)</label>
                      <input type="text" placeholder="Team A" value={editingMatch.teamA} onChange={e => setEditingMatch({...editingMatch, teamA: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none focus:border-emerald-500"/>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Team B (Away)</label>
                      <input type="text" placeholder="Team B" value={editingMatch.teamB} onChange={e => setEditingMatch({...editingMatch, teamB: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none focus:border-emerald-500"/>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Odds 1</label>
                      <input type="number" step="0.01" placeholder="Home" value={editingMatch.oddsA} onChange={e => setEditingMatch({...editingMatch, oddsA: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none font-mono focus:border-emerald-500"/>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Odds X</label>
                      <input type="number" step="0.01" placeholder="Draw" value={editingMatch.oddsDraw || ''} onChange={e => setEditingMatch({...editingMatch, oddsDraw: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none font-mono focus:border-emerald-500"/>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Odds 2</label>
                      <input type="number" step="0.01" placeholder="Away" value={editingMatch.oddsB} onChange={e => setEditingMatch({...editingMatch, oddsB: parseFloat(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none font-mono focus:border-emerald-500"/>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Sport Category</label>
                      <input type="text" placeholder="e.g. Football" value={editingMatch.sport} onChange={e => setEditingMatch({...editingMatch, sport: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none focus:border-emerald-500"/>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Kickoff Time</label>
                      <input type="text" placeholder="e.g. 15:30" value={editingMatch.startTime} onChange={e => setEditingMatch({...editingMatch, startTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none font-mono focus:border-emerald-500"/>
                    </div>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">League Name</label>
                   <input type="text" placeholder="Tournament / League" value={editingMatch.league} onChange={e => setEditingMatch({...editingMatch, league: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none focus:border-emerald-500"/>
                 </div>

                 <button onClick={() => saveMatch(editingMatch)} className="w-full bg-emerald-500 text-slate-950 py-5 rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all mt-4 tracking-widest">COMMIT FIXTURE</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
