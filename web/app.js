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
S.name = store.get("inv-name") || "";
S.savedBy = "";
S.saveLog = new Map();
const missingFn = (e, fn) => e && e.message && e.message.includes(fn) && /(find|schema cache|does not exist)/i.test(e.message);

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
    renderToday(); route(); loadAll();
  } catch (err) {
    $("pinErr").textContent = err.code === "invalid_pin" ? "Wrong PIN. Try again." : errorText(err, "check the PIN");
    $("pinErr").hidden = false;
  } finally { btn.disabled = false; btn.textContent = "Open"; }
});

/* =========================================================
   Header
   ========================================================= */
function renderHeader() {
  if (S.mode && S.mode !== "stock") return renderModeHeader();
  $("homeBtn").hidden = false; $("homeBtn").textContent = "‹ Home";
  const titles = { today: "Daily Inventory", history: "History", products: "Products" };
  $("viewTitle").textContent = titles[S.view];
  $("dateLine").textContent = S.view === "today" ? longDate(current) : (S.view === "history" ? "Past inventory records" : "Products and target stock");
  const pills = [];
  if (S.view === "today" && S.productsLoaded) {
    const short = activeProducts().filter(p => toNum(valueFor(p.id)) > 0).length;
    pills.push(short ? `<span class="pill warn num">${short} short</span>` : `<span class="pill num">All full</span>`);
    if (isDirty()) pills.push(`<span class="pill rev">Not saved yet</span>`);
    else if (S.savedAt) pills.push(`<span class="pill mute">Saved ${esc(timeOf(S.savedAt))}${S.savedBy ? " · " + esc(S.savedBy) : ""}</span>`);
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
  const name = $("whoName").value.trim();
  if (!name) {
    $("whoName").closest(".who").classList.add("need");
    window.scrollTo({ top: 0, behavior: "smooth" }); $("whoName").focus();
    toast("Enter your name in “Checked by” first.", true); return;
  }
  const btn = $("saveBtn");
  const items = act.map(p => ({ product_id: p.id, qty: toNum(valueFor(p.id)) }));
  btn.disabled = true; btn.textContent = "Saving…";
  try {
    try { await rpc("save_day", { p_pin: S.pin, p_date: current, p_items: items, p_name: name }); }
    catch (e) { if (missingFn(e, "save_day")) await rpc("save_day", { p_pin: S.pin, p_date: current, p_items: items }); else throw e; }
    S.saved = Object.fromEntries(items.map(it => [it.product_id, it.qty]));
    S.savedAt = new Date().toISOString(); S.savedBy = name; S.saveLog.delete(current);
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
  const lines = entries.filter(e => e.qty > 0).map((e, i) => `${i + 1}. ${e.name} - ${fmt(e.qty)} ${e.unit || ""}`.trim());
  if (!lines.length) return { text: "", count: 0 };
  const d = parseKey(dateKey).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const total = `Total: ${lines.length} item${lines.length > 1 ? "s" : ""}`;
  return { text: `Order - ${d}\n\n${lines.join("\n")}\n\n${total}\n\nThank you!`, count: lines.length };
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
      if (!S.saveLog.has(day)) {
        try { S.saveLog.set(day, await rpc("get_day_saves", { p_pin: S.pin, p_date: day }) || []); }
        catch (e2) { if (e2.code === "invalid_pin") throw e2; S.saveLog.set(day, []); }
      }
      if (S.histDay !== day || S.view !== "history" || S.histMode !== "date") return;
    }
    const ord = new Map(S.products.map((p, i) => [p.id, i]));
    rows = rows.slice().sort((a, b) => (ord.get(a.product_id) ?? 999) - (ord.get(b.product_id) ?? 999));
    const short = rows.filter(r => Number(r.shortage_quantity) > 0).length;
    const last = rows.reduce((m, r) => (!m || r.updated_at > m) ? r.updated_at : m, null);
    el.innerHTML = `<button class="back" data-back type="button">← All dates</button>
      <div class="sectitle"><h2>${esc(longDate(day))}</h2><span class="num">${short} short · saved ${esc(timeOf(last))}</span></div>
      ${(S.saveLog.get(day) || []).length ? `<p class="savelog">Checked by ${(S.saveLog.get(day)).map(x => `<b>${esc(x.saved_by)}</b> <span class="num">${esc(timeOf(x.saved_at))}</span>`).join(", ")}</p>` : ""}
      <ul class="list">${rows.map(r => {
        const p = productById(r.product_id) || { name: "Unknown product", unit: "" };
        const q = Number(r.shortage_quantity);
        return `<li class="hrow ${q > 0 ? "pos" : "zero"}">
          <button class="link" type="button" data-prod="${esc(r.product_id)}">${esc(p.name)}</button>
          <span class="q num">${fmt(q)} <small>${esc(p.unit)}</small></span></li>`;
      }).join("")}</ul>
      ${short ? `<button class="btn order-day" type="button" data-order-day>Order text for this day</button>` : ""}
      ${S.confirmDelete === day ? `<form class="danger-box" id="deleteForm" novalidate>
          <p><b>Delete all records for ${esc(longDate(day))}?</b><br>This can't be undone. Products are not affected.</p>
          ${S.adminPin ? "" : `<label for="delPin">Manager PIN</label><input id="delPin" type="password" inputmode="numeric" autocomplete="off">`}
          ${S.deleteErr ? `<p class="err-msg">${esc(S.deleteErr)}</p>` : ""}
          <div class="actions"><button class="btn danger" type="submit">Delete</button><button class="btn" type="button" data-del-cancel>Cancel</button></div>
        </form>`
        : `<button class="btn delete-day" type="button" data-del-day>Delete this day</button>`}`;
    if (S.confirmDelete === day) { const f = $("delPin") || document.querySelector("#deleteForm .danger"); if (f) f.focus(); }
    return;
  }
  if (!S.daysLoaded) { el.innerHTML = `<div class="empty">Loading records…</div>`; await ensureDays(); if (S.view !== "history" || S.histMode !== "date" || S.histDay) return; }
  if (!S.days.length) { el.innerHTML = `<div class="empty"><b>No records yet</b>Save today's inventory and it will show up here.</div>`; return; }
  el.innerHTML = `<div class="sectitle"><h2>All dates</h2><span class="num">${S.days.length} records</span></div>
    <ul class="list">${S.days.map(d => {
      const k = String(d.inventory_date).slice(0, 10), n = Number(d.short_count);
      return `<li><button class="daybtn" type="button" data-day="${esc(k)}"><span><span class="d">${esc(longDate(k))}</span><br><span class="s">${esc(weekday(k))}</span>${d.checked_by ? `<span class="by">by ${esc(d.checked_by)}</span>` : ""}</span>
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
  if (e.target.closest("[data-back]")) { S.histDay = null; S.confirmDelete = null; renderHistory(); return; }
  if (e.target.closest("[data-del-day]")) { S.confirmDelete = S.histDay; S.deleteErr = ""; renderHistory(); return; }
  if (e.target.closest("[data-del-cancel]")) { S.confirmDelete = null; S.deleteErr = ""; renderHistory(); return; }
  if (e.target.closest("[data-order-day]")) {
    const ord = new Map(S.products.map((p, i) => [p.id, i]));
    const rows = (S.dayCache.get(S.histDay) || []).slice().sort((a, b) => (ord.get(a.product_id) ?? 999) - (ord.get(b.product_id) ?? 999));
    openOrderSheet(S.histDay, rows.map(r => { const p = productById(r.product_id) || { name: "Unknown product", unit: "" }; return { name: p.name, unit: p.unit, qty: Number(r.shortage_quantity) }; }));
    return;
  }
  const pr = e.target.closest("[data-prod]"); if (pr) { S.histMode = "product"; S.histProduct = pr.dataset.prod; renderHistory(); window.scrollTo(0, 0); }
});
$("historyBody").addEventListener("submit", async e => {
  if (e.target.id !== "deleteForm") return;
  e.preventDefault();
  const day = S.confirmDelete; if (!day) return;
  const pin = S.adminPin || ($("delPin") ? $("delPin").value.trim() : "");
  if (!pin) { S.deleteErr = "Enter the manager PIN."; return renderHistory(); }
  const btn = e.target.querySelector(".danger"); btn.disabled = true; btn.textContent = "Deleting…";
  try {
    await rpc("delete_day", { p_pin: pin, p_date: day });
    if (!S.adminPin) { S.adminPin = pin; store.set("inv-admin-pin", pin, true); }
    S.days = S.days.filter(d => String(d.inventory_date).slice(0, 10) !== day);
    S.dayCache.delete(day); S.saveLog.delete(day); S.histRows = null; S.histDay = null; S.confirmDelete = null; S.deleteErr = "";
    if (day === current) { S.saved = {}; S.savedAt = null; S.savedBy = ""; syncTodayValues(); renderHeader(); }
    toast("Records for " + longDate(day) + " deleted.");
  } catch (err) {
    if (err.code === "invalid_pin") {
      if (S.adminPin) { S.adminPin = ""; store.del("inv-admin-pin", true); }
      S.deleteErr = "Wrong manager PIN. Only the manager can delete records.";
    } else if (/delete_day/.test(err.message) && /(find|schema cache|does not exist)/i.test(err.message)) {
      S.deleteErr = "Deleting isn't set up yet. Run supabase/002_delete_day.sql in Supabase once (see README).";
    } else S.deleteErr = errorText(err, "delete this day");
  }
  renderHistory();
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
  S.view = view; S.mode = "stock";
  $("view-home").hidden = true; $("view-closing").hidden = true; $("closebar").hidden = true;
  document.querySelector(".tabs").hidden = false; document.body.classList.remove("no-bar", "close-bar");
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
    S.savedBy = "";
    try {
      const saves = await rpc("get_day_saves", { p_pin: S.pin, p_date: current }) || [];
      S.saveLog.set(current, saves);
      if (saves.length) S.savedBy = saves[saves.length - 1].saved_by;
    } catch (e2) { if (e2.code === "invalid_pin") throw e2; }
  } catch (e) {
    if (handlePinError(e)) return;
    setBanner(errorText(e, "load the product list") + " Pull down or reopen the page to retry.");
  }
  const focused = document.activeElement && document.activeElement.closest && document.activeElement.closest("#todayList");
  if (!focused) renderToday(); else syncTodayValues();
  if (S.view === "products" && !$("prodForm")) renderProducts();
  renderHeader();
  if (S.mode === "home") renderHome();
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !S.pin) return;
  const k = todayKey();
  if (k !== current) { current = k; draft = loadDraft(); }
  loadAll();
  if (S.mode === "closing" || S.mode === "home") loadClosingDay(true);
});


/* =========================================================
   Home + Closing checklist
   ========================================================= */
const ROLES = window.CLOSING_ROLES || [];
const roleById = id => ROLES.find(r => r.id === id);
const WORK_ROLES = ROLES.filter(r => !r.leader);
/* a closing done after midnight (before 4 AM) still counts for the previous day */
const closeKey = () => keyOf(new Date(Date.now() - 4 * 3600 * 1000));
const C = { date: closeKey(), rows: new Map(), loaded: false, notSetUp: false, view: "roles", role: null,
            checks: {}, confirm: false, days: null, histDay: null, histRows: null, confirmDelete: false, deleteErr: "" };
const CDKEY = () => "close-draft-" + C.date + "-" + C.role;
function loadChecks() {
  try { const d = JSON.parse(store.get(CDKEY()) || "null"); if (d) return d; } catch (e) {}
  const row = C.rows.get(C.role); const out = {};
  if (row && Array.isArray(row.items)) row.items.forEach(it => { if (it.done) out[it.id] = true; });
  return out;
}
const hasDraft = () => store.get(CDKEY()) !== null;

function notSetUpMsg() { return `<div class="banner">Closing isn't set up yet. Run <b>supabase/004_closing.sql</b> in Supabase once (see README).</div>`; }

async function loadClosingDay(rerender) {
  const k = closeKey();
  if (k !== C.date) { C.date = k; C.rows = new Map(); C.loaded = false; }
  try {
    const rows = await rpc("get_closing_day", { p_pin: S.pin, p_date: C.date }) || [];
    C.rows = new Map(rows.map(r => [r.role, r])); C.loaded = true; C.notSetUp = false;
  } catch (e) {
    if (handlePinError(e)) return;
    if (missingFn(e, "get_closing_day")) C.notSetUp = true;
    C.loaded = true;
  }
  if (rerender) { if (S.mode === "closing") renderClosing(); if (S.mode === "home") renderHome(); }
}

function roleStatus(r) {
  const row = C.rows.get(r.id);
  if (!row) return { cls: "", pill: `<span class="pill mute">Not yet</span>`, text: "Not yet" };
  const full = row.done_count === row.total_count;
  return { cls: full ? "done" : "part", row,
    pill: `<span class="pill ${full ? "" : "warn"} num">${full ? "✓ " : row.done_count + "/" + row.total_count + " · "}${esc(row.checked_by)}</span>`,
    text: `${row.checked_by} · ${row.done_count}/${row.total_count} · ${timeOf(row.updated_at)}` };
}

function setMode(mode) {
  S.mode = mode;
  ["today", "history", "products"].forEach(v => { $("view-" + v).hidden = true; });
  $("view-home").hidden = mode !== "home"; $("view-closing").hidden = mode !== "closing";
  $("savebar").hidden = true; document.querySelector(".tabs").hidden = true;
  const bar = mode === "closing" && C.view === "role";
  $("closebar").hidden = !bar;
  document.body.classList.remove("no-save");
  document.body.classList.toggle("close-bar", bar); document.body.classList.toggle("no-bar", !bar);
}

function renderModeHeader() {
  const hb = $("homeBtn"); let title = "", line = "";
  if (S.mode === "home") { hb.hidden = true; title = "Today"; line = longDate(current); }
  else if (C.view === "roles") { hb.hidden = false; hb.textContent = "‹ Home"; title = "Closing"; line = longDate(C.date); }
  else if (C.view === "role") { hb.hidden = false; hb.textContent = "‹ Closing"; const r = roleById(C.role); title = r ? r.name : "Closing"; line = (r ? r.ko + " · " : "") + longDate(C.date); }
  else { hb.hidden = false; hb.textContent = "‹ Closing"; title = "Closing History"; line = "Past closing checklists"; }
  $("viewTitle").textContent = title; $("dateLine").textContent = line; $("statusPills").innerHTML = "";
}

function renderHome() {
  $("homeStockSub").textContent = S.savedAt ? `Saved today ${timeOf(S.savedAt)}${S.savedBy ? " · " + S.savedBy : ""}` : "Enter today's shortages";
  if (C.notSetUp) $("homeCloseSub").textContent = "Closing checklist";
  else if (C.loaded) {
    const n = WORK_ROLES.filter(r => C.rows.has(r.id)).length;
    const lead = C.rows.get("leader");
    $("homeCloseSub").textContent = lead ? `Final check done · ${lead.checked_by}` : `${n} of ${WORK_ROLES.length} parts submitted tonight`;
  }
  renderModeHeader();
}

function renderClosing() {
  const el = $("closingBody");
  setMode("closing"); renderModeHeader();
  if (C.notSetUp) { el.innerHTML = notSetUpMsg(); $("closebar").hidden = true; return; }
  if (C.view === "roles") return renderRoles(el);
  if (C.view === "role") return renderRole(el);
  return renderClosingHistory(el);
}

function renderRoles(el) {
  el.innerHTML = `<p class="hint" style="margin-top:14px">Pick your part. 내 파트를 누르세요.</p>
    <div class="role-grid">${ROLES.map(r => { const st = roleStatus(r);
      return `<button type="button" class="role-btn ${r.leader ? "leader" : ""} ${st.cls}" data-role="${esc(r.id)}">
        <span class="rn">${esc(r.name)}</span><span class="rk">${esc(r.ko)} · ${r.tasks.length} tasks</span>
        <span class="rs">${C.loaded ? st.pill : ""}</span></button>`; }).join("")}</div>
    <div class="linkrow"><button type="button" class="btn" data-go-hist>Closing history</button></div>`;
}

function renderRole(el) {
  const r = roleById(C.role); if (!r) { location.hash = "closing"; return; }
  const done = r.tasks.filter(t => C.checks[t.id]).length, total = r.tasks.length;
  const row = C.rows.get(r.id);
  let team = "";
  if (r.leader) {
    team = `<div class="sectitle"><h2>Team</h2><span class="num">${WORK_ROLES.filter(x => C.rows.has(x.id)).length}/${WORK_ROLES.length} submitted</span></div>
      <ul class="team">${WORK_ROLES.map(x => { const st = roleStatus(x); const xr = st.row;
        const miss = xr && Array.isArray(xr.items) ? xr.items.filter(i => !i.done) : [];
        return `<li><div><div class="tn">${esc(x.name)} <span class="tm">${esc(x.ko)}</span></div>
          <div class="tm">${xr ? esc(st.text) : "Not submitted yet"}</div>
          ${miss.length ? `<ul class="missing">${miss.map(i => `<li>${esc(i.ko ? i.ko + " · " + i.label : i.label)}</li>`).join("")}</ul>` : ""}</div>
          ${xr ? (xr.done_count === xr.total_count ? `<span class="pill">Done</span>` : `<span class="pill warn">${miss.length} left</span>`) : `<span class="pill mute">Not yet</span>`}</li>`; }).join("")}</ul>`;
  }
  el.innerHTML = `<div class="who"><label for="closeName">${r.leader ? "Leader" : "Checked by"}</label>
      <input id="closeName" type="text" autocomplete="name" autocapitalize="words" maxlength="40" placeholder="Your name" value="${esc(S.name)}" enterkeyhint="done"></div>
    ${team}
    <div class="sectitle"><h2>${r.leader ? "Final check" : "Checklist"}</h2><span class="num" id="cCount">${done}/${total}</span></div>
    <div class="progress"><span id="cBar" style="width:${Math.round(done / total * 100)}%"></span></div>
    <ul class="task-list">${r.tasks.map(t => `<li><button type="button" class="task" role="checkbox" aria-checked="${C.checks[t.id] ? "true" : "false"}" data-task="${esc(t.id)}">
        <span class="box" aria-hidden="true">✓</span><span><span class="tk">${esc(t.ko)}</span><span class="te">${esc(t.en)}</span></span></button></li>`).join("")}</ul>
    ${row ? `<p class="hint">Submitted by <b>${esc(row.checked_by)}</b> at ${esc(timeOf(row.updated_at))} (${row.done_count}/${row.total_count}).${hasDraft() ? " You have changes that aren't submitted." : " You can change it and submit again."}</p>` : ""}`;
  updateSubmit();
}

function updateSubmit() {
  const r = roleById(C.role); if (!r) return;
  const done = r.tasks.filter(t => C.checks[t.id]).length, total = r.tasks.length;
  const cnt = $("cCount"), bar = $("cBar");
  if (cnt) cnt.textContent = `${done}/${total}`; if (bar) bar.style.width = Math.round(done / total * 100) + "%";
  const missingParts = r.leader ? WORK_ROLES.filter(x => !C.rows.has(x.id)).length : 0;
  const btn = $("closeSubmit");
  btn.classList.toggle("warn", C.confirm);
  if (C.confirm) {
    const bits = [];
    if (total - done) bits.push(`${total - done} unchecked`);
    if (missingParts) bits.push(`${missingParts} part${missingParts > 1 ? "s" : ""} missing`);
    btn.textContent = `Submit anyway? (${bits.join(", ")})`;
  } else btn.textContent = `${r.leader ? "Final check" : "Submit " + r.name} (${done}/${total})`;
}

$("closingBody").addEventListener("click", e => {
  const rb = e.target.closest("[data-role]"); if (rb) { location.hash = "closing-" + rb.dataset.role; return; }
  if (e.target.closest("[data-go-hist]")) { location.hash = "closing-history"; return; }
  const tb = e.target.closest("[data-task]");
  if (tb) {
    const id = tb.dataset.task; C.checks[id] = !C.checks[id]; if (!C.checks[id]) delete C.checks[id];
    tb.setAttribute("aria-checked", C.checks[id] ? "true" : "false");
    store.set(CDKEY(), JSON.stringify(C.checks)); C.confirm = false; updateSubmit(); return;
  }
  const d = e.target.closest("[data-cday]"); if (d) { C.histDay = d.dataset.cday; C.histRows = null; C.confirmDelete = false; renderClosing(); window.scrollTo(0, 0); return; }
  if (e.target.closest("[data-cback]")) { C.histDay = null; C.confirmDelete = false; renderClosing(); return; }
  if (e.target.closest("[data-cdel]")) { C.confirmDelete = true; C.deleteErr = ""; renderClosing(); return; }
  if (e.target.closest("[data-cdel-cancel]")) { C.confirmDelete = false; renderClosing(); }
});
$("closingBody").addEventListener("input", e => {
  if (e.target.id !== "closeName") return;
  S.name = e.target.value; store.set("inv-name", S.name.trim()); $("whoName").value = S.name;
  if (S.name.trim()) e.target.closest(".who").classList.remove("need");
});
$("closingBody").addEventListener("keydown", e => { if (e.target.id === "closeName" && e.key === "Enter") { e.preventDefault(); e.target.blur(); } });

$("closeSubmit").addEventListener("click", async () => {
  const r = roleById(C.role); if (!r) return;
  const nameEl = $("closeName"); const name = (nameEl ? nameEl.value : S.name).trim();
  if (!name) { nameEl.closest(".who").classList.add("need"); window.scrollTo({ top: 0, behavior: "smooth" }); nameEl.focus(); toast("Enter your name first. 이름을 먼저 적어주세요.", true); return; }
  const done = r.tasks.filter(t => C.checks[t.id]).length;
  const missingParts = r.leader ? WORK_ROLES.filter(x => !C.rows.has(x.id)).length : 0;
  if ((done < r.tasks.length || missingParts) && !C.confirm) { C.confirm = true; updateSubmit(); return; }
  const btn = $("closeSubmit"); btn.disabled = true; btn.textContent = "Submitting…";
  const items = r.tasks.map(t => ({ id: t.id, label: t.en, ko: t.ko, done: !!C.checks[t.id] }));
  try {
    await rpc("save_closing", { p_pin: S.pin, p_date: C.date, p_role: r.id, p_name: name, p_items: items });
    store.del(CDKEY()); C.confirm = false; C.days = null;
    await loadClosingDay(false);
    toast(`${r.leader ? "Final check" : r.name} submitted. 제출 완료!`);
    location.hash = "closing";
  } catch (e) {
    if (handlePinError(e)) return;
    if (missingFn(e, "save_closing")) toast("Closing isn't set up yet. Ask the manager to run 004_closing.sql.", true);
    else if (e.code === "invalid_date") toast("This device's date looks wrong. Check the date and time.", true);
    else toast(e.code === "network" ? "No internet. Your checks are kept on this device. Try again when online." : "Couldn't submit. Your checks are kept. Try again.", true);
  } finally { btn.disabled = false; updateSubmit(); }
});

async function renderClosingHistory(el) {
  try {
    if (C.histDay) {
      const day = C.histDay;
      if (!C.histRows) {
        el.innerHTML = `<button class="back" type="button" data-cback>← All dates</button><div class="empty">Loading…</div>`;
        C.histRows = await rpc("get_closing_day", { p_pin: S.pin, p_date: day }) || [];
        if (C.histDay !== day || C.view !== "history") return;
      }
      const byRole = new Map(C.histRows.map(x => [x.role, x]));
      el.innerHTML = `<button class="back" type="button" data-cback>← All dates</button>
        <div class="sectitle"><h2>${esc(longDate(day))}</h2><span>${esc(weekday(day))}</span></div>
        <ul class="team">${ROLES.map(x => { const xr = byRole.get(x.id);
          const miss = xr && Array.isArray(xr.items) ? xr.items.filter(i => !i.done) : [];
          return `<li><div><div class="tn">${esc(x.name)} <span class="tm">${esc(x.ko)}</span></div>
            <div class="tm">${xr ? `${esc(xr.checked_by)} · ${xr.done_count}/${xr.total_count} · ${esc(timeOf(xr.updated_at))}` : "Not submitted"}</div>
            ${miss.length ? `<ul class="missing">${miss.map(i => `<li>${esc(i.ko ? i.ko + " · " + i.label : i.label)}</li>`).join("")}</ul>` : ""}</div>
            ${xr ? (miss.length ? `<span class="pill warn">${miss.length} missed</span>` : `<span class="pill">Done</span>`) : `<span class="pill mute">—</span>`}</li>`; }).join("")}</ul>
        ${C.confirmDelete ? `<form class="danger-box" id="cDeleteForm" novalidate>
            <p><b>Delete the closing checklist for ${esc(longDate(day))}?</b><br>This can't be undone.</p>
            ${S.adminPin ? "" : `<label for="cDelPin">Manager PIN</label><input id="cDelPin" type="password" inputmode="numeric" autocomplete="off">`}
            ${C.deleteErr ? `<p class="err-msg">${esc(C.deleteErr)}</p>` : ""}
            <div class="actions"><button class="btn danger" type="submit">Delete</button><button class="btn" type="button" data-cdel-cancel>Cancel</button></div></form>`
          : `<button class="btn delete-day" type="button" data-cdel>Delete this day</button>`}`;
      return;
    }
    if (!C.days) {
      el.innerHTML = `<div class="empty">Loading…</div>`;
      C.days = await rpc("list_closing_days", { p_pin: S.pin, p_limit: 400 }) || [];
      if (C.view !== "history" || C.histDay) return;
    }
    if (!C.days.length) { el.innerHTML = `<div class="empty"><b>No closings yet</b>Submitted closing checklists will show up here.</div>`; return; }
    el.innerHTML = `<div class="sectitle"><h2>All dates</h2><span class="num">${C.days.length}</span></div>
      <ul class="list">${C.days.map(d => { const k = String(d.check_date).slice(0, 10);
        const sub = Number(d.roles_submitted), comp = Number(d.roles_complete);
        return `<li><button class="daybtn" type="button" data-cday="${esc(k)}"><span><span class="d">${esc(longDate(k))}</span><br><span class="s">${esc(weekday(k))}</span>
          <span class="by">${d.leader ? "Final: " + esc(d.leader) : "No final check"}</span></span>
          <span class="pill ${comp === WORK_ROLES.length && d.leader ? "" : "warn"} num">${sub}/${WORK_ROLES.length} parts</span></button></li>`; }).join("")}</ul>`;
  } catch (e) {
    if (handlePinError(e)) return;
    el.innerHTML = missingFn(e, "closing") ? notSetUpMsg() : `<div class="empty"><b>Couldn't load</b>${esc(errorText(e, "load closing records"))}</div>`;
  }
}
$("closingBody").addEventListener("submit", async e => {
  if (e.target.id !== "cDeleteForm") return;
  e.preventDefault();
  const pin = S.adminPin || ($("cDelPin") ? $("cDelPin").value.trim() : "");
  if (!pin) { C.deleteErr = "Enter the manager PIN."; return renderClosing(); }
  try {
    await rpc("delete_closing_day", { p_pin: pin, p_date: C.histDay });
    if (!S.adminPin) { S.adminPin = pin; store.set("inv-admin-pin", pin, true); }
    toast("Closing for " + longDate(C.histDay) + " deleted.");
    if (C.histDay === C.date) await loadClosingDay(false);
    C.histDay = null; C.days = null; C.confirmDelete = false;
  } catch (err) {
    if (err.code === "invalid_pin") { if (S.adminPin) { S.adminPin = ""; store.del("inv-admin-pin", true); } C.deleteErr = "Wrong manager PIN."; }
    else C.deleteErr = errorText(err, "delete this day");
  }
  renderClosing();
});

/* ---------- routing (#home, #stock, #closing, #closing-server, #closing-history) ---------- */
function route() {
  const h = (location.hash || "").replace("#", "");
  if (h === "stock" || h === "today" || h === "history" || h === "products") {
    show(h === "stock" ? (S.mode === "stock" ? S.view : "today") : h); return;
  }
  if (h.startsWith("closing")) {
    const sub = h.slice(8);
    C.date = closeKey();
    if (sub === "history") { C.view = "history"; C.histDay = null; C.days = null; }
    else if (roleById(sub)) { C.view = "role"; C.role = sub; C.checks = loadChecks(); C.confirm = false; }
    else C.view = "roles";
    renderClosing(); window.scrollTo(0, 0);
    if (!C.loaded || C.view === "roles") loadClosingDay(true).then(() => {
      if (C.view === "role" && !hasDraft()) { C.checks = loadChecks(); if (S.mode === "closing") renderClosing(); }
    });
    return;
  }
  setMode("home"); renderHome(); window.scrollTo(0, 0);
  loadClosingDay(true);
}
window.addEventListener("hashchange", route);
$("homeBtn").addEventListener("click", () => {
  if (S.mode === "closing" && C.view !== "roles") location.hash = "closing"; else location.hash = "home";
});
$("view-home").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) location.hash = b.dataset.go; });
$("signOutHome").addEventListener("click", () => { S.adminPin = ""; store.del("inv-admin-pin", true); lock(""); });

/* "Checked by" name: remembered on this device */
$("whoName").value = S.name;
$("whoName").addEventListener("input", e => {
  S.name = e.target.value; store.set("inv-name", S.name.trim());
  if (S.name.trim()) e.target.closest(".who").classList.remove("need");
});
$("whoName").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.target.blur(); } });

/* boot */
if (!API || !KEY) {
  /* config.js didn't load (often a stale cached copy): fetch it fresh once, then reload */
  let tries = 0; try { tries = Number(sessionStorage.getItem("cfg-retry") || 0); } catch (e) {}
  if (tries < 1) {
    try { sessionStorage.setItem("cfg-retry", "1"); } catch (e) {}
    fetch("config.js?t=" + Date.now(), { cache: "reload" }).finally(() => location.reload());
  } else {
    try { sessionStorage.removeItem("cfg-retry"); } catch (e) {}
    $("pinScreen").hidden = false;
    $("pinErr").textContent = "Couldn't connect to the database. Check your internet, then close this tab and open the link again.";
    $("pinErr").hidden = false; $("pinBtn").disabled = true;
  }
} else if (!S.pin) {
  try { sessionStorage.removeItem("cfg-retry"); } catch (e) {}
  lock("");
} else {
  try { sessionStorage.removeItem("cfg-retry"); } catch (e) {}
  $("app").hidden = false;
  renderToday(); route(); loadAll();
}
})();
