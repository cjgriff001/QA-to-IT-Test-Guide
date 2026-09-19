export type ScriptLanguage = 'powershell' | 'bash' | 'python';

export type ScriptCategory = 'triage' | 'network' | 'user-admin' | 'log-audit' | 'watchdog';

export interface ScriptParamConfig {
  diskThreshold: number;
  memoryThreshold: number;
  pingTarget: string;
  dnsTarget: string;
  criticalServices: string[];
  reportFormat: 'text' | 'json' | 'markdown';
}

export interface ScriptItem {
  id: ScriptCategory;
  title: string;
  shortDesc: string;
  whyForQA: string;
  itJobRelevance: string;
  languages: {
    powershell: {
      filename: string;
      extension: string;
      codeGenerator: (params: ScriptParamConfig) => string;
      executionGuide: string;
    };
    bash: {
      filename: string;
      extension: string;
      codeGenerator: (params: ScriptParamConfig) => string;
      executionGuide: string;
    };
    python: {
      filename: string;
      extension: string;
      codeGenerator: (params: ScriptParamConfig) => string;
      executionGuide: string;
    };
  };
}

export type SimulationScenario = 'healthy' | 'disk_warning' | 'network_outage' | 'service_down' | 'security_anomaly';

export interface TerminalOutputLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'header' | 'metric';
  delayMs?: number;
}

export interface QASkillMapping {
  qaSkill: string;
  itEquivalent: string;
  leverageExplanation: string;
  interviewTip: string;
  sampleResumeBullet: string;
}
