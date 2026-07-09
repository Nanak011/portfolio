import { ROOT } from './filesystem.js';
import { getArt, listArtNames } from './ascii-art.js';

const DEFAULT_LINES = 10;

export function initTerminal(outputEl, inputEl, promptEl) {
  let cwd = [];
  let history = [];
  let historyIndex = -1;
  let nanoOpen = false;

  printWelcome();

  inputEl.addEventListener('keydown', (e) => {
    if (nanoOpen) {
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'x')) {
        e.preventDefault();
        closeNano();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = inputEl.value;
      inputEl.value = '';
      if (raw.trim()) {
        history.push(raw);
        historyIndex = history.length;
      }
      executeCommand(raw);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex -= 1;
        inputEl.value = history[historyIndex];
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex += 1;
        inputEl.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        inputEl.value = '';
      }
    }
  });

  inputEl.addEventListener('focus', () => outputEl.closest('.terminal')?.classList.add('focused'));
  inputEl.addEventListener('blur', () => outputEl.closest('.terminal')?.classList.remove('focused'));

  function printWelcome() {
    appendLine('Microsoft Windows [Version 10.0.26200]', 'dim');
    appendLine('(c) Gurunanak Portfolio. Type "help" for commands.', 'dim');
    appendLine('');
    appendLine('Try: cd projects → dir → cat honeypot-cti.txt', 'success');
    appendLine('');
    updatePrompt();
    inputEl.focus();
  }

  function getNode(pathParts) {
    let node = ROOT;
    for (const part of pathParts) {
      if (!node || node.type !== 'dir' || !node.children[part]) return null;
      node = node.children[part];
    }
    return node;
  }

  function resolvePath(arg) {
    if (!arg || arg === '.') return [...cwd];
    if (arg === '\\' || arg === '/') return [];

    const parts = arg.replace(/\\/g, '/').split('/').filter(Boolean);
    const result = arg.startsWith('/') || arg.startsWith('\\') ? [] : [...cwd];

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        result.pop();
      } else {
        result.push(part);
      }
    }
    return result;
  }

  function pathToString(parts) {
    if (parts.length === 0) return 'C:\\portfolio';
    return `C:\\portfolio\\${parts.join('\\')}`;
  }

  function updatePrompt() {
    promptEl.textContent = `${pathToString(cwd)}>`;
  }

  function appendLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`.trim();
    line.textContent = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function appendCommandLine(cmd) {
    appendLine(`${pathToString(cwd)}>${cmd}`, 'command');
  }

  function listDir(node) {
    appendLine(` Directory of ${pathToString(cwd)}`, 'dim');
    appendLine('');
    const names = Object.keys(node.children).sort();
    for (const name of names) {
      const child = node.children[name];
      if (child.type === 'dir') {
        appendLine(`  <DIR>          ${name}`);
      } else {
        const linkTag = child.url ? '  [link]' : '';
        appendLine(`                 ${name}${linkTag}`, child.url ? 'success' : '');
      }
    }
    appendLine('');
    const files = names.filter((n) => node.children[n].type === 'file').length;
    const dirs = names.length - files;
    appendLine(`       ${dirs} Dir(s)  ${files} File(s)`);
  }

  function getFileLines(parts, filename) {
    const parentParts = parts.slice(0, -1);
    const parent = getNode(parentParts);
    if (!parent || parent.type !== 'dir') return { error: 'The system cannot find the path specified.' };

    const file = parent.children[filename];
    if (!file) return { error: 'The system cannot find the file specified.' };
    if (file.type === 'dir') return { error: 'Access is denied.' };

    return { lines: file.content.split('\n'), file };
  }

  function parseFileArg(tokens, startIdx) {
    let n = DEFAULT_LINES;
    let fileArg = tokens[startIdx];

    if (tokens[startIdx] === '-n' && tokens[startIdx + 1]) {
      n = parseInt(tokens[startIdx + 1], 10) || DEFAULT_LINES;
      fileArg = tokens[startIdx + 2];
    }

    return { n, fileArg };
  }

  function openNano(parts, filename) {
    const resolved = resolvePath(filename);
    const name = resolved[resolved.length - 1];
    const parentParts = resolved.slice(0, -1);
    const result = getFileLines([...parentParts, name], name);

    if (result.error) {
      appendLine(result.error, 'error');
      return;
    }

    nanoOpen = true;
    const overlay = document.createElement('div');
    overlay.className = 'nano-overlay';
    overlay.id = 'nano-overlay';

    const header = document.createElement('div');
    header.className = 'nano-header';
    header.textContent = ` GNU nano 6.0 — ${name} `;

    const body = document.createElement('pre');
    body.className = 'nano-body';
    body.textContent = result.lines.join('\n');

    const footer = document.createElement('div');
    footer.className = 'nano-footer';
    footer.textContent = '^X Exit   (read-only — edit links in src/filesystem.js)';

    overlay.append(header, body, footer);
    outputEl.appendChild(overlay);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function closeNano() {
    document.getElementById('nano-overlay')?.remove();
    nanoOpen = false;
    inputEl.focus();
  }

  function executeCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) {
      updatePrompt();
      return;
    }

    appendCommandLine(trimmed);

    const tokens = trimmed.split(/\s+/);
    const cmd = tokens[0].toLowerCase();

    if (cmd === 'clear' || cmd === 'cls') {
      outputEl.innerHTML = '';
      updatePrompt();
      return;
    }

    if (cmd === 'help') {
      const result = getFileLines(['help.txt'], 'help.txt');
      if (result.error) {
        appendLine(result.error, 'error');
        return;
      }
      result.lines.forEach((l) => appendLine(l));
      return;
    }

    if (cmd === 'pwd') {
      appendLine(pathToString(cwd));
      return;
    }

    if (cmd === 'whoami') {
      appendLine('portfolio\\gurunanak_adhikari', 'success');
      return;
    }

    if (cmd === 'cd') {
      const target = tokens[1];
      if (!target) {
        cwd = [];
      } else {
        const resolved = resolvePath(target);
        const node = getNode(resolved);
        if (!node) {
          appendLine('The system cannot find the path specified.', 'error');
          return;
        }
        if (node.type !== 'dir') {
          appendLine('The directory name is invalid.', 'error');
          return;
        }
        cwd = resolved;
      }
      updatePrompt();
      return;
    }

    if (cmd === 'dir' || cmd === 'ls') {
      const node = getNode(cwd);
      if (!node || node.type !== 'dir') {
        appendLine('The system cannot find the path specified.', 'error');
        return;
      }
      listDir(node);
      return;
    }

    if (cmd === 'cat' || cmd === 'type') {
      const fileArg = tokens.slice(1).join(' ');
      if (!fileArg) {
        appendLine('Required parameter missing.', 'error');
        return;
      }
      const resolved = resolvePath(fileArg);
      const name = resolved[resolved.length - 1];
      const result = getFileLines(resolved, name);
      if (result.error) {
        appendLine(result.error, 'error');
        return;
      }
      result.lines.forEach((l) => {
        const cls = l.startsWith('url:') ? 'success' : l.includes('YOUR_LINK_HERE') ? 'dim' : '';
        appendLine(l, cls);
      });
      return;
    }

    if (cmd === 'head') {
      const { n, fileArg } = parseFileArg(tokens, 1);
      if (!fileArg) {
        appendLine('Required parameter missing.', 'error');
        return;
      }
      const resolved = resolvePath(fileArg);
      const name = resolved[resolved.length - 1];
      const result = getFileLines(resolved, name);
      if (result.error) {
        appendLine(result.error, 'error');
        return;
      }
      result.lines.slice(0, n).forEach((l) => appendLine(l));
      return;
    }

    if (cmd === 'tail') {
      const { n, fileArg } = parseFileArg(tokens, 1);
      if (!fileArg) {
        appendLine('Required parameter missing.', 'error');
        return;
      }
      const resolved = resolvePath(fileArg);
      const name = resolved[resolved.length - 1];
      const result = getFileLines(resolved, name);
      if (result.error) {
        appendLine(result.error, 'error');
        return;
      }
      result.lines.slice(-n).forEach((l) => appendLine(l));
      return;
    }

    if (cmd === 'nano') {
      const fileArg = tokens.slice(1).join(' ');
      if (!fileArg) {
        appendLine('Required parameter missing.', 'error');
        return;
      }
      openNano(cwd, fileArg);
      return;
    }

    if (cmd === 'echo') {
      appendLine(tokens.slice(1).join(' '));
      return;
    }

    if (cmd === 'ascii') {
      const name = tokens[1]?.toLowerCase();
      if (!name) {
        appendLine('Usage: ascii <name>', 'dim');
        appendLine(`Available: ${listArtNames().join(', ')}`, 'success');
        return;
      }
      const art = getArt(name, 0);
      if (!art) {
        appendLine('Unknown ASCII art name.', 'error');
        appendLine(`Try: ${listArtNames().join(', ')}`, 'dim');
        return;
      }
      art.split('\n').forEach((l) => appendLine(l, 'success'));
      return;
    }

    appendLine(`'${cmd}' is not recognized as an internal or external command.`, 'error');
    appendLine('Type "help" for available commands.', 'dim');
  }
}
