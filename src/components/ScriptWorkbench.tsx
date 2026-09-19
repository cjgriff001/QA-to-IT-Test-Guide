import React, { useState } from 'react';
import { 
  ScriptItem, 
  ScriptLanguage, 
  ScriptParamConfig 
} from '../types';
import { 
  Check, 
  Copy, 
  Download, 
  Sliders, 
  Terminal, 
  Code2, 
  Lightbulb, 
  Info, 
  Plus, 
  X,
  Play,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface ScriptWorkbenchProps {
  scripts: ScriptItem[];
  activeScript: ScriptItem;
  setActiveScript: (script: ScriptItem) => void;
  language: ScriptLanguage;
  setLanguage: (lang: ScriptLanguage) => void;
  params: ScriptParamConfig;
  setParams: React.Dispatch<React.SetStateAction<ScriptParamConfig>>;
  onRunSimulator: () => void;
  onCopyCode: (code: string) => void;
  onDownloadCode: (filename: string, code: string) => void;
  copied: boolean;
}

export const ScriptWorkbench: React.FC<ScriptWorkbenchProps> = ({
  scripts,
  activeScript,
  setActiveScript,
  language,
  setLanguage,
  params,
  setParams,
  onRunSimulator,
  onCopyCode,
  onDownloadCode,
  copied
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [newServiceInput, setNewServiceInput] = useState('');

  const currentLangConfig = activeScript.languages[language];
  const generatedCode = currentLangConfig.codeGenerator(params);

  const handleAddService = () => {
    if (newServiceInput.trim() && !params.criticalServices.includes(newServiceInput.trim())) {
      setParams(prev => ({
        ...prev,
        criticalServices: [...prev.criticalServices, newServiceInput.trim()]
      }));
      setNewServiceInput('');
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setParams(prev => ({
      ...prev,
      criticalServices: prev.criticalServices.filter(s => s !== serviceToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Script Picker Carousel / Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              IT Administration Script Catalog
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              Select Script for Your IT Toolkit
            </h2>
          </div>
          <span className="text-xs text-slate-400 mt-1 sm:mt-0">
            5 Battle-tested Production Templates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {scripts.map((script) => {
            const isSelected = script.id === activeScript.id;
            return (
              <button
                key={script.id}
                onClick={() => setActiveScript(script)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                    script.id === 'triage' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {script.id === 'triage' ? '★ Flagship' : script.id}
                  </span>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
                <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">
                  {script.title.split('(')[0]}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {script.shortDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Script Header & QA Leverage Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                Filename: {currentLangConfig.filename}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                Target Role: {activeScript.itJobRelevance.split(',')[0]}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {activeScript.title}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              {activeScript.shortDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setShowGuide(!showGuide);
                if (!showGuide) setShowConfig(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center space-x-2 transition ${
                showGuide 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>{showGuide ? 'Hide Run Guide' : 'How to Run This'}</span>
            </button>

            <button
              onClick={() => {
                setShowConfig(!showConfig);
                if (!showConfig) setShowGuide(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center space-x-2 transition ${
                showConfig 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{showConfig ? 'Hide Parameters' : 'Customize Parameters'}</span>
            </button>

            <button
              onClick={onRunSimulator}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-2 shadow-sm transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Execution</span>
            </button>
          </div>
        </div>

        {/* Quick Run & Usage Guide Drawer */}
        {showGuide && (
          <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4 animate-in fade-in duration-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-sm font-semibold text-cyan-300">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Execution Instructions: How to Run on Real Machines</span>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-200 text-xs flex items-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Windows PowerShell */}
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>1. Windows (PowerShell)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Click <span className="text-cyan-300 font-semibold">"Download"</span> in the top right (saves <code className="bg-slate-950 px-1 rounded text-cyan-400">.ps1</code>).</li>
                  <li>Press <kbd className="bg-slate-800 px-1 rounded">Win + X</kbd> and choose <strong>Terminal (Admin)</strong> or <strong>PowerShell (Admin)</strong>.</li>
                  <li>Allow script execution in current terminal:
                    <pre className="mt-1 p-1.5 bg-slate-950 rounded text-cyan-300 text-[10px] font-mono overflow-x-auto">Set-ExecutionPolicy -Scope Process Bypass</pre>
                  </li>
                  <li>Run the script:
                    <pre className="mt-1 p-1.5 bg-slate-950 rounded text-cyan-300 text-[10px] font-mono overflow-x-auto">.\IT-SystemTriage.ps1</pre>
                  </li>
                </ol>
              </div>

              {/* Linux / Mac Bash */}
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>2. Linux / macOS (Bash)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Switch language tab to <strong>Bash (.sh)</strong> and click <span className="text-cyan-300 font-semibold">"Download"</span>.</li>
                  <li>Open your terminal and navigate to download folder:
                    <pre className="mt-1 p-1.5 bg-slate-950 rounded text-emerald-300 text-[10px] font-mono overflow-x-auto">cd ~/Downloads</pre>
                  </li>
                  <li>Give executable permission:
                    <pre className="mt-1 p-1.5 bg-slate-950 rounded text-emerald-300 text-[10px] font-mono overflow-x-auto">chmod +x it-system-triage.sh</pre>
                  </li>
                  <li>Execute with sudo (required for /var/log & service inspection):
                    <pre className="mt-1 p-1.5 bg-slate-950 rounded text-emerald-300 text-[10px] font-mono overflow-x-auto">sudo ./it-system-triage.sh</pre>
                  </li>
                </ol>
              </div>

              {/* Python Cross-Platform */}
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>3. Python 3 (Any OS)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Switch language tab to <strong>Python (.py)</strong> and click <span className="text-cyan-300 font-semibold">"Download"</span>.</li>
                  <li>No pip packages needed! Uses built-in standard library only (<code className="text-amber-300">socket</code>, <code className="text-amber-300">platform</code>, <code className="text-amber-300">shutil</code>).</li>
                  <li>Run directly in your terminal:
                    <pre className="mt-1 p-1.5 bg-slate-950 rounded text-amber-300 text-[10px] font-mono overflow-x-auto">python3 it_system_triage.py</pre>
                  </li>
                  <li>Outputs formatted triage results and returns exit code <code className="text-cyan-300">0</code> (healthy) or <code className="text-rose-400">1</code> (alerts detected).</li>
                </ol>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 font-semibold">💡 QA Tip:</span>
                <span>Treat this like an automated acceptance / sanity test for hardware, network & services before touching user tickets.</span>
              </div>
              <button
                onClick={onRunSimulator}
                className="text-cyan-300 hover:text-cyan-200 underline font-medium self-start sm:self-auto"
              >
                Or test-drive it right now in the browser simulator ➔
              </button>
            </div>
          </div>
        )}

        {/* 9-Year QA Insight Callout */}
        <div className="mt-4 p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 flex items-start space-x-3 text-xs">
          <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span className="font-semibold text-cyan-300">
              How Your 9 Years of QA Directly Applies to This Script:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {activeScript.whyForQA}
            </p>
          </div>
        </div>

        {/* Parameter Customization Drawer */}
        {showConfig && (
          <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Custom Parameters (Injected into Script Generation in Real-Time)</span>
              </div>
              <button 
                onClick={() => setShowConfig(false)}
                className="text-slate-400 hover:text-slate-200 text-xs flex items-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Disk Threshold */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-400 font-medium">Disk Warning Limit</label>
                  <span className="text-cyan-400 font-mono">{params.diskThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={params.diskThreshold}
                  onChange={(e) => setParams(prev => ({ ...prev, diskThreshold: Number(e.target.value) }))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Memory Threshold */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-slate-400 font-medium">RAM Warning Limit</label>
                  <span className="text-cyan-400 font-mono">{params.memoryThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={params.memoryThreshold}
                  onChange={(e) => setParams(prev => ({ ...prev, memoryThreshold: Number(e.target.value) }))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Ping Target */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Ping / Gateway Target</label>
                <input
                  type="text"
                  value={params.pingTarget}
                  onChange={(e) => setParams(prev => ({ ...prev, pingTarget: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  placeholder="8.8.8.8 or 10.0.0.1"
                />
              </div>

              {/* DNS Target */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">DNS Test Domain</label>
                <input
                  type="text"
                  value={params.dnsTarget}
                  onChange={(e) => setParams(prev => ({ ...prev, dnsTarget: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  placeholder="google.com or intranet.corp"
                />
              </div>
            </div>

            {/* Critical Services List */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <label className="text-slate-400 font-medium">
                Monitored IT Services / Daemons (Will be verified by script)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {params.criticalServices.map((service) => (
                  <span 
                    key={service} 
                    className="inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]"
                  >
                    <span>{service}</span>
                    <button
                      onClick={() => handleRemoveService(service)}
                      className="ml-1.5 text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="inline-flex items-center space-x-1">
                  <input
                    type="text"
                    value={newServiceInput}
                    onChange={(e) => setNewServiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddService()}
                    placeholder="add service (e.g. redis)..."
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-200 text-xs font-mono w-40 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleAddService}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400"
                    title="Add service"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Editor Toolbar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Language Selector Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setLanguage('powershell')}
              className={`px-3 py-1 rounded text-xs font-medium font-mono flex items-center space-x-1.5 transition ${
                language === 'powershell'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>PowerShell (.ps1)</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">[Windows/AD]</span>
            </button>

            <button
              onClick={() => setLanguage('bash')}
              className={`px-3 py-1 rounded text-xs font-medium font-mono flex items-center space-x-1.5 transition ${
                language === 'bash'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Bash (.sh)</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">[Linux/Cloud]</span>
            </button>

            <button
              onClick={() => setLanguage('python')}
              className={`px-3 py-1 rounded text-xs font-medium font-mono flex items-center space-x-1.5 transition ${
                language === 'python'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Python (.py)</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">[Cross-Platform]</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onCopyCode(generatedCode)}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                  <span className="text-emerald-300">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={() => onDownloadCode(currentLangConfig.filename, generatedCode)}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Save As {currentLangConfig.filename}</span>
            </button>
          </div>
        </div>

        {/* Execution Guide Banner */}
        <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2 text-xs flex items-center justify-between text-slate-300 font-mono">
          <div className="flex items-center space-x-2 truncate">
            <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400">Run Command:</span>
            <span className="text-cyan-300 truncate">{currentLangConfig.executionGuide.split('\n')[1] || currentLangConfig.executionGuide.split('\n')[0]}</span>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
            {generatedCode.split('\n').length} lines
          </span>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto text-xs font-mono leading-relaxed bg-[#0d1117] text-slate-200">
          <pre className="select-text">
            {generatedCode.split('\n').map((line, idx) => {
              // Simple syntax styling
              const isComment = line.trim().startsWith('#') || line.trim().startsWith('"""');
              const isHeader = line.includes('===') || line.includes('***');
              const isFunction = line.includes('function ') || line.includes('def ') || line.includes('() {');
              
              let textColor = 'text-slate-200';
              if (isComment) textColor = 'text-emerald-500/80 italic';
              else if (isHeader) textColor = 'text-cyan-400 font-bold';
              else if (isFunction) textColor = 'text-amber-300 font-semibold';
              else if (line.includes('[OK]') || line.includes('PASS')) textColor = 'text-emerald-400';
              else if (line.includes('[WARN]')) textColor = 'text-amber-400';
              else if (line.includes('[FAIL]')) textColor = 'text-rose-400';

              return (
                <div key={idx} className="flex hover:bg-slate-800/40 px-1 rounded">
                  <span className="w-10 select-none text-slate-600 text-right pr-4 shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <span className={textColor}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Execution Instructions Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-slate-200 font-semibold">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Production Sysadmin Execution Best Practices:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-slate-400">
          <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
            <span className="font-semibold text-slate-200 block mb-1">PowerShell (Windows)</span>
            <p>Always run as Administrator. Use <code className="text-cyan-400">Set-ExecutionPolicy -Scope Process Bypass</code> if script execution is restricted by enterprise GPO.</p>
          </div>
          <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
            <span className="font-semibold text-slate-200 block mb-1">Bash (Linux / Unix)</span>
            <p>Ensure file has execute bits: <code className="text-cyan-400">chmod +x filename.sh</code>. Use <code className="text-cyan-400">sudo</code> to inspect protected directories like <code className="text-cyan-400">/var/log</code>.</p>
          </div>
          <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
            <span className="font-semibold text-slate-200 block mb-1">Python (Cross-Platform)</span>
            <p>Designed with standard library only. No <code className="text-cyan-400">pip install</code> required, making it safe to drop onto isolated air-gapped production boxes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
