#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const fail = [];
const twilightPath = path.join(root, 'twilight.json');
let t;
try {
  t = JSON.parse(fs.readFileSync(twilightPath, 'utf8'));
} catch (e) {
  console.error('FAIL: twilight.json is invalid:', e.message);
  process.exit(1);
}
const allowedTypes = new Set(['string', 'number', 'boolean', 'items', 'collection']);
const keys = new Set();
const paths = new Set();
const names = new Set();
const settingIds = new Set();

for (const setting of (t.settings || [])) {
  if (!setting.id || settingIds.has(setting.id)) fail.push(`Missing/duplicate theme setting id: ${setting.id || '(unknown)'}`);
  settingIds.add(setting.id);
  if (!allowedTypes.has(setting.type)) fail.push(`Unsupported theme setting type: ${setting.id} (${setting.type})`);
}

function checkFields(fields, label) {
  const ids = new Set();
  for (const f of (fields || [])) {
    if (!f.id || ids.has(f.id)) fail.push(`Missing/duplicate field id in ${label}: ${f.id || '(unknown)'}`);
    ids.add(f.id);
    if (!allowedTypes.has(f.type)) fail.push(`Unsupported field type in ${label}: ${f.id} (${f.type})`);
    if (f.type === 'collection') {
      if (!Array.isArray(f.fields)) fail.push(`Collection field missing fields array: ${label}.${f.id}`);
      else checkFields(f.fields, `${label}.${f.id}`);
    }
    if (typeof f.maxLength === 'number' && f.maxLength > 1000) fail.push(`maxLength exceeds Twilight limit (1000): ${label}.${f.id}`);
  }
}

for (const c of (t.components || [])) {
  if (!c.key || keys.has(c.key)) fail.push(`Missing/duplicate component key: ${c.path || '(unknown)'}`);
  keys.add(c.key);
  if (!c.name) fail.push(`Missing component name: ${c.path || '(unknown)'}`);
  else if (names.has(c.name)) fail.push(`Duplicate component name: ${c.name}`);
  names.add(c.name);
  if (!c.path || paths.has(c.path)) fail.push(`Missing/duplicate component path: ${c.path || '(unknown)'}`);
  paths.add(c.path);
  const twig = path.join(root, 'src/views/components', String(c.path || '').replace(/\./g, path.sep) + '.twig');
  if (!fs.existsSync(twig)) fail.push(`Missing component Twig: ${c.path} -> ${path.relative(root, twig)}`);
  checkFields(c.fields, c.path || '(unknown)');
}

for (const f of [
  'src/views/pages/index.twig',
  'src/views/layouts/master.twig',
  'src/locales/ar.json',
  'src/locales/en.json',
  'src/assets/images/placeholder.png',
  'src/assets/styles/style.css',
  'src/assets/styles/components.css',
  'src/assets/js/app.js',
  'src/assets/js/components.js',
  'src/assets/js/pages/home.js',
  'src/assets/js/pages/category.js',
  'src/assets/js/pages/product.js',
  'public/style.css',
  'public/components.css',
  'public/app.js',
  'public/components.js',
  'public/home.js',
  'public/category.js',
  'public/product.js',
  'public/images/placeholder.png'
]) {
  if (!fs.existsSync(path.join(root, f))) fail.push(`Missing required file: ${f}`);
}

for (const lang of ['ar', 'en']) {
  try { JSON.parse(fs.readFileSync(path.join(root, `src/locales/${lang}.json`), 'utf8')); }
  catch (e) { fail.push(`Invalid locale JSON ${lang}: ${e.message}`); }
}

const templateFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && full.endsWith('.twig')) templateFiles.push(full);
  }
}
walk(path.join(root, 'src/views'));
for (const file of templateFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/theme\.settings\.get\(['"]([^'"]+)['"]/g)) {
    if (!settingIds.has(match[1])) fail.push(`Template setting not defined in twilight.json: ${path.relative(root, file)} -> ${match[1]}`);
  }
}
const master = fs.readFileSync(path.join(root, 'src/views/layouts/master.twig'), 'utf8');
for (const tag of ['salla-offer-modal', 'salla-login-modal']) {
  if (!master.includes(tag)) fail.push(`Required Twilight component missing in master.twig: ${tag}`);
}
if (!master.includes('{% block head %}')) fail.push('Required master.twig block is missing: head');
const assetPairs = [
  ['src/assets/styles/style.css', 'public/style.css'],
  ['src/assets/styles/components.css', 'public/components.css'],
  ['src/assets/js/app.js', 'public/app.js'],
  ['src/assets/js/components.js', 'public/components.js'],
  ['src/assets/js/pages/home.js', 'public/home.js'],
  ['src/assets/js/pages/category.js', 'public/category.js'],
  ['src/assets/js/pages/product.js', 'public/product.js'],
  ['src/assets/images/placeholder.png', 'public/images/placeholder.png']
];
for (const [source, output] of assetPairs) {
  if (fs.existsSync(path.join(root, source)) && fs.existsSync(path.join(root, output))) {
    if (!fs.readFileSync(path.join(root, source)).equals(fs.readFileSync(path.join(root, output)))) {
      fail.push(`Built asset is out of sync: ${source} -> ${output}; run npm run production.`);
    }
  }
}
const twilightText = fs.readFileSync(twilightPath, 'utf8');
if (twilightText.includes('raw.githubusercontent.com')) fail.push('twilight.json still contains GitHub Raw URLs; use the configured CDN URLs.');

if (fail.length) {
  console.error('Theme QA failed:\n- ' + fail.join('\n- '));
  process.exit(1);
}
console.log(`Theme QA passed: ${t.components.length} named components, unique keys/paths, supported field types, matching Twig files, declared settings, valid locale JSON, required assets, and required Twilight components.`);
