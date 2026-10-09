const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(join(__dirname, "../homepage.js"), "utf8")
  .split("const projectTabs =")[0];

function setup(clipboard) {
  const elements = {};
  for (const id of [
    "contact-button", "contact-status", "contact-fallback", "contact-email",
  ]) {
    elements[id] = {
      dataset: {},
      attributes: {},
      events: {},
      hidden: true,
      textContent: "",
      addEventListener(name, callback) { this.events[name] = callback; },
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      focus() { this.focused = true; this.events.focus?.(); },
      select() { this.selected = true; },
    };
  }
  const button = elements["contact-button"];
  button.dataset.email = "portfolio@example.test";
  const timers = new Map();
  let nextTimer = 0;
  vm.runInNewContext(source, {
    document: { getElementById: (id) => elements[id] },
    navigator: { clipboard },
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
  });
  return {
    button,
    status: elements["contact-status"],
    fallback: elements["contact-fallback"],
    email: elements["contact-email"],
    timers,
    click: () => button.events.click(),
  };
}

test("copies the exact configured email and resets success after two seconds", async () => {
  let copied;
  const ui = setup({ writeText: async (text) => { copied = text; } });
  await ui.click();
  assert.equal(copied, ui.button.dataset.email);
  assert.equal(ui.email.value, copied);
  assert.equal(ui.button.dataset.copied, "true");
  assert.equal(ui.button.attributes["aria-label"], "Email copied");
  assert.equal(ui.status.textContent, "Email address copied to clipboard.");
  assert.equal(ui.fallback.hidden, true);
  assert.equal(ui.button.attributes["aria-busy"], undefined);
  const timer = [...ui.timers.values()][0];
  assert.equal(timer.delay, 2000);
  timer.callback();
  assert.equal(ui.button.dataset.copied, undefined);
  assert.equal(ui.button.attributes["aria-label"], "Contact Me: copy email address");
  assert.equal(ui.status.textContent, "");
});

test("unavailable or rejected clipboard access reveals selected email without false success", async () => {
  for (const clipboard of [
    undefined,
    { writeText: async () => { throw new Error("Permission denied"); } },
  ]) {
    const ui = setup(clipboard);
    await ui.click();
    assert.equal(ui.button.dataset.copied, undefined);
    assert.equal(ui.fallback.hidden, false);
    assert.equal(ui.email.focused, true);
    assert.equal(ui.email.selected, true);
    assert.match(ui.status.textContent, /Couldn’t copy automatically/);
    assert.equal(ui.timers.size, 0);
    assert.equal(ui.button.attributes["aria-busy"], undefined);
  }
});

test("pending copies do not show success or start duplicate writes", async () => {
  let resolve;
  let writes = 0;
  const ui = setup({
    writeText: () => {
      writes++;
      return new Promise((done) => { resolve = done; });
    },
  });
  const pending = ui.click();
  await ui.click();
  assert.equal(writes, 1);
  assert.equal(ui.button.dataset.copied, undefined);
  assert.equal(ui.button.attributes["aria-busy"], "true");
  assert.equal(ui.timers.size, 0);
  resolve();
  await pending;
  assert.equal(ui.button.dataset.copied, "true");

  const previousTimer = [...ui.timers.keys()][0];
  const repeated = ui.click();
  assert.equal(ui.timers.has(previousTimer), false);
  assert.equal(ui.button.dataset.copied, undefined);
  resolve();
  await repeated;
  assert.equal(writes, 2);
  assert.equal(ui.timers.size, 1);
  assert.equal(ui.button.dataset.copied, "true");
});

test("a successful retry hides the fallback from a previous failure", async () => {
  let rejected = true;
  const ui = setup({
    writeText: async () => {
      if (rejected) throw new Error("Permission denied");
    },
  });
  await ui.click();
  assert.equal(ui.fallback.hidden, false);
  rejected = false;
  await ui.click();
  assert.equal(ui.fallback.hidden, true);
  assert.equal(ui.button.dataset.copied, "true");
});
