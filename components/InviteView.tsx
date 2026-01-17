
import React from 'react';
import { User } from '../types';

interface InviteViewProps {
  user: User;
  onBack: () => void;
}

const InviteView: React.FC<InviteViewProps> = ({ user, onBack }) => {
  const inviteLink = `${window.location.origin}/join?ref=${user.inviteCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={onBack} className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors mb-4">
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         Back to Games
      </button>

      <div className="glass rounded-[2.5rem] p-12 border-emerald-500/20 text-center space-y-8 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">INVITE FRIENDS</h2>
          <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest leading-relaxed">
            Share your referral link and earn <span className="text-emerald-400">bonus credits</span>
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Your Unique Referral Link</p>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono text-emerald-400 text-sm break-all">
            {inviteLink}
          </div>
          <button 
            onClick={copyLink}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 uppercase text-[10px]"
          >
            Copy Invitation Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteView;
