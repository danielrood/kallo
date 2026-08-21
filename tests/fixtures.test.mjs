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
  view,
  runThreeFixtures,
} = require("../js/reception.js");

function assertOpenCard(shown, verb, when) {
  assert.equal(shown.who, "Priya Nair");
  assert.equal(shown.when, when);
  assert.equal(shown.verb, verb);
  assert.equal(shown.confirm, "That's right");
  assert.equal(shown.pending, true);
}

function assertWritten(shown, verb, when) {
  assert.equal(shown.who, "Priya Nair");
  assert.equal(shown.when, when);
  assert.equal(shown.verb, verb);
  assert.equal(shown.confirm, "Written");
  assert.equal(shown.pending, false);
}

const session = createSession();
assertOpenCard(view(session), "BOOKED", "Tuesday 2:30");

hear(session, FIXTURE_TURNS.book);
assertOpenCard(view(session), "BOOKED", FIXTURE.when);
const booked = thatsRight(session);
assertWritten(booked, "BOOKED", "Tuesday 2:30");
assertWritten(view(session), "BOOKED", "Tuesday 2:30");
assert.equal(session.diary, undefined);

hear(session, FIXTURE_TURNS.move);
assertOpenCard(view(session), "MOVED", LATER);
assertWritten(thatsRight(session), "MOVED", "Thursday 4:00");

hear(session, FIXTURE_TURNS.cancel);
assertOpenCard(view(session), "CANCELLED", LATER);
assertWritten(thatsRight(session), "CANCELLED", "Thursday 4:00");

const halfTwo = createSession();
hear(halfTwo, "Hi, can I book Priya Nair for a cut and blow dry on Tuesday at half two");
assertOpenCard(view(halfTwo), "BOOKED", "Tuesday 2:30");

const thursday = createSession();
assertWritten(thatsRight(thursday), "BOOKED", "Tuesday 2:30");
hear(thursday, "Can I move that to Thursday at four");
assertOpenCard(view(thursday), "MOVED", "Thursday 4:00");
assertWritten(thatsRight(thursday), "MOVED", "Thursday 4:00");
hear(thursday, "Cancel Priya's booking");
assertWritten(thatsRight(thursday), "CANCELLED", "Thursday 4:00");

const cards = runThreeFixtures();
assert.equal(cards.length, 3);
assertWritten(cards[0], "BOOKED", "Tuesday 2:30");
assertWritten(cards[1], "MOVED", LATER);
assertWritten(cards[2], "CANCELLED", LATER);

console.log("fixture evals passed");
