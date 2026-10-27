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
  const titles = { today: "위시모토 인벤토리", history: "History", products: "Products" };
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
function showTextSheet(title, text, meta) {
  clearTimeout(toastT); $("toast").hidden = true;
  $("orderTitle").textContent = title; $("orderText").value = text; $("orderMeta").textContent = meta;
  sheetReturnFocus = document.activeElement;
  $("orderSheet").hidden = false; $("orderCopy").focus();
}
function openOrderSheet(dateKey, entries, note) {
  const { text, count } = buildOrderText(dateKey, entries);
  if (!count) { toast(dateKey === current ? "Nothing is short. Enter shortages first." : "Nothing was short on this day.", true); return; }
  showTextSheet("Order text", text, `${count} item${count > 1 ? "s" : ""} · ${longDate(dateKey)}${note ? " · " + note : ""}. You can edit the text before copying.`);
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
    <label class="check"><input type="checkbox" id="f-active"${p.active === false ? "" : " checked"}> Active (shown on 위시모토 인벤토리)</label>
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
  $("view-store2").hidden = true; $("s2bar").hidden = true;
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
const ICONS = {
  server: '<path d="M3 17h18"/><path d="M5 17a7 7 0 0 1 14 0"/><path d="M12 8V6"/><path d="M10 6h4"/>',
  cook:   '<path d="M12 3c.8 2.6 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2 1-3.4 2.2-4.3.1 1.8.9 2.8 2 3.1-.5-2.6-.6-5 .3-7.8z"/>',
  rice:   '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8.5 7.5c0-1.2.8-2 1.8-2.3M13.5 6.5c0-1.2.8-2 1.8-2.3"/>',
  sushi:  '<path d="M3.5 12c2.6-3.6 6.3-5.5 10-5.5 3.5 0 6.2 2.2 7.5 5.5-1.3 3.3-4 5.5-7.5 5.5-3.7 0-7.4-1.9-10-5.5z"/><path d="M3.5 12 1.5 8.5M3.5 12l-2 3.5"/><circle cx="16.5" cy="11" r=".9"/>',
  leader: '<path d="M12 3l2.3 1.7 2.9.1.9 2.7 2.3 1.8-.9 2.7.9 2.7-2.3 1.8-.9 2.7-2.9.1L12 21l-2.3-1.7-2.9-.1-.9-2.7-2.3-1.8.9-2.7-.9-2.7 2.3-1.8.9-2.7 2.9-.1z"/><path d="M9 12l2 2 4-4"/>'
};
const svg = (d, cls) => `<svg viewBox="0 0 24 24"${cls ? ` class="${cls}"` : ""}>${d}</svg>`;
const GO_ICON = svg('<path d="M9 6l6 6-6 6"/>');

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
/* each part keeps its own name for tonight; nothing is copied between parts */
const CNKEY = () => "close-name-" + C.date + "-" + C.role;
function roleName() {
  const typed = store.get(CNKEY());
  if (typed !== null) return typed;
  const row = C.rows.get(C.role);
  return row ? row.checked_by : "";
}

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
  $("view-home").hidden = mode !== "home"; $("view-closing").hidden = mode !== "closing"; $("view-store2").hidden = mode !== "store2";
  $("savebar").hidden = true; document.querySelector(".tabs").hidden = true;
  const cbar = mode === "closing" && C.view === "role";
  const sbar = mode === "store2" && !S.s2pick && T.view === "form";
  const bar = cbar || sbar;
  $("closebar").hidden = !cbar; $("s2bar").hidden = !sbar;
  document.body.classList.remove("no-save");
  document.body.classList.toggle("close-bar", bar); document.body.classList.toggle("no-bar", !bar);
}

function renderModeHeader() {
  const hb = $("homeBtn"); let title = "", line = "";
  if (S.mode === "home") { hb.hidden = true; title = "Today"; line = longDate(current); }
  else if (S.mode === "store2" && S.s2pick) {
    hb.hidden = false; hb.textContent = "‹ Home";
    $("viewTitle").textContent = GROUPS[S.s2pick].title; $("dateLine").textContent = longDate(current); $("statusPills").innerHTML = ""; return;
  }
  else if (S.mode === "store2") {
    hb.hidden = false; hb.textContent = T.view === "detail" && !T.justSubmitted ? "‹ Past checks" : T.justSubmitted ? "‹ Home" : `‹ ${KINDS[K].group === "store1" ? "Stations" : "Store #2"}`;
    title = T.view === "history" || T.view === "detail" ? KINDS[K].hist : KINDS[K].title;
    line = T.view === "form" ? longDate(current) : T.view === "history" ? "Past inventory checks" : (T.detail ? longDate(String(T.detail.check_date).slice(0, 10)) + " · " + timeOf(T.detail.created_at) : "");
    $("viewTitle").textContent = title; $("dateLine").textContent = line;
    $("statusPills").innerHTML = T.view === "form" ? `<span class="pill num" id="s2Pill"></span>` : "";
    return;
  }
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
  const due = weeklyDue(); $("homeS2wDue").hidden = !due;
  const lastOf = g => Object.keys(KINDS).filter(k => KINDS[k].group === g).map(k => TS[k].last && { ...TS[k].last, kind: k }).filter(Boolean).sort((x, y) => String(y.created_at).localeCompare(String(x.created_at)))[0];
  const L2 = lastOf("store2"), L1 = lastOf("store1");
  $("homeS2Sub").textContent = due ? "Saturday check due today" : L2 ? `Last check ${shortDate(String(L2.check_date).slice(0, 10))} · ${L2.checked_by}` : "Weekday & Saturday checks";
  $("homeS1Sub").textContent = L1 ? `Last: ${KINDS[L1.kind].pick} ${shortDate(String(L1.check_date).slice(0, 10))} · ${L1.checked_by}` : "Server · Sushi · Middle · Cook";
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
    <div class="role-grid">${ROLES.map(r => { const st = roleStatus(r); const row = st.row;
      const pct = row ? Math.round(row.done_count / row.total_count * 100) : 0;
      const label = !C.loaded ? "&nbsp;" : !row ? "Not started" : row.done_count === row.total_count ? `✓ Done · ${esc(row.checked_by)}` : `${row.done_count}/${row.total_count} · ${esc(row.checked_by)}`;
      return `<button type="button" class="tile role-btn ${esc(r.id)} ${r.leader ? "leader" : ""} ${st.cls}" data-role="${esc(r.id)}">
        <span class="ic" aria-hidden="true">${svg(ICONS[r.id] || ICONS.leader)}</span>
        <span class="tt">${esc(r.name)}</span><span class="ts">${esc(r.ko)} · ${r.tasks.length} tasks</span>
        <span class="meter"><span class="bar"><span style="width:${pct}%"></span></span><span class="st">${label}</span></span>
        <span class="go" aria-hidden="true">${GO_ICON}</span></button>`; }).join("")}</div>
    <div class="linkrow"><button type="button" class="hist-btn" data-go-hist>${svg('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/>')}Closing history</button></div>`;
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
      <input id="closeName" type="text" autocomplete="name" autocapitalize="words" maxlength="40" placeholder="Your name" value="${esc(roleName())}" enterkeyhint="done"></div>
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
  store.set(CNKEY(), e.target.value);
  if (e.target.value.trim()) e.target.closest(".who").classList.remove("need");
});
$("closingBody").addEventListener("keydown", e => { if (e.target.id === "closeName" && e.key === "Enter") { e.preventDefault(); e.target.blur(); } });

$("closeSubmit").addEventListener("click", async () => {
  const r = roleById(C.role); if (!r) return;
  const nameEl = $("closeName"); const name = (nameEl ? nameEl.value : "").trim();
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


/* =========================================================
   Store #2 regular inventory check
   ========================================================= */
/* Two Store #2 forms share these screens: the regular check and the weekly (Saturday) check. */
const KINDS = {
  store2:  { cfg: window.STORE2_CHECK,  title: "Store #2 Weekday",  pick: "Weekday",  pko: "평일 체크",     icon: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 10l1.5 1.5 3-3"/><path d="M8.5 16h7"/>',
             hist: "Store #2 Weekday Checks",  order: "Store #2 Order",          sql: "005_store2_check.sql",  key: "s2-draft" },
  store2w: { cfg: window.STORE2_WEEKLY, title: "Store #2 Saturday", pick: "Saturday", pko: "토요일 주간 체크", icon: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="M9 15l2 2 4-4"/>',
             hist: "Store #2 Saturday Checks", order: "Store #2 Saturday Order", sql: "006_store2_weekly.sql", key: "s2w-draft" }
};
const TS = {};
KINDS.store2.group = KINDS.store2w.group = "store2";
const S1 = window.STORE1_STATIONS || {};
const S1_ICONS = {
  server: '<path d="M3 17h18"/><path d="M5 17a7 7 0 0 1 14 0"/><path d="M12 8V6"/><path d="M10 6h4"/>',
  sushi:  '<path d="M3.5 12c2.6-3.6 6.3-5.5 10-5.5 3.5 0 6.2 2.2 7.5 5.5-1.3 3.3-4 5.5-7.5 5.5-3.7 0-7.4-1.9-10-5.5z"/><path d="M3.5 12 1.5 8.5M3.5 12l-2 3.5"/><circle cx="16.5" cy="11" r=".9"/>',
  middle: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8.5 7.5c0-1.2.8-2 1.8-2.3M13.5 6.5c0-1.2.8-2 1.8-2.3"/>',
  cook:   '<path d="M12 3c.8 2.6 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2 1-3.4 2.2-4.3.1 1.8.9 2.8 2 3.1-.5-2.6-.6-5 .3-7.8z"/>'
};
for (const sid of ["server", "sushi", "middle", "cook"]) {
  const st = S1[sid]; if (!st) continue;
  KINDS["s1" + sid] = { cfg: st, group: "store1", title: `Store #1 ${st.name}`, pick: st.name, pko: `${st.ko} 파트`, icon: S1_ICONS[sid],
    hist: `Store #1 ${st.name} Checks`, order: `Store #1 ${st.name} Order`, sql: "007_store1_checks.sql", key: `s1${sid}-draft` };
}
const GROUPS = { store1: { title: "Store #1 Inventory", hint: "Pick your station. 오늘 담당 파트를 고르세요." }, store2: { title: "Store #2", hint: "Pick the check. 체크 종류를 고르세요." } };
for (const k in KINDS) TS[k] = { view: "form", draft: null, list: null, detail: null, detailId: null, last: null, notSetUp: false, confirmDelete: false, deleteErr: "" };
let K = "store2", S2, S2_ITEMS, T;
function useKind(k) { K = k; S2 = KINDS[k].cfg || { sections: [], extra: null }; S2_ITEMS = S2.sections.flatMap(s => s.items); T = TS[k]; }
useKind("store2");
const LEVEL_NAME = { urgent: "URGENT", order: "ORDER", low: "LOW", ok: "SAFE", none: "", request: "REQUEST" };
function s2Draft() {
  if (!T.draft) { try { T.draft = JSON.parse(store.get(KINDS[K].key) || "null"); } catch (e) {} }
  if (!T.draft || T.draft.v !== 2) T.draft = { v: 2, short: {}, flags: {}, texts: {}, extra: null, extraText: "", name: (T.draft && T.draft.name) || "" };
  for (const f of ["counts", "choice", "det"]) if (!T.draft[f]) T.draft[f] = {};
  return T.draft;
}
const s2Save = () => store.set(KINDS[K].key, JSON.stringify(T.draft));
const isText = it => it.input === "text";
const isFlag = it => it.input === "flag";
const isCount = it => it.input === "count";
const hasVal = v => String(v ?? "").trim() !== "";
const cntNeed = (it, v) => !hasVal(v) ? 0 : toNum(v) <= 0 ? Math.max(Number(it.target) || 0, 0) : it.target != null ? Math.max(Math.round((Number(it.target) - toNum(v)) * 100) / 100, 0) : 0;
const cntLow = (it, v) => hasVal(v) && (toNum(v) <= 0 || (it.target != null && toNum(v) < Number(it.target)));
function cntRowUpdate(row, it, v) {
  row.classList.toggle("short", cntLow(it, v));
  const s = row.querySelector("[data-need]"); if (s) s.textContent = cntLow(it, v) && it.target != null ? ` · order ${fmtFrac(cntNeed(it, v))}` : "";
}
const isChoice = it => it.input === "choice";
const choiceIdx = (d, it) => d.choice[it.id] !== undefined ? d.choice[it.id] : 0;
const unitLabel = it => it.unit ? `${it.unit}${it.unitKo ? " (" + it.unitKo + ")" : ""}` : "";
const s2Step = it => { if (Number(it.step) > 0) return Number(it.step); const t = Number(it.target); return t > 0 && t < 1 ? t : (t % 1 ? 0.5 : 1); };
const s2Short = (d, it) => Math.min(toNum(d.short[it.id] || 0), Number(it.target) || Infinity);
const s2Missing = d => S2_ITEMS.filter(it => (isText(it) && !(d.texts[it.id] || "").trim()) || (isCount(it) && String(d.counts[it.id] ?? "").trim() === ""));
const s2ShortCount = d => S2_ITEMS.filter(it =>
  isFlag(it) ? !!d.flags[it.id] :
  isCount(it) ? cntLow(it, d.counts[it.id]) :
  isChoice(it) ? ((it.options[choiceIdx(d, it)] || {}).level || "ok") !== "ok" :
  isText(it) ? false : s2Short(d, it) > 0).length;
const statusText = o => (o.status || "").split(" / ")[0] || LEVEL_NAME[o.level] || "";
const isNone = s => /^(none|no|nothing|n\/a|없음|없어요|없습니다|x|-)[.!]?$/i.test(String(s).trim());
/* show 0.33 as 1/3, 0.75 as 3/4 … halves stay as 0.5 / 1.5 */
const FRACS = [[1 / 3, "1/3"], [2 / 3, "2/3"], [1 / 4, "1/4"], [3 / 4, "3/4"], [1 / 5, "1/5"], [2 / 5, "2/5"]];
function fmtFrac(n) {
  n = Number(n); if (!isFinite(n)) return "?";
  const w = Math.floor(n + 1e-9), f = n - w;
  if (f < 0.01) return String(w);
  for (const [v, s] of FRACS) if (Math.abs(f - v) < 0.02) return w ? `${w} ${s}` : s;
  return fmt(n);
}
const fmtQty = (n, it) => `${fmtFrac(n)} ${it.unit || ""}${it.unitKo ? " (" + it.unitKo + ")" : ""}`.trim();

function s2Answers(d) {
  return S2_ITEMS.map(it => {
    const base = { id: it.id, name: it.name, ko: it.ko };
    if (isText(it)) { const t = (d.texts[it.id] || "").trim(); return { ...base, choice: t, level: !t ? "none" : isNone(t) ? "ok" : "request", text: true }; }
    if (isCount(it)) { const raw = String(d.counts[it.id] ?? "").trim(), c = raw === "" ? null : Math.round(parseFloat(raw.replace(",", ".")) * 100) / 100;
      const u = `${it.unit}${it.unitKo ? " (" + it.unitKo + ")" : ""}`, t = it.target != null ? Number(it.target) : null;
      const need = c == null ? 0 : cntNeed(it, c), lvl = c == null ? "none" : c <= 0 ? "urgent" : t != null && c < t ? "order" : "ok";
      return { ...base, count: c, target: t, need: lvl === "ok" || lvl === "none" ? null : need, unit: it.unit, unitKo: it.unitKo,
        choice: c == null ? "" : `${fmtFrac(c)} ${u}${t != null ? ` / target ${fmtFrac(t)}` : ""}`, level: lvl }; }
    if (isChoice(it)) { const o = it.options[choiceIdx(d, it)] || {}; return { ...base, choice: o.label || "", status: o.status || "", level: o.level || "ok" }; }
    if (isFlag(it)) { const on = !!d.flags[it.id]; return { ...base, choice: on ? "Need to order / 주문 필요" : "Enough / 충분함", level: on ? "order" : "ok", flag: true }; }
    const s = s2Short(d, it), t = Number(it.target);
    const level = s <= 0 ? "ok" : s >= t ? "urgent" : "order";
    return { ...base, short: s, target: t, unit: it.unit, unitKo: it.unitKo,
      choice: s <= 0 ? `Full · target ${fmtQty(t, it)}` : s >= t ? `OUT · short ${fmtQty(s, it)} (target ${fmtFrac(t)})` : `Short ${fmtQty(s, it)} (target ${fmtFrac(t)})`, level };
  });
}

function renderStore2() {
  setMode("store2"); renderModeHeader();
  const el = $("s2Body");
  if (T.notSetUp) { el.innerHTML = `<div class="banner">This check isn't set up yet. Run <b>supabase/${esc(KINDS[K].sql)}</b> in Supabase once (see README).</div>`; $("s2bar").hidden = true; return; }
  if (T.view === "form") return renderS2Form(el);
  if (T.view === "history") return renderS2History(el);
  return renderS2Detail(el);
}

function renderS2Form(el) {
  const d = s2Draft();
  el.innerHTML = `<div class="who"><label for="s2Name">Checked by</label>
      <input id="s2Name" type="text" autocomplete="name" autocapitalize="words" maxlength="40" placeholder="Your name" value="${esc(d.name)}" enterkeyhint="done"></div>
    <p class="hint">Enter how much is short compared to the target. Leave 0 if it's full. 기준보다 부족한 수량만 입력하세요.${KINDS[K].group === "store1" ? " 상태 항목은 칩을 탭해서 고르세요." : ""}</p>
    ${S2.sections.map(sec => `<section class="s2sec"><h2>${esc(sec.en)} <small>${esc(sec.ko)}</small></h2>
      ${sec.note ? `<p class="secnote">${esc(sec.note)}</p>` : ""}
      <ul class="list s2list">${sec.items.map(it => s2Row(it, d)).join("")}</ul></section>`).join("")}
    ${S2.extra ? `<section class="s2sec s2extra" id="s2-extra"><h2>${esc(S2.extra.title)} <small>${esc(S2.extra.ko)}</small></h2>
      ${S2.extra.help ? `<p class="secnote">${esc(S2.extra.help)}</p>` : ""}
      <div class="s2item" id="s2-extra-q"><div class="iname">${esc(S2.extra.question)}</div>
        <div class="yn"><button type="button" class="opt lv-ok" role="radio" aria-checked="${d.extra === "no"}" data-extra="no"><span class="dot"></span><span>No</span><span></span></button>
        <button type="button" class="opt lv-order" role="radio" aria-checked="${d.extra === "yes"}" data-extra="yes"><span class="dot"></span><span>Yes</span><span></span></button></div>
        ${d.extra === "yes" ? (S2.extra.details ? s2DetailsHtml(d) : `<textarea id="s2ExtraText" placeholder="What needs to be bought or replaced? 예: 마커 2개, 테이프">${esc(d.extraText)}</textarea>`) : ""}
      </div></section>` : ""}
    <div class="linkrow"><button type="button" class="hist-btn" data-s2hist>${svg('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/>')}Past checks</button></div>`;
  s2UpdateBar();
}
const REASONS = [["Broken", "파손"], ["Lost", "분실"], ["Low quantity", "수량부족"], ["Other", "기타"]];
function s2DetailsHtml(d) {
  const t = d.det || {};
  return `<div class="det">
    <div class="field"><label for="detItem">Item needed / 필요한 물품</label><input id="detItem" data-det="item" value="${esc(t.item || "")}" autocomplete="off"></div>
    <div class="field"><label for="detQty">Quantity needed / 필요 수량</label><input id="detQty" data-det="qty" value="${esc(t.qty || "")}" autocomplete="off"></div>
    <div class="field"><label>Reason / 사유</label><div class="chips2">${REASONS.map(([en, ko]) => `<button type="button" class="chip2 lv-order" role="radio" aria-checked="${t.reason === en}" data-reason="${en}"><span class="dot"></span><span>${en} / ${ko}</span></button>`).join("")}</div></div>
    <div class="field"><label for="detDesc">Description (optional) / 설명</label><input id="detDesc" data-det="desc" value="${esc(t.desc || "")}" autocomplete="off"></div>
  </div>`;
}
const detText = t => [t.item && `Item: ${t.item}`, t.qty && `Quantity: ${t.qty}`, t.reason && `Reason: ${t.reason}`, t.desc && `Note: ${t.desc}`].filter(Boolean).join("\n");
function s2Row(it, d) {
  const name = `<div class="name">${esc(it.name)}${it.ko ? `<small>${esc(it.ko)}</small>` : ""}</div>`;
  const note = it.note ? `<div class="s2note">${isText(it) ? "" : "※ "}${esc(it.note).replace(/\n/g, "<br>")}</div>` : "";
  if (isChoice(it)) { const sel = choiceIdx(d, it), lv = (it.options[sel] || {}).level || "ok";
    return `<li class="row s2row s2choicerow${lv !== "ok" ? " short" : ""}" id="s2-${esc(it.id)}">${name}${note}
      <div class="chips2" role="radiogroup" aria-label="${esc(it.name)}">${it.options.map((o, k) => `<button type="button" class="chip2 lv-${esc(o.level)}" role="radio" aria-checked="${k === sel}" data-ch="${esc(it.id)}" data-k="${k}"><span class="dot"></span><span>${esc(o.label)}</span></button>`).join("")}</div></li>`; }
  if (isCount(it)) { const v = d.counts[it.id] ?? "";
    const low = cntLow(it, v), u = `${esc(it.unit)}${it.unitKo ? " (" + esc(it.unitKo) + ")" : ""}`;
    return `<li class="row s2row${low ? " short" : ""}" id="s2-${esc(it.id)}" data-cid="${esc(it.id)}">${name}
      <div class="tgt num"><span>${it.target != null ? `Target <b>${esc(fmtFrac(Number(it.target)))}</b> ${u}` : `Count in <b>${esc(it.unit)}</b>${it.unitKo ? " (" + esc(it.unitKo) + ")" : ""}`}<span class="sfr" data-need>${low && it.target != null ? ` · order ${esc(fmtFrac(cntNeed(it, v)))}` : ""}</span></span></div>${note}
      <div class="step">
        <button type="button" data-cnt="minus" aria-label="Less ${esc(it.name)}">−</button>
        <input type="number" inputmode="decimal" step="any" min="0" value="${esc(v)}" placeholder="–" data-count="${esc(it.id)}" aria-label="${esc(it.name)} on hand (${esc(it.unit)})">
        <button type="button" data-cnt="plus" aria-label="More ${esc(it.name)}">+</button>
      </div></li>`; }
  if (isText(it)) return `<li class="row s2row s2textrow" id="s2-${esc(it.id)}">${name}${note}
      <textarea class="s2text" data-text="${esc(it.id)}" rows="2" placeholder="Write here, or “None / 없음”" aria-label="${esc(it.name)}">${esc(d.texts[it.id] || "")}</textarea></li>`;
  if (isFlag(it)) { const on = !!d.flags[it.id];
    return `<li class="row s2row${on ? " short" : ""}" id="s2-${esc(it.id)}">${name}<div class="tgt">Count not needed</div>${note}
      <div class="step"><button type="button" class="flagbtn" role="switch" aria-checked="${on}" data-flag="${esc(it.id)}">${on ? "Need to order" : "Enough"}</button></div></li>`; }
  const v = d.short[it.id] !== undefined ? d.short[it.id] : "0";
  return `<li class="row s2row${toNum(v) > 0 ? " short" : ""}" id="s2-${esc(it.id)}" data-id="${esc(it.id)}">${name}
      <div class="tgt num"><span>Target <b>${fmtFrac(it.target)}</b> ${esc(unitLabel(it))}</span><span class="sfr">${s2FracHint(v)}</span></div>${note}
      <div class="step">
        <button type="button" data-s2act="minus" aria-label="Less ${esc(it.name)}">−</button>
        <input type="number" inputmode="${Number(it.step) === 1 ? "numeric" : "decimal"}" step="${Number(it.step) === 1 ? "1" : "any"}" min="0" value="${esc(v)}" data-short="${esc(it.id)}" aria-label="${esc(it.name)} short by (${esc(it.unit || "")})">
        <button type="button" data-s2act="plus" aria-label="More ${esc(it.name)}">+</button>
      </div></li>`;
}
function s2UpdateBar() {
  const d = s2Draft(), n = s2ShortCount(d);
  $("s2Submit").textContent = `Submit check${n ? ` (${n} short)` : ""}`;
  const pill = $("s2Pill"); if (pill) { pill.textContent = n ? `${n} short` : "All full"; pill.classList.toggle("warn", !!n); pill.classList.remove("mute"); }
}
function s2FracHint(v) { const n = toNum(v); return n > 0 && fmtFrac(n) !== fmt(n) ? `short ${fmtFrac(n)}` : ""; }
function s2SetShort(row, val) {
  const it = S2_ITEMS.find(x => x.id === row.dataset.id); if (!it) return;
  const d = s2Draft(); d.short[it.id] = val; s2Save();
  const inp = row.querySelector("input"); if (inp.value !== val) inp.value = val;
  row.classList.toggle("short", toNum(val) > 0); row.querySelector(".sfr").textContent = s2FracHint(val); s2UpdateBar();
}

$("s2Body").addEventListener("click", e => {
  const cb = e.target.closest("[data-cnt]");
  if (cb) {
    const row = cb.closest(".row"), it = S2_ITEMS.find(x => x.id === row.dataset.cid); if (!it) return;
    const inp = row.querySelector("input"), st = Number(it.step) || 1;
    const cur = inp.value.trim() === "" ? (cb.dataset.cnt === "plus" ? 0 : 0) : toNum(inp.value);
    const next = cb.dataset.cnt === "plus" ? cur + st : Math.max(0, cur - st);
    const v = String(Math.round(next * 100) / 100);
    inp.value = v; const d = s2Draft(); d.counts[it.id] = v; s2Save();
    cntRowUpdate(row, it, v); row.classList.remove("missing"); s2UpdateBar(); return;
  }
  const ch = e.target.closest("[data-ch]");
  if (ch) {
    const d = s2Draft(), it = S2_ITEMS.find(x => x.id === ch.dataset.ch); d.choice[ch.dataset.ch] = Number(ch.dataset.k); s2Save();
    ch.parentElement.querySelectorAll(".chip2").forEach(b => b.setAttribute("aria-checked", b === ch ? "true" : "false"));
    ch.closest(".row").classList.toggle("short", ((it.options[Number(ch.dataset.k)] || {}).level || "ok") !== "ok"); s2UpdateBar(); return;
  }
  const sb = e.target.closest("[data-s2act]");
  if (sb) {
    const row = sb.closest(".row"), it = S2_ITEMS.find(x => x.id === row.dataset.id); if (!it) return;
    const st = s2Step(it), cur = toNum(row.querySelector("input").value), t = Number(it.target);
    let next = sb.dataset.s2act === "plus" ? cur + st : Math.max(0, cur - st);
    next = Math.min(Math.round(next * 100) / 100, t);
    s2SetShort(row, String(next)); return;
  }
  const fb = e.target.closest("[data-flag]");
  if (fb) {
    const d = s2Draft(), id = fb.dataset.flag; d.flags[id] = !d.flags[id]; s2Save();
    fb.setAttribute("aria-checked", d.flags[id] ? "true" : "false"); fb.textContent = d.flags[id] ? "Need to order" : "Enough";
    fb.closest(".row").classList.toggle("short", !!d.flags[id]); s2UpdateBar(); return;
  }
  const rb = e.target.closest("[data-reason]");
  if (rb) { const d = s2Draft(); d.det.reason = rb.dataset.reason; s2Save(); rb.parentElement.querySelectorAll(".chip2").forEach(b => b.setAttribute("aria-checked", b === rb ? "true" : "false")); return; }
  const x = e.target.closest("[data-extra]");
  if (x) { const d = s2Draft(); d.extra = x.dataset.extra; s2Save(); renderS2Form($("s2Body")); const t = $("s2ExtraText"); if (t) t.focus(); return; }
  if (e.target.closest("[data-s2hist]")) { location.hash = K + "-history"; return; }
  if (e.target.closest("[data-s2new]")) { T.view = "form"; location.hash = K; renderStore2(); window.scrollTo(0, 0); return; }
  if (e.target.closest("[data-s2home]")) { location.hash = "home"; return; }
  const c = e.target.closest("[data-s2check]"); if (c) { T.detailId = Number(c.dataset.s2check); T.detail = null; T.view = "detail"; T.confirmDelete = false; renderStore2(); window.scrollTo(0, 0); return; }
  if (e.target.closest("[data-s2copy]")) { s2Copy(T.detail); return; }
  if (e.target.closest("[data-s2del]")) { T.confirmDelete = true; T.deleteErr = ""; renderStore2(); return; }
  if (e.target.closest("[data-s2del-cancel]")) { T.confirmDelete = false; renderStore2(); }
});
$("s2Body").addEventListener("input", e => {
  const d = s2Draft();
  if (e.target.id === "s2Name") { d.name = e.target.value; s2Save(); if (d.name.trim()) e.target.closest(".who").classList.remove("need"); }
  if (e.target.id === "s2ExtraText") { d.extraText = e.target.value; s2Save(); }
  if (e.target.dataset && e.target.dataset.count) {
    d.counts[e.target.dataset.count] = e.target.value; s2Save();
    const r = e.target.closest(".row"); cntRowUpdate(r, S2_ITEMS.find(x => x.id === e.target.dataset.count), e.target.value);
    if (e.target.value.trim() !== "") r.classList.remove("missing"); s2UpdateBar();
  }
  if (e.target.dataset && e.target.dataset.det) { d.det[e.target.dataset.det] = e.target.value; s2Save(); }
  if (e.target.dataset && e.target.dataset.short) {
    d.short[e.target.dataset.short] = e.target.value; s2Save();
    const r = e.target.closest(".row"); r.classList.toggle("short", toNum(e.target.value) > 0); r.querySelector(".sfr").textContent = s2FracHint(e.target.value); s2UpdateBar();
  }
  if (e.target.dataset && e.target.dataset.text) {
    d.texts[e.target.dataset.text] = e.target.value; s2Save();
    if (e.target.value.trim()) e.target.closest(".row").classList.remove("missing");
  }
});
$("s2Body").addEventListener("focusin", e => { if (e.target.dataset && (e.target.dataset.short || e.target.dataset.count)) setTimeout(() => { try { e.target.select(); } catch (_) {} }, 0); });
$("s2Body").addEventListener("focusout", e => {
  if (!(e.target.dataset && e.target.dataset.short)) return;
  const row = e.target.closest(".row"), it = S2_ITEMS.find(x => x.id === row.dataset.id);
  let v = e.target.value.trim() === "" ? 0 : toNum(e.target.value);
  if (it && Number(it.step) === 1 && v % 1) { v = Math.ceil(v); toast(`Whole ${it.unit || "units"} only. Rounded up to ${v}.`); }
  if (it && v > Number(it.target)) { v = Number(it.target); toast(`Short can't be more than the target (${fmtFrac(it.target)}). It's set to ${fmtFrac(v)} = OUT.`); }
  s2SetShort(row, String(v));
});
$("s2Body").addEventListener("keydown", e => {
  if (e.target.id === "s2Name" && e.key === "Enter") { e.preventDefault(); e.target.blur(); return; }
  if (e.key === "Enter" && e.target.dataset && (e.target.dataset.short || e.target.dataset.count)) {
    e.preventDefault();
    const inputs = [...$("s2Body").querySelectorAll("input[data-short], input[data-count]")]; const i = inputs.indexOf(e.target);
    if (inputs[i + 1]) inputs[i + 1].focus(); else e.target.blur();
  }
});

/* Order button: copyable order list from what is entered right now (before submitting) */
$("s2Order").addEventListener("click", () => {
  const d = s2Draft();
  const ex = d.extra === "yes" ? (S2.extra && S2.extra.details ? detText(d.det) : d.extraText.trim()) : null;
  s2Copy({ check_date: current, checked_by: d.name.trim(), answers: s2Answers(d), extra_request: ex || null }, "not submitted yet");
});
$("s2Submit").addEventListener("click", async () => {
  const d = s2Draft();
  if (!d.name.trim()) { const n = $("s2Name"); n.closest(".who").classList.add("need"); window.scrollTo({ top: 0, behavior: "smooth" }); n.focus(); toast("Enter your name first. 이름을 먼저 적어주세요.", true); return; }
  const missing = s2Missing(d);
  if (missing.length) {
    missing.forEach(it => { const c = $("s2-" + it.id); if (c) c.classList.add("missing"); });
    $("s2-" + missing[0].id).scrollIntoView({ behavior: "smooth", block: "center" });
    const nc = missing.filter(isCount).length, nt = missing.length - nc;
    toast(nc ? `Enter a count for ${nc} item${nc > 1 ? "s" : ""}${nt ? ` and fill in ${nt} written item${nt > 1 ? "s" : ""}` : ""}. Enter 0 if there is none.` : `Fill in ${nt} written item${nt > 1 ? "s" : ""} (write “None” if nothing is needed).`, true); return;
  }
  if (S2.extra && !d.extra) { $("s2-extra-q").classList.add("missing"); $("s2-extra").scrollIntoView({ behavior: "smooth", block: "start" }); toast("Answer the last question (Yes / No).", true); return; }
  if (S2.extra && S2.extra.details && d.extra === "yes") {
    if (!(d.det.item || "").trim()) { const t = $("detItem"); if (t) t.focus(); toast("Write the item needed, or choose No.", true); return; }
    d.extraText = detText(d.det);
  }
  if (d.extra === "yes" && !d.extraText.trim()) { const t = $("s2ExtraText"); if (t) t.focus(); toast("Write what needs to be ordered, or choose No.", true); return; }
  const btn = $("s2Submit"); btn.disabled = true; btn.textContent = "Submitting…";
  const answers = s2Answers(d);
  try {
    const id = await rpc("save_store_check", { p_pin: S.pin, p_store: K, p_date: current, p_name: d.name.trim(), p_answers: answers, p_extra: d.extra === "yes" ? d.extraText.trim() : null });
    T.detail = { id, check_date: current, checked_by: d.name.trim(), answers, extra_request: d.extra === "yes" ? d.extraText.trim() : null, created_at: new Date().toISOString() };
    T.detailId = id; T.list = null; T.last = T.detail;
    T.draft = { v: 2, short: {}, flags: {}, texts: {}, counts: {}, choice: {}, det: {}, extra: null, extraText: "", name: d.name }; s2Save();
    T.view = "detail"; T.justSubmitted = true; location.hash = K + "-history"; T.view = "detail"; renderStore2(); window.scrollTo(0, 0);
    toast("Check submitted. 제출 완료!");
  } catch (e) {
    if (handlePinError(e)) return;
    if (missingFn(e, "save_store_check") || /invalid_store/.test(e.message)) { T.notSetUp = true; renderStore2(); }
    else toast(e.code === "network" ? "No internet. Your answers are kept on this device. Try again when online." : "Couldn't submit. Your answers are kept. Try again.", true);
  } finally { btn.disabled = false; s2UpdateBar(); }
});

function s2Groups(answers) {
  const by = l => (answers || []).filter(a => a.level === l);
  return [["urgent", "Out / Urgent", by("urgent")], ["order", "Short / Order", by("order")], ["request", "Written requests", by("request")], ["low", "Low", by("low")]];
}
function s2Copy(c, note) {
  if (!c) return;
  const day = String(c.check_date).slice(0, 10);
  const d = parseKey(day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  let n = 0; const parts = [`${KINDS[K].order} - ${d}`, ""];
  for (const [, title, list] of s2Groups(c.answers)) {
    if (!list.length) continue;
    parts.push(title.toUpperCase());
    list.forEach(a => parts.push(`${++n}. ${a.name}${a.ko ? " / " + a.ko : ""}`, `   → ${a.count != null ? (a.need ? `${fmtFrac(a.need)} ${a.unit || ""}${a.unitKo ? " (" + a.unitKo + ")" : ""} (have ${fmtFrac(a.count)})` : `Out (0 ${a.unit || ""} left)`) : a.short != null ? `${fmtFrac(a.short)} ${a.unit || ""}${a.unitKo ? " (" + a.unitKo + ")" : ""}`.trim() : a.flag ? "Need to order" : a.choice}`));
    parts.push("");
  }
  if (c.extra_request) { parts.push("OTHER"); parts.push(c.extra_request); parts.push(""); }
  if (!n && !c.extra_request) { toast(note ? "Nothing is short. Enter shortages first." : "Nothing needs ordering in this check.", true); return; }
  parts.push(`Total: ${n} item${n === 1 ? "" : "s"}${c.extra_request ? " + other request" : ""}`, "", "Thank you!");
  showTextSheet("Order list", parts.join("\n"), `${n} item${n === 1 ? "" : "s"} · ${longDate(day)}${c.checked_by ? " · checked by " + c.checked_by : ""}${note ? " · " + note : ""}. You can edit the text before copying.`);
}

async function renderS2History(el) {
  try {
    if (!T.list) {
      el.innerHTML = `<div class="empty">Loading…</div>`;
      T.list = await rpc("list_store_checks", { p_pin: S.pin, p_store: K, p_limit: 200 }) || [];
      if (T.view !== "history") return;
    }
    if (!T.list.length) { el.innerHTML = `<div class="empty"><b>No checks yet</b>Submitted checks will show up here.</div><div class="linkrow"><button type="button" class="hist-btn" data-s2new>Start a check</button></div>`; return; }
    el.innerHTML = `<div class="sectitle"><h2>All checks</h2><span class="num">${T.list.length}</span></div>
      <ul class="list">${T.list.map(c => { const k = String(c.check_date).slice(0, 10);
        return `<li><button class="daybtn" type="button" data-s2check="${c.id}"><span><span class="d">${esc(longDate(k))}</span><br>
          <span class="s">${esc(weekday(k))} · ${esc(timeOf(c.created_at))} · ${esc(c.checked_by)}</span></span>
          <span class="chips">${c.urgent_count ? `<span class="chip lv-urgent">${c.urgent_count}</span>` : ""}${c.order_count ? `<span class="chip lv-order">${c.order_count}</span>` : ""}${c.low_count ? `<span class="chip lv-low">${c.low_count}</span>` : ""}${!c.urgent_count && !c.order_count && !c.low_count ? `<span class="chip lv-ok">All safe</span>` : ""}</span></button></li>`; }).join("")}</ul>
      <p class="hint">Red = urgent, orange = order, yellow = low.</p>`;
  } catch (e) {
    if (handlePinError(e)) return;
    if (missingFn(e, "store_check")) { T.notSetUp = true; renderStore2(); return; }
    el.innerHTML = `<div class="empty"><b>Couldn't load</b>${esc(errorText(e, "load checks"))}</div>`;
  }
}

async function renderS2Detail(el) {
  try {
    if (!T.detail || T.detail.id !== T.detailId) {
      el.innerHTML = `<div class="empty">Loading…</div>`;
      const rows = await rpc("get_store_check", { p_pin: S.pin, p_id: T.detailId }) || [];
      T.detail = rows[0] || null; renderModeHeader();
      if (!T.detail) { el.innerHTML = `<div class="empty">This check was deleted.</div>`; return; }
    }
    const c = T.detail, groups = s2Groups(c.answers);
    const cnt = Object.fromEntries(groups.map(([l, , list]) => [l, list.length]));
    const any = cnt.urgent || cnt.order || cnt.request || cnt.low || c.extra_request;
    el.innerHTML = `<div class="sumhead">
        <span class="sumtitle">${T.justSubmitted ? "Submitted ✓" : "Checked by " + esc(c.checked_by)}</span>
        <span class="tm">${esc(longDate(String(c.check_date).slice(0, 10)))} · ${esc(timeOf(c.created_at))}${T.justSubmitted ? " · " + esc(c.checked_by) : ""}</span>
        <span class="chips"><span class="chip lv-urgent">${cnt.urgent} urgent</span><span class="chip lv-order">${cnt.order} order</span>${cnt.request ? `<span class="chip lv-request">${cnt.request} request${cnt.request > 1 ? "s" : ""}</span>` : ""}<span class="chip lv-low">${cnt.low} low</span></span>
      </div>
      ${groups.map(([lv, title, list]) => list.length ? `<div class="sumgroup"><h3><span class="chip lv-${lv}">${esc(title)}</span></h3>
        <ul class="sumlist">${list.map(a => `<li class="lv-${lv}"><span class="dot"></span><span><span class="n">${esc(a.name)}${a.ko ? ` <span class="k">${esc(a.ko)}</span>` : ""}</span><span class="c" style="white-space:pre-wrap">${esc(a.choice)}</span></span></li>`).join("")}</ul></div>` : "").join("")}
      ${c.extra_request ? `<div class="sumgroup"><h3><span class="chip lv-order">Other request</span></h3><ul class="sumlist"><li class="lv-order"><span class="dot"></span><span class="n" style="white-space:pre-wrap">${esc(c.extra_request)}</span></li></ul></div>` : ""}
      ${!any ? `<div class="sumgroup"><span class="chip lv-ok">Everything is safe</span></div>` : ""}
      <div class="actrow">
        ${any ? `<button type="button" class="primary-wide" data-s2copy>Copy order list</button>` : ""}
        ${T.justSubmitted ? `<button type="button" class="btn" data-s2home>Back to Home</button>` : ""}
      </div>
      <details class="allitems"><summary>All ${(c.answers || []).length} items</summary>
        <ul class="sumlist">${(c.answers || []).map(a => `<li class="lv-${esc(a.level)}"><span class="dot"></span><span><span class="n">${esc(a.name)}</span><span class="c">${esc(a.choice)}</span></span></li>`).join("")}</ul></details>
      ${T.justSubmitted ? "" : T.confirmDelete ? `<form class="danger-box" id="s2DeleteForm" novalidate>
          <p><b>Delete this check?</b><br>This can't be undone.</p>
          ${S.adminPin ? "" : `<label for="s2DelPin">Manager PIN</label><input id="s2DelPin" type="password" inputmode="numeric" autocomplete="off">`}
          ${T.deleteErr ? `<p class="err-msg">${esc(T.deleteErr)}</p>` : ""}
          <div class="actions"><button class="btn danger" type="submit">Delete</button><button class="btn" type="button" data-s2del-cancel>Cancel</button></div></form>`
        : `<button class="btn delete-day" type="button" data-s2del>Delete this check</button>`}`;
  } catch (e) {
    if (handlePinError(e)) return;
    el.innerHTML = `<div class="empty"><b>Couldn't load</b>${esc(errorText(e, "load this check"))}</div>`;
  }
}
$("s2Body").addEventListener("submit", async e => {
  if (e.target.id !== "s2DeleteForm") return;
  e.preventDefault();
  const pin = S.adminPin || ($("s2DelPin") ? $("s2DelPin").value.trim() : "");
  if (!pin) { T.deleteErr = "Enter the manager PIN."; return renderStore2(); }
  try {
    await rpc("delete_store_check", { p_pin: pin, p_id: T.detailId });
    if (!S.adminPin) { S.adminPin = pin; store.set("inv-admin-pin", pin, true); }
    toast("Check deleted."); T.list = null; T.detail = null; T.confirmDelete = false; T.view = "history";
    if (T.last && T.last.id === T.detailId) T.last = null;
  } catch (err) {
    if (err.code === "invalid_pin") { if (S.adminPin) { S.adminPin = ""; store.del("inv-admin-pin", true); } T.deleteErr = "Wrong manager PIN."; }
    else T.deleteErr = errorText(err, "delete this check");
  }
  renderStore2();
});
async function loadS2Last() {
  for (const k in KINDS) {
    try { const r = await rpc("list_store_checks", { p_pin: S.pin, p_store: k, p_limit: 1 }) || []; TS[k].last = r[0] || null; TS[k].notSetUp = false; TS[k].lastLoaded = true; }
    catch (e) { if (handlePinError(e)) return; if (missingFn(e, "store_check")) TS[k].notSetUp = true; }
  }
  if (S.mode === "home") renderHome();
}
function renderStore2Pick() {
  setMode("store2"); renderModeHeader();
  const due = weeklyDue(), g = S.s2pick;
  $("s2Body").innerHTML = `<p class="hint" style="margin-top:14px">${esc(GROUPS[g].hint)}</p>
    <div class="pick-grid">${Object.entries(KINDS).filter(([, v]) => v.group === g).map(([k, v]) => { const L = TS[k].last; const n = (v.cfg ? v.cfg.sections.flatMap(s => s.items).length : 0);
      return `<button type="button" class="tile role-btn pick-${k}" data-pick="${k}">
        <span class="ic" aria-hidden="true">${svg(v.icon)}</span>
        <span class="tt">${esc(v.pick)}${k === "store2w" && due ? ' <span class="due">Due today</span>' : ""}</span>
        <span class="ts">${esc(v.pko)} · ${n} items</span>
        <span class="meter"><span class="st">${L ? `Last: ${esc(shortDate(String(L.check_date).slice(0, 10)))} · ${esc(L.checked_by)}` : k === "store2w" ? "Once a week · Saturday" : g === "store1" ? "Station inventory" : "Regular check"}</span></span>
        <span class="go" aria-hidden="true">${GO_ICON}</span></button>`; }).join("")}</div>`;
}
$("s2Body").addEventListener("click", e => { const b = e.target.closest("[data-pick]"); if (b) location.hash = b.dataset.pick; });
function weeklyDue() {
  const t = TS.store2w; if (!t.lastLoaded) return false;
  const today = parseKey(current);
  if (today.getDay() !== 6) return false;                    /* Saturday */
  if (!t.last) return true;
  const last = parseKey(String(t.last.check_date).slice(0, 10));
  return (today - last) / 86400000 >= 6;                     /* nothing in the last 6 days */
}

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
  if (h === "store2-pick" || h === "store1-pick") {
    S.s2pick = h.slice(0, 6); renderStore2Pick(); window.scrollTo(0, 0);
    loadS2Last().then(() => { if (S.s2pick && S.mode === "store2") renderStore2Pick(); });
    return;
  }
  S.s2pick = false;
  const kk = h.replace(/-history$/, "");
  if (KINDS[kk]) {
    useKind(kk);
    if (h === K + "-history") { if (T.view !== "detail" || !T.justSubmitted) { T.view = "history"; T.list = null; } }
    else { T.view = "form"; T.justSubmitted = false; }
    renderStore2(); window.scrollTo(0, 0);
    return;
  }
  for (const k in TS) TS[k].justSubmitted = false;
  setMode("home"); renderHome(); window.scrollTo(0, 0);
  loadClosingDay(true); loadS2Last();
}
window.addEventListener("hashchange", route);
$("homeBtn").addEventListener("click", () => {
  if (S.mode === "closing" && C.view !== "roles") location.hash = "closing";
  else if (S.mode === "store2" && !S.s2pick && T.view === "detail" && !T.justSubmitted) { T.view = "history"; renderStore2(); window.scrollTo(0, 0); }
  else if (S.mode === "store2" && !S.s2pick && !T.justSubmitted) location.hash = KINDS[K].group + "-pick";
  else location.hash = "home";
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
