import { QASkillMapping, SimulationScenario, TerminalOutputLine } from '../types';

export const QA_TO_IT_SKILLS: QASkillMapping[] = [
  {
    qaSkill: 'Defect Triage & Bug Isolation',
    itEquivalent: 'IT Incident Triage & Root Cause Analysis (RCA)',
    leverageExplanation: '9 years of finding elusive software bugs means you already possess the scientific method of troubleshooting: isolating variables, checking logs, and testing hypotheses. In IT, this makes you an elite first-responder when servers crash or networks degrade.',
    interviewTip: '"In QA, I spent 9 years isolating intermittent race conditions by reproducing them step-by-step. In IT, I apply that same methodical troubleshooting process to isolate whether an outage is caused by DNS, network firewalls, disk exhaustion, or application deadlock."',
    sampleResumeBullet: 'Spearheaded cross-functional incident triage workflows, reducing Mean Time to Resolution (MTTR) by 35% using automated health-check diagnostic scripts and methodical root-cause isolation.'
  },
  {
    qaSkill: 'Test Automation & Scripting (Python / Bash / JS)',
    itEquivalent: 'Infrastructure Automation, Runbooks & Config Management',
    leverageExplanation: 'Most traditional IT support technicians only know GUI tools. Because you already know how to write robust code, handle exceptions, and structure scripts, you can immediately write PowerShell, Bash, and Ansible playbooks to automate repetitive IT operations.',
    interviewTip: '"Unlike entry-level IT candidates, I already have 9 years of scripting experience. Rather than manually clicking through settings on 50 servers, I write automated PowerShell and Bash runbooks to deploy, audit, and self-heal services."',
    sampleResumeBullet: 'Automated recurring server maintenance and security health audits using custom PowerShell and Bash diagnostic suites, eliminating 15+ hours of manual weekly sysadmin overhead.'
  },
  {
    qaSkill: 'API & Microservice Testing (Postman, cURL, JSON)',
    itEquivalent: 'Network Protocol Diagnostics (TCP/UDP, DNS, SSL/TLS, Proxies)',
    leverageExplanation: 'You understand HTTP status codes, payload structures, headers, and authentication tokens. This directly maps to IT troubleshooting for reverse proxies (Nginx), SSL/TLS certificate renewal, API gateway routing, and webhook alerting.',
    interviewTip: '"My deep familiarity with HTTP headers, TLS handshakes, and REST endpoints allows me to quickly determine if an issue is client-side, DNS propagation, or an upstream firewall rejecting connections."',
    sampleResumeBullet: 'Diagnosed and resolved critical service connectivity and reverse-proxy degradations using network probing tools (cURL, netcat, openssl, tcpdump).'
  },
  {
    qaSkill: 'CI/CD Pipeline Integration (Jenkins, GitHub Actions)',
    itEquivalent: 'DevOps, Scheduled Runbooks & Patch Automation',
    leverageExplanation: 'You understand build triggers, environment variables, secret management, and artifact promotion. In IT, this translates into managing automated backup cron jobs, patch deployment pipelines, and configuration deployment.',
    interviewTip: '"I bridge the gap between Dev and IT Ops because I have worked inside CI/CD pipelines for years. I know how changes get deployed and how to guard production stability."',
    sampleResumeBullet: 'Integrated automated infrastructure verification steps into deployment pipelines, ensuring zero configuration regressions across staging and production clusters.'
  },
  {
    qaSkill: 'Log Analysis & Crash Reporting',
    itEquivalent: 'System Observability, Event Logs (SIEM), and Audit Trails',
    leverageExplanation: 'You already instinctively look at stack traces and server logs. Translating this to IT means using `journalctl`, Windows Event Viewer, Syslog, and tools like Splunk or Datadog to detect security intrusions or resource leaks.',
    interviewTip: '"I treat IT system logs the same way I treated test failure logs: filtering signal from noise, identifying warning trends before they cause outages, and setting up proactive alerts."',
    sampleResumeBullet: 'Configured automated log-monitoring scripts to identify brute-force login attempts and disk saturation spikes before user impact occurred.'
  }
];

export const CERTIFICATION_ROADMAP = [
  {
    category: 'Foundational Networking & Systems',
    cert: 'CompTIA Network+ / CCNA',
    whyValuable: 'Fills any gaps in IP subnetting, VLANs, routing protocols, and firewalls—the most common stumbling block for QA engineers moving to IT infrastructure.',
    qaAdvantage: 'High. You already know TCP/IP concepts from API and client-server testing.'
  },
  {
    category: 'Enterprise Windows & Cloud IAM',
    cert: 'Microsoft AZ-104 (Azure Administrator) or SC-300',
    whyValuable: 'Enterprise IT heavily revolves around Active Directory, Entra ID, Intune, and Azure VMs. Having Azure certification pairs powerfully with your PowerShell scripting.',
    qaAdvantage: 'Immediate hiring appeal for corporate sysadmin & cloud support roles.'
  },
  {
    category: 'Linux & Cloud Operations',
    cert: 'RHCSA (Red Hat Certified System Administrator) or LFCS',
    whyValuable: 'Hands-on practical exams that prove you can manage systemd services, storage LVMs, users, and networking purely from the terminal.',
    qaAdvantage: 'Very natural fit if you used Linux for test environments or automation runners.'
  }
];

export const SIMULATION_OUTPUTS: Record<SimulationScenario, {
  name: string;
  badgeColor: string;
  description: string;
  exitCode: number;
  lines: TerminalOutputLine[];
}> = {
  healthy: {
    name: 'Scenario 1: All Systems Healthy (Nominal)',
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
    description: 'System running normally with balanced resource metrics, operational DNS, and all critical daemons active.',
    exitCode: 0,
    lines: [
      { text: '============================================================', type: 'header' },
      { text: ' [IT AUDIT] Universal IT First-Responder System Triage', type: 'header' },
      { text: ' Target Host: prod-app-srv01.corp | Platform: Linux 6.8.0-31-generic', type: 'info' },
      { text: '============================================================', type: 'header' },
      { text: ' [OK]   OS Distribution : Ubuntu 24.04 LTS (Kernel: 6.8.0)', type: 'success' },
      { text: ' [OK]   System Uptime   : up 14 days, 3 hours, 22 minutes', type: 'success' },
      { text: ' [OK]   Load Averages   : 0.24, 0.38, 0.42 (Healthy for 8 CPU cores)', type: 'success' },
      { text: ' [OK]   Memory Usage    : 3,420 MB / 16,384 MB (20.8% utilized - Threshold: 80%)', type: 'success' },
      { text: ' [OK]   Swap Pressure   : 0 MB utilized of 4,096 MB', type: 'success' },
      { text: ' [OK]   Mount Point /   : Used 38% (62.4 GB free of 100 GB)', type: 'success' },
      { text: ' [OK]   Mount Point /var: Used 44% (28.1 GB free of 50 GB)', type: 'success' },
      { text: ' [OK]   Egress Network  : 192.168.10.45 via eth0 (MTU: 1500)', type: 'success' },
      { text: ' [OK]   Gateway Ping    : Echo reply from 8.8.8.8 (Latency: 4.8ms)', type: 'success' },
      { text: ' [OK]   DNS Resolution  : google.com -> 142.250.190.46 (Resolution: 12ms)', type: 'success' },
      { text: ' [OK]   Service: sshd   : Active (running) - Port 22 listening', type: 'success' },
      { text: ' [OK]   Service: nginx  : Active (running) - Worker processes healthy', type: 'success' },
      { text: ' [OK]   Service: docker : Active (running) - Daemon socket responding', type: 'success' },
      { text: '------------------------------------------------------------', type: 'header' },
      { text: ' [STATUS: NOMINAL] All IT system checks passed with 0 critical alerts.', type: 'success' }
    ]
  },
  disk_warning: {
    name: 'Scenario 2: Storage Exhaustion Incident',
    badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/40',
    description: 'Disk utilization on /var/log or root volume exceeds critical threshold, threatening database lockup and crash.',
    exitCode: 1,
    lines: [
      { text: '============================================================', type: 'header' },
      { text: ' [IT AUDIT] Universal IT First-Responder System Triage', type: 'header' },
      { text: ' Target Host: db-replica-02.internal | Platform: Linux 6.8.0-31', type: 'info' },
      { text: '============================================================', type: 'header' },
      { text: ' [OK]   OS Distribution : Ubuntu 22.04.4 LTS', type: 'success' },
      { text: ' [OK]   System Uptime   : up 89 days, 18 hours', type: 'success' },
      { text: ' [OK]   Memory Usage    : 12,180 MB / 16,384 MB (74.3% utilized)', type: 'success' },
      { text: ' [FAIL] Mount Point /var/log : Used 94% on /dev/nvme0n1p3 (Threshold: 85%)', type: 'error' },
      { text: '        -> Root Cause: Rapid log growth in /var/log/journal (34.2 GB unrotated)', type: 'warning' },
      { text: '        -> Impact: Service writes will fail once 100% capacity is reached.', type: 'warning' },
      { text: ' [INFO] Recommended IT Action: Run `journalctl --vacuum-size=1G` or execute logrotate.', type: 'info' },
      { text: ' [OK]   Gateway Ping    : 8.8.8.8 reachable (Latency: 6.2ms)', type: 'success' },
      { text: ' [OK]   Service: sshd   : Active (running)', type: 'success' },
      { text: ' [WARN] Service: mysql  : In-flight transactions warning: Disk write latency spiking', type: 'warning' },
      { text: '------------------------------------------------------------', type: 'header' },
      { text: ' [STATUS: ACTION REQUIRED] 1 critical storage anomaly detected requiring IT triage.', type: 'error' }
    ]
  },
  network_outage: {
    name: 'Scenario 3: Network Gateway & DNS Resolution Breakdown',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
    description: 'Host is isolated: Default gateway ping drops packets, and DNS nameservers fail to resolve external endpoints.',
    exitCode: 1,
    lines: [
      { text: '============================================================', type: 'header' },
      { text: ' [IT AUDIT] Universal IT First-Responder System Triage', type: 'header' },
      { text: ' Target Host: k8s-worker-node04 | Platform: Linux', type: 'info' },
      { text: '============================================================', type: 'header' },
      { text: ' [OK]   OS Distribution : RHEL 9.3 (Plow)', type: 'success' },
      { text: ' [OK]   Memory Usage    : 4,100 MB / 32,768 MB (Healthy)', type: 'success' },
      { text: ' [OK]   Storage Mount / : Used 42% (Normal)', type: 'success' },
      { text: ' [FAIL] Gateway Ping    : 100% packet loss to 8.8.8.8 (Destination Host Unreachable)', type: 'error' },
      { text: ' [FAIL] DNS Resolution  : getaddrinfo failed for google.com (SERVFAIL / Timeout)', type: 'error' },
      { text: '        -> Triage: Inspecting /etc/resolv.conf...', type: 'warning' },
      { text: '        -> Finding: Primary nameserver 10.0.0.2 is not responding to UDP 53.', type: 'warning' },
      { text: ' [WARN] Service: kubelet: Reporting NodeNotReady due to API server communication failure', type: 'warning' },
      { text: ' [INFO] Remediation: Verify route via `ip route show` and switch fallback nameserver to 1.1.1.1', type: 'info' },
      { text: '------------------------------------------------------------', type: 'header' },
      { text: ' [STATUS: ACTION REQUIRED] Network connectivity blackout detected. 2 failures.', type: 'error' }
    ]
  },
  service_down: {
    name: 'Scenario 4: Critical Service Crash & Auto-Recovery',
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
    description: 'A core reverse-proxy (Nginx) has crashed. Watchdog triggers automatic restart and records audit log.',
    exitCode: 1,
    lines: [
      { text: '============================================================', type: 'header' },
      { text: ' [IT AUDIT & WATCHDOG] Service Health Auto-Recovery Scan', type: 'header' },
      { text: ' Target Host: web-frontend-lb01 | Timestamp: 2026-09-09 19:30:15', type: 'info' },
      { text: '============================================================', type: 'header' },
      { text: ' [OK]   CPU & Memory    : Normal operational range (22% load)', type: 'success' },
      { text: ' [FAIL] Service: nginx  : INACTIVE / DEAD (Process exited with code 137 / SIGKILL)', type: 'error' },
      { text: ' [WARN] Port 443 (HTTPS): Connection refused - End users experiencing 502/504 errors', type: 'warning' },
      { text: ' [INFO] AUTO-HEALER TRIGGERED: Invoking `systemctl restart nginx`...', type: 'info' },
      { text: ' [HEALED] Service: nginx: Now ACTIVE and listening on Port 80, 443! Downtime: 4.2s', type: 'success' },
      { text: ' [INFO] Incident Event Logged to /var/log/syslog [IT-WATCHDOG-RECOVERY]', type: 'info' },
      { text: '------------------------------------------------------------', type: 'header' },
      { text: ' [STATUS: AUTO-RESOLVED] Service crash detected and successfully resurrected.', type: 'success' }
    ]
  },
  security_anomaly: {
    name: 'Scenario 5: Brute-Force SSH Attack Detected',
    badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/40',
    description: 'Security log scan detects 420 failed SSH logins from single unauthorized IP within 15 minutes.',
    exitCode: 1,
    lines: [
      { text: '============================================================', type: 'header' },
      { text: ' [IT INCIDENT AUDIT] Security Event & Auth Anomaly Scanner', type: 'header' },
      { text: ' Target Host: bastion-gw-01 | Scanning: /var/log/auth.log (Last 6 Hours)', type: 'info' },
      { text: '============================================================', type: 'header' },
      { text: ' [WARN] High Volume Failed SSH Logins: 428 failed password attempts', type: 'warning' },
      { text: ' [FAIL] Top Attacking Remote IP: 198.51.100.24 (412 attempts targeting user: "root", "admin")', type: 'error' },
      { text: ' [INFO] Firewall Status : UFW active, but Port 22 was left open to 0.0.0.0/0', type: 'info' },
      { text: ' [INFO] Automated Action: Adding 198.51.100.24 to iptables DROP rule.', type: 'success' },
      { text: ' [INFO] Recommendation  : Implement fail2ban and disable PasswordAuthentication in /etc/ssh/sshd_config', type: 'warning' },
      { text: '------------------------------------------------------------', type: 'header' },
      { text: ' [STATUS: SEC-ALERT] Automated IP block enforced. Hardening required.', type: 'error' }
    ]
  }
};
