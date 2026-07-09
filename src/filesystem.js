/**
 * Virtual filesystem for the interactive terminal.
 * Edit the `url` fields below to add your real project / certificate links.
 */

export const PROJECT_LINKS = {
  'honeypot-cti.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'Global Honeypot Network & Threat Intel Pipeline',
    description:
      'Multi-node honeypot on DigitalOcean, Gemini AI classification, Three.js threat globe, Supabase telemetry.',
  },
  'aws-soar.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'AWS SOAR Engine',
    description:
      'Serverless SOAR: AWS WAF + ALB, Lambda quarantine, Twilio emergency call on attack detection.',
  },
  'splunk-soc.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'AWS & Splunk SOC Lab',
    description:
      'Containerized DVWA on AWS, Splunk Universal Forwarder, simulated path traversal attacks.',
  },
};

export const CERTIFICATE_LINKS = {
  'isc2-cc.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'ISC2 Certified in Cybersecurity (CC)',
    description: 'Professional certification from ISC2.',
  },
  'aws-cloud-practitioner.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'AWS Academy — Cloud Practitioner',
    description: 'AWS Cloud Practitioner curriculum track.',
  },
  'aws-solutions-architect.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'AWS Academy — Solutions Architect Associate',
    description: 'AWS Solutions Architect Associate curriculum track.',
  },
  'splunk-expert.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'Coursera — Splunk Knowledge Manager & Search Expert',
    description: 'Splunk search and knowledge manager specialization.',
  },
  'google-ibm-cybersec.txt': {
    url: 'https://YOUR_LINK_HERE',
    title: 'Google & IBM — Cybersecurity Professional Certificate',
    description: 'Cybersecurity professional certificate program.',
  },
};

function linkFileContent(entry) {
  return [
    `title: ${entry.title}`,
    `url: ${entry.url}`,
    '',
    entry.description,
    '',
    '# Replace YOUR_LINK_HERE in src/filesystem.js with your real URL.',
  ].join('\n');
}

function buildDir(entries) {
  const children = {};
  for (const [name, entry] of Object.entries(entries)) {
    children[name] = {
      type: 'file',
      content: linkFileContent(entry),
      url: entry.url,
    };
  }
  return { type: 'dir', children };
}

export const ROOT = {
  type: 'dir',
  children: {
    'about.txt': {
      type: 'file',
      content: [
        'Gurunanak Adhikari',
        'Cybersecurity Student | ISC2 CC Certified',
        '',
        'Blue Team & Red Team exposure through internships, labs, and projects.',
        'AWS cloud, web app testing, network traffic analysis, SIEM, CTFs, Python scripting.',
        'Seeking opportunities in cybersecurity.',
        '',
        'Email: gurunanakadhari1@gmail.com',
        'Phone: +977 9844643891',
        'Location: Nepaltar, Kathmandu, Nepal',
      ].join('\n'),
    },
    'help.txt': {
      type: 'file',
      content: [
        'Available commands:',
        '  cd [path]       Change directory (.., ., projects, certificates)',
        '  dir             List directory contents',
        '  cat [file]      Print file contents',
        '  head [file]     Print first 10 lines (head -n 5 file)',
        '  tail [file]     Print last 10 lines (tail -n 5 file)',
        '  nano [file]     Open file in nano viewer',
        '  ascii [name]    Display ASCII art (hero, soar, honeypot...)',
        '  pwd             Print working directory',
        '  clear           Clear terminal',
        '  help            Show this message',
        '',
        'Try: cd projects → dir → cat honeypot-cti.txt',
      ].join('\n'),
    },
    projects: buildDir(PROJECT_LINKS),
    certificates: buildDir(CERTIFICATE_LINKS),
  },
};
