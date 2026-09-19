import React, { useState } from 'react';
import { QA_TO_IT_SKILLS, CERTIFICATION_ROADMAP } from '../data/qaToItData';
import { 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  HelpCircle, 
  Award, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';

export const QABridgeGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyBullet = (bullet: string, idx: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const interviewScenarios = [
    {
      question: "Why should we hire you as an IT professional when your past 9 years were in Software QA?",
      answerPitch: "Software QA and IT Operations share the exact same core DNA: finding root causes, understanding distributed architectures, and maintaining system stability. But having 9 years of QA means I bring advanced scripting, test automation, and systematic debugging that most traditional Tier 1/2 IT technicians lack. Rather than manually clicking through GUI dialogues, I write automated PowerShell and Bash runbooks to triage incidents and prevent repeat outages.",
      qaAdvantage: "You already know how to write scripts, read API contracts, and document reproducible steps."
    },
    {
      question: "A user or monitoring tool reports that a web service is down. What is your exact troubleshooting sequence?",
      answerPitch: "I follow the standard OSI/network triage protocol using the automated scripts in my toolkit: First, Layer 3/4—can I ping the gateway, and is TCP Port 443 listening? Second, Layer 7—does DNS resolve the domain, and is the SSL certificate valid? Third, Host Resources—I inspect CPU, memory pressure, and whether disk space is exhausted (e.g. /var/log or C:\\). Fourth, Service Daemon—I check systemctl or Get-Service to verify if the process died or encountered an unhandled exception.",
      qaAdvantage: "Your instinct to isolate variables (frontend vs backend vs database) mirrors enterprise IT triage."
    },
    {
      question: "A production server is at 98% disk utilization. How do you resolve it safely without causing data loss?",
      answerPitch: "Never blindly run `rm -rf` or delete unknown files. First, run the triage script to identify the exact volume and offending directory (e.g., `ncdu` or `du -sh /var/*` in Linux, or `Get-CimInstance Win32_LogicalDisk` in PowerShell). Usually, it is unrotated application logs or old kernel images. I safely vacuum system logs (`journalctl --vacuum-size=1G`), rotate old logs, and verify if a core database was paused due to disk write locks before restarting services.",
      qaAdvantage: "In QA, you've seen systems crash from full test disks; you respect data integrity and root-cause fixes."
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Narrative */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>Strategic Career Positioning Guide</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
          Translating 9 Years of QA Experience into Senior IT Impact
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed">
          Transitioning from Software Quality Assurance to IT Engineering, Systems Administration, or Cloud Operations is one of the highest-leverage career pivots in tech. While junior IT staff often rely on trial-and-error, your 9 years of rigorous defect isolation, log parsing, and automation scripting position you as a high-value Senior IT professional.
        </p>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-cyan-400 font-mono text-xs font-bold block mb-1">01. THE SCRIPTING EDGE</span>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Automation Over Clicking</h4>
            <p className="text-xs text-slate-400">
              Traditional IT technicians start with GUI tools. Your coding and automation background lets you immediately write PowerShell, Bash, and Python automation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-emerald-400 font-mono text-xs font-bold block mb-1">02. METHODICAL TRIAGE</span>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Root Cause Scientific Method</h4>
            <p className="text-xs text-slate-400">
              Isolating complex software bugs for 9 years trained your brain to test one variable at a time when troubleshooting network or server outages.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <span className="text-amber-400 font-mono text-xs font-bold block mb-1">03. SYSTEMS THINKING</span>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Cross-Functional Fluency</h4>
            <p className="text-xs text-slate-400">
              You already speak the language of developers, product managers, and release engineers, making you an exceptional SRE or IT incident commander.
            </p>
          </div>
        </div>
      </div>

      {/* Skill Translation Matrix */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Competency Translation Matrix
          </span>
          <h3 className="text-lg font-bold text-slate-100">
            How Your QA Skills Rebrand for IT Job Descriptions
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {QA_TO_IT_SKILLS.map((item, index) => (
            <div 
              key={index}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-sm font-semibold">
                  <span className="text-slate-400">QA Experience:</span>
                  <span className="text-slate-200">{item.qaSkill}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 hidden sm:inline" />
                  <span className="text-cyan-400">{item.itEquivalent}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 w-fit">
                  High IT Hiring Demand
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Why It Matters in IT:</span>
                  <p className="text-slate-300 leading-relaxed">{item.leverageExplanation}</p>
                </div>

                <div>
                  <span className="text-amber-400 font-semibold block mb-1">Interview Talk Track:</span>
                  <p className="text-slate-300 italic leading-relaxed">{item.interviewTip}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-emerald-400 font-semibold block mb-1">Resume Bullet Formula:</span>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                      "{item.sampleResumeBullet}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyBullet(item.sampleResumeBullet, index)}
                    className="mt-2 text-xs text-slate-400 hover:text-cyan-300 flex items-center space-x-1.5 transition self-end"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Bullet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Real IT Interview Questions */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100 font-bold text-base sm:text-lg">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>Real IT Hiring Manager Questions (And How a 9-Year QA Pro Answers)</span>
        </div>

        <div className="space-y-4">
          {interviewScenarios.map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-800/90 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold">
                  Q{idx + 1}
                </span>
                <span className="font-semibold text-slate-200 text-sm">
                  {item.question}
                </span>
              </div>

              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-semibold block mb-1">Your Recommended Response:</span>
                "{item.answerPitch}"
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span><strong>QA Leverage:</strong> {item.qaAdvantage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Certification Path */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-slate-100 font-bold text-base sm:text-lg">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Recommended IT Certifications (Fast-Track for QA Veterans)</span>
        </div>
        <p className="text-xs text-slate-400">
          Because you already have 9 years of tech industry credibility, you don't need entry-level certs like CompTIA A+. Target these high-yield operational certifications:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CERTIFICATION_ROADMAP.map((cert, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                {cert.category}
              </span>
              <h4 className="text-sm font-bold text-slate-100">{cert.cert}</h4>
              <p className="text-slate-300">{cert.whyValuable}</p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400">
                <strong>QA Synergy:</strong> {cert.qaAdvantage}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
