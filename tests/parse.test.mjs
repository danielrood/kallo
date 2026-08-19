import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parseUtterance } = require("../js/parse.js");

const locksmith = parseUtterance("Ashford Locksmiths, locksmith, 01632 960123");
assert.equal(locksmith.tradeId, "locksmith");
assert.match(locksmith.shopName, /Ashford/i);
assert.equal(locksmith.number, "01632 960123");

const garage = parseUtterance("Northgate Motors garage 07700 900447");
assert.equal(garage.tradeId, "garage");
assert.match(garage.number, /07700 900447/);

const plumber = parseUtterance("Ridgeway Plumbing, plumber, +44 1632 960555");
assert.equal(plumber.tradeId, "plumber");

console.log("parse tests passed");
