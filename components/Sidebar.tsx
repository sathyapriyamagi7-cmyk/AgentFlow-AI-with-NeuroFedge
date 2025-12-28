
import React from 'react';
import { AgentMode } from '../types';
import { AGENT_CONFIGS } from '../constants';
import { History, LogOut, User as UserIcon } from 'lucide-react';

interface SidebarProps {
  activeMode: AgentMode;
  setActiveMode: (mode: AgentMode) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  user: any;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeMode, 
  setActiveMode, 
  showHistory, 
  setShowHistory, 
  user,
  onLogout,
  onLoginClick
}) => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-xl">A</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AgentFlow AI</h1>
            <p className="text-xs text-slate-500">NeuroFedge Core</p>
          </div>
        </div>

        <nav className="space-y-1">
          {Object.entries(AGENT_CONFIGS).map(([mode, config]) => (
            <button
              key={mode}
              onClick={() => {
                setActiveMode(mode as AgentMode);
                setShowHistory(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                activeMode === mode && !showHistory
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {config.icon}
              <span className="font-medium">{mode}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <button
            onClick={() => setShowHistory(true)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
              showHistory
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <History className="w-5 h-5" />
            <span className="font-medium">History</span>
          </button>
        </div>
      </div>

      <div className="mt-auto p-4 bg-slate-950 border-t border-slate-800">
        {user.isLoggedIn ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-slate-500 truncate">Pro Plan</p>
              </div>
            </div>
            <button onClick={onLogout} className="p-2 text-slate-500 hover:text-red-400">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Sign In for History
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
