
import React, { useState } from 'react';

interface AuthFormProps {
  onAuth: (phoneNumber: string, pin: string, isRegister: boolean, email?: string) => void;
  onCancel: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth, onCancel }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 9 && code.length >= 4) {
      onAuth(phone, code, isRegister, email);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="max-w-md w-full glass rounded-[2.5rem] p-8 border-emerald-500/20 shadow-2xl relative animate-in zoom-in-95">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
          title="Return to Demo Mode"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-lg shadow-emerald-500/20">
            <span className="text-2xl font-black text-slate-950">10X</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">10X Sports</h2>
          <p className="text-slate-400 text-[10px] mt-2 uppercase font-black tracking-widest">{isRegister ? 'New Account' : 'Welcome Back'}</p>
        </div>

        <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8">
          <button onClick={() => setIsRegister(false)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${!isRegister ? 'bg-emerald-500 text-slate-950' : 'text-slate-500'}`}>LOGIN</button>
          <button onClick={() => setIsRegister(true)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${isRegister ? 'bg-emerald-500 text-slate-950' : 'text-slate-500'}`}>REGISTER</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Ethiopia Phone</label>
            <div className="flex gap-2">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 flex items-center text-emerald-500 font-bold">+251</div>
              <input 
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9********" className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500 transition-all text-lg" required
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Recovery Email</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500 transition-all text-lg"
              />
            </div>
          )}

          <div className="relative">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">PIN / Password</label>
            <input 
              type={showPass ? "text" : "password"} value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500 transition-all text-center text-lg" required
            />
            <button 
              type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-10 text-slate-500 hover:text-emerald-500 transition-colors"
            >
              {showPass ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057-5.064-7 9.542-7 1.274 0 2.458.22 3.534.62M8.118 8.118l8.118 8.118M3 3l18 18" /></svg>
              )}
            </button>
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/10 hover:scale-[1.02] transition-all uppercase text-sm tracking-widest">
            {isRegister ? 'REGISTER NOW' : 'LOGIN'}
          </button>
        </form>
        
        <button onClick={onCancel} className="w-full mt-6 text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">
          Stay in Demo Mode
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
