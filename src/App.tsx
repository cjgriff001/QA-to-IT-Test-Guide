/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScriptWorkbench } from './components/ScriptWorkbench';
import { TerminalSimulator } from './components/TerminalSimulator';
import { QABridgeGuide } from './components/QABridgeGuide';
import { ITCheatsheet } from './components/ITCheatsheet';
import { SCRIPTS_COLLECTION, DEFAULT_SCRIPT_PARAMS } from './data/scriptsData';
import { ScriptItem, ScriptLanguage, ScriptParamConfig } from './types';
import { Shield, Sparkles, Terminal as TerminalIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workbench' | 'terminal' | 'bridge' | 'cheatsheet'>('workbench');
  const [activeScript, setActiveScript] = useState<ScriptItem>(SCRIPTS_COLLECTION[0]);
  const [language, setLanguage] = useState<ScriptLanguage>('powershell');
  const [params, setParams] = useState<ScriptParamConfig>(DEFAULT_SCRIPT_PARAMS);
  const [copied, setCopied] = useState(false);

  // Quick action copy handler
  const handleCopyCode = (codeToCopy?: string) => {
    const code = codeToCopy || activeScript.languages[language].codeGenerator(params);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick action download handler
  const handleDownloadCode = (filenameToDownload?: string, codeToDownload?: string) => {
    const filename = filenameToDownload || activeScript.languages[language].filename;
    const code = codeToDownload || activeScript.languages[language].codeGenerator(params);

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickCopy={() => handleCopyCode()}
        onQuickDownload={() => handleDownloadCode()}
        copied={copied}
        activeScriptTitle={activeScript.languages[language].filename}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'workbench' && (
          <ScriptWorkbench
            scripts={SCRIPTS_COLLECTION}
            activeScript={activeScript}
            setActiveScript={setActiveScript}
            language={language}
            setLanguage={setLanguage}
            params={params}
            setParams={setParams}
            onRunSimulator={() => setActiveTab('terminal')}
            onCopyCode={handleCopyCode}
            onDownloadCode={handleDownloadCode}
            copied={copied}
          />
        )}

        {activeTab === 'terminal' && (
          <TerminalSimulator />
        )}

        {activeTab === 'bridge' && (
          <QABridgeGuide />
        )}

        {activeTab === 'cheatsheet' && (
          <ITCheatsheet />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Enterprise-Grade IT Sysadmin & Triage Scripts • Crafted for Software QA Professionals</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab('bridge')}
              className="text-slate-400 hover:text-cyan-300 transition"
            >
              Career Strategy
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('terminal')}
              className="text-slate-400 hover:text-cyan-300 transition"
            >
              Terminal Simulator
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('cheatsheet')}
              className="text-slate-400 hover:text-cyan-300 transition"
            >
              Command Reference
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
