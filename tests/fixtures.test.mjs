import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  FIXTURE,
  LATER,
  FIXTURE_TURNS,
  createSession,
  hear,
  thatsRight,
  runThreeFixtures,
} = require("../js/reception.js");

function assertCard(card, verb, when) {
  assert.equal(card.who, "Priya Nair");
  assert.equal(card.when, when);
  assert.equal(card.verb, verb);
}

const session = createSession();
assertCard(session.card, "Booked", "Tuesday 2:30");
assert.equal(session.pending, true);

hear(session, FIXTURE_TURNS.book);
assertCard(session.card, "Booked", FIXTURE.when);
thatsRight(session);
assertCard(session.card, "Booked", "Tuesday 2:30");
assert.equal(session.pending, false);
assert.equal(session.diary, undefined);

hear(session, FIXTURE_TURNS.move);
assertCard(session.card, "Moved", LATER);
thatsRight(session);
assertCard(session.card, "Moved", "Thursday 4:00");

hear(session, FIXTURE_TURNS.cancel);
assertCard(session.card, "Cancelled", LATER);
thatsRight(session);
assertCard(session.card, "Cancelled", "Thursday 4:00");

const halfTwo = createSession();
hear(halfTwo, "Hi, can I book Priya Nair for a cut and blow dry on Tuesday at half two");
assertCard(halfTwo.card, "Booked", "Tuesday 2:30");

const thursday = createSession();
thatsRight(thursday);
hear(thursday, "Can I move that to Thursday at four");
assertCard(thursday.card, "Moved", "Thursday 4:00");
thatsRight(thursday);
hear(thursday, "Cancel Priya's booking");
assertCard(thursday.card, "Cancelled", "Thursday 4:00");

const cards = runThreeFixtures();
assert.equal(cards.length, 3);
assertCard(cards[0], "Booked", "Tuesday 2:30");
assertCard(cards[1], "Moved", LATER);
assertCard(cards[2], "Cancelled", LATER);

console.log("fixture evals passed");
