const TERMINAL_SEQUENCE = [
  {
    command: 'whoami',
    output: [
      { text: 'gurunanak_adhikari', class: 'success' },
      { text: 'Cybersecurity Student | ISC2 CC Certified', class: 'dim' },
    ],
    delay: 800,
  },
  {
    command: 'cat about.txt',
    output: [
      { text: '─────────────────────────────────────────', class: 'dim' },
      { text: 'Cybersecurity student with Blue Team & Red Team', class: '' },
      { text: 'exposure. AWS cloud, web app testing, network', class: '' },
      { text: 'traffic analysis, SIEM, CTFs, Python scripting.', class: '' },
      { text: '─────────────────────────────────────────', class: 'dim' },
    ],
    delay: 600,
  },
  {
    command: 'dir skills\\',
    output: [
      { text: ' Volume in drive C is PORTFOLIO', class: 'dim' },
      { text: ' Directory of C:\\portfolio\\skills', class: 'dim' },
      { text: '', class: '' },
      { text: ' Wireshark.exe       Nmap.exe        SQLmap.exe', class: '' },
      { text: ' Snort.exe           Splunk.exe      Kali.exe', class: '' },
      { text: ' AWS-Cloud.exe       SOAR.exe        SIEM.exe', class: '' },
      { text: ' Python-Sec.exe      OSINT.exe       ThreatHunt.exe', class: '' },
      { text: '', class: '' },
      { text: '        8 File(s)      ISC2-CC.cert', class: 'success' },
    ],
    delay: 500,
  },
  {
    command: 'netstat -an | findstr LISTENING',
    output: [
      { text: '  TCP    0.0.0.0:443     0.0.0.0:0     LISTENING  [HTTPS]', class: '' },
      { text: '  TCP    0.0.0.0:22      0.0.0.0:0     LISTENING  [SSH]', class: '' },
      { text: '  TCP    0.0.0.0:514     0.0.0.0:0     LISTENING  [SYSLOG]', class: '' },
      { text: '  TCP    0.0.0.0:8080    0.0.0.0:0     LISTENING  [HONEYPOT]', class: 'success' },
    ],
    delay: 500,
  },
  {
    command: 'type projects.log',
    output: [
      { text: '[CTI]  Global Honeypot Network + Threat Intel Pipeline', class: 'success' },
      { text: '[SOAR] AWS SOAR Engine — WAF + Lambda + Twilio', class: 'success' },
      { text: '[SOC]  AWS & Splunk SOC Lab — DVWA + Splunk UF', class: 'success' },
    ],
    delay: 600,
  },
  {
    command: 'ping contact.gurunanak -n 1',
    output: [
      { text: 'Pinging gurunanakadhari1@gmail.com [93.184.216.34]', class: 'dim' },
      { text: 'Reply from contact: bytes=32 time<1ms TTL=128', class: 'success' },
      { text: '', class: '' },
      { text: 'Phone: +977 9844643891', class: '' },
      { text: 'Location: Nepaltar, Kathmandu, Nepal', class: '' },
      { text: 'Status: OPEN TO OPPORTUNITIES', class: 'success' },
    ],
    delay: 800,
  },
  {
    command: 'echo Ready.',
    output: [
      { text: 'Ready.', class: 'success' },
      { text: '', class: '' },
      { text: 'Scroll down to explore full portfolio ▼', class: 'dim' },
    ],
    delay: 2000,
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createLine(text, className = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`.trim();
  line.textContent = text;
  return line;
}

async function typeText(element, text, speed = 45) {
  element.textContent = '';
  for (const char of text) {
    element.textContent += char;
    await sleep(speed + Math.random() * 30);
  }
}

export async function initTerminal(outputEl, cursorEl) {
  const inputLine = cursorEl.parentElement;

  for (const step of TERMINAL_SEQUENCE) {
    const typingSpan = document.createElement('span');
    typingSpan.className = 'typing-command';
    inputLine.insertBefore(typingSpan, cursorEl);

    await typeText(typingSpan, ` ${step.command}`, 55);
    await sleep(300);

    const cmdLine = createLine(`C:\\portfolio>${step.command}`, 'command');
    outputEl.appendChild(cmdLine);
    typingSpan.remove();

    await sleep(200);

    for (const line of step.output) {
      if (line.text === '') {
        outputEl.appendChild(createLine('', line.class));
      } else {
        const outLine = createLine('', line.class);
        outputEl.appendChild(outLine);
        await typeText(outLine, line.text, 12);
      }
      await sleep(40);
    }

    outputEl.scrollTop = outputEl.scrollHeight;
    await sleep(step.delay);
  }

  await sleep(4000);
  outputEl.innerHTML = '';
  initTerminal(outputEl, cursorEl);
}
