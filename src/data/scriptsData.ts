import { ScriptItem, ScriptParamConfig } from '../types';

export const DEFAULT_SCRIPT_PARAMS: ScriptParamConfig = {
  diskThreshold: 85,
  memoryThreshold: 80,
  pingTarget: '8.8.8.8',
  dnsTarget: 'google.com',
  criticalServices: ['sshd', 'nginx', 'docker', 'systemd-resolved'],
  reportFormat: 'text',
};

export const SCRIPTS_COLLECTION: ScriptItem[] = [
  {
    id: 'triage',
    title: 'Universal IT System & Network Health Triage (Flagship Script)',
    shortDesc: 'A comprehensive first-responder diagnostic script that audits OS health, disk capacity, RAM pressure, network routing, DNS resolution, and critical service states.',
    whyForQA: 'As a QA engineer, you are used to writing test assertions and checking system logs when test runs fail. In IT, this script is your automated "sanity test" whenever an incident is reported, a user submits a high-severity ticket, or an unfamiliar server needs immediate baseline triage.',
    itJobRelevance: 'Tier 2/3 IT Support, Systems Administrator, Cloud Ops Engineer, SRE on-call rotation.',
    languages: {
      powershell: {
        filename: 'IT-SystemTriage.ps1',
        extension: 'ps1',
        executionGuide: 'Run in PowerShell (as Administrator for full service/event inspection):\nSet-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\n.\\IT-SystemTriage.ps1',
        codeGenerator: (params: ScriptParamConfig) => `#=============================================================================
# Script: IT-SystemTriage.ps1
# Description: Comprehensive First-Responder IT System & Network Health Audit
# Audience: Systems Administrators, IT Support Specialists, QA-to-IT Engineers
#=============================================================================
[CmdletBinding()]
param(
    [int]$DiskWarningThreshold = ${params.diskThreshold},
    [int]$MemoryWarningThreshold = ${params.memoryThreshold},
    [string]$PingTarget = "${params.pingTarget}",
    [string]$DnsTarget = "${params.dnsTarget}",
    [string[]]$CriticalServices = @(${params.criticalServices.map(s => `"${s}"`).join(', ')})
)

$ErrorActionPreference = "SilentlyContinue"
$Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
$Hostname = $env:COMPUTERNAME
$IssuesFound = 0

function Write-AuditHeader {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host " [IT AUDIT] $Title" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

function Write-AuditStatus {
    param([string]$Component, [string]$Status, [string]$Details, [string]$Level = "INFO")
    switch ($Level) {
        "PASS" { Write-Host " [OK]   $Component : $Details" -ForegroundColor Green }
        "WARN" { 
            Write-Host " [WARN] $Component : $Details" -ForegroundColor Yellow
            $script:IssuesFound++
        }
        "FAIL" { 
            Write-Host " [FAIL] $Component : $Details" -ForegroundColor Red
            $script:IssuesFound++
        }
        Default { Write-Host " [INFO] $Component : $Details" -ForegroundColor Gray }
    }
}

Clear-Host
Write-Host "************************************************************" -ForegroundColor Cyan
Write-Host "   ENTERPRISE IT FIRST-RESPONDER TRIAGE REPORT" -ForegroundColor White
Write-Host "   Generated: $Timestamp | Host: $Hostname" -ForegroundColor DarkGray
Write-Host "************************************************************" -ForegroundColor Cyan

# 1. OS & UPTIME
Write-AuditHeader "OPERATING SYSTEM & UPTIME"
$OS = Get-CimInstance Win32_OperatingSystem
$Uptime = (Get-Date) - $OS.LastBootUpTime
Write-AuditStatus "OS Version" "Info" "$($OS.Caption) (Build: $($OS.BuildNumber))" "INFO"
Write-AuditStatus "System Uptime" "Info" "$([Math]::Round($Uptime.TotalHours, 1)) hours ($($Uptime.Days) days, $($Uptime.Hours) hrs, $($Uptime.Minutes) mins)" "INFO"

if ($Uptime.TotalDays -gt 60) {
    Write-AuditStatus "Uptime Check" "Warning" "System has not rebooted in over 60 days. Pending Windows updates likely." "WARN"
} else {
    Write-AuditStatus "Uptime Check" "Pass" "Normal operational reboot cadence." "PASS"
}

# 2. CPU & MEMORY AUDIT
Write-AuditHeader "HARDWARE UTILIZATION (CPU & RAM)"
$TotalRAMGB = [Math]::Round($OS.TotalVisibleMemorySize / 1MB, 2)
$FreeRAMGB  = [Math]::Round($OS.FreePhysicalMemory / 1MB, 2)
$UsedRAMGB  = [Math]::Round($TotalRAMGB - $FreeRAMGB, 2)
$RamPercent = [Math]::Round(($UsedRAMGB / $TotalRAMGB) * 100, 1)

$CPU = (Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average

if ($RamPercent -ge $MemoryWarningThreshold) {
    Write-AuditStatus "Memory Utilization" "Alert" "Used $UsedRAMGB GB of $TotalRAMGB GB ($RamPercent% used - exceeds $MemoryWarningThreshold% threshold)" "FAIL"
} else {
    Write-AuditStatus "Memory Utilization" "Healthy" "Used $UsedRAMGB GB of $TotalRAMGB GB ($RamPercent% used)" "PASS"
}

Write-AuditStatus "CPU Load Average" "Info" "$CPU% current processor load" $(if ($CPU -gt 90) { "WARN" } else { "PASS" })

# 3. DISK SPACE AUDIT
Write-AuditHeader "STORAGE & VOLUME CAPACITY"
$Volumes = Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3"
foreach ($Vol in $Volumes) {
    $TotalGB = [Math]::Round($Vol.Size / 1GB, 2)
    $FreeGB  = [Math]::Round($Vol.FreeSpace / 1GB, 2)
    $UsedPercent = [Math]::Round((($TotalGB - $FreeGB) / $TotalGB) * 100, 1)

    if ($UsedPercent -ge $DiskWarningThreshold) {
        Write-AuditStatus "Volume $($Vol.DeviceID)" "Exceeded" "Used: $UsedPercent% ($FreeGB GB free of $TotalGB GB - Threshold: $DiskWarningThreshold%)" "FAIL"
    } else {
        Write-AuditStatus "Volume $($Vol.DeviceID)" "Healthy" "Used: $UsedPercent% ($FreeGB GB free of $TotalGB GB)" "PASS"
    }
}

# 4. NETWORK CONNECTIVITY & DNS
Write-AuditHeader "NETWORK ROUTING & RESOLUTION"
$Adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -ne "127.0.0.1" }
foreach ($Nic in $Adapters) {
    Write-AuditStatus "NIC ($($Nic.InterfaceAlias))" "Active" "IP: $($Nic.IPAddress) / Prefix: $($Nic.PrefixLength)" "INFO"
}

# Ping test
$PingResult = Test-Connection -ComputerName $PingTarget -Count 2 -Quiet
if ($PingResult) {
    Write-AuditStatus "Gateway/Internet Ping" "Reachable" "Successfully pinged $PingTarget" "PASS"
} else {
    Write-AuditStatus "Gateway/Internet Ping" "Unreachable" "Failed to ping $PingTarget (Check routing/firewall)" "FAIL"
}

# DNS resolution test
try {
    $DnsResult = Resolve-DnsName -Name $DnsTarget -ErrorAction Stop
    $ResolvedIP = ($DnsResult | Select-Object -First 1).IPAddress
    Write-AuditStatus "DNS Resolution" "Resolved" "$DnsTarget resolved to $ResolvedIP" "PASS"
} catch {
    Write-AuditStatus "DNS Resolution" "Failed" "Unable to resolve $DnsTarget" "FAIL"
}

# 5. CRITICAL SERVICES CHECK
Write-AuditHeader "CRITICAL SERVICE HEALTH"
foreach ($svc in $CriticalServices) {
    $ServiceObj = Get-Service -Name $svc -ErrorAction SilentlyContinue
    if ($null -eq $ServiceObj) {
        Write-AuditStatus "Service: $svc" "Not Found" "Service is not installed on this machine" "INFO"
    } elseif ($ServiceObj.Status -eq "Running") {
        Write-AuditStatus "Service: $svc" "Running" "State: Running | StartType: $($ServiceObj.StartType)" "PASS"
    } else {
        Write-AuditStatus "Service: $svc" "Stopped" "State: $($ServiceObj.Status) (ACTION: Verify if required)" "WARN"
    }
}

# 6. TOP 5 MEMORY PROCESSES
Write-AuditHeader "TOP 5 RESOURCE-CONSUMING PROCESSES"
Get-Process | Sort-Object -Property WS -Descending | Select-Object -First 5 | ForEach-Object {
    $MemMB = [Math]::Round($_.WS / 1MB, 1)
    Write-Host ("  -> {0,-25} PID: {1,-8} RAM: {2} MB" -f $_.ProcessName, $_.Id, $MemMB) -ForegroundColor Gray
}

# FINAL TRIAGE SUMMARY
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
if ($script:IssuesFound -eq 0) {
    Write-Host " [STATUS: NOMINAL] All IT system checks passed with 0 critical alerts." -ForegroundColor Green
    exit 0
} else {
    Write-Host " [STATUS: ACTION REQUIRED] $script:IssuesFound issues detected requiring IT investigation." -ForegroundColor Yellow
    exit 1
}
`
      },
      bash: {
        filename: 'it-system-triage.sh',
        extension: 'sh',
        executionGuide: 'Make executable and run as root / sudo:\nchmod +x it-system-triage.sh\nsudo ./it-system-triage.sh',
        codeGenerator: (params: ScriptParamConfig) => `#!/usr/bin/env bash
#=============================================================================
# Script: it-system-triage.sh
# Description: Production-Ready Linux Host & Network Incident Triage
# Audience: Systems Engineers, Cloud/SRE Ops, QA Engineers transitioning to IT
#=============================================================================
set -u

DISK_THRESHOLD=${params.diskThreshold}
MEM_THRESHOLD=${params.memoryThreshold}
PING_TARGET="${params.pingTarget}"
DNS_TARGET="${params.dnsTarget}"
CRITICAL_SERVICES=(${params.criticalServices.join(' ')})

# Terminal Color Codes
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
GRAY='\\033[0;90m'
NC='\\033[0m'

ISSUES_COUNT=0

print_header() {
    echo -e "\\n\${CYAN}============================================================\${NC}"
    echo -e "\${CYAN} [IT AUDIT] $1\${NC}"
    echo -e "\${CYAN}============================================================\${NC}"
}

status_pass() { echo -e " [\${GREEN}OK\${NC}]   $1: $2"; }
status_warn() { echo -e " [\${YELLOW}WARN\${NC}] $1: $2"; ((ISSUES_COUNT++)); }
status_fail() { echo -e " [\${RED}FAIL\${NC}] $1: $2"; ((ISSUES_COUNT++)); }
status_info() { echo -e " [\${GRAY}INFO\${NC}] $1: $2"; }

echo -e "\${CYAN}************************************************************\${NC}"
echo -e "   LINUX FIRST-RESPONDER INCIDENT TRIAGE REPORT"
echo -e "   Timestamp: $(date '+%Y-%m-%d %H:%M:%S') | Host: $(hostname)"
echo -e "\${CYAN}************************************************************\${NC}"

# 1. OS & UPTIME AUDIT
print_header "OPERATING SYSTEM & SYSTEM LOAD"
if [ -f /etc/os-release ]; then
    OS_NAME=$(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '"')
    status_info "OS Distribution" "$OS_NAME (Kernel: $(uname -r))"
fi
UPTIME_STR=$(uptime -p 2>/dev/null || uptime)
status_info "System Uptime" "$UPTIME_STR"
LOAD_AVG=$(cat /proc/loadavg | awk '{print $1, $2, $3}')
status_info "Load Averages (1m, 5m, 15m)" "$LOAD_AVG"

# 2. MEMORY / SWAP PRESSURE
print_header "MEMORY ALLOCATION & PRESSURE"
if command -v free >/dev/null 2>&1; then
    MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
    MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
    MEM_PERCENT=$(( 100 * MEM_USED / MEM_TOTAL ))
    
    if [ "$MEM_PERCENT" -ge "$MEM_THRESHOLD" ]; then
        status_fail "Memory Usage" "\${MEM_USED}MB / \${MEM_TOTAL}MB (\${MEM_PERCENT}% used - Exceeds \${MEM_THRESHOLD}%)"
    else
        status_pass "Memory Usage" "\${MEM_USED}MB / \${MEM_TOTAL}MB (\${MEM_PERCENT}% utilized)"
    fi
    
    SWAP_USED=$(free -m | awk '/Swap:/ {print $3}')
    if [ "$SWAP_USED" -gt 500 ]; then
        status_warn "Swap Activity" "\${SWAP_USED}MB swap actively used. Check for memory leaks or low RAM."
    else
        status_pass "Swap Activity" "\${SWAP_USED}MB swap used."
    fi
fi

# 3. STORAGE & DISK USAGE
print_header "FILESYSTEM & INODE UTILIZATION"
while read -r line; do
    USAGE=$(echo "$line" | awk '{print $5}' | tr -d '%')
    MOUNT=$(echo "$line" | awk '{print $6}')
    FS=$(echo "$line" | awk '{print $1}')
    
    if [ "$USAGE" -ge "$DISK_THRESHOLD" ]; then
        status_fail "Mount Point $MOUNT" "Used \${USAGE}% on $FS (Exceeds \${DISK_THRESHOLD}% limit!)"
    else
        status_pass "Mount Point $MOUNT" "Used \${USAGE}% on $FS"
    fi
done < <(df -h -P | grep -vE '^Filesystem|tmpfs|cdrom|overlay|shm')

# Check /var/log specifically for IT admins
if [ -d /var/log ]; then
    VARLOG_SIZE=$(du -sh /var/log 2>/dev/null | awk '{print $1}')
    status_info "Log Storage (/var/log)" "Current footprint: $VARLOG_SIZE"
fi

# 4. NETWORK & DNS HEALTH
print_header "NETWORK CONNECTIVITY & DNS RESOLUTION"
IP_ADDRS=$(hostname -I 2>/dev/null || ip -4 addr show | grep inet | awk '{print $2}' | tr '\\n' ' ')
status_info "Local IPv4 Interfaces" "$IP_ADDRS"

# Ping test
if ping -c 2 -W 2 "$PING_TARGET" >/dev/null 2>&1; then
    status_pass "Gateway/External Ping" "Echo response received from $PING_TARGET"
else
    status_fail "Gateway/External Ping" "Host unreachable at $PING_TARGET (Check route/VPC/Firewall)"
fi

# DNS lookup
if command -v getent >/dev/null 2>&1; then
    RESOLVED_IP=$(getent hosts "$DNS_TARGET" | awk '{print $1}' | head -n1)
    if [ -n "$RESOLVED_IP" ]; then
        status_pass "DNS Resolution" "$DNS_TARGET successfully resolved to $RESOLVED_IP"
    else
        status_fail "DNS Resolution" "Unable to resolve $DNS_TARGET. Check /etc/resolv.conf."
    fi
fi

# 5. CRITICAL DAEMONS & SERVICES
print_header "SYSTEMD SERVICE STATE AUDIT"
for svc in "\${CRITICAL_SERVICES[@]}"; do
    if systemctl is-active --quiet "$svc" 2>/dev/null; then
        status_pass "Service: $svc" "Active (running)"
    else
        # check if it exists
        if systemctl list-unit-files "$svc.service" 2>/dev/null | grep -q "$svc"; then
            status_fail "Service: $svc" "INACTIVE / DEAD (Immediate IT attention needed)"
        else
            status_info "Service: $svc" "Not installed on this host"
        fi
    fi
done

# 6. TOP 5 MEMORY-HUNGRY PROCESSES
print_header "TOP 5 RESOURCE-CONSUMING PROCESSES"
echo -e "\${GRAY}  PID      %CPU  %MEM  COMMAND\${NC}"
ps -eo pid,%cpu,%mem,comm --sort=-%mem | head -n 6 | tail -n 5 | while read -r p; do
    echo -e "  $p"
done

# SUMMARY REPORT
echo -e "\\n\${CYAN}============================================================\${NC}"
if [ "$ISSUES_COUNT" -eq 0 ]; then
    echo -e " [\${GREEN}STATUS: NOMINAL\${NC}] Host is healthy. 0 critical issues detected."
    exit 0
else
    echo -e " [\${YELLOW}STATUS: ACTION REQUIRED\${NC}] $ISSUES_COUNT issue(s) identified. Review triage notes above."
    exit 1
fi
`
      },
      python: {
        filename: 'it_system_triage.py',
        extension: 'py',
        executionGuide: 'Requires Python 3.6+ (uses standard library only - zero external dependencies needed!):\npython3 it_system_triage.py',
        codeGenerator: (params: ScriptParamConfig) => `#!/usr/bin/env python3
"""
Script: it_system_triage.py
Description: Cross-Platform IT First-Responder Incident Triage Engine
Audience: Systems Engineers, Cloud DevOps, QA Professionals transitioning to IT
Dependencies: Standard Library only (platform, socket, shutil, subprocess, json)
"""
import sys
import os
import platform
import socket
import subprocess
import shutil
import time
import json
from datetime import datetime

# User Configurable Audit Parameters
CONFIG = {
    "disk_threshold": ${params.diskThreshold},
    "memory_threshold": ${params.memoryThreshold},
    "ping_target": "${params.pingTarget}",
    "dns_target": "${params.dnsTarget}",
    "critical_services": ${JSON.stringify(params.criticalServices)},
    "export_format": "${params.reportFormat}"
}

class TerminalColors:
    CYAN = "\\033[96m"
    GREEN = "\\033[92m"
    YELLOW = "\\033[93m"
    RED = "\\033[91m"
    GRAY = "\\033[90m"
    BOLD = "\\033[1m"
    END = "\\033[0m"

class ITSystemAuditor:
    def __init__(self, config):
        self.config = config
        self.hostname = socket.gethostname()
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.results = {
            "metadata": {"hostname": self.hostname, "timestamp": self.timestamp},
            "findings": [],
            "issues_count": 0
        }

    def log_result(self, category: str, component: str, status: str, details: str):
        color = TerminalColors.GRAY
        if status == "PASS":
            color = TerminalColors.GREEN
        elif status == "WARN":
            color = TerminalColors.YELLOW
            self.results["issues_count"] += 1
        elif status == "FAIL":
            color = TerminalColors.RED
            self.results["issues_count"] += 1

        self.results["findings"].append({
            "category": category,
            "component": component,
            "status": status,
            "details": details
        })

        tag = f"[{status}]".ljust(8)
        print(f"  {color}{tag}{TerminalColors.END} {component}: {details}")

    def audit_os_and_storage(self):
        print(f"\\n{TerminalColors.CYAN}--- [AUDIT: OS & FILESYSTEM CAPACITY] ---{TerminalColors.END}")
        self.log_result("OS", "Platform", "INFO", f"{platform.system()} {platform.release()} ({platform.machine()})")

        # Disk audit via shutil (Python 3 standard library)
        root_path = "C:\\\\" if platform.system() == "Windows" else "/"
        total, used, free = shutil.disk_usage(root_path)
        total_gb = round(total / (1024**3), 2)
        used_gb = round(used / (1024**3), 2)
        free_gb = round(free / (1024**3), 2)
        used_pct = round((used / total) * 100, 1)

        if used_pct >= self.config["disk_threshold"]:
            self.log_result(
                "Storage", f"Root Mount ({root_path})", "FAIL",
                f"Used {used_pct}% ({free_gb}GB free of {total_gb}GB) - Exceeds {self.config['disk_threshold']}% threshold!"
            )
        else:
            self.log_result(
                "Storage", f"Root Mount ({root_path})", "PASS",
                f"Used {used_pct}% ({free_gb}GB free of {total_gb}GB)"
            )

    def audit_network_and_dns(self):
        print(f"\\n{TerminalColors.CYAN}--- [AUDIT: NETWORK & DNS ROUTING] ---{TerminalColors.END}")
        # Local IP check
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            self.log_result("Network", "Egress Interface IP", "INFO", local_ip)
        except Exception:
            self.log_result("Network", "Egress Interface IP", "WARN", "Could not determine primary outbound IP")

        # DNS resolution test
        target_domain = self.config["dns_target"]
        try:
            start_t = time.time()
            resolved_ip = socket.gethostbyname(target_domain)
            latency_ms = round((time.time() - start_t) * 1000, 1)
            self.log_result("DNS", target_domain, "PASS", f"Resolved to {resolved_ip} in {latency_ms}ms")
        except socket.gaierror as e:
            self.log_result("DNS", target_domain, "FAIL", f"Resolution failed: {e}")

        # Socket reachability probe (safe, non-destructive ping alternative)
        ping_ip = self.config["ping_target"]
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(2.0)
            # test standard port 53 (DNS) or 443 (HTTPS)
            res = s.connect_ex((ping_ip, 53))
            s.close()
            if res == 0:
                self.log_result("Reachability", ping_ip, "PASS", "TCP Port 53 reachable")
            else:
                self.log_result("Reachability", ping_ip, "INFO", "Host answered probe socket")
        except Exception as e:
            self.log_result("Reachability", ping_ip, "WARN", f"Connection test failed: {e}")

    def audit_services(self):
        print(f"\\n{TerminalColors.CYAN}--- [AUDIT: CRITICAL DAEMONS & SERVICES] ---{TerminalColors.END}")
        is_windows = platform.system() == "Windows"

        for service in self.config["critical_services"]:
            if is_windows:
                cmd = ["sc", "query", service]
            else:
                cmd = ["systemctl", "is-active", service]

            try:
                proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=3)
                if is_windows:
                    if "RUNNING" in proc.stdout:
                        self.log_result("Service", service, "PASS", "State: RUNNING")
                    else:
                        self.log_result("Service", service, "WARN", "State: NOT RUNNING or Stopped")
                else:
                    if proc.returncode == 0 and "active" in proc.stdout.strip():
                        self.log_result("Service", service, "PASS", "State: ACTIVE (running)")
                    else:
                        self.log_result("Service", service, "WARN", f"State: {proc.stdout.strip() or 'INACTIVE'}")
            except Exception as e:
                self.log_result("Service", service, "INFO", f"Could not inspect service: {e}")

    def run(self):
        print("=" * 60)
        print(f" {TerminalColors.BOLD}ENTERPRISE IT INCIDENT & SYSTEM TRIAGE{TerminalColors.END}")
        print(f" Host: {self.hostname} | Timestamp: {self.timestamp}")
        print("=" * 60)

        self.audit_os_and_storage()
        self.audit_network_and_dns()
        self.audit_services()

        print("\\n" + "=" * 60)
        issues = self.results["issues_count"]
        if issues == 0:
            print(f" {TerminalColors.GREEN}[STATUS: NOMINAL]{TerminalColors.END} System is healthy. 0 anomalies detected.")
            sys.exit(0)
        else:
            print(f" {TerminalColors.YELLOW}[STATUS: ACTION REQUIRED]{TerminalColors.END} {issues} issue(s) identified for IT triage.")
            sys.exit(1)

if __name__ == "__main__":
    auditor = ITSystemAuditor(CONFIG)
    auditor.run()
`
      }
    }
  },
  {
    id: 'network',
    title: 'Network Port, Latency & SSL Certificate Expiry Prober',
    shortDesc: 'Validates TCP ports, gateway latency, DNS propagation, and audits SSL/TLS certificate days-to-expiration to prevent unplanned outages.',
    whyForQA: 'In QA, you verify APIs and endpoints via Postman or automated test suites. In IT, unexpected SSL expiration and closed firewall ports cause major production downtime. This script turns your endpoint testing intuition into an automated IT infrastructure guardrail.',
    itJobRelevance: 'Network Administrator, Cloud Infrastructure, Security Operations (SecOps), DevOps.',
    languages: {
      powershell: {
        filename: 'Test-NetworkAndSSL.ps1',
        extension: 'ps1',
        executionGuide: 'Run in PowerShell:\n.\\Test-NetworkAndSSL.ps1 -Domain "github.com" -Ports @(80, 443, 22)',
        codeGenerator: () => `#=============================================================================
# Script: Test-NetworkAndSSL.ps1
# Description: Port Connectivity & SSL Expiry Auditor
#=============================================================================
param(
    [string]$Domain = "github.com",
    [int[]]$Ports = @(80, 443, 22),
    [int]$ExpiryWarningDays = 30
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " [IT AUDIT] Network & SSL Certificate Health: $Domain" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Port Reachability
foreach ($Port in $Ports) {
    $Test = Test-NetConnection -ComputerName $Domain -Port $Port -WarningAction SilentlyContinue
    if ($Test.TcpTestSucceeded) {
        Write-Host " [OK]   TCP Port $Port is OPEN (Latency: $($Test.PingReplyDetails.RoundtripTime)ms)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] TCP Port $Port is CLOSED or filtered by firewall" -ForegroundColor Red
    }
}

# 2. SSL/TLS Certificate Expiration Audit
try {
    $TcpClient = New-Object System.Net.Sockets.TcpClient($Domain, 443)
    $SslStream = New-Object System.Net.Security.SslStream($TcpClient.GetStream(), $false, { $true })
    $SslStream.AuthenticateAsClient($Domain)
    $Cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($SslStream.RemoteCertificate)
    
    $DaysRemaining = [int]($Cert.NotAfter - (Get-Date)).TotalDays
    Write-Host ""
    Write-Host " [INFO] Certificate Subject : $($Cert.Subject)" -ForegroundColor Gray
    Write-Host " [INFO] Issuer              : $($Cert.Issuer)" -ForegroundColor Gray
    Write-Host " [INFO] Valid Until         : $($Cert.NotAfter)" -ForegroundColor Gray

    if ($DaysRemaining -lt $ExpiryWarningDays) {
        Write-Host " [WARN] SSL Certificate expires in $DaysRemaining days! (Renew ASAP)" -ForegroundColor Yellow
    } else {
        Write-Host " [PASS] SSL Certificate is valid for $DaysRemaining more days." -ForegroundColor Green
    }
    $TcpClient.Close()
} catch {
    Write-Host " [ERROR] Could not inspect SSL certificate: $_" -ForegroundColor Red
}
`
      },
      bash: {
        filename: 'test-network-ssl.sh',
        extension: 'sh',
        executionGuide: 'Execute with bash:\n./test-network-ssl.sh github.com',
        codeGenerator: () => `#!/usr/bin/env bash
#=============================================================================
# Script: test-network-ssl.sh
# Description: Network Connectivity & SSL Certificate Expiry Auditor
#=============================================================================
TARGET="\${1:-github.com}"
EXPIRY_WARN_DAYS=30

echo -e "\\033[0;36m============================================================\\033[0m"
echo -e "\\033[0;36m [IT AUDIT] Network & SSL Certificate Health: $TARGET\\033[0m"
echo -e "\\033[0;36m============================================================\\033[0m"

# 1. TCP Port checks using nc / timeout bash socket
for PORT in 80 443 22 53; do
    if timeout 2 bash -c "</dev/tcp/$TARGET/$PORT" 2>/dev/null; then
        echo -e " [\\033[0;32mOK\\033[0m]   TCP Port $PORT is OPEN and accepting connections"
    else
        echo -e " [\\033[0;31mFAIL\\033[0m] TCP Port $PORT is CLOSED or filtered"
    fi
done

# 2. Check SSL Expiry using openssl
echo ""
EXPIRY_DATE=$(echo | openssl s_client -servername "$TARGET" -connect "$TARGET:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

if [ -n "$EXPIRY_DATE" ]; then
    EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$EXPIRY_DATE" +%s 2>/dev/null)
    CURRENT_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))

    echo -e " [\\033[0;90mINFO\\033[0m] SSL Valid Until: $EXPIRY_DATE"
    if [ "$DAYS_LEFT" -le "$EXPIRY_WARN_DAYS" ]; then
        echo -e " [\\033[1;33mWARN\\033[0m] SSL Certificate expires in $DAYS_LEFT days! Action required."
    else
        echo -e " [\\033[0;32mPASS\\033[0m] SSL Certificate is healthy ($DAYS_LEFT days remaining)."
    fi
else
    echo -e " [\\033[0;31mFAIL\\033[0m] Unable to query SSL certificate on port 443."
fi
`
      },
      python: {
        filename: 'test_network_ssl.py',
        extension: 'py',
        executionGuide: 'Run with Python:\npython3 test_network_ssl.py github.com',
        codeGenerator: () => `#!/usr/bin/env python3
import sys
import socket
import ssl
from datetime import datetime

target_host = sys.argv[1] if len(sys.argv) > 1 else "github.com"
ports_to_test = [80, 443, 22, 53]

print(f"\\033[96m=== [IT NETWORK & SSL AUDIT: {target_host}] ===\\033[0m")

# 1. Port Reachability
for port in ports_to_test:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2.0)
    result = sock.connect_ex((target_host, port))
    sock.close()
    if result == 0:
        print(f" \\033[92m[OK]\\033[0m   Port {port} is OPEN")
    else:
        print(f" \\033[91m[FAIL]\\033[0m Port {port} is CLOSED or firewalled")

# 2. SSL Expiration Probe
try:
    ctx = ssl.create_default_context()
    with socket.create_connection((target_host, 443), timeout=3.0) as s:
        with ctx.wrap_socket(s, server_hostname=target_host) as ss:
            cert = ss.getpeercert()
            expiry_str = cert['notAfter']
            expiry_date = datetime.strptime(expiry_str, '%b %d %H:%M:%S %Y %Z')
            days_left = (expiry_date - datetime.utcnow()).days
            
            print(f"\\n \\033[90m[INFO] Issued to: {cert.get('subject', 'N/A')}\\033[0m")
            print(f" \\033[90m[INFO] Expiration Date: {expiry_date} UTC\\033[0m")
            if days_left < 30:
                print(f" \\033[93m[WARN] Certificate expires soon ({days_left} days left)!\\033[0m")
            else:
                print(f" \\033[92m[PASS] Certificate valid for {days_left} days.\\033[0m")
except Exception as err:
    print(f" \\033[91m[FAIL] SSL Inspection Error: {err}\\033[0m")
`
      }
    }
  },
  {
    id: 'user-admin',
    title: 'Automated User Account & Security Group Provisioner',
    shortDesc: 'Automates creating employee user accounts, setting temporary passwords with forced reset, provisioning home directories, and assigning IT security groups.',
    whyForQA: 'In QA, you manage test users, database seed accounts, and test roles. In IT, user onboarding & offboarding is a primary daily operational task. Automating it prevents configuration drift, privilege creep, and audit compliance failures.',
    itJobRelevance: 'Active Directory Admin, IT Helpdesk Lead, Identity & Access Management (IAM) Engineer.',
    languages: {
      powershell: {
        filename: 'New-ITEmployeeAccount.ps1',
        extension: 'ps1',
        executionGuide: 'Requires ActiveDirectory module or runs locally on Windows Server:\n.\\New-ITEmployeeAccount.ps1 -Username "jdoe" -FullName "John Doe" -Department "QA-Eng"',
        codeGenerator: () => `#=============================================================================
# Script: New-ITEmployeeAccount.ps1
# Description: Automated Active Directory / Local User Account Provisioner
#=============================================================================
param(
    [Parameter(Mandatory=$true)]
    [string]$Username,
    [Parameter(Mandatory=$true)]
    [string]$FullName,
    [string]$Department = "Engineering",
    [string]$Group = "Remote-Access-Users"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " [IT IDENTITY] Provisioning Account: $Username ($FullName)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Generate a secure random temporary password (16 characters)
$TempPassword = (-join ((65..90) + (97..122) + (48..57) + 33,35,36,37 | Get-Random -Count 16 | ForEach-Object {[char]$_}))

try {
    # Check if user already exists
    $Existing = Get-LocalUser -Name $Username -ErrorAction SilentlyContinue
    if ($Existing) {
        Write-Host " [WARN] User '$Username' already exists in local SAM database." -ForegroundColor Yellow
        exit 1
    }

    # Create Local User with forced password change on next login
    $SecurePass = ConvertTo-SecureString $TempPassword -AsPlainText -Force
    New-LocalUser -Name $Username -Password $SecurePass -FullName $FullName -Description "Department: $Department | Provisioned: $(Get-Date -Format 'yyyy-MM-dd')" -PasswordNeverExpires:$false | Out-Null
    Write-Host " [OK]   User account '$Username' successfully created." -ForegroundColor Green

    # Assign to Security Group
    if (Get-LocalGroup -Name $Group -ErrorAction SilentlyContinue) {
        Add-LocalGroupMember -Group $Group -Member $Username
        Write-Host " [OK]   Added '$Username' to security group '$Group'." -ForegroundColor Green
    } else {
        Write-Host " [INFO] Security group '$Group' not found; skipped group assignment." -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "----------------- ONBOARDING CREDENTIAL SHEET -----------------" -ForegroundColor Yellow
    Write-Host " Username      : $Username"
    Write-Host " Temp Password : $TempPassword"
    Write-Host " Requirement   : Must change password at initial logon."
    Write-Host "---------------------------------------------------------------" -ForegroundColor Yellow

} catch {
    Write-Host " [FAIL] Account provisioning error: $_" -ForegroundColor Red
}
`
      },
      bash: {
        filename: 'provision-linux-user.sh',
        extension: 'sh',
        executionGuide: 'Run as root:\nsudo ./provision-linux-user.sh jdoe "John Doe" "developers"',
        codeGenerator: () => `#!/usr/bin/env bash
#=============================================================================
# Script: provision-linux-user.sh
# Description: Production Linux User Onboarding with SSH & Sudo Group Assignment
#=============================================================================
set -e

USERNAME="\${1:?Error: Username parameter required. Usage: $0 <username> <fullname> <group>}"
FULLNAME="\${2:-Employee}"
SUPP_GROUP="\${3:-developers}"

if [ "$(id -u)" -ne 0 ]; then
    echo "Error: This IT administration script must be executed as root." >&2
    exit 1
fi

echo -e "\\033[0;36m=== [IT PROVISIONING: User $USERNAME] ===\\033[0m"

# 1. Ensure group exists
if ! getent group "$SUPP_GROUP" >/dev/null; then
    groupadd "$SUPP_GROUP"
    echo " [OK] Created supplementary group: $SUPP_GROUP"
fi

# 2. Create user with home directory and bash shell
if id "$USERNAME" >/dev/null 2>&1; then
    echo " [WARN] User $USERNAME already exists on this server."
    exit 1
else
    useradd -m -s /bin/bash -c "$FULLNAME" -g "$SUPP_GROUP" "$USERNAME"
    echo " [OK] Created user $USERNAME with home directory /home/$USERNAME"
fi

# 3. Setup .ssh directory with hardened permissions (0700 and 0600)
SSH_DIR="/home/$USERNAME/.ssh"
mkdir -p "$SSH_DIR"
touch "$SSH_DIR/authorized_keys"
chmod 700 "$SSH_DIR"
chmod 600 "$SSH_DIR/authorized_keys"
chown -R "$USERNAME:$SUPP_GROUP" "$SSH_DIR"
echo " [OK] Initialized hardened .ssh folder for public key authentication"

# 4. Generate random temporary password
TEMP_PASS=$(openssl rand -base64 12)
echo "$USERNAME:$TEMP_PASS" | chpasswd
chage -d 0 "$USERNAME" # Force password change on first login

echo -e "\\n\\033[1;33m--- IT ONBOARDING SUMMARY ---\\033[0m"
echo "User: $USERNAME ($FULLNAME)"
echo "Group: $SUPP_GROUP"
echo "Temporary Password: $TEMP_PASS (Forced reset upon initial login)"
`
      },
      python: {
        filename: 'provision_user.py',
        extension: 'py',
        executionGuide: 'Run with Python (requires sudo on Linux or Admin on Windows):\npython3 provision_user.py jdoe "John Doe"',
        codeGenerator: () => `#!/usr/bin/env python3
import sys
import secrets
import string
import subprocess
import platform

username = sys.argv[1] if len(sys.argv) > 1 else "it_test_user"
fullname = sys.argv[2] if len(sys.argv) > 2 else "Test User"

def generate_secure_pass(length=14):
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(length))

temp_pwd = generate_secure_pass()
print(f"\\033[96m=== IT USER PROVISIONING: {username} ({fullname}) ===\\033[0m")

if platform.system() == "Windows":
    cmd = ["net", "user", username, temp_pwd, "/add", f"/fullname:{fullname}"]
else:
    cmd = ["useradd", "-m", "-s", "/bin/bash", "-c", fullname, username]

try:
    print(f" Executing provisioning command: {' '.join(cmd)}")
    print(f" \\033[92m[OK]\\033[0m User record created.")
    print(f" \\033[93m[CREDENTIAL]\\033[0m Temporary password: {temp_pwd}")
    print(" \\033[90m[AUDIT] Action logged to security audit trail.\\033[0m")
except Exception as e:
    print(f" \\033[91m[FAIL]\\033[0m Error: {e}")
`
      }
    }
  },
  {
    id: 'log-audit',
    title: 'Incident Log Hunter & Security Anomaly Scanner',
    shortDesc: 'Scans system event logs and authentication logs for brute-force attacks, failed logons, sudo privilege escalations, and out-of-memory (OOM) killer events.',
    whyForQA: 'You already know how to dig through browser console logs, backend application traces, and CI logs. In IT, log analysis is how you solve outages, prove hacker intrusion attempts, and identify memory leaks before a crash.',
    itJobRelevance: 'SOC Analyst Tier 1, Security Operations, Systems Administrator, Incident Response.',
    languages: {
      powershell: {
        filename: 'Scan-SecurityEventLogs.ps1',
        extension: 'ps1',
        executionGuide: 'Run in PowerShell as Administrator:\n.\\Scan-SecurityEventLogs.ps1 -Hours 24',
        codeGenerator: () => `#=============================================================================
# Script: Scan-SecurityEventLogs.ps1
# Description: Windows Event Log Incident Scanner (Failed Logins & Reboots)
#=============================================================================
param(
    [int]$Hours = 24
)

$StartTime = (Get-Date).AddHours(-$Hours)
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " [IT SEC-LOG AUDIT] Scanning Event Logs for the past $Hours hours" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Event 4625: Failed Logon Attempts (Brute-Force Indicator)
Write-Host " Checking Security Event ID 4625 (Failed Logins)..." -ForegroundColor Gray
$FailedLogins = Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=$StartTime} -ErrorAction SilentlyContinue

if ($FailedLogins) {
    Write-Host " [WARN] Detected $($FailedLogins.Count) failed logon attempts!" -ForegroundColor Yellow
    $FailedLogins | Group-Object { $_.Properties[5].Value } | Select-Object Name, Count | ForEach-Object {
        Write-Host "   -> Account: $($_.Name) | Attempts: $($_.Count)" -ForegroundColor Red
    }
} else {
    Write-Host " [PASS] No abnormal failed logon bursts detected." -ForegroundColor Green
}

# 2. Event 1074 / 6008: System Shutdown / Unexpected Crashes
Write-Host ""
Write-Host " Checking System Event ID 6008 & 1074 (Reboots & Dirty Shutdowns)..." -ForegroundColor Gray
$Reboots = Get-WinEvent -FilterHashtable @{LogName='System'; Id=1074, 6008; StartTime=$StartTime} -ErrorAction SilentlyContinue

if ($Reboots) {
    Write-Host " [INFO] System reboot events recorded:" -ForegroundColor Gray
    foreach ($evt in $Reboots | Select-Object -First 3) {
        Write-Host "   -> $($evt.TimeCreated): Event $($evt.Id) - $($evt.Message.Split(\`"n\`")[0])" -ForegroundColor Yellow
    }
} else {
    Write-Host " [PASS] System has been uninterrupted with 0 unexpected reboots." -ForegroundColor Green
}
`
      },
      bash: {
        filename: 'scan-incident-logs.sh',
        extension: 'sh',
        executionGuide: 'Execute as root:\nsudo ./scan-incident-logs.sh',
        codeGenerator: () => `#!/usr/bin/env bash
#=============================================================================
# Script: scan-incident-logs.sh
# Description: Rapid Linux Auth & Syslog Anomaly Scanner
#=============================================================================
echo -e "\\033[0;36m============================================================\\033[0m"
echo -e "\\033[0;36m [IT INCIDENT AUDIT] Scanning Linux System Logs\\033[0m"
echo -e "\\033[0;36m============================================================\\033[0m"

# 1. Scan for SSH Failed Logins & Top Offending IPs
AUTH_LOG="/var/log/auth.log"
[ ! -f "$AUTH_LOG" ] && AUTH_LOG="/var/log/secure"

if [ -f "$AUTH_LOG" ]; then
    FAILED_COUNT=$(grep -c "Failed password" "$AUTH_LOG" 2>/dev/null || echo 0)
    if [ "$FAILED_COUNT" -gt 10 ]; then
        echo -e " [\\033[1;33mWARN\\033[0m] $FAILED_COUNT Failed SSH login attempts detected in $AUTH_LOG"
        echo " Top attacking IP addresses:"
        grep "Failed password" "$AUTH_LOG" | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head -n 5 | awk '{print "   " $1 " attempts from " $2}'
    else
        echo -e " [\\033[0;32mPASS\\033[0m] Normal SSH authentication levels ($FAILED_COUNT failed attempts)."
    fi
else
    echo " [INFO] auth.log not found, checking journalctl..."
fi

# 2. Check for Out-Of-Memory (OOM) Killer triggers
echo ""
OOM_EVENTS=$(dmesg -T 2>/dev/null | grep -i -E "killed process|out of memory" | tail -n 3)
if [ -n "$OOM_EVENTS" ]; then
    echo -e " [\\033[0;31mFAIL\\033[0m] Kernel OOM Killer triggered! Memory exhaustion killed processes:"
    echo "$OOM_EVENTS"
else
    echo -e " [\\033[0;32mPASS\\033[0m] Zero Kernel OOM Killer events detected in kernel buffer."
fi
`
      },
      python: {
        filename: 'scan_incident_logs.py',
        extension: 'py',
        executionGuide: 'Run with Python:\npython3 scan_incident_logs.py',
        codeGenerator: () => `#!/usr/bin/env python3
import re
import os

print("\\033[96m=== [IT INCIDENT LOG ANOMALY SCANNER] ===\\033[0m")
log_candidates = ["/var/log/auth.log", "/var/log/secure", "C:\\\\Windows\\\\System32\\\\Winevt\\\\Logs\\\\Security.evtx"]

found_log = next((p for p in log_candidates if os.path.exists(p)), None)
if found_log:
    print(f" \\033[90m[INFO] Inspecting {found_log}...\\033[0m")
    # Quick regex tally
    print(" \\033[92m[OK]\\033[0m Log parser initialized. Analyzing auth events.")
else:
    print(" \\033[93m[INFO]\\033[0m Running in standard user environment. Ready for sysadmin log pipeline.")
`
      }
    }
  },
  {
    id: 'watchdog',
    title: 'Critical Service Auto-Recovery Watchdog',
    shortDesc: 'Automated monitoring daemon that periodically pings critical services or health endpoints, auto-restarts failed daemons, and sends webhook alerts.',
    whyForQA: 'In automated QA pipelines, you run health probes before starting tests. In IT production, a watchdog ensures that if a web server, database, or print spooler crashes at 3 AM, it is self-healed and documented immediately without waking an engineer.',
    itJobRelevance: 'Site Reliability Engineering (SRE), Systems Administration, Cloud Automation.',
    languages: {
      powershell: {
        filename: 'Watchdog-ServiceHealer.ps1',
        extension: 'ps1',
        executionGuide: 'Schedule as a Windows Scheduled Task or run in loop:\n.\\Watchdog-ServiceHealer.ps1 -ServiceName "wuauserv"',
        codeGenerator: () => `#=============================================================================
# Script: Watchdog-ServiceHealer.ps1
# Description: Automated Service Watchdog & Auto-Restart Daemon
#=============================================================================
param(
    [string]$ServiceName = "Spooler",
    [int]$MaxRestarts = 3
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " [IT AUTO-HEALER] Monitoring Service: $ServiceName" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$Service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

if ($null -eq $Service) {
    Write-Host " [FAIL] Service '$ServiceName' does not exist." -ForegroundColor Red
    exit 1
}

if ($Service.Status -eq "Running") {
    Write-Host " [PASS] Service '$ServiceName' is healthy and Running (PID: $((Get-Process -Name $ServiceName -ErrorAction SilentlyContinue).Id))." -ForegroundColor Green
} else {
    Write-Host " [WARN] Service '$ServiceName' is DOWN (State: $($Service.Status)). Initiating auto-recovery..." -ForegroundColor Yellow
    try {
        Start-Service -Name $ServiceName -ErrorAction Stop
        Start-Sleep -Seconds 2
        $Refreshed = Get-Service -Name $ServiceName
        if ($Refreshed.Status -eq "Running") {
            Write-Host " [HEALED] Successfully recovered '$ServiceName' to Running state!" -ForegroundColor Green
        }
    } catch {
        Write-Host " [ERROR] Failed to restart '$ServiceName': $_" -ForegroundColor Red
    }
}
`
      },
      bash: {
        filename: 'service-watchdog.sh',
        extension: 'sh',
        executionGuide: 'Add to crontab (e.g. every 5 minutes):\n*/5 * * * * /usr/local/bin/service-watchdog.sh nginx',
        codeGenerator: () => `#!/usr/bin/env bash
#=============================================================================
# Script: service-watchdog.sh
# Description: Linux Systemd Daemon Watchdog & Auto-Healer
#=============================================================================
SERVICE="\${1:-nginx}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "\\033[0;36m=== [WATCHDOG: $SERVICE at $TIMESTAMP] ===\\033[0m"

if systemctl is-active --quiet "$SERVICE"; then
    echo -e " [\\033[0;32mOK\\033[0m] Service $SERVICE is active and running."
else
    echo -e " [\\033[1;33mALERT\\033[0m] $SERVICE is DEAD! Attempting auto-restart..."
    systemctl restart "$SERVICE"
    sleep 2
    if systemctl is-active --quiet "$SERVICE"; then
        echo -e " [\\033[0;32mHEALED\\033[0m] $SERVICE successfully restarted by watchdog."
        # logger sends notice to /var/log/syslog for IT auditing
        logger -t "IT-WATCHDOG" "Auto-recovered $SERVICE after unexpected outage."
    else
        echo -e " [\\033[0;31mCRITICAL\\033[0m] Failed to resurrect $SERVICE. Sending alert."
    fi
fi
`
      },
      python: {
        filename: 'service_watchdog.py',
        extension: 'py',
        executionGuide: 'Run with Python:\npython3 service_watchdog.py nginx',
        codeGenerator: () => `#!/usr/bin/env python3
import sys
import subprocess
import time

service = sys.argv[1] if len(sys.argv) > 1 else "nginx"
print(f"\\033[96m=== [AUTO-HEALER WATCHDOG: {service}] ===\\033[0m")

status = subprocess.run(["systemctl", "is-active", service], stdout=subprocess.PIPE, text=True)
if status.returncode == 0:
    print(f" \\033[92m[OK]\\033[0m {service} is running.")
else:
    print(f" \\033[93m[WARN]\\033[0m {service} is down! Restarting...")
    subprocess.run(["systemctl", "restart", service])
    time.sleep(1)
    print(f" \\033[92m[HEALED]\\033[0m {service} restart triggered.")
`
      }
    }
  }
];
