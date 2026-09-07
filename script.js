"use strict";

const CONFIG = Object.freeze({
  storageKey: "tourabu-tanto-ceiling-calculator-v1",
  ceiling: 5000,
  points: Object.freeze({ none: 5, plum: 10, bamboo: 15, pine: 20, fuji: 60 }),
  recipe: Object.freeze({ charcoal: 700, steel: 700, coolant: 700, whetstone: 700 })
});

const CARD_KEYS = ["plum", "bamboo", "pine", "fuji"];
const RESOURCE_LABELS = { charcoal: "木炭", steel: "玉鋼", coolant: "冷却材", whetstone: "砥石" };
const $ = (id) => document.getElementById(id);
const format = (value) => Math.max(0, value).toLocaleString("ja-JP");

function toInteger(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.floor(number));
}

function readState() {
  return {
    currentPoints: toInteger($("currentPoints").value),
    cards: Object.fromEntries(CARD_KEYS.map((key) => [key, toInteger($(key + "Count").value)])),
    ceiling: Math.max(1, toInteger($("settingCeiling").value, CONFIG.ceiling)),
    recipe: {
      charcoal: toInteger($("recipeCharcoal").value),
      steel: toInteger($("recipeSteel").value),
      coolant: toInteger($("recipeCoolant").value),
      whetstone: toInteger($("recipeWhetstone").value)
    }
  };
}

function calculate(state) {
  const reached = state.currentPoints >= state.ceiling;
  const remaining = Math.max(0, state.ceiling - state.currentPoints);
  const baseForge = reached ? 0 : Math.ceil(remaining / CONFIG.points.none);
  const enteredCardCount = CARD_KEYS.reduce((sum, key) => sum + state.cards[key], 0);
  const cardForgeCount = reached ? 0 : enteredCardCount;
  const cardPointsByType = Object.fromEntries(CARD_KEYS.map((key) => [key, state.cards[key] * CONFIG.points[key]]));
  const cardPoints = CARD_KEYS.reduce((sum, key) => sum + cardPointsByType[key], 0);
  const pointsAfterCards = state.currentPoints + cardPoints;
  const remainingAfterCards = Math.max(0, state.ceiling - pointsAfterCards);
  const noCardForge = reached ? 0 : Math.ceil(remainingAfterCards / CONFIG.points.none);
  const totalForge = reached ? 0 : cardForgeCount + noCardForge;
  const resources = Object.fromEntries(Object.entries(state.recipe).map(([key, value]) => [key, value * totalForge]));
  return { reached, remaining, baseForge, cardForgeCount, cardPointsByType, cardPoints, pointsAfterCards, remainingAfterCards, noCardForge, totalForge, resources };
}

function renderResources(state, result) {
  const values = Object.values(state.recipe);
  const allSame = values.every((value) => value === values[0]);
  $("recipeSummary").textContent = allSame ? `ALL${format(values[0])}` : "個別レシピ";
  $("resourceRecipeLabel").textContent = allSame ? `ALL${format(values[0])}で計算` : "個別レシピで計算";
  if (allSame) {
    $("resourceResult").className = "resource-result";
    $("resourceResult").innerHTML = `<span>各資源</span><strong>${format(result.resources.charcoal)}</strong>`;
    return;
  }
  $("resourceResult").className = "resource-result-list";
  $("resourceResult").innerHTML = Object.entries(result.resources)
    .map(([key, value]) => `<div><span>${RESOURCE_LABELS[key]}</span><strong>${format(value)}</strong></div>`).join("");
}

function renderNotices(state, result) {
  const messages = [];
  if (!result.reached && result.cardForgeCount > 0 && result.cardPoints >= result.remaining) {
    messages.push("入力した御札だけで天井へ到達可能です");
    if (result.cardPoints > result.remaining) messages.push("天井到達前に不要になる札が出る可能性があります");
  }
  $("noticeStack").innerHTML = messages.map((message) => `<p class="notice">${message}</p>`).join("");
}

function render(state, result) {
  $("ceilingSummary").textContent = `天井 ${format(state.ceiling)}P`;
  $("remainingPoints").textContent = `${format(result.remaining)}P`;
  $("baseForge").textContent = `${format(result.baseForge)}回`;
  $("baseForgeCompare").textContent = `${format(result.baseForge)}回`;
  $("totalForge").textContent = format(result.totalForge);
  $("cardForgeCount").textContent = `${format(result.cardForgeCount)}回`;
  $("noCardForge").textContent = `${format(result.noCardForge)}回`;
  $("cardPoints").textContent = `${format(result.cardPoints)}P`;
  $("pointsAfterCards").textContent = `${format(result.pointsAfterCards)}P`;
  $("remainingAfterCards").textContent = `${format(result.remainingAfterCards)}P`;
  $("reachedMessage").hidden = !result.reached;
  $("mainResult").hidden = result.reached;
  CARD_KEYS.forEach((key) => {
    const count = state.cards[key];
    $(key + "Batch").textContent = `十連${Math.floor(count / 10)}回＋単発${count % 10}回`;
  });
  renderResources(state, result);
  renderNotices(state, result);
}

function saveState(state) {
  try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state)); } catch (_) { /* 保存不可でも計算は継続 */ }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey));
    if (!saved || typeof saved !== "object") return;
    $("currentPoints").value = toInteger(saved.currentPoints);
    CARD_KEYS.forEach((key) => { $(key + "Count").value = toInteger(saved.cards && saved.cards[key]); });
    $("settingCeiling").value = Math.max(1, toInteger(saved.ceiling, CONFIG.ceiling));
    Object.keys(CONFIG.recipe).forEach((key) => {
      const id = "recipe" + key.charAt(0).toUpperCase() + key.slice(1);
      $(id).value = toInteger(saved.recipe && saved.recipe[key], CONFIG.recipe[key]);
    });
  } catch (_) { /* 壊れた保存データは無視 */ }
}

function update() {
  const state = readState();
  const result = calculate(state);
  render(state, result);
  saveState(state);
}

function normalizeInput(event) {
  const fallback = event.target.id === "settingCeiling" ? CONFIG.ceiling : 0;
  event.target.value = event.target.id === "settingCeiling" ? Math.max(1, toInteger(event.target.value, fallback)) : toInteger(event.target.value, fallback);
  update();
}

function resetSettings() {
  $("settingCeiling").value = CONFIG.ceiling;
  Object.entries(CONFIG.recipe).forEach(([key, value]) => {
    const id = "recipe" + key.charAt(0).toUpperCase() + key.slice(1);
    $(id).value = value;
  });
  update();
}

const PUBLIC_API = Object.freeze({ CONFIG, calculate, toInteger, saveState, loadState });
if (typeof window !== "undefined") window.TantoCalculator = PUBLIC_API;
if (typeof module !== "undefined" && module.exports) module.exports = PUBLIC_API;

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    loadState();
    document.querySelectorAll(".number-input").forEach((input) => {
      input.addEventListener("input", update);
      input.addEventListener("change", normalizeInput);
      input.addEventListener("blur", normalizeInput);
    });
    $("calculateButton").addEventListener("click", update);
    $("resetSettings").addEventListener("click", resetSettings);
    update();
  });
}
