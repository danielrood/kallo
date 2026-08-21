(function (root) {
  const SALON = "Helen's";
  const FIXTURE = {
    who: "Priya Nair",
    what: "cut and blow dry",
    when: "Tuesday 2:30",
  };
  const LATER = "Thursday 4:00";

  const FIXTURE_TURNS = {
    book: "Book Priya Nair for a cut and blow dry on Tuesday at 2:30",
    move: "Move that to later this week",
    cancel: "Cancel that booking",
  };

  const DAYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const DAY_LABEL = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const HOURS = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
  };

  const NAME_STOP = new RegExp(
    "\\b(" +
      DAYS.join("|") +
      "|cut|blow|dry|later|week|please|thanks|thank|that|this|the|booking|appointment|slot|hairdresser|salon|hello|hi|yes|no|for|from|into|want|like|have|got|can|could|would|need|move|moved|change|changed|cancel|cancelled|book|booked|half|past|o.clock|am|pm)\\b",
    "i"
  );

  function normalise(text) {
    return String(text || "")
      .replace(/[’']/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function titleCase(text) {
    return String(text || "").replace(/\b[a-z]/g, function (ch) {
      return ch.toUpperCase();
    });
  }

  function formatTime(hour, minute) {
    const h = ((Number(hour) + 11) % 12) + 1;
    const m = String(minute == null ? 0 : minute).padStart(2, "0");
    return h + ":" + m;
  }

  function extractDay(text) {
    for (let i = 0; i < DAYS.length; i += 1) {
      if (new RegExp("\\b" + DAYS[i] + "\\b", "i").test(text)) {
        return DAY_LABEL[DAYS[i]];
      }
    }
    return "";
  }

  function extractTime(text) {
    const hm = text.match(/\b([01]?\d|2[0-3])[:.](\d{2})\b/);
    if (hm) return formatTime(hm[1], hm[2]);

    if (/\bhalf\s+(?:past\s+)?two\b|\btwo\s+thirty\b/i.test(text)) return "2:30";
    if (/\bhalf\s+(?:past\s+)?four\b|\bfour\s+thirty\b/i.test(text)) return "4:30";

    const half = text.match(/\bhalf\s+(?:past\s+)?(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d{1,2})\b/i);
    if (half) {
      const hour = HOURS[half[1].toLowerCase()] || Number(half[1]);
      return formatTime(hour, 30);
    }

    const spoken = text.match(
      /\b(?:at|for)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?:\s+o'?clock)?\b/i
    );
    if (spoken) return formatTime(HOURS[spoken[1].toLowerCase()], 0);

    const clock = text.match(/\b([01]?\d|2[0-3])\s*(?:o'?clock|am|pm)\b/i);
    if (clock) return formatTime(clock[1], 0);

    const atNum = text.match(/\bat\s+([01]?\d|2[0-3])\b/i);
    if (atNum) return formatTime(atNum[1], 0);

    return "";
  }

  function extractWhen(text, fallbackWhen) {
    if (/\blater\b|\banother\s+(?:day|time|slot)\b|\bthis\s+week\b/i.test(text) && !extractDay(text)) {
      return LATER;
    }
    const day = extractDay(text);
    const time = extractTime(text);
    if (day && time) return day + " " + time;
    if (day && fallbackWhen) {
      const kept = fallbackWhen.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+/, "");
      return day + " " + (time || kept);
    }
    if (time && fallbackWhen) {
      const keptDay = (fallbackWhen.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/) || [])[0];
      return (keptDay ? keptDay + " " : "") + time;
    }
    if (day) return day;
    return "";
  }

  function extractWhat(text) {
    if (/cut\s*(?:and|&)\s*blow(?:\s*dry)?|\bblow\s*dry\b/i.test(text)) {
      return "cut and blow dry";
    }
    return "";
  }

  function extractWho(text) {
    if (/\bpriya(?:\s+nair)?\b/i.test(text)) return "Priya Nair";
    const named = text.match(
      /\b(?:for|book(?:ing)?|name is|this is|it's|i am|i'm)\s+([a-z]{2,}(?:\s+[a-z]{2,})?)/i
    );
    if (named && !NAME_STOP.test(named[1])) return titleCase(named[1]);
    return "";
  }

  function intentOf(text) {
    if (/\b(cancel|cancelled|call off|bin it|forget it|don't need|do not need)\b/i.test(text)) {
      return "Cancelled";
    }
    if (/\b(move|moved|change|changed|reschedule|switch|push|later|another\s+(?:day|time|slot))\b/i.test(text)) {
      return "Moved";
    }
    return "Booked";
  }

  function cardOf(source, verb) {
    return {
      verb: verb || "Booked",
      who: source.who,
      what: source.what,
      when: source.when,
    };
  }

  function defaultCard() {
    return cardOf(FIXTURE, "Booked");
  }

  function parseTurn(raw, current) {
    const text = normalise(raw);
    const prior = current || FIXTURE;
    const verb = intentOf(text);
    const who = extractWho(text) || prior.who;
    const what = extractWhat(text) || prior.what;
    let when = extractWhen(text, prior.when);
    if (!when) when = verb === "Moved" ? LATER : prior.when;
    return cardOf({ who: who, what: what, when: when }, verb);
  }

  function createSession() {
    return {
      salon: SALON,
      card: defaultCard(),
      pending: true,
    };
  }

  function hear(session, raw) {
    session.card = parseTurn(raw, session.card);
    session.pending = true;
    return session.card;
  }

  function thatsRight(session) {
    session.pending = false;
    return session.card;
  }

  function runThreeFixtures(turns) {
    const spoken = Object.assign({}, FIXTURE_TURNS, turns || {});
    const session = createSession();
    hear(session, spoken.book);
    const booked = thatsRight(session);
    hear(session, spoken.move);
    const moved = thatsRight(session);
    hear(session, spoken.cancel);
    const cancelled = thatsRight(session);
    return [booked, moved, cancelled];
  }

  const api = {
    SALON: SALON,
    FIXTURE: FIXTURE,
    LATER: LATER,
    FIXTURE_TURNS: FIXTURE_TURNS,
    parseTurn: parseTurn,
    createSession: createSession,
    hear: hear,
    thatsRight: thatsRight,
    runThreeFixtures: runThreeFixtures,
    defaultCard: defaultCard,
  };

  root.kalloReception = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
