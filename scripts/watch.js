#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src', 'assets');
const build = path.join(__dirname, 'build.js');
function snapshot(dir, out = {}) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) snapshot(full, out);
    else { const st = fs.statSync(full); out[full] = `${st.size}:${st.mtimeMs}`; }
  }
  return out;
}
function runBuild() {
  const child = spawn(process.execPath, [build], { cwd: root, stdio: 'inherit' });
  child.on('exit', code => { if (code !== 0) console.error(`Build exited with code ${code}`); });
}
console.log('Watching src/assets for changes (poll interval: 1s). Press Ctrl+C to stop.');
let previous = snapshot(source);
runBuild();
setInterval(() => {
  const next = snapshot(source);
  const a = JSON.stringify(previous), b = JSON.stringify(next);
  if (a !== b) { previous = next; console.log('Source assets changed; rebuilding...'); runBuild(); }
}, 1000);
