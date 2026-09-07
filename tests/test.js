"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const { CONFIG, calculate, toInteger, saveState, loadState } = require(path.join(__dirname, "../script.js"));

function state(currentPoints, cards = {}, ceiling = CONFIG.ceiling, recipe = CONFIG.recipe) {
  return {
    currentPoints,
    cards: { plum: 0, bamboo: 0, pine: 0, fuji: 0, ...cards },
    ceiling,
    recipe: { ...recipe }
  };
}

const cases = [
  { name: "ケース1", input: state(0), expected: { baseForge: 1000, totalForge: 1000, resources: { charcoal: 700000, steel: 700000, coolant: 700000, whetstone: 700000 } } },
  { name: "ケース2", input: state(1850), expected: { baseForge: 630, totalForge: 630, resources: { charcoal: 441000, steel: 441000, coolant: 441000, whetstone: 441000 } } },
  { name: "ケース3", input: state(1850, { fuji: 10 }), expected: { cardPoints: 600, cardForgeCount: 10, noCardForge: 510, totalForge: 520, resources: { charcoal: 364000, steel: 364000, coolant: 364000, whetstone: 364000 } } },
  { name: "ケース4", input: state(1850, { fuji: 23 }), expected: { cardPoints: 1380, pointsAfterCards: 3230, remainingAfterCards: 1770, cardForgeCount: 23, noCardForge: 354, totalForge: 377, resources: { charcoal: 263900, steel: 263900, coolant: 263900, whetstone: 263900 } } },
  { name: "ケース5", input: state(4998), expected: { baseForge: 1, totalForge: 1, resources: { charcoal: 700, steel: 700, coolant: 700, whetstone: 700 } } },
  { name: "ケース6", input: state(5000), expected: { reached: true, totalForge: 0, resources: { charcoal: 0, steel: 0, coolant: 0, whetstone: 0 } } },
  { name: "ケース7", input: state(0, {}, 2500, { charcoal: 500, steel: 600, coolant: 700, whetstone: 800 }), expected: { totalForge: 500, resources: { charcoal: 250000, steel: 300000, coolant: 350000, whetstone: 400000 } } }
];

cases.push({
  name: "天井超過時の持ち越し",
  input: state(4500, { fuji: 18 }),
  expected: {
    cardPoints: 1080,
    pointsAfterCards: 5580,
    remainingAfterCards: 0,
    cardsReachCeiling: true,
    reachedCeilingCount: 1,
    carryoverPoints: 580,
    forgeDisplayCount: 0,
    cardForgeCount: 18,
    noCardForge: 0,
    totalForge: 18,
    resources: { charcoal: 12600, steel: 12600, coolant: 12600, whetstone: 12600 }
  }
});

for (const testCase of cases) {
  const actual = calculate(testCase.input);
  for (const [key, value] of Object.entries(testCase.expected)) assert.deepEqual(actual[key], value, `${testCase.name}: ${key}`);
  console.log(`PASS ${testCase.name}`);
}

assert.equal(toInteger(""), 0);
assert.equal(toInteger(-10), 0);
assert.equal(toInteger(12.9), 12);
assert.equal(toInteger("abc"), 0);
console.log("PASS 入力補正（空欄・負数・小数・非数値）");

const elements = Object.fromEntries([
  "currentPoints", "plumCount", "bambooCount", "pineCount", "fujiCount",
  "settingCeiling", "recipeCharcoal", "recipeSteel", "recipeCoolant", "recipeWhetstone"
].map((id) => [id, { value: "" }]));
global.document = { getElementById: (id) => elements[id] };
let stored = null;
global.localStorage = {
  setItem: (_key, value) => { stored = value; },
  getItem: () => stored
};
const savedState = state(1850, { plum: 1, bamboo: 2, pine: 3, fuji: 4 }, 5000, CONFIG.recipe);
saveState(savedState);
loadState();
assert.equal(Number(elements.currentPoints.value), 1850);
assert.equal(Number(elements.fujiCount.value), 4);
assert.equal(Number(elements.settingCeiling.value), 5000);
assert.equal(Number(elements.recipeWhetstone.value), 700);
global.localStorage = { setItem: () => { throw new Error("blocked"); }, getItem: () => { throw new Error("blocked"); } };
assert.doesNotThrow(() => saveState(savedState));
assert.doesNotThrow(() => loadState());
console.log("PASS LocalStorage保存・復元・利用不可時の継続");
