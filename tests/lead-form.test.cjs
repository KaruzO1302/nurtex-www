const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/lead-form.js'), 'utf8');

function setup(fetchResult, { valid = true } = {}) {
  const fields = Object.fromEntries(Object.entries({ name: 'Test lokalny', phone: '000000000', message: 'Kontrola bez wysyłki', website: '' }).map(([k, value]) => [k, { value, focus() {} }]));
  const button = { disabled: false, dataset: {}, textContent: 'Wyślij zapytanie →', style: {}, classList: { contains: () => false } };
  const panels = [];
  let handler, requests = 0, opened = 0, timeout, cleared = false;
  const form = {
    dataset: {}, attributes: {}, children: [button],
    reportValidity: () => valid,
    setAttribute(k, v) { this.attributes[k] = v; },
    querySelector(selector) {
      if (selector === '[type="submit"]') return button;
      const match = selector.match(/\[name="([^"]+)"\]/);
      if (match) return fields[match[1]] || null;
      return panels.find(p => selector === '.' + p.className) || null;
    },
    appendChild(p) { panels.push(p); this.children.push(p); },
    addEventListener(_, fn) { handler = fn; }
  };
  const context = {
    document: {
      querySelectorAll: () => [form],
      createElement: () => { const node = { style: {}, attributes: {}, hidden: false, setAttribute(k,v) { this.attributes[k] = v; }, focus() { this.focused = true; } }; node.classList = { contains: c => node.className === c }; return node; }
    },
    window: { location: { href: 'https://nurtex.pl/' }, open() { opened++; } },
    fetch: async (...args) => { requests++; return fetchResult(...args); },
    AbortController,
    setTimeout(fn) { timeout = fn; return 1; },
    clearTimeout() { cleared = true; },
    alert() {}
  };
  vm.runInNewContext(source, context);
  return { form, fields, button, panels, submit: () => handler({ preventDefault() {} }), expire: () => timeout(), requests: () => requests, opened: () => opened, cleared: () => cleared };
}
const response = (ok, body) => ({ ok, json: async () => body });
for (const [name, result] of [
  ['HTTP 503', () => response(false, { success: false })],
  ['HTTP 500 even with success=true', () => response(false, { success: true })],
  ['success=false', () => response(true, { success: false })],
  ['null JSON', () => response(true, null)],
  ['non-boolean success', () => response(true, { success: 'true' })],
  ['invalid JSON', () => ({ ok: true, json: async () => { throw Error('bad json'); } })],
  ['offline', () => { throw Error('offline'); }]
]) test(name + ': keeps data, enables retry, no success or WhatsApp', async () => {
  const app = setup(result); await app.submit();
  assert.equal(app.panels.some(p => p.className === 'nurtex-lead-ok'), false);
  const error = app.panels.find(p => p.className === 'nurtex-lead-error');
  assert.equal(error.hidden, false); assert.equal(error.attributes.role, 'alert');
  assert.equal(app.fields.message.value, 'Kontrola bez wysyłki');
  assert.equal(app.button.disabled, false); assert.equal(app.button.textContent, 'Wyślij zapytanie →');
  assert.equal(app.form.attributes['aria-busy'], 'false'); assert.equal(app.opened(), 0); assert.equal(app.cleared(), true);
});
test('success only on accepted response; single submission after success', async () => {
  let payload;
  const app = setup((url, options) => { assert.equal(url, '/api/lead-wycena'); payload = JSON.parse(options.body); return response(true, { success: true, leadId: 'local-test' }); });
  await app.submit(); await app.submit();
  assert.equal(app.requests(), 1); assert.equal(app.opened(), 0);
  assert.equal(payload.message, 'Kontrola bez wysyłki');
  assert.equal(app.panels.find(p => p.className === 'nurtex-lead-ok').attributes.role, 'status');
});
test('double click while pending sends once', async () => {
  let finish; const pending = new Promise(resolve => { finish = resolve; });
  const app = setup(() => pending); const first = app.submit(); await app.submit();
  assert.equal(app.requests(), 1); assert.equal(app.button.disabled, true);
  finish(response(true, { success: true })); await first;
});
test('retry after failure can succeed and hides old error', async () => {
  let count = 0; const app = setup(() => response(++count > 1, { success: count > 1 }));
  await app.submit(); await app.submit();
  assert.equal(app.requests(), 2); assert.equal(app.panels.find(p => p.className === 'nurtex-lead-error').hidden, true);
  assert.ok(app.panels.find(p => p.className === 'nurtex-lead-ok'));
});
test('timeout aborts, preserves data and enables retry', async () => {
  const app = setup((url, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(Error('aborted')))));
  const pending = app.submit(); app.expire(); await pending;
  assert.equal(app.button.disabled, false); assert.equal(app.fields.message.value, 'Kontrola bez wysyłki');
  assert.ok(app.panels.find(p => p.className === 'nurtex-lead-error'));
});
test('native required validation, whitespace and honeypot stop submission', async () => {
  const invalid = setup(() => {}, { valid: false }); await invalid.submit(); assert.equal(invalid.requests(), 0);
  for (const field of ['name','phone','message']) { const app = setup(() => {}); app.fields[field].value = '  '; await app.submit(); assert.equal(app.requests(), 0); }
  const bot = setup(() => {}); bot.fields.website.value = 'spam'; await bot.submit(); assert.equal(bot.requests(), 0);
});
