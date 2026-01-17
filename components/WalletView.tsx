
import React, { useState } from 'react';
import { User, Transaction } from '../types';

interface WalletViewProps {
  user: User;
  onBack: () => void;
  onSubmitTransaction: (tx: Partial<Transaction>) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ user, onBack, onSubmitTransaction }) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [bankName, setBankName] = useState('Amhara Bank');
  const [accNo, setAccNo] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeposit = () => {
    if (!amount || !screenshot) {
      setError("Please provide both amount and payment screenshot.");
      return;
    }
    onSubmitTransaction({
      amount: parseFloat(amount),
      type: 'DEPOSIT',
      screenshot
    });
  };

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (!val || val > user.balance || !accNo || !fullName) return;
    onSubmitTransaction({
      amount: val,
      type: 'WITHDRAW',
      fullName,
      bankName,
      accountNumber: accNo
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      // 10MB validation
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit.");
        return;
      }

      // Type validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Please upload JPG, PNG or PDF.");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const BANK_DETAILS = [
    { name: 'Amhara Bank', number: '9900046711622', holder: '10X SPORTS ARENA' },
    { name: 'Abyssinia Bank', number: '235241412', holder: '10X SPORTS ARENA' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors mb-4">
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         Back to Games
      </button>

      <div className="glass rounded-3xl p-8 border-emerald-500/20 text-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Wallet Balance</span>
        <h2 className="text-5xl font-black text-emerald-400 mt-2 font-mono">
          ETB {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
        <button onClick={() => setTab('deposit')} className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${tab === 'deposit' ? 'bg-emerald-500 text-slate-950' : 'text-slate-500'}`}>DEPOSIT</button>
        <button onClick={() => setTab('withdraw')} className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${tab === 'withdraw' ? 'bg-emerald-500 text-slate-950' : 'text-slate-500'}`}>WITHDRAW</button>
      </div>

      <div className="glass rounded-3xl p-8 border-slate-800">
        {tab === 'deposit' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BANK_DETAILS.map((bank) => (
                <div key={bank.name} className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center relative group">
                  <h4 className="text-emerald-400 font-black text-lg mb-2">{bank.name}</h4>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <p className="text-white font-mono text-xl tracking-tighter">{bank.number}</p>
                    <button 
                      onClick={() => copyToClipboard(bank.number, bank.name)}
                      className="p-1.5 bg-slate-800 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all"
                      title="Copy Account Number"
                    >
                      {copiedId === bank.name ? (
                        <span className="text-[8px] font-black px-1">COPIED</span>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Account Holder: {bank.holder}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-800"></div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-500 text-xs font-bold text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase">1. Deposit Amount</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter Amount in ETB" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500" 
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase">2. Payment Receipt (JPG, PNG, PDF - Max 10MB)</label>
              <div className="relative border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center hover:border-emerald-500/50 transition-colors bg-slate-950/50">
                <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  {screenshot ? (
                    <div className="space-y-2">
                       <p className="text-emerald-400 text-xs font-bold">{fileName}</p>
                       {screenshot.startsWith('data:image') && (
                         <img src={screenshot} className="mx-auto h-24 rounded-lg object-cover border border-emerald-500/30" alt="preview" />
                       )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-white text-sm font-bold">Click to upload screenshot</p>
                      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">Proof of payment is required</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button onClick={handleDeposit} disabled={!screenshot || !amount} className="w-full bg-emerald-500 text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 disabled:opacity-50 transition-all uppercase tracking-widest text-sm">Submit Deposit Request</button>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As seen on bank account" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white font-bold focus:border-emerald-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase">Select Bank</label>
                <select value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white font-bold focus:border-emerald-500">
                  <option>Amhara Bank</option>
                  <option>Abyssinia Bank</option>
                  <option>Commercial Bank of Ethiopia (CBE)</option>
                  <option>Dashen Bank</option>
                  <option>TeleBirr</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase">Account Number</label>
                <input type="text" value={accNo} onChange={(e) => setAccNo(e.target.value)} placeholder="0000000000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Withdrawal Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min 100 ETB" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white font-mono focus:border-emerald-500" />
            </div>

            <button onClick={handleWithdraw} disabled={!amount || parseFloat(amount) > user.balance} className="w-full bg-emerald-500 text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 disabled:opacity-50 transition-all uppercase tracking-widest text-sm">Request Withdrawal</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletView;
