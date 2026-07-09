/**
 * CTI dashboard — CV intel feed + animated ASCII attack/defense battle
 */

// ── CV data (from resume) ──────────────────────────────────────
const CV = {
  operator: {
    name: 'GURUNANAK ADHIKARI',
    location: 'Nepaltar, Kathmandu, Nepal',
    email: 'gurunanakadhari1@gmail.com',
    phone: '+977 9844643891',
    status: 'SEEKING OPPORTUNITIES',
    clearance: 'ISC2 CC CERTIFIED',
  },
  summary:
    'Cybersecurity student with Blue Team & Red Team exposure. AWS cloud, web app testing, network traffic analysis, SIEM, CTFs, Python security scripting.',
  education: {
    school: 'IIMS College (Taylor\'s University)',
    degree: 'BSc Computer Science — Cybersecurity',
    years: '2023 – 2027 (Expected)',
  },
  experience: [
    {
      tag: 'ACTIVE',
      severity: 'HIGH',
      role: 'Data Automation & AI Fellow (AWS DevOps)',
      org: 'Cloudmandap · Kathmandu',
      period: 'Feb 2026 – Present',
      detail: 'AWS infrastructure, DevOps workflows, security automation. AWS CCP & SAA tracks.',
    },
    {
      tag: 'LOG',
      severity: 'MEDIUM',
      role: 'Cyber Security Extern',
      org: 'Guided Virtual Internships · Remote',
      period: 'Apr 2025 – Aug 2025',
      detail: 'Wireshark traffic analysis, recon, SQLi/XSS CTFs, Python security scripts.',
    },
  ],
  projects: [
    {
      tag: 'CTI',
      severity: 'CRITICAL',
      name: 'Global Honeypot Network & Threat Intel Pipeline',
      detail: 'DigitalOcean honeypots, Gemini AI classification, Three.js globe, Supabase.',
    },
    {
      tag: 'SOAR',
      severity: 'HIGH',
      name: 'AWS SOAR Engine',
      detail: 'WAF + ALB + Lambda quarantine + Twilio emergency call on exploit detection.',
    },
    {
      tag: 'SOC',
      severity: 'HIGH',
      name: 'AWS & Splunk SOC Lab',
      detail: 'Dockerized DVWA, Splunk UF → Enterprise, simulated path traversal attacks.',
    },
  ],
  skills: {
    tools: 'Wireshark, Nmap, SQLmap, Snort, Splunk, Kali Linux',
    concepts: 'Cloud Security (AWS), SOAR, SIEM, Network Security, Threat Hunting, OSINT',
    programming: 'Python — security scripting & automation',
  },
  certs: [
    'ISC2 Certified in Cybersecurity (CC)',
    'AWS Academy: Solutions Architect & Cloud Practitioner',
    'Coursera: Splunk Knowledge Manager & Search Expert',
    'Google & IBM: Cybersecurity Professional Certificate',
  ],
  metrics: {
    experience: 2,
    projects: 3,
    certifications: 4,
    skillDomains: 3,
  },
};

// ── ASCII animation frames ───────────────────────────────────
const ASCII_RED = [
  `  ╔═ RED TEAM ═══╗
  ║    \\│/       ║
  ║   >[█]<      ║
  ║    /|\\       ║
  ║  EXPLOIT     ║
  ╚══════════════╝`,
  `  ╔═ RED TEAM ═══╗
  ║    \\│/       ║
  ║  >>[█]>>     ║
  ║    /|\\       ║
  ║  INJECTING   ║
  ╚══════════════╝`,
  `  ╔═ RED TEAM ═══╗
  ║    \\│/       ║
  ║ >>>[█]>>>    ║
  ║    /|\\       ║
  ║  PAYLOAD     ║
  ╚══════════════╝`,
];

const ASCII_BLUE = [
  `  ╔═ BLUE TEAM ══╗
  ║  ┌───────┐    ║
  ║  │ SHIELD│    ║
  ║  │  ▓▓▓  │    ║
  ║  └───────┘    ║
  ║   DEFENDING   ║
  ╚═══════════════╝`,
  `  ╔═ BLUE TEAM ══╗
  ║  ┌───────┐    ║
  ║  │ BLOCK │◄── ║
  ║  │  ▓▓▓  │    ║
  ║  └───────┘    ║
  ║   FILTERING   ║
  ╚═══════════════╝`,
  `  ╔═ BLUE TEAM ══╗
  ║  ┌───────┐    ║
  ║◄─│ QUAR  │    ║
  ║  │  ▓▓▓  │    ║
  ║  └───────┘    ║
  ║   ISOLATING   ║
  ╚═══════════════╝`,
];

const ASCII_CLASH_ATTACK = [
  `  ◄──●────►
  SQLi SCAN`,
  ` ◄───●───►
  XSS PROBE`,
  `◄────●───►
  RCE ATTEMPT`,
];

const ASCII_CLASH_DEFENSE = [
  `  ◄──■────►
  WAF BLOCK`,
  ` ◄───■───►
  SOAR EXEC`,
  `◄────■───►
  SG LOCK`,
];

const ASCII_CLASH_NEUTRAL = [
  `  ◄──╳──►
  STANDOFF`,
  ` ◄─ ╳ ─►
  ANALYZING`,
  `◄── ╳ ──►
  CORRELATING`,
];

const TICKER_LINES = [
  `OPERATOR: ${CV.operator.name} — ${CV.operator.location}`,
  `STATUS: ${CV.operator.status}`,
  `CERT: ${CV.operator.clearance}`,
  `EDU: ${CV.education.degree} @ ${CV.education.school}`,
  `PROJECT: Global Honeypot CTI Pipeline — Three.js + Supabase`,
  `PROJECT: AWS SOAR Engine — WAF + Lambda + Twilio`,
  `PROJECT: AWS & Splunk SOC Lab — DVWA + Splunk UF`,
  `EXP: Cloudmandap — AWS DevOps Fellow (Feb 2026 – Present)`,
  `EXP: Guided Virtual Internships — Cyber Security Extern`,
  `SKILLS: ${CV.skills.tools}`,
  `CONTACT: ${CV.operator.email}`,
];

function formatTime() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

export function initCtiDashboard() {
  const els = {
    asciiRed: document.getElementById('ascii-red'),
    asciiBlue: document.getElementById('ascii-blue'),
    asciiClash: document.getElementById('ascii-clash'),
    attackBar: document.getElementById('cti-attack-bar'),
    defenseBar: document.getElementById('cti-defense-bar'),
    attackRate: document.getElementById('cti-attack-rate'),
    blockRate: document.getElementById('cti-block-rate'),
    feed: document.getElementById('cti-feed'),
    ticker: document.getElementById('cti-ticker-track'),
    posture: document.getElementById('cti-posture'),
    simStatus: document.getElementById('cti-sim-status'),
    urgencyPulse: document.getElementById('cti-urgency-pulse'),
    operatorName: document.getElementById('cti-operator-name'),
    operatorMeta: document.getElementById('cti-operator-meta'),
    summary: document.getElementById('cti-summary'),
    metricExp: document.getElementById('cti-metric-exp'),
    metricProjects: document.getElementById('cti-metric-projects'),
    metricCerts: document.getElementById('cti-metric-certs'),
    metricSkills: document.getElementById('cti-metric-skills'),
    skillsBlock: document.getElementById('cti-skills-block'),
    certsBlock: document.getElementById('cti-certs-block'),
    eduBlock: document.getElementById('cti-edu-block'),
  };

  if (!els.feed) return;

  let frame = 0;
  let attackMomentum = 38;
  let defenseMomentum = 62;
  let defenseWins = true;
  let feedIndex = 0;

  const allFeedItems = [
    ...CV.experience.map((e) => ({ ...e, kind: 'experience' })),
    ...CV.projects.map((p) => ({ ...p, kind: 'project' })),
    ...CV.certs.map((c) => ({
      kind: 'cert',
      tag: 'CERT',
      severity: 'HIGH',
      role: c,
      org: 'Professional Development',
      period: 'VERIFIED',
      detail: c,
    })),
  ];

  // Populate static CV blocks
  if (els.operatorName) els.operatorName.textContent = CV.operator.name;
  if (els.operatorMeta) {
    els.operatorMeta.textContent = `${CV.operator.location} · ${CV.operator.email} · ${CV.operator.phone}`;
  }
  if (els.summary) els.summary.textContent = CV.summary;
  if (els.metricExp) els.metricExp.textContent = CV.metrics.experience;
  if (els.metricProjects) els.metricProjects.textContent = CV.metrics.projects;
  if (els.metricCerts) els.metricCerts.textContent = CV.metrics.certifications;
  if (els.metricSkills) els.metricSkills.textContent = CV.metrics.skillDomains;

  if (els.eduBlock) {
    els.eduBlock.innerHTML = `<strong>${CV.education.degree}</strong><br>${CV.education.school}<br><span class="accent">${CV.education.years}</span>`;
  }
  if (els.skillsBlock) {
    els.skillsBlock.innerHTML = [
      `<div class="cti-skill-line"><span>TOOLS</span> ${CV.skills.tools}</div>`,
      `<div class="cti-skill-line"><span>CONCEPTS</span> ${CV.skills.concepts}</div>`,
      `<div class="cti-skill-line"><span>CODE</span> ${CV.skills.programming}</div>`,
    ].join('');
  }
  if (els.certsBlock) {
    els.certsBlock.innerHTML = CV.certs.map((c) => `<li>${c}</li>`).join('');
  }

  function addTickerItem(text) {
    if (!els.ticker) return;
    const item = document.createElement('span');
    item.className = 'cti-ticker-item';
    item.textContent = text;
    els.ticker.appendChild(item);
  }

  TICKER_LINES.forEach(addTickerItem);
  if (els.ticker) {
    els.ticker.innerHTML += els.ticker.innerHTML;
  }

  function updateBars() {
    const total = attackMomentum + defenseMomentum;
    const attackPct = Math.round((attackMomentum / total) * 100);
    const defensePct = 100 - attackPct;

    if (els.attackBar) els.attackBar.style.width = `${attackPct}%`;
    if (els.defenseBar) els.defenseBar.style.width = `${defensePct}%`;
    if (els.attackRate) els.attackRate.textContent = `${attackPct}%`;
    if (els.blockRate) els.blockRate.textContent = `${defensePct}%`;

    const clash = document.querySelector('.cti-battle-clash');
    if (clash) clash.style.left = `${attackPct}%`;

    defenseWins = defensePct >= 50;
    return { attackPct, defensePct };
  }

  function updateAscii(frameIdx) {
    const fi = frameIdx % 3;
    if (els.asciiRed) {
      els.asciiRed.textContent = ASCII_RED[fi];
      els.asciiRed.className = `ascii-art attack-art${defenseWins ? '' : ' surging'}`;
    }
    if (els.asciiBlue) {
      els.asciiBlue.textContent = ASCII_BLUE[fi];
      els.asciiBlue.className = `ascii-art defense-art${defenseWins ? ' holding' : ''}`;
    }
    if (els.asciiClash) {
      const clashFrames = defenseWins ? ASCII_CLASH_DEFENSE : ASCII_CLASH_ATTACK;
      const neutral = ASCII_CLASH_NEUTRAL[fi % ASCII_CLASH_NEUTRAL.length];
      els.asciiClash.textContent =
        attackMomentum > 55 && !defenseWins
          ? clashFrames[fi]
          : defenseWins
            ? clashFrames[fi]
            : neutral;
      els.asciiClash.className = `ascii-art clash-art ${defenseWins ? 'defense-win' : 'attack-win'}`;
    }

    if (els.posture) {
      els.posture.textContent = defenseWins ? CV.operator.status : 'RED TEAM PRESSURE';
      els.posture.className = `cti-posture ${defenseWins ? 'holding' : 'breach'}`;
    }
    if (els.simStatus) {
      els.simStatus.textContent = defenseWins
        ? '▶ BLUE TEAM: CV DEFENSE POSTURE'
        : '▶ RED TEAM: SKILL DEMONSTRATION';
      els.simStatus.className = `cti-sim-status ${defenseWins ? 'defense' : 'attack'}`;
    }
    if (els.urgencyPulse) {
      els.urgencyPulse.textContent = defenseWins ? '● OPERATOR ACTIVE' : '● SIM LIVE';
      els.urgencyPulse.className = `cti-urgency-pulse ${defenseWins ? 'level-low' : 'level-high'}`;
    }
  }

  function addFeedEntry(item) {
    const entry = document.createElement('div');
    entry.className = `cti-feed-entry ${item.kind === 'project' ? 'defended' : 'incoming'}`;

    const time = document.createElement('span');
    time.className = 'cti-feed-time';
    time.textContent = formatTime();

    const sev = document.createElement('span');
    sev.className = `cti-feed-sev sev-${(item.severity || 'MEDIUM').toLowerCase()}`;
    sev.textContent = item.tag || item.kind?.toUpperCase();

    const msg = document.createElement('span');
    msg.className = 'cti-feed-msg';
    const title = item.role || item.name || '';
    msg.textContent = `[${item.period || ''}] ${title} — ${item.org || ''} — ${item.detail || ''}`;

    entry.append(time, sev, msg);
    els.feed.prepend(entry);

    while (els.feed.children.length > 10) {
      els.feed.removeChild(els.feed.lastChild);
    }
  }

  // Seed feed with all CV items
  allFeedItems.forEach(addFeedEntry);

  function simulateTick() {
    attackMomentum += (Math.random() - 0.48) * 6;
    defenseMomentum += (Math.random() - 0.52) * 6;
    attackMomentum = Math.max(22, Math.min(72, attackMomentum));
    defenseMomentum = Math.max(28, Math.min(78, defenseMomentum));

    updateBars();
    frame += 1;
    updateAscii(frame);

    // Cycle CV intel through feed
    feedIndex = (feedIndex + 1) % allFeedItems.length;
    addFeedEntry(allFeedItems[feedIndex]);
  }

  updateBars();
  updateAscii(0);

  setInterval(simulateTick, 1800);
  setInterval(() => {
    frame += 1;
    updateAscii(frame);
  }, 400);
}
