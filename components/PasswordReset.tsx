
import React, { useState } from 'react';
import { User } from '../types';
import { generateOTPEmail } from '../services/geminiService';

interface PasswordResetProps {
  onBack: () => void;
  onComplete: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: New Pass
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockEmail, setMockEmail] = useState<{ visible: boolean; body: string }>({ visible: false, body: '' });

  const handleSendOtp = async () => {
    if (!phone || !email) return;
    setLoading(true);
    
    const fullPhone = `+251${phone.replace(/\D/g, '')}`;
    const users = JSON.parse(localStorage.getItem('10x_users') || '[]');
    
    // Find user by Phone Number (The account we want to reset)
    const targetUser = users.find((u: User) => u.phoneNumber === fullPhone);
    
    if (targetUser) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      
      // Use Gemini to generate a professional security email
      const emailBody = await generateOTPEmail(email, code);
      setMockEmail({ visible: true, body: emailBody });
      
      setStep(2);
    } else {
      alert("Account with this phone number not found. Please register first.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setStep(3);
      setMockEmail({ ...mockEmail, visible: false });
    } else {
      alert("Invalid OTP code. Please check the simulated email.");
    }
  };

  const handleReset = () => {
    if (!newPass) return;
    
    const fullPhone = `+251${phone.replace(/\D/g, '')}`;
    const users = JSON.parse(localStorage.getItem('10x_users') || '[]');
    const userIdx = users.findIndex((u: User) => u.phoneNumber === fullPhone);
    
    if (userIdx !== -1) {
      // Update the password for the account identified by phone
      users[userIdx].password = newPass;
      localStorage.setItem('10x_users', JSON.stringify(users));
      
      // Update session if it's currently logged in as this user (unlikely but good practice)
      const session = localStorage.getItem('10x_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.phoneNumber === fullPhone) {
          parsed.password = newPass;
          localStorage.setItem('10x_session', JSON.stringify(parsed));
        }
      }
      
      onComplete();
    } else {
      alert("An error occurred during reset. Account not found.");
      onBack();
    }
  };

  return (
    <div className="max-w-md mx-auto relative">
      {/* Mock Email Notification Popup */}
      {mockEmail.visible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-sm rounded-3xl p-6 border-emerald-500/40 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Incoming Email: 10X Security</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-medium text-slate-300 leading-relaxed italic whitespace-pre-wrap">
              {mockEmail.body}
            </div>
            <p className="text-[8px] text-slate-500 mt-2 text-center font-bold uppercase">To: {email}</p>
            <button onClick={() => setMockEmail({ ...mockEmail, visible: false })} className="w-full mt-4 py-2 text-[10px] font-black text-slate-500 hover:text-white uppercase transition-colors">Close Inbox</button>
          </div>
        </div>
      )}

      <div className="glass rounded-3xl p-8 border-emerald-500/20 shadow-2xl space-y-8 animate-in fade-in">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Recover Access</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase mt-1">Step {step} of 3 • Identify Account</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Registered Phone</label>
              <div className="flex gap-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 flex items-center text-emerald-500 font-bold text-sm">+251</div>
                <input 
                  type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                  className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500 transition-all" 
                  placeholder="912345678" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Recovery Email</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500 transition-all" 
                placeholder="your@email.com" 
              />
            </div>

            <button 
              onClick={handleSendOtp} 
              disabled={loading || !email || !phone}
              className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl uppercase text-xs flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span> : 'Request Reset OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify the 6-digit code sent to your email</p>
            <input 
              type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono text-center text-2xl tracking-[0.5em]" 
              placeholder="000000" 
            />
            <button onClick={handleVerifyOtp} className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl uppercase text-xs">Confirm Identity</button>
            <button onClick={() => setMockEmail({ ...mockEmail, visible: true })} className="w-full text-[9px] font-black text-emerald-500/50 hover:text-emerald-500 uppercase tracking-widest">View Recovery Email</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Identity Verified</p>
              <p className="text-xs text-white mt-1">Account: +251{phone}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">New Security Password</label>
              <input 
                type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono text-center" 
                placeholder="••••••••" 
              />
            </div>
            <button onClick={handleReset} className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl uppercase text-xs">Apply New Password</button>
          </div>
        )}

        <button onClick={onBack} className="w-full text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Return to Login</button>
      </div>
    </div>
  );
};

export default PasswordReset;
