
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate, onBack }) => {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handlePfp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate({ profilePicture: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = () => {
    if (password && password === confirmPass) {
      onUpdate({ password });
      setPassword('');
      setConfirmPass('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <button onClick={onBack} className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         Back to Games
      </button>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">My Account</h2>
        <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mt-2">Manage your profile & security</p>
      </div>

      <div className="glass rounded-3xl p-8 border-slate-800 flex flex-col items-center">
        <div className="relative group mb-6">
          <div className="w-32 h-32 rounded-3xl bg-slate-900 border-2 border-slate-800 overflow-hidden group-hover:border-emerald-500 transition-all">
            {user.profilePicture ? (
              <img src={user.profilePicture} className="w-full h-full object-cover" alt="pfp" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-700">
                {user.fullName?.[0]}
              </div>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
            <input type="file" accept="image/*" className="hidden" onChange={handlePfp} />
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </label>
        </div>
        <div className="text-center">
          <p className="text-white font-bold">{user.phoneNumber}</p>
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">ID: {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8 border-slate-800 space-y-4">
          <h3 className="text-white text-xs font-black uppercase tracking-widest mb-4">Identity Settings</h3>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Display Username</label>
            <input 
              type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:border-emerald-500 transition-all"
            />
          </div>
          <button onClick={() => onUpdate({ fullName })} className="w-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white text-[10px] font-black py-3 rounded-xl transition-all uppercase">Save Changes</button>
        </div>

        <div className="glass rounded-3xl p-8 border-slate-800 space-y-4">
          <h3 className="text-white text-xs font-black uppercase tracking-widest mb-4">Security Settings</h3>
          <div className="relative">
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">New Password</label>
            <input 
              type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono focus:border-emerald-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Confirm New Password</label>
            <input 
              type={showPass ? "text" : "password"} value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono focus:border-emerald-500 transition-all"
            />
          </div>
          <button onClick={handleUpdatePassword} disabled={!password || password !== confirmPass} className="w-full bg-slate-800 hover:bg-rose-500 hover:text-white text-white text-[10px] font-black py-3 rounded-xl transition-all uppercase disabled:opacity-50">Update Security</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
