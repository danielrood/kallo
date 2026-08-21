import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  FIXTURE,
  LATER,
  FIXTURE_TURNS,
  createSession,
  hear,
  view,
  runThreeFixtures,
} = require("../js/reception.js");

function assertCard(shown, verb, when) {
  assert.equal(shown.who, "Priya Nair");
  assert.equal(shown.what, "Cut and blow dry");
  assert.equal(shown.when, when);
  assert.equal(shown.verb, verb);
  assert.equal(shown.confirm, undefined);
  assert.equal(shown.pending, undefined);
}

const session = createSession();
assertCard(view(session), "BOOKED", "Tuesday 2:30");

hear(session, FIXTURE_TURNS.book);
assertCard(view(session), "BOOKED", FIXTURE.when);
assert.equal(session.diary, undefined);
assert.equal(typeof session.thatsRight, "undefined");

hear(session, FIXTURE_TURNS.move);
assertCard(view(session), "MOVED", LATER);

hear(session, FIXTURE_TURNS.cancel);
assertCard(view(session), "CANCELLED", LATER);

const halfTwo = createSession();
hear(halfTwo, "Hi, can I book Priya Nair for a cut and blow dry on Tuesday at half two");
assertCard(view(halfTwo), "BOOKED", "Tuesday 2:30");

const thursday = createSession();
hear(thursday, "Can I move that to Thursday at four");
assertCard(view(thursday), "MOVED", "Thursday 4:00");
hear(thursday, "Cancel Priya's booking");
assertCard(view(thursday), "CANCELLED", "Thursday 4:00");

const cards = runThreeFixtures();
assert.equal(cards.length, 3);
assertCard(cards[0], "BOOKED", "Tuesday 2:30");
assertCard(cards[1], "MOVED", LATER);
assertCard(cards[2], "CANCELLED", LATER);

console.log("fixture evals passed");
