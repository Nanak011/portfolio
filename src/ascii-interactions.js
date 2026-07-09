import { ASCII_ART, getArt } from './ascii-art.js';

function initWidget(el) {
  const artName = el.dataset.art;
  const frames = ASCII_ART[artName];
  if (!frames) return;

  let frame = 0;
  let interval = null;

  const render = () => {
    el.textContent = frames[frame % frames.length];
  };

  render();

  const cycle = () => {
    frame = (frame + 1) % frames.length;
    render();
    el.classList.add('ascii-flash');
    setTimeout(() => el.classList.remove('ascii-flash'), 200);
  };

  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('title', `Click to animate · ${artName}`);

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    cycle();
    showToast(el.dataset.toast || `ASCII // ${artName.toUpperCase()}`);
  });

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cycle();
    }
  });

  el.addEventListener('mouseenter', () => {
    interval = setInterval(cycle, 600);
    el.classList.add('ascii-hover');
  });

  el.addEventListener('mouseleave', () => {
    if (interval) clearInterval(interval);
    el.classList.remove('ascii-hover');
  });
}

function showToast(msg) {
  let toast = document.getElementById('ascii-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ascii-toast';
    toast.className = 'ascii-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('visible'), 1800);
}

function initInteractiveCards() {
  document.querySelectorAll('.interactive-card').forEach((card) => {
    const asciiEl = card.querySelector('.ascii-widget');
    const body = card.querySelector('.card-body');
    let expanded = false;

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      expanded = !expanded;
      card.classList.toggle('expanded', expanded);
      if (asciiEl) {
        const frames = ASCII_ART[asciiEl.dataset.art];
        if (frames) {
          asciiEl.textContent = frames[expanded ? frames.length - 1 : 0];
        }
      }
      if (body) body.classList.toggle('revealed', expanded);
    });
  });
}

function initSkillTags() {
  const toolAscii = {
    Wireshark: '[ PCAP ]',
    Nmap: '[ SCAN ]',
    SQLmap: '[ SQLi ]',
    Snort: '[ IDS ]',
    Splunk: '[ SIEM ]',
    'Kali Linux': '[ PENTEST ]',
    'Cloud Security (AWS)': '[ AWS ]',
    SOAR: '[ AUTO ]',
    SIEM: '[ LOG ]',
    'Network Security': '[ NET ]',
    'Threat Hunting': '[ HUNT ]',
    OSINT: '[ INTEL ]',
    Python: '[ .py ]',
    'Security Scripting': '[ #!/ ]',
    Automation: '[ CRON ]',
  };

  document.querySelectorAll('.skill-tags span').forEach((tag) => {
    tag.setAttribute('tabindex', '0');
    tag.setAttribute('role', 'button');

    tag.addEventListener('click', () => {
      document.querySelectorAll('.skill-tags span').forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
      const label = tag.textContent.trim();
      showToast(toolAscii[label] ? `${toolAscii[label]} ${label}` : `SKILL // ${label}`);
    });

    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tag.click();
    });
  });
}

function initNavAscii() {
  document.querySelectorAll('.header-nav a').forEach((link) => {
    link.addEventListener('mouseenter', () => link.setAttribute('data-hover', 'true'));
    link.addEventListener('mouseleave', () => link.removeAttribute('data-hover'));
  });
}

function initSectionHeaders() {
  document.querySelectorAll('.section-header').forEach((header) => {
    const ascii = header.querySelector('.section-ascii');
    if (!ascii) return;

    header.style.cursor = 'pointer';
    header.setAttribute('title', 'Click header to cycle ASCII');

    header.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const name = ascii.dataset.art;
      const frames = ASCII_ART[name];
      if (!frames) return;
      const current = parseInt(ascii.dataset.frame || '0', 10);
      const next = (current + 1) % frames.length;
      ascii.dataset.frame = next;
      ascii.textContent = frames[next];
      header.classList.add('ascii-pulse');
      setTimeout(() => header.classList.remove('ascii-pulse'), 400);
    });
  });
}

function initContactLinks() {
  document.querySelectorAll('.contact-link').forEach((link) => {
    link.addEventListener('mouseenter', () => link.classList.add('ascii-glow'));
    link.addEventListener('mouseleave', () => link.classList.remove('ascii-glow'));
    link.addEventListener('click', () => {
      const label = link.querySelector('.label')?.textContent || 'CONTACT';
      showToast(`OPENING // ${label}`);
    });
  });
}

function initBrutalBoxes() {
  document.querySelectorAll('.brutal-box:not(.interactive-card)').forEach((box) => {
    box.addEventListener('click', (e) => {
      if (e.target.closest('a, input, button, .ascii-widget, .skill-tags span')) return;
      box.classList.add('box-pulse');
      setTimeout(() => box.classList.remove('box-pulse'), 350);
    });
  });
}

function initHeroTitle() {
  const accent = document.querySelector('.hero-title .accent');
  if (!accent) return;
  const frames = ['█▀█', '▓▒░', '010', 'SEC'];
  let i = 0;
  accent.style.cursor = 'pointer';
  accent.setAttribute('title', 'Click me');
  accent.addEventListener('click', (e) => {
    e.stopPropagation();
    i = (i + 1) % frames.length;
    accent.textContent = frames[i];
    showToast('CYBERSECURITY MODE');
  });
}

export function initAsciiInteractions() {
  document.querySelectorAll('.ascii-widget').forEach(initWidget);
  initInteractiveCards();
  initSkillTags();
  initNavAscii();
  initSectionHeaders();
  initContactLinks();
  initBrutalBoxes();
  initHeroTitle();
}

export function renderAsciiToElement(el, name, frame = 0) {
  const art = getArt(name, frame);
  if (art && el) el.textContent = art;
  return art;
}
