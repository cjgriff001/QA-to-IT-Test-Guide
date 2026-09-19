import React, { useState, useEffect, useRef } from 'react';
import { SimulationScenario } from '../types';
import { SIMULATION_OUTPUTS } from '../data/qaToItData';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  AlertTriangle, 
  ShieldAlert, 
  Server, 
  Activity, 
  WifiOff 
} from 'lucide-react';

export const TerminalSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>('healthy');
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLineCount, setVisibleLineCount] = useState<number>(0);
  const [copiedLog, setCopiedLog] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scenarioData = SIMULATION_OUTPUTS[selectedScenario];

  // Auto-scroll terminal on new lines
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLineCount]);

  // Start execution simulation
  const handleRunSimulation = () => {
    setIsRunning(true);
    setVisibleLineCount(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleLineCount(current);
      if (current >= scenarioData.lines.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 90);
  };

  // Run on mount or scenario change
  useEffect(() => {
    handleRunSimulation();
  }, [selectedScenario]);

  const handleCopyLog = () => {
    const rawText = scenarioData.lines.slice(0, visibleLineCount).map(l => l.text).join('\n');
    navigator.clipboard.writeText(rawText);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const handleDownloadLog = () => {
    const rawText = scenarioData.lines.slice(0, visibleLineCount).map(l => l.text).join('\n');
    const blob = new Blob([rawText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `it_triage_audit_${selectedScenario}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate health score
  const issuesCount = scenarioData.exitCode === 0 ? 0 : (selectedScenario === 'network_outage' ? 2 : 1);
  const healthScore = issuesCount === 0 ? 100 : (issuesCount === 1 ? 72 : 44);

  return (
    <div className="space-y-6">
      {/* Top Banner & Scenario Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Interactive IT First-Responder Simulator
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              Test Real-World Infrastructure Scenarios
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Simulating as:</span>
            <code className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono border border-slate-800">
              root@bastion-01:~#
            </code>
          </div>
        </div>

        {/* Scenario Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {(Object.keys(SIMULATION_OUTPUTS) as SimulationScenario[]).map((scenarioKey) => {
            const sc = SIMULATION_OUTPUTS[scenarioKey];
            const isSelected = selectedScenario === scenarioKey;

            return (
              <button
                key={scenarioKey}
                onClick={() => {
                  setSelectedScenario(scenarioKey);
                }}
                disabled={isRunning}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                } ${isRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  {scenarioKey === 'healthy' && <Activity className="w-3.5 h-3.5 text-emerald-400" />}
                  {scenarioKey === 'disk_warning' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                  {scenarioKey === 'network_outage' && <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
                  {scenarioKey === 'service_down' && <Server className="w-3.5 h-3.5 text-cyan-400" />}
                  {scenarioKey === 'security_anomaly' && <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />}
                  
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${sc.badgeColor}`}>
                    {scenarioKey === 'healthy' ? '0 Alerts' : 'Alert'}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 truncate">
                  {sc.name.split(':')[1] || sc.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {sc.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Health Score</span>
            <span className={`text-xl font-bold font-mono ${
              healthScore >= 90 ? 'text-emerald-400' : healthScore >= 70 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {healthScore}/100
            </span>
          </div>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            healthScore >= 90 ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Issues Detected</span>
            <span className={`text-xl font-bold font-mono ${issuesCount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {issuesCount} Anomaly
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Exit Code ($?)</span>
            <span className="text-xl font-bold font-mono text-cyan-400">
              {scenarioData.exitCode}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
            $?
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Triage Status</span>
            <span className="text-xs font-semibold text-slate-200 block truncate">
              {isRunning ? 'Auditing...' : (issuesCount === 0 ? 'Nominal / Healthy' : 'Action Required')}
            </span>
          </div>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            isRunning ? 'bg-amber-950/60 text-amber-400 animate-spin' : (issuesCount === 0 ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400')
          }`}>
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs text-slate-400 font-mono ml-2">
              bash - root@jumpbox: /opt/scripts/it-system-triage.sh
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunning ? 'Running...' : 'Re-Run'}</span>
            </button>

            <button
              onClick={handleCopyLog}
              className="p-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Copy Output"
            >
              {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownloadLog}
              className="p-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Download Log"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div className="p-4 font-mono text-xs leading-relaxed min-h-[360px] max-h-[500px] overflow-y-auto space-y-1 select-text">
          <div className="text-slate-500 flex items-center space-x-2 pb-2 border-b border-slate-900">
            <span className="text-emerald-400 font-bold">root@jumpbox:~#</span>
            <span className="text-slate-300">./it-system-triage.sh --threshold-disk=85 --check-services</span>
          </div>

          {scenarioData.lines.slice(0, visibleLineCount).map((line, idx) => {
            let style = 'text-slate-300';
            if (line.type === 'header') style = 'text-cyan-400 font-bold';
            else if (line.type === 'success') style = 'text-emerald-400';
            else if (line.type === 'warning') style = 'text-amber-400';
            else if (line.type === 'error') style = 'text-rose-400 font-semibold';
            else if (line.type === 'info') style = 'text-slate-400';

            return (
              <div key={idx} className={`${style} transition-all duration-75`}>
                {line.text}
              </div>
            );
          })}

          {isRunning && (
            <div className="flex items-center space-x-2 text-cyan-400 animate-pulse pt-2">
              <span className="w-2 h-4 bg-cyan-400 inline-block" />
              <span className="text-slate-500 text-[11px]">Executing system probe...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Status Bar */}
        <div className="bg-slate-900/80 border-t border-slate-800/80 px-4 py-1.5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span>Scenario: {scenarioData.name.split(':')[0]}</span>
            <span>•</span>
            <span className="text-emerald-400">Exit Code: {scenarioData.exitCode}</span>
          </div>
          <span className="text-slate-500">Lines Rendered: {visibleLineCount} / {scenarioData.lines.length}</span>
        </div>
      </div>
    </div>
  );
};
