
import React, { useState, useEffect } from 'react';
import { User, ViewState, GameOutcome, VirtualGameType, Transaction, Game } from './types';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import VirtualArena from './components/VirtualArena';
import WalletView from './components/WalletView';
import HistoryView from './components/HistoryView';
import AdminPanel from './components/AdminPanel';
import ProfileView from './components/ProfileView';
import InviteView from './components/InviteView';
import UsersListView from './components/UsersListView';

const INITIAL_MATCHES: Game[] = [
  { id: '1', sport: 'FOOTBALL', league: 'English Premier League', teamA: 'Arsenal', teamB: 'Man City', startTime: '19:45', oddsA: 2.45, oddsDraw: 3.40, oddsB: 2.80 },
  { id: '2', sport: 'BASKETBALL', league: 'NBA', teamA: 'Lakers', teamB: 'Warriors', startTime: '04:00', oddsA: 1.90, oddsB: 1.95 },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [demoBalance, setDemoBalance] = useState(5000);
  const [view, setView] = useState<ViewState>('GAMES');
  const [history, setHistory] = useState<GameOutcome[]>([]);
  const [matches, setMatches] = useState<Game[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Load matches
    const savedMatches = localStorage.getItem('10x_matches');
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    } else {
      setMatches(INITIAL_MATCHES);
      localStorage.setItem('10x_matches', JSON.stringify(INITIAL_MATCHES));
    }

    // Load session
    const savedSession = localStorage.getItem('10x_session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      // Check if user is suspended
      const users = JSON.parse(localStorage.getItem('10x_users') || '[]');
      const dbUser = users.find((u: User) => u.id === parsedSession.id);
      
      if (dbUser?.isSuspended) {
        handleLogout();
        notify("Account suspended", 'error');
      } else {
        parsedSession.lastActive = Date.now();
        setUser(parsedSession);
      }
    }
  }, []);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUserInDB = (userData: User) => {
    const users = JSON.parse(localStorage.getItem('10x_users') || '[]');
    const index = users.findIndex((u: User) => u.phoneNumber === userData.phoneNumber);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
    } else {
      users.push(userData);
    }
    localStorage.setItem('10x_users', JSON.stringify(users));
  };

  const handleAuth = (phoneNumber: string, pin: string, isRegister: boolean, email?: string) => {
    const fullPhone = `+251${phoneNumber}`;
    const users = JSON.parse(localStorage.getItem('10x_users') || '[]');
    
    // Admin Override
    if (phoneNumber === '932333149' && pin === 'Admin1749') {
      const adminUser: User = {
        id: 'ADMIN-MASTER',
        phoneNumber: '+251932333149',
        balance: 0.00,
        role: 'ADMIN',
        fullName: 'System Admin',
        lastActive: Date.now(),
        lastLogin: Date.now()
      };
      setUser(adminUser);
      setView('ADMIN');
      localStorage.setItem('10x_session', JSON.stringify(adminUser));
      notify("Administrator Mode Active", 'success');
      return;
    }

    const existingUser = users.find((u: User) => u.phoneNumber === fullPhone);

    if (isRegister) {
      if (existingUser) {
        notify("Number already exists", 'error');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        phoneNumber: fullPhone,
        email: email,
        password: pin,
        balance: 0.00,
        role: 'PLAYER',
        fullName: `User_${Math.floor(Math.random() * 9000) + 1000}`,
        inviteCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
        lastActive: Date.now(),
        lastLogin: Date.now(),
        bettingLimit: 5000
      };
      updateUserInDB(newUser);
      setUser(newUser);
      localStorage.setItem('10x_session', JSON.stringify(newUser));
      setView('GAMES');
      notify("Welcome to 10x Sports!");
    } else {
      if (!existingUser) {
        notify("Account not found", 'error');
        return;
      }
      if (existingUser.password !== pin) {
        notify("Invalid credentials", 'error');
        return;
      }
      if (existingUser.isSuspended) {
        notify("Your account has been suspended", 'error');
        return;
      }
      existingUser.lastActive = Date.now();
      existingUser.lastLogin = Date.now();
      setUser(existingUser);
      localStorage.setItem('10x_session', JSON.stringify(existingUser));
      setView('GAMES');
      notify("Login Successful");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('10x_session');
    setUser(null);
    setDemoBalance(5000);
    setView('GAMES');
    notify("Logged Out");
  };

  const handleTransaction = (tx: Partial<Transaction>) => {
    if (!user) return;
    if (user.isWalletFrozen) {
      notify("Wallet is frozen by administration", 'error');
      return;
    }
    const transactions = JSON.parse(localStorage.getItem('10x_txs') || '[]');
    const newTx: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      userPhone: user.phoneNumber,
      timestamp: new Date().toLocaleString(),
      status: 'PENDING',
      ...tx
    } as Transaction;

    transactions.push(newTx);
    localStorage.setItem('10x_txs', JSON.stringify(transactions));

    if (tx.type === 'WITHDRAW') {
      const newBalance = user.balance - (tx.amount || 0);
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      updateUserInDB(updatedUser);
      localStorage.setItem('10x_session', JSON.stringify(updatedUser));
    }

    notify("Request Received");
    setView('GAMES');
  };

  const handleProfileUpdate = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    updateUserInDB(updatedUser);
    localStorage.setItem('10x_session', JSON.stringify(updatedUser));
  };

  const handleGameResult = (type: VirtualGameType, amt: number, win: boolean, mult: number, det: string) => {
    if (user && user.isSuspended) {
      handleLogout();
      return;
    }
    
    if (user && user.bettingLimit && amt > user.bettingLimit) {
      notify(`Bet exceeds your limit of ETB ${user.bettingLimit}`, 'error');
      return;
    }

    const payout = win ? amt * mult : 0;
    
    if (user) {
      const newBalance = user.balance - amt + payout;
      handleProfileUpdate({ balance: newBalance });
      setHistory(prev => [{ 
        id: Math.random().toString(36).substr(2,6).toUpperCase(), 
        gameType: type, 
        timestamp: new Date().toLocaleTimeString(), 
        betAmount: amt, 
        payout, 
        status: win ? 'WIN' : 'LOSS', 
        details: det 
      }, ...prev]);
    } else {
      setDemoBalance(prev => prev - amt + payout);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar user={user} activeView={view} onNavigate={setView} onLogout={handleLogout} />

      {notification && (
        <div className={`fixed top-20 right-4 z-[100] px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right font-bold border ${
          notification.type === 'success' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-rose-500 text-white border-rose-400'
        }`}>
          {notification.message}
        </div>
      )}

      <main className="container mx-auto px-4 pt-24 pb-12">
        {view === 'AUTH' && <AuthForm onAuth={handleAuth} onCancel={() => setView('GAMES')} />}
        
        {view === 'GAMES' && (
          <VirtualArena 
            userBalance={user ? user.balance : demoBalance} 
            isGuest={!user}
            onRequestAuth={() => setView('AUTH')}
            onResult={handleGameResult} 
          />
        )}

        {user && (
          <>
            {view === 'WALLET' && <WalletView user={user} onSubmitTransaction={handleTransaction} onBack={() => setView('GAMES')} />}
            {view === 'HISTORY' && <HistoryView history={history} onBack={() => setView('GAMES')} />}
            {view === 'ADMIN' && user.role === 'ADMIN' && <AdminPanel onUpdate={() => {
              const sess = localStorage.getItem('10x_session');
              if (sess) {
                const parsedSess = JSON.parse(sess);
                setUser(parsedSess);
              }
              const currentMatches = localStorage.getItem('10x_matches');
              if (currentMatches) setMatches(JSON.parse(currentMatches));
            }} />}
            {view === 'PROFILE' && <ProfileView user={user} onUpdate={handleProfileUpdate} onBack={() => setView('GAMES')} />}
            {view === 'INVITE' && <InviteView user={user} onBack={() => setView('GAMES')} />}
            {view === 'USERS' && <UsersListView onBack={() => setView('GAMES')} />}
          </>
        )}
      </main>

      <footer className="border-t border-slate-900 py-12 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
        <p>10x Sports Ethiopia • Provably Fair • Advanced Master Access</p>
      </footer>
    </div>
  );
};

export default App;
