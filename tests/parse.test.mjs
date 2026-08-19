import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  parseUtterance,
  mergeFacts,
  isComplete,
  missingFacts,
  askForMissing,
  emptyProfile,
} = require("../js/parse.js");

const locksmith = parseUtterance("Ashford Locksmiths, locksmith, 01632 960123");
assert.equal(locksmith.tradeId, "locksmith");
assert.match(locksmith.shopName, /Ashford/i);
assert.equal(locksmith.number, "01632 960123");
assert.equal(isComplete(locksmith), true);
assert.equal(locksmith.shopName.includes("Your shop"), false);

const garage = parseUtterance("Northgate Motors garage 07700 900447");
assert.equal(garage.tradeId, "garage");
assert.match(garage.number, /07700 900447/);
assert.equal(isComplete(garage), true);

const plumber = parseUtterance("Ridgeway Plumbing, plumber, +44 1632 960555");
assert.equal(plumber.tradeId, "plumber");
assert.equal(isComplete(plumber), true);

const tradeOnly = parseUtterance("I am a plumber");
assert.equal(tradeOnly.tradeId, "plumber");
assert.equal(tradeOnly.shopName, "");
assert.equal(tradeOnly.number, "");
assert.deepEqual(missingFacts(tradeOnly), ["shop name", "existing number"]);
assert.match(askForMissing(tradeOnly), /shop name/i);
assert.equal(tradeOnly.shopName, "");
assert.notEqual(tradeOnly.number, "Number on file");

const numberOnly = parseUtterance("01632 960123");
assert.equal(numberOnly.number, "01632 960123");
assert.equal(numberOnly.shopName, "");
assert.equal(numberOnly.tradeId, "");
assert.equal(isComplete(numberOnly), false);

const nameOnly = parseUtterance("Northgate Motors");
assert.match(nameOnly.shopName, /Northgate Motors/i);
assert.equal(nameOnly.tradeId, "");
assert.equal(nameOnly.number, "");
assert.equal(isComplete(nameOnly), false);

const empty = parseUtterance("hello there");
assert.equal(isComplete(empty), false);
assert.equal(empty.number, "");
assert.notEqual(empty.shopName, "Your shop");

let profile = emptyProfile();
profile = mergeFacts(profile, parseUtterance("Northgate Motors"));
assert.equal(isComplete(profile), false);
profile = mergeFacts(profile, parseUtterance("garage"));
assert.equal(isComplete(profile), false);
profile = mergeFacts(profile, parseUtterance("01632 960447"));
assert.equal(isComplete(profile), true);
assert.equal(profile.shopName, "Northgate Motors");
assert.equal(profile.tradeLabel, "garage");
assert.equal(profile.number, "01632 960447");

const invented = emptyProfile();
assert.equal(invented.shopName, "");
assert.equal(invented.number, "");
assert.equal(isComplete(invented), false);

console.log("parse tests passed");
