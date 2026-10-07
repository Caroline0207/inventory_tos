(function () {
"use strict";

/* =========================================================
   Config (config.js is written by the GitHub Actions deploy
   from repository secrets; see README).
   ========================================================= */
const CFG = window.APP_CONFIG || {};
const API = String(CFG.supabaseUrl || "").replace(/\/+$/, "");
const KEY = String(CFG.supabaseAnonKey || "");

/* ---------- small helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const keyOf = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const todayKey = () => keyOf(new Date());
const parseKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const longDate = k => parseKey(k).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const shortDate = k => parseKey(k).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
const weekday = k => parseKey(k).toLocaleDateString("en-US", { weekday: "short" });
const timeOf = iso => iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
const fmt = n => (n === null || n === undefined || n === "") ? "?" : String(Math.round(Number(n) * 100) / 100);
const toNum = v => { const n = parseFloat(String(v).replace(",", ".")); return isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0; };
const store = {
  get(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
  set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} },
  del(k, s) { try { (s ? sessionStorage : localStorage).removeItem(k); } catch (e) {} }
};

/* ---------- Supabase RPC ---------- */
async function rpc(fn, args) {
  if (!API || !KEY) { const e = new Error("not_configured"); e.code = "not_configured"; throw e; }
  let res;
  try {
    res = await fetch(API + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: { "apikey": KEY, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(args || {})
    });
  } catch (err) { const e = new Error("network"); e.code = "network"; throw e; }
  const text = await res.text();
  let body = null; try { body = text ? JSON.parse(text) : null; } catch (e) {}
  if (!res.ok) {
    const msg = (body && (body.message || body.error || body.hint)) || res.statusText || "error";
    const e = new Error(msg);
    e.code = /invalid_pin/.test(msg) ? "invalid_pin" : /invalid_date/.test(msg) ? "invalid_date" : "server";
    throw e;
  }
  return body;
}

/* ---------- state ---------- */
const S = {
  pin: store.get("inv-pin") || "",
  adminPin: store.get("inv-admin-pin", true) || "",
  products: [], productsLoaded: false,
  saved: {}, savedAt: null, savedLoaded: false,        // today's saved record
  days: [], daysLoaded: false, dayCache: new Map(),
  view: "today", histMode: "date", histDay: null, histProduct: null, histRows: null,
  editing: null, editErr: ""
};
let current = todayKey();

/* draft = values typed but not yet saved; kept on this device */
const DKEY = () => "inv-draft-" + current;
function loadDraft() { try { return JSON.parse(store.get(DKEY()) || "null") || {}; } catch (e) { return {}; } }
function storeDraft() { store.set(DKEY(), JSON.stringify(draft)); }
function clearDraft() { store.del(DKEY()); }
let draft = loadDraft();
const isDirty = () => Object.keys(draft).length > 0;

const activeProducts = () => S.products.filter(p => p.active !== false);
const productById = id => S.products.find(p => p.id === id);
function valueFor(id) {
  if (id in draft) return draft[id];
  return (id in S.saved) ? String(Number(S.saved[id])) : "0";
}
const stepFor = p => { const t = Number(p.target_stock); return (isFinite(t) && t > 0 && (t < 1 || t % 1 !== 0)) ? 0.5 : 1; };

/* ---------- toast + banner ---------- */
let toastT;
function toast(msg, err) {
  const t = $("toast"); t.textContent = msg; t.className = "toast" + (err ? " err" : ""); t.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, err ? 6000 : 3000);
}
function setBanner(msg) { const b = $("banner"); b.textContent = msg || ""; b.hidden = !msg; }
function errorText(e, what) {
  if (e && e.code === "network") return "No internet connection. Your numbers are kept on this device. Try again when you're back online.";
  if (e && e.code === "not_configured") return "The app isn't connected to its database yet. See the setup guide (README).";
  return "Couldn't " + what + ". Please try again.";
}
function handlePinError(e) {
  if (e && e.code === "invalid_pin") { lock("The shop PIN has changed. Enter the new PIN."); return true; }
  return false;
}

/* =========================================================
   PIN screen
   ========================================================= */
function lock(msg) {
  S.pin = ""; store.del("inv-pin");
  $("app").hidden = true; $("pinScreen").hidden = false;
  $("pinErr").textContent = msg || ""; $("pinErr").hidden = !msg;
  $("pinInput").value = ""; setTimeout(() => $("pinInput").focus(), 50);
}
$("pinForm").addEventListener("submit", async e => {
  e.preventDefault();
  const pin = $("pinInput").value.trim(); if (!pin) return;
  const btn = $("pinBtn"); btn.disabled = true; btn.textContent = "Checking…";
  try {
    const role = await rpc("check_pin", { p_pin: pin });
    S.pin = pin; store.set("inv-pin", pin);
    if (role === "admin") { S.adminPin = pin; store.set("inv-admin-pin", pin, true); }
    $("pinScreen").hidden = true; $("app").hidden = false;
    show("today"); renderToday(); loadAll();
  } catch (err) {
    $("pinErr").textContent = err.code === "invalid_pin" ? "Wrong PIN. Try again." : errorText(err, "check the PIN");
    $("pinErr").hidden = false;
  } finally { btn.disabled = false; btn.textContent = "Open"; }
});

/* =========================================================
   Header
   ========================================================= */
function renderHeader() {
  const titles = { today: "Daily Inventory", history: "History", products: "Products" };
  $("viewTitle").textContent = titles[S.view];
  $("dateLine").textContent = S.view === "today" ? longDate(current) : (S.view === "history" ? "Past inventory records" : "Products and target stock");
  const pills = [];
  if (S.view === "today" && S.productsLoaded) {
    const short = activeProducts().filter(p => toNum(valueFor(p.id)) > 0).length;
    pills.push(short ? `<span class="pill warn num">${short} short</span>` : `<span class="pill num">All full</span>`);
    if (isDirty()) pills.push(`<span class="pill rev">Not saved yet</span>`);
    else if (S.savedAt) pills.push(`<span class="pill mute">Saved ${esc(timeOf(S.savedAt))}</span>`);
  }
  $("statusPills").innerHTML = pills.join("");
}

/* =========================================================
   Daily Inventory
   ========================================================= */
function renderToday() {
  const ul = $("todayList");
  if (!S.productsLoaded) { ul.innerHTML = `<li class="empty">Loading products…</li>`; return; }
  const act = activeProducts();
  if (!act.length) { ul.innerHTML = `<li class="empty"><b>No products yet</b>Add products and their target stock on the Products page.</li>`; return; }
  ul.innerHTML = act.map((p, i) => {
    const v = valueFor(p.id);
    return `<li class="row${toNum(v) > 0 ? " short" : ""}" data-id="${esc(p.id)}">
      <div class="name">${esc(p.name)}${p.note ? `<small>${esc(p.note)}</small>` : ""}</div>
      <div class="tgt num"><span>Target <b>${fmt(p.target_stock)}</b> ${esc(p.unit || "")}</span>${p.needs_review ? `<span class="pill rev">Check target</span>` : ""}</div>
      <div class="step">
        <button type="button" data-act="minus" aria-label="Less ${esc(p.name)}">−</button>
        <input id="q-${esc(p.id)}" type="number" inputmode="decimal" step="any" min="0" enterkeyhint="${i === act.length - 1 ? "done" : "next"}" value="${esc(v)}" aria-label="${esc(p.name)} short by (${esc(p.unit || "")})">
        <button type="button" data-act="plus" aria-label="More ${esc(p.name)}">+</button>
      </div></li>`;
  }).join("");
}
function syncTodayValues() {
  document.querySelectorAll("#todayList .row").forEach(row => {
    const inp = row.querySelector("input");
    if (!inp || document.activeElement === inp) return;
    const v = valueFor(row.dataset.id); if (inp.value !== v) inp.value = v;
    row.classList.toggle("short", toNum(v) > 0);
  });
}
function setValue(row, val) {
  const inp = row.querySelector("input");
  inp.value = val; draft[row.dataset.id] = val; storeDraft();
  row.classList.toggle("short", toNum(val) > 0); renderHeader();
}
const todayList = $("todayList");
todayList.addEventListener("click", e => {
  const b = e.target.closest("button[data-act]"); if (!b) return;
  const row = b.closest(".row"), p = productById(row.dataset.id); if (!p) return;
  const st = stepFor(p), cur = toNum(row.querySelector("input").value);
  const next = b.dataset.act === "plus" ? cur + st : Math.max(0, cur - st);
  setValue(row, String(Math.round(next * 100) / 100));
});
todayList.addEventListener("input", e => {
  if (e.target.tagName !== "INPUT") return;
  const row = e.target.closest(".row"); draft[row.dataset.id] = e.target.value; storeDraft();
  row.classList.toggle("short", toNum(e.target.value) > 0); renderHeader();
});
todayList.addEventListener("focusin", e => { if (e.target.tagName === "INPUT") setTimeout(() => { try { e.target.select(); } catch (_) {} }, 0); });
todayList.addEventListener("focusout", e => {
  if (e.target.tagName === "INPUT" && e.target.value.trim() === "") setValue(e.target.closest(".row"), "0");
});
todayList.addEventListener("keydown", e => {
  if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;
  e.preventDefault();
  const inputs = [...todayList.querySelectorAll("input")]; const i = inputs.indexOf(e.target);
  if (inputs[i + 1]) inputs[i + 1].focus(); else e.target.blur();
});

async function saveToday() {
  const act = activeProducts();
  if (!act.length) { toast("Add products first on the Products page.", true); return; }
  const btn = $("saveBtn");
  const items = act.map(p => ({ product_id: p.id, qty: toNum(valueFor(p.id)) }));
  btn.disabled = true; btn.textContent = "Saving…";
  try {
    await rpc("save_day", { p_pin: S.pin, p_date: current, p_items: items });
    S.saved = Object.fromEntries(items.map(it => [it.product_id, it.qty]));
    S.savedAt = new Date().toISOString();
    draft = {}; clearDraft();
    S.daysLoaded = false; S.dayCache.delete(current); S.histRows = null;
    syncTodayValues();
    toast("Inventory saved successfully.");
  } catch (e) {
    if (handlePinError(e)) return;
    if (e.code === "invalid_date") toast("This device's date looks wrong. Check the phone's date and time, then save again.", true);
    else toast(e.code === "network" ? "No internet connection. Your numbers are still here. Tap Save again when you're online." : "Couldn't save. Your numbers are still here. Tap Save again.", true);
  } finally { btn.disabled = false; btn.textContent = "Save Today's Inventory"; renderHeader(); }
}
$("saveBtn").addEventListener("click", saveToday);

/* =========================================================
   Order text (copy and paste to the supplier)
   ========================================================= */
function buildOrderText(dateKey, entries) {
  const lines = entries.filter(e => e.qty > 0).map(e => `${e.name} - ${fmt(e.qty)} ${e.unit || ""}`.trim());
  if (!lines.length) return { text: "", count: 0 };
  const d = parseKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return { text: `Order - ${d}\n\n${lines.join("\n")}\n\nThank you!`, count: lines.length };
}
let sheetReturnFocus = null;
function openOrderSheet(dateKey, entries, note) {
  const { text, count } = buildOrderText(dateKey, entries);
  if (!count) { toast(dateKey === current ? "Nothing is short. Enter shortages first." : "Nothing was short on this day.", true); return; }
  clearTimeout(toastT); $("toast").hidden = true;
  $("orderText").value = text;
  $("orderMeta").textContent = `${count} item${count > 1 ? "s" : ""} · ${longDate(dateKey)}${note ? " · " + note : ""}. You can edit the text before copying.`;
  sheetReturnFocus = document.activeElement;
  $("orderSheet").hidden = false;
  $("orderCopy").focus();
}
function closeOrderSheet() {
  $("orderSheet").hidden = true;
  if (sheetReturnFocus && sheetReturnFocus.focus) sheetReturnFocus.focus();
}
async function copyOrderText() {
  const ta = $("orderText"), text = ta.value;
  let ok = false;
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); ok = true; } } catch (e) {}
  if (!ok) {
    try { ta.focus(); ta.select(); ta.setSelectionRange(0, text.length); ok = document.execCommand("copy"); } catch (e) {}
  }
  if (ok) toast("Copied. Paste it into your message to the supplier.");
  else { ta.focus(); ta.select(); toast("Couldn't copy automatically. The text is selected: tap and hold, then Copy.", true); }
}
$("orderBtn").addEventListener("click", () => {
  const entries = activeProducts().map(p => ({ name: p.name, unit: p.unit, qty: toNum(valueFor(p.id)) }));
  openOrderSheet(current, entries, isDirty() ? "not saved yet" : "");
});
$("orderCopy").addEventListener("click", copyOrderText);
$("orderClose").addEventListener("click", closeOrderSheet);
$("orderSheet").addEventListener("click", e => { if (e.target.id === "orderSheet") closeOrderSheet(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("orderSheet").hidden) closeOrderSheet(); });

/* =========================================================
   History
   ========================================================= */
async function ensureDays() {
  if (S.daysLoaded) return;
  S.days = await rpc("list_days", { p_pin: S.pin, p_limit: 400 }) || [];
  S.daysLoaded = true;
}
async function renderHistory() {
  $("segDate").setAttribute("aria-pressed", S.histMode === "date");
  $("segProduct").setAttribute("aria-pressed", S.histMode === "product");
  const el = $("historyBody");
  try {
    if (S.histMode === "date") await renderHistoryByDate(el);
    else await renderHistoryByProduct(el);
  } catch (e) {
    if (handlePinError(e)) return;
    el.innerHTML = `<div class="empty"><b>Couldn't load records</b>${esc(errorText(e, "load records"))}</div>`;
  }
}
async function renderHistoryByDate(el) {
  if (S.histDay) {
    const day = S.histDay;
    let rows = S.dayCache.get(day);
    if (!rows) {
      el.innerHTML = `<button class="back" data-back type="button">← All dates</button><div class="empty">Loading…</div>`;
      rows = await rpc("get_day", { p_pin: S.pin, p_date: day }) || [];
      S.dayCache.set(day, rows);
      if (S.histDay !== day || S.view !== "history" || S.histMode !== "date") return;
    }
    const ord = new Map(S.products.map((p, i) => [p.id, i]));
    rows = rows.slice().sort((a, b) => (ord.get(a.product_id) ?? 999) - (ord.get(b.product_id) ?? 999));
    const short = rows.filter(r => Number(r.shortage_quantity) > 0).length;
    const last = rows.reduce((m, r) => (!m || r.updated_at > m) ? r.updated_at : m, null);
    el.innerHTML = `<button class="back" data-back type="button">← All dates</button>
      <div class="sectitle"><h2>${esc(longDate(day))}</h2><span class="num">${short} short · saved ${esc(timeOf(last))}</span></div>
      <ul class="list">${rows.map(r => {
        const p = productById(r.product_id) || { name: "Unknown product", unit: "" };
        const q = Number(r.shortage_quantity);
        return `<li class="hrow ${q > 0 ? "pos" : "zero"}">
          <button class="link" type="button" data-prod="${esc(r.product_id)}">${esc(p.name)}</button>
          <span class="q num">${fmt(q)} <small>${esc(p.unit)}</small></span></li>`;
      }).join("")}</ul>
      ${short ? `<button class="btn order-day" type="button" data-order-day>Order text for this day</button>` : ""}`;
    return;
  }
  if (!S.daysLoaded) { el.innerHTML = `<div class="empty">Loading records…</div>`; await ensureDays(); if (S.view !== "history" || S.histMode !== "date" || S.histDay) return; }
  if (!S.days.length) { el.innerHTML = `<div class="empty"><b>No records yet</b>Save today's inventory and it will show up here.</div>`; return; }
  el.innerHTML = `<div class="sectitle"><h2>All dates</h2><span class="num">${S.days.length} records</span></div>
    <ul class="list">${S.days.map(d => {
      const k = String(d.inventory_date).slice(0, 10), n = Number(d.short_count);
      return `<li><button class="daybtn" type="button" data-day="${esc(k)}"><span><span class="d">${esc(longDate(k))}</span><br><span class="s">${esc(weekday(k))}</span></span>
        <span class="pill ${n ? "warn" : ""} num">${n ? n + " short" : "All full"}</span></button></li>`;
    }).join("")}</ul>`;
}
async function renderHistoryByProduct(el) {
  const prods = S.products;
  if (!prods.length) { el.innerHTML = `<div class="empty">No products yet.</div>`; return; }
  if (!S.histProduct || !productById(S.histProduct)) S.histProduct = (activeProducts()[0] || prods[0]).id;
  const p = productById(S.histProduct);
  const picker = `<div class="field" style="margin-top:14px"><label for="prodPick">Product</label>
    <select id="prodPick">${prods.map(x => `<option value="${esc(x.id)}"${x.id === p.id ? " selected" : ""}>${esc(x.name)}${x.active === false ? " (inactive)" : ""}</option>`).join("")}</select></div>`;
  if (!S.histRows || S.histRows.id !== p.id) {
    el.innerHTML = picker + `<div class="empty">Loading…</div>`;
    const rows = await rpc("get_product_history", { p_pin: S.pin, p_product_id: p.id, p_limit: 90 }) || [];
    S.histRows = { id: p.id, rows };
    if (S.histProduct !== p.id || S.view !== "history" || S.histMode !== "product") return;
  }
  const recs = S.histRows.rows.map(r => ({ date: String(r.inventory_date).slice(0, 10), q: Number(r.shortage_quantity) }));
  el.innerHTML = picker + chartSvg(p, recs) +
    `<div class="sectitle"><h2>${esc(p.name)}</h2><span class="num">Target ${fmt(p.target_stock)} ${esc(p.unit || "")}</span></div>` +
    (recs.length ? `<ul class="list">${recs.map(x => `<li class="hrow ${x.q > 0 ? "pos" : "zero"}">
        <span><span class="num">${esc(shortDate(x.date))}</span> <span class="wd">${esc(weekday(x.date))}</span></span>
        <span class="q num">${fmt(x.q)} <small>${esc(p.unit || "")}</small></span></li>`).join("")}</ul>`
      : `<div class="empty">No records for this product yet.</div>`);
}
function chartSvg(p, recs) {
  const byDate = new Map(recs.map(r => [r.date, r.q]));
  const end = parseKey(todayKey()), days = [];
  for (let i = 29; i >= 0; i--) { const d = new Date(end); d.setDate(d.getDate() - i); const k = keyOf(d); days.push({ k, q: byDate.has(k) ? byDate.get(k) : null }); }
  if (!days.some(d => d.q !== null)) return "";
  const W = 320, H = 130, L = 26, R = 6, T = 10, B = 22, iw = W - L - R, ih = H - T - B;
  const maxQ = Math.max(1, ...days.map(d => d.q || 0));
  const top = maxQ <= 2 ? Math.ceil(maxQ * 2) / 2 : Math.ceil(maxQ);
  const y = v => T + ih - (v / top) * ih, bw = iw / 30;
  let s = `<line class="c-axis" x1="${L}" x2="${W - R}" y1="${T + ih}" y2="${T + ih}"/><line class="c-axis" x1="${L}" x2="${W - R}" y1="${T}" y2="${T}"/>
    <text class="c-txt" x="${L - 4}" y="${T + 4}" text-anchor="end">${fmt(top)}</text><text class="c-txt" x="${L - 4}" y="${T + ih + 3}" text-anchor="end">0</text>`;
  days.forEach((d, i) => {
    const x = L + i * bw + 1;
    if (d.q === null) return;
    if (d.q > 0) s += `<rect class="c-bar" x="${x.toFixed(1)}" y="${y(d.q).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${(T + ih - y(d.q)).toFixed(1)}" rx="1.5"><title>${shortDate(d.k)}: ${fmt(d.q)}</title></rect>`;
    else s += `<rect class="c-zero" x="${x.toFixed(1)}" y="${T + ih - 2}" width="${(bw - 2).toFixed(1)}" height="2"/>`;
  });
  s += `<text class="c-txt" x="${L}" y="${H - 6}">${shortDate(days[0].k)}</text><text class="c-txt" x="${W - R}" y="${H - 6}" text-anchor="end">Today</text>`;
  return `<div class="chartbox"><p class="cap">Shortage, last 30 days (${esc(p.unit || "")}). Grey ticks are days saved with 0; gaps are days with no record.</p>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Shortage of ${esc(p.name)} over the last 30 days">${s}</svg></div>`;
}
$("segDate").addEventListener("click", () => { S.histMode = "date"; renderHistory(); });
$("segProduct").addEventListener("click", () => { S.histMode = "product"; renderHistory(); });
$("historyBody").addEventListener("click", e => {
  const d = e.target.closest("[data-day]"); if (d) { S.histDay = d.dataset.day; renderHistory(); window.scrollTo(0, 0); return; }
  if (e.target.closest("[data-back]")) { S.histDay = null; renderHistory(); return; }
  if (e.target.closest("[data-order-day]")) {
    const ord = new Map(S.products.map((p, i) => [p.id, i]));
    const rows = (S.dayCache.get(S.histDay) || []).slice().sort((a, b) => (ord.get(a.product_id) ?? 999) - (ord.get(b.product_id) ?? 999));
    openOrderSheet(S.histDay, rows.map(r => { const p = productById(r.product_id) || { name: "Unknown product", unit: "" }; return { name: p.name, unit: p.unit, qty: Number(r.shortage_quantity) }; }));
    return;
  }
  const pr = e.target.closest("[data-prod]"); if (pr) { S.histMode = "product"; S.histProduct = pr.dataset.prod; renderHistory(); window.scrollTo(0, 0); }
});
$("historyBody").addEventListener("change", e => { if (e.target.id === "prodPick") { S.histProduct = e.target.value; renderHistory(); } });

/* =========================================================
   Products (editing needs the manager PIN)
   ========================================================= */
function editorHtml(p) {
  const isNew = !p.id;
  return `<form class="editor" id="prodForm" novalidate>
    <div class="field"><label for="f-name">Product name</label><input id="f-name" value="${esc(p.name || "")}" autocomplete="off"></div>
    <div class="field"><label for="f-note">Note (optional, e.g. Korean name)</label><input id="f-note" value="${esc(p.note || "")}" autocomplete="off"></div>
    <div class="two">
      <div class="field"><label for="f-target">Target stock</label><input id="f-target" type="number" inputmode="decimal" step="any" min="0" value="${p.target_stock ?? ""}"></div>
      <div class="field"><label for="f-unit">Unit</label><input id="f-unit" list="unitList" value="${esc(p.unit || "")}" autocomplete="off"></div>
    </div>
    <label class="check"><input type="checkbox" id="f-active"${p.active === false ? "" : " checked"}> Active (shown on Daily Inventory)</label>
    ${p.needs_review ? `<p class="err-msg" style="color:var(--review)">Needs review: ${esc(p.needs_review)}. Saving marks it as reviewed.</p>` : ""}
    ${S.editErr ? `<p class="err-msg">${esc(S.editErr)}</p>` : ""}
    <div class="actions"><button class="btn primary" type="submit">${isNew ? "Add product" : "Save changes"}</button><button class="btn" type="button" data-cancel>Cancel</button></div>
  </form>`;
}
function renderProducts() {
  const el = $("productsBody");
  if (!S.productsLoaded) { el.innerHTML = `<div class="empty">Loading products…</div>`; return; }
  const can = !!S.adminPin;
  const flagged = S.products.filter(p => p.needs_review);
  const act = S.products.filter(p => p.active !== false), off = S.products.filter(p => p.active === false);
  const row = p => `<li><div class="prow${p.active === false ? " off" : ""}">
      <div><div class="pn">${esc(p.name)}${p.note ? `<small>${esc(p.note)}</small>` : ""}</div>
      <div class="pm num"><span>Target ${fmt(p.target_stock)} ${esc(p.unit || "")}</span>${p.active === false ? `<span class="pill mute">Inactive</span>` : ""}${p.needs_review ? `<span class="pill rev">Needs review</span>` : ""}</div></div>
      ${can ? `<button class="btn" type="button" data-edit="${esc(p.id)}">Edit</button>` : ""}</div>
      ${S.editing === p.id ? editorHtml(p) : ""}</li>`;
  el.innerHTML = `
    ${can ? "" : `<form class="unlock" id="unlockForm" novalidate>
        <label for="adminPin"><b>Manager PIN</b> to add or edit products</label>
        <div class="rowline"><input id="adminPin" type="password" inputmode="numeric" autocomplete="off"><button class="btn primary" type="submit">Unlock</button></div>
        ${S.editErr && !S.editing ? `<p class="err-msg">${esc(S.editErr)}</p>` : ""}
      </form>`}
    ${flagged.length ? `<div class="reviewbox"><h3>Needs review (${flagged.length})</h3><ul>${flagged.map(p => `<li>${can ? `<button class="link" type="button" data-edit="${esc(p.id)}">${esc(p.name)}</button>` : `<b>${esc(p.name)}</b>`}: ${esc(p.needs_review)}</li>`).join("")}</ul></div>` : ""}
    <div class="sectitle"><h2>Active</h2>${can ? `<button class="btn primary" type="button" data-new>+ Add product</button>` : `<span class="num">${act.length}</span>`}</div>
    ${S.editing === "__new" ? `<div class="list" style="margin-bottom:12px">${editorHtml({ active: true })}</div>` : ""}
    ${act.length ? `<ul class="list">${act.map(row).join("")}</ul>` : `<div class="empty">No active products.</div>`}
    ${off.length ? `<div class="sectitle"><h2>Inactive</h2><span class="num">${off.length}</span></div><ul class="list">${off.map(row).join("")}</ul>` : ""}
    <p class="hint">To stop counting a product, uncheck Active. Its past records stay in History.</p>
    <div class="foot">${can ? `<button type="button" data-lockadmin>Lock product editing</button>` : ""}<button type="button" data-signout>Sign out of this device</button></div>
    <datalist id="unitList">${["Box", "Bag", "EA", "Kg", "CON"].map(u => `<option value="${u}">`).join("")}</datalist>`;
  if (S.editing === "__new") { const f = $("f-name"); if (f) f.focus(); }
}
const productsBody = $("productsBody");
productsBody.addEventListener("click", e => {
  const ed = e.target.closest("[data-edit]");
  if (ed) { S.editErr = ""; S.editing = S.editing === ed.dataset.edit ? null : ed.dataset.edit; renderProducts(); const f = $("prodForm"); if (f) f.scrollIntoView({ block: "nearest" }); return; }
  if (e.target.closest("[data-new]")) { S.editErr = ""; S.editing = "__new"; renderProducts(); return; }
  if (e.target.closest("[data-cancel]")) { S.editing = null; S.editErr = ""; renderProducts(); return; }
  if (e.target.closest("[data-lockadmin]")) { S.adminPin = ""; store.del("inv-admin-pin", true); S.editing = null; renderProducts(); return; }
  if (e.target.closest("[data-signout]")) { S.adminPin = ""; store.del("inv-admin-pin", true); lock(""); }
});
productsBody.addEventListener("submit", async e => {
  e.preventDefault();
  if (e.target.id === "unlockForm") {
    const pin = $("adminPin").value.trim(); if (!pin) return;
    try {
      const role = await rpc("check_pin", { p_pin: pin });
      if (role === "admin") { S.adminPin = pin; store.set("inv-admin-pin", pin, true); S.editErr = ""; }
      else S.editErr = "That PIN can enter inventory but can't edit products.";
    } catch (err) { S.editErr = err.code === "invalid_pin" ? "Wrong manager PIN." : errorText(err, "check the PIN"); }
    renderProducts(); return;
  }
  if (e.target.id !== "prodForm") return;
  const name = $("f-name").value.trim(), note = $("f-note").value.trim(), unit = $("f-unit").value.trim();
  const tRaw = $("f-target").value.trim(), t = parseFloat(tRaw), active = $("f-active").checked;
  if (!name) { S.editErr = "Enter a product name."; return renderProducts(); }
  if (tRaw === "" || !isFinite(t) || t < 0) { S.editErr = "Enter the target stock as a number, for example 5 or 0.5."; return renderProducts(); }
  if (!unit) { S.editErr = "Enter a unit, for example Box, Bag, EA or Kg."; return renderProducts(); }
  const btn = e.target.querySelector("button[type=submit]"); btn.disabled = true;
  try {
    const isNew = S.editing === "__new";
    const row = await rpc("upsert_product", {
      p_pin: S.adminPin, p_id: isNew ? null : S.editing, p_name: name, p_note: note,
      p_target: Math.round(t * 100) / 100, p_unit: unit, p_active: active
    });
    const saved = Array.isArray(row) ? row[0] : row;
    if (isNew) S.products.push(saved); else S.products = S.products.map(p => p.id === saved.id ? saved : p);
    S.products.sort((a, b) => (a.sort_order - b.sort_order) || String(a.name).localeCompare(b.name));
    S.editing = null; S.editErr = "";
    toast(isNew ? "Product added." : "Product saved.");
    renderToday(); renderHeader();
  } catch (err) {
    if (err.code === "invalid_pin") { S.adminPin = ""; store.del("inv-admin-pin", true); S.editing = null; S.editErr = "The manager PIN has changed. Enter it again."; }
    else S.editErr = errorText(err, "save the product");
  }
  renderProducts();
});

/* =========================================================
   Navigation + loading
   ========================================================= */
function show(view) {
  S.view = view;
  ["today", "history", "products"].forEach(v => { $("view-" + v).hidden = v !== view; });
  document.querySelectorAll(".tabs button").forEach(b => b.setAttribute("aria-current", b.dataset.view === view ? "page" : "false"));
  $("savebar").hidden = view !== "today"; document.body.classList.toggle("no-save", view !== "today");
  if (view === "history") renderHistory();
  if (view === "products") renderProducts();
  renderHeader(); window.scrollTo(0, 0);
}
document.querySelector(".tabs").addEventListener("click", e => {
  const b = e.target.closest("button[data-view]"); if (!b) return;
  if (b.dataset.view === "history") { S.histDay = null; S.daysLoaded = false; S.histRows = null; }
  show(b.dataset.view);
});

async function loadAll() {
  setBanner("");
  try {
    const [products, day] = await Promise.all([
      rpc("get_products", { p_pin: S.pin }),
      rpc("get_day", { p_pin: S.pin, p_date: current })
    ]);
    S.products = products || []; S.productsLoaded = true;
    S.saved = {}; S.savedAt = null;
    (day || []).forEach(r => { S.saved[r.product_id] = Number(r.shortage_quantity); if (!S.savedAt || r.updated_at > S.savedAt) S.savedAt = r.updated_at; });
    S.savedLoaded = true;
  } catch (e) {
    if (handlePinError(e)) return;
    setBanner(errorText(e, "load the product list") + " Pull down or reopen the page to retry.");
  }
  const focused = document.activeElement && document.activeElement.closest && document.activeElement.closest("#todayList");
  if (!focused) renderToday(); else syncTodayValues();
  if (S.view === "products" && !$("prodForm")) renderProducts();
  renderHeader();
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !S.pin) return;
  const k = todayKey();
  if (k !== current) { current = k; draft = loadDraft(); }
  loadAll();
});

/* boot */
if (!API || !KEY) {
  $("pinScreen").hidden = false;
  $("pinErr").textContent = "The app isn't connected to its database yet (config.js is missing). See the setup guide.";
  $("pinErr").hidden = false; $("pinBtn").disabled = true;
} else if (!S.pin) {
  lock("");
} else {
  $("app").hidden = false;
  show("today"); renderToday(); loadAll();
}
})();
