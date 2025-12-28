
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import NeuroFedge from './components/NeuroFedge';
import Auth from './components/Auth';
import { AgentMode, AgentHistoryItem, User } from './types';
import { Clock, Trash2, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AgentMode>(AgentMode.CODER);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<AgentHistoryItem[]>([]);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User>({
    fullName: '',
    email: '',
    mobile: '',
    isLoggedIn: false
  });

  // Load history from localStorage if user is "logged in"
  useEffect(() => {
    const savedHistory = localStorage.getItem('agent_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (item: AgentHistoryItem) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    localStorage.setItem('agent_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your entire history?')) {
      setHistory([]);
      localStorage.removeItem('agent_history');
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setShowAuth(false);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        activeMode={activeMode} 
        setActiveMode={setActiveMode}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        user={user}
        onLogout={() => setUser({ fullName: '', email: '', mobile: '', isLoggedIn: false })}
        onLoginClick={() => setShowAuth(true)}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {showHistory ? (
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Agent Execution History
                </h2>
                <p className="text-sm text-slate-400">Review your past multi-agent collaborations.</p>
              </div>
              <button 
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <Search className="w-8 h-8 opacity-20" />
                  </div>
                  <p>No history found. Start a task in an agent mode!</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors">
                    <div className="px-4 py-3 bg-slate-900/50 flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-[10px] font-bold uppercase rounded border border-indigo-500/20">
                          {item.mode}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {item.confidence && (
                        <span className="text-xs font-bold text-green-400">
                          {item.confidence}% Confidence
                        </span>
                      )}
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Input</p>
                        <div className="text-sm text-slate-400 line-clamp-3 overflow-hidden bg-slate-900/30 p-2 rounded">
                          {item.input}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Output Snapshot</p>
                        <div className="text-sm text-slate-300 line-clamp-3 overflow-hidden bg-indigo-500/5 p-2 rounded border border-indigo-500/10">
                          {item.output}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <Workspace mode={activeMode} onSaveResult={saveToHistory} />
        )}
      </main>

      <NeuroFedge />

      {showAuth && (
        <Auth 
          onSuccess={handleAuthSuccess} 
          onClose={() => setShowAuth(false)} 
        />
      )}
    </div>
  );
};

export default App;
