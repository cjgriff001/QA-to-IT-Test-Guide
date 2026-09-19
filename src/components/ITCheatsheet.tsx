import React, { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, Cpu, Network } from 'lucide-react';

export const ITCheatsheet: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(code);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const psCommands = [
    {
      cmd: 'Test-NetConnection -ComputerName target.corp -Port 443',
      desc: 'Verify if a remote TCP port is open and reachable through the firewall.'
    },
    {
      cmd: 'Get-Service | Where-Object {$_.Status -eq "Stopped" -and $_.StartType -eq "Automatic"}',
      desc: 'Find all critical services configured to start automatically that have unexpectedly crashed.'
    },
    {
      cmd: 'Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Select-Object DeviceID, Size, FreeSpace',
      desc: 'Audit disk space across all connected physical Windows drives.'
    },
    {
      cmd: 'Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4625; StartTime=(Get-Date).AddHours(-1)}',
      desc: 'Detect brute-force password attacks by checking failed logons in the last hour.'
    },
    {
      cmd: 'Resolve-DnsName -Name internal.service.local -Server 10.0.0.2',
      desc: 'Query a specific internal DNS server to test corporate name resolution.'
    }
  ];

  const linuxCommands = [
    {
      cmd: 'journalctl -u nginx.service -xe --no-pager -n 50',
      desc: 'Inspect the last 50 error log entries for a failed systemd service daemon.'
    },
    {
      cmd: 'ss -tulpn',
      desc: 'List all open TCP and UDP listening sockets and their owning process IDs.'
    },
    {
      cmd: 'df -h -T && du -sh /var/log/* | sort -hr | head -n 5',
      desc: 'Check disk partition space and find top log directories filling up the disk.'
    },
    {
      cmd: 'dmesg -T | grep -i -E "killed process|oom"',
      desc: 'Check if Linux Out-Of-Memory (OOM) killer terminated any processes.'
    },
    {
      cmd: 'ip route show && ip -br a',
      desc: 'Display default network gateway route and active IP addresses on all interfaces.'
    }
  ];

  const termsComparison = [
    { qa: 'Test Plan / Test Strategy', it: 'Runbook / Standard Operating Procedure (SOP) / MOP' },
    { qa: 'Smoke Test / Sanity Check', it: 'Synthetic Health Check / Heartbeat Probe' },
    { qa: 'Defect Report (Jira Bug)', it: 'Incident Ticket (ServiceNow / Jira Service Management)' },
    { qa: 'Test Assertion Failure', it: 'Alert Trigger / SLA / SLO Breach' },
    { qa: 'Regression Testing', it: 'Change Validation / Post-Maintenance Verification (PVT)' },
    { qa: 'Mock Server / Stub', it: 'Staging Sandbox / Local Virtual Environment (Vagrant/Docker)' },
    { qa: 'Postman Collection', it: 'cURL Scripts / API Synthetic Monitoring Probe' },
    { qa: 'Bug Root Cause Analysis', it: 'Post-Incident Review (PIR) / Blameless Post-Mortem' }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Operational Quick Reference</span>
        </div>
        <h2 className="text-lg font-bold text-slate-100">
          The IT Sysadmin & Systems Operations Cheatsheet
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Quick-reference commands, lexicon translations, and port mappings designed to build muscle memory for day-to-day IT engineering.
        </p>
      </div>

      {/* QA vs IT Lexicon Translation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center space-x-2">
          <span className="text-cyan-400">❖</span>
          <span>QA Vocabulary ➔ IT Operations Vocabulary (Speak Like a Sysadmin)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {termsComparison.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 font-medium">{item.qa}</span>
              <span className="text-slate-600 font-mono px-2">➔</span>
              <span className="text-cyan-300 font-semibold">{item.it}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Command Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PowerShell Cheatsheet */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs">
              <Terminal className="w-4 h-4" />
              <span>Windows Enterprise / PowerShell Cmdlets</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Run as Admin</span>
          </div>

          <div className="space-y-2.5">
            {psCommands.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 text-xs space-y-1.5">
                <p className="text-slate-400 text-[11px]">{item.desc}</p>
                <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-cyan-300 text-[11px] overflow-x-auto">
                  <span className="truncate mr-2">{item.cmd}</span>
                  <button
                    onClick={() => handleCopy(item.cmd)}
                    className="text-slate-400 hover:text-white shrink-0 p-1"
                    title="Copy Cmdlet"
                  >
                    {copiedSnippet === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linux Sysadmin Cheatsheet */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
              <Cpu className="w-4 h-4" />
              <span>Linux Server / Bash Sysadmin Commands</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Terminal CLI</span>
          </div>

          <div className="space-y-2.5">
            {linuxCommands.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 text-xs space-y-1.5">
                <p className="text-slate-400 text-[11px]">{item.desc}</p>
                <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-emerald-300 text-[11px] overflow-x-auto">
                  <span className="truncate mr-2">{item.cmd}</span>
                  <button
                    onClick={() => handleCopy(item.cmd)}
                    className="text-slate-400 hover:text-white shrink-0 p-1"
                    title="Copy command"
                  >
                    {copiedSnippet === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Networking Ports */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Core IT & Networking Ports Every IT Engineer Knows by Heart</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
            <span className="text-cyan-400 font-bold block text-sm">22 / TCP</span>
            <span className="text-slate-400 text-[11px]">SSH (Linux Remote)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
            <span className="text-cyan-400 font-bold block text-sm">53 / UDP</span>
            <span className="text-slate-400 text-[11px]">DNS Resolution</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
            <span className="text-cyan-400 font-bold block text-sm">80 / 443</span>
            <span className="text-slate-400 text-[11px]">HTTP / HTTPS (SSL)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
            <span className="text-cyan-400 font-bold block text-sm">3389 / TCP</span>
            <span className="text-slate-400 text-[11px]">RDP (Windows Remote)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
            <span className="text-cyan-400 font-bold block text-sm">445 / TCP</span>
            <span className="text-slate-400 text-[11px]">SMB (Windows Shares)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
            <span className="text-cyan-400 font-bold block text-sm">389 / 636</span>
            <span className="text-slate-400 text-[11px]">LDAP / LDAPS (Active Dir)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
