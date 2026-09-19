import React from 'react';
import { Terminal, Shield, BookOpen, Wrench, Sparkles, Download, Check, Copy } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workbench' | 'terminal' | 'bridge' | 'cheatsheet';
  setActiveTab: (tab: 'workbench' | 'terminal' | 'bridge' | 'cheatsheet') => void;
  onQuickCopy: () => void;
  onQuickDownload: () => void;
  copied: boolean;
  activeScriptTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickCopy,
  onQuickDownload,
  copied,
  activeScriptTitle
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-mono font-bold">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-semibold text-slate-100 tracking-tight">
                  QA <span className="text-cyan-400">➔</span> IT Transition Suite
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                  <Sparkles className="w-3 h-3 mr-1 text-cyan-400" />
                  9-Year Veteran Bridge
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                Production-grade IT diagnostic, sysadmin & triage automation
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'workbench'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Script Workbench</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'terminal'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('bridge')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'bridge'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>QA ➔ IT Career Bridge</span>
            </button>

            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'cheatsheet'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>IT Cheatsheet</span>
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onQuickCopy}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm active:scale-95"
              title="Copy active script to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                  <span className="hidden sm:inline">Copy Script</span>
                </>
              )}
            </button>

            <button
              onClick={onQuickDownload}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm active:scale-95"
              title={`Download ${activeScriptTitle}`}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 space-x-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('workbench')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'workbench' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Workbench
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'terminal' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('bridge')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'bridge' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Career Bridge
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'cheatsheet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Cheatsheet
          </button>
        </div>
      </div>
    </header>
  );
};
