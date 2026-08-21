import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  FIXTURE,
  LATER,
  FIXTURE_TURNS,
  parseTurn,
  createSession,
  hear,
  thatsRight,
  runThreeFixtures,
} = require("../js/reception.js");

function assertRecord(record, verb, when) {
  assert.equal(record.verb, verb);
  assert.equal(record.who, FIXTURE.who);
  assert.equal(record.what, FIXTURE.what);
  assert.equal(record.when, when);
  assert.equal(record.demo, true);
  assert.ok(record.at);
}

const spokenBook = parseTurn(FIXTURE_TURNS.book, null);
assert.equal(spokenBook.verb, "Booked");
assert.equal(spokenBook.who, "Priya Nair");
assert.equal(spokenBook.what, "cut and blow dry");
assert.equal(spokenBook.when, "Tuesday 2:30");

const halfTwo = parseTurn(
  "Hi, can I book Priya Nair for a cut and blow dry on Tuesday at half two",
  null
);
assert.equal(halfTwo.verb, "Booked");
assert.equal(halfTwo.when, "Tuesday 2:30");

const session = createSession();
assert.equal(session.salon, "Helen's");
assert.equal(session.proposal.verb, "Booked");
assert.equal(session.proposal.who, FIXTURE.who);
assert.equal(session.proposal.what, FIXTURE.what);
assert.equal(session.proposal.when, FIXTURE.when);
assert.equal(session.pending, true);

const booked = thatsRight(session);
assertRecord(booked, "Booked", "Tuesday 2:30");
assert.equal(session.diary.records.length, 1);
assert.equal(session.pending, false);

hear(session, FIXTURE_TURNS.move);
assert.equal(session.proposal.verb, "Moved");
assert.equal(session.proposal.when, LATER);
assert.equal(session.pending, true);
const moved = thatsRight(session);
assertRecord(moved, "Moved", LATER);
assert.equal(session.diary.records.length, 2);

hear(session, FIXTURE_TURNS.cancel);
assert.equal(session.proposal.verb, "Cancelled");
assert.equal(session.proposal.who, "Priya Nair");
assert.equal(session.proposal.when, LATER);
const cancelled = thatsRight(session);
assertRecord(cancelled, "Cancelled", LATER);
assert.equal(session.diary.records.length, 3);
assert.equal(session.diary.records[0].verb, "Booked");
assert.equal(session.diary.records[1].verb, "Moved");
assert.equal(session.diary.records[2].verb, "Cancelled");

const thursday = createSession();
thatsRight(thursday);
hear(thursday, "Can I move that to Thursday at four");
assert.equal(thursday.proposal.verb, "Moved");
assert.equal(thursday.proposal.when, "Thursday 4:00");
thatsRight(thursday);
hear(thursday, "Cancel Priya's booking");
assert.equal(thursday.proposal.verb, "Cancelled");
assert.equal(thatsRight(thursday).verb, "Cancelled");

const scripted = runThreeFixtures();
assert.equal(scripted.records.length, 3);
assertRecord(scripted.records[0], "Booked", "Tuesday 2:30");
assertRecord(scripted.records[1], "Moved", LATER);
assertRecord(scripted.records[2], "Cancelled", LATER);

console.log("fixture evals passed");
