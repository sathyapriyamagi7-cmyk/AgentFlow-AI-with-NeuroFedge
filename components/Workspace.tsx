
import React, { useState, useEffect } from 'react';
import { AgentMode, AgentHistoryItem } from '../types';
import { AGENT_CONFIGS } from '../constants';
import { runAgentTask, runSupervisorWorkflow } from '../services/geminiService';
import { Play, Loader2, Copy, Check, ShieldAlert } from 'lucide-react';

interface WorkspaceProps {
  mode: AgentMode;
  onSaveResult: (item: AgentHistoryItem) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ mode, onSaveResult }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);

  const config = AGENT_CONFIGS[mode];

  useEffect(() => {
    // Clear state when switching modes
    setInput('');
    setOutput('');
    setConfidence(null);
  }, [mode]);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setConfidence(null);

    try {
      let result = '';
      let score = null;

      if (mode === AgentMode.SUPERVISOR) {
        const { output: res, confidence: conf } = await runSupervisorWorkflow(input);
        result = res;
        score = conf;
        setConfidence(conf);
      } else {
        result = await runAgentTask(mode, input);
      }

      setOutput(result);
      
      onSaveResult({
        id: crypto.randomUUID(),
        mode,
        input,
        output: result,
        timestamp: Date.now(),
        confidence: score || undefined
      });
    } catch (error) {
      setOutput(`Error: ${String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {config.icon}
            {mode} Mode
          </h2>
          <p className="text-sm text-slate-400 mt-1">{config.description}</p>
        </div>
        <button
          onClick={handleRun}
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-900/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run Agent
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Input Prompt / Code</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your code or requirements for the ${mode} agent here...`}
            className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 code-font text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-inner"
          />
        </div>

        {(loading || output) && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {mode} Output
              </label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="relative">
              {loading ? (
                <div className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-4 text-slate-500">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                    <div className="absolute inset-0 blur-lg bg-indigo-500/20 animate-pulse"></div>
                  </div>
                  <p className="text-sm font-medium animate-pulse">{mode} Agent is thinking...</p>
                </div>
              ) : (
                <div className="w-full min-h-[16rem] bg-slate-950 border border-slate-800 rounded-xl p-6 code-font text-sm whitespace-pre-wrap text-slate-300 leading-relaxed shadow-lg">
                  {confidence !== null && (
                    <div className={`mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                      confidence > 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      confidence > 50 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      <ShieldAlert className="w-3 h-3" />
                      Confidence: {confidence}%
                    </div>
                  )}
                  {output}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
