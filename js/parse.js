(function (root) {
  const TRADES = [
    { id: "locksmith", labels: ["locksmith", "lock smith", "keys"] },
    { id: "plumber", labels: ["plumber", "plumbing", "heating engineer"] },
    { id: "electrician", labels: ["electrician", "electrical"] },
    { id: "garage", labels: ["garage", "mechanic", "mot", "car workshop"] },
    { id: "salon", labels: ["salon", "hairdresser", "barber", "barbers"] },
    { id: "cafe", labels: ["cafe", "café", "coffee shop"] },
    { id: "bakery", labels: ["bakery", "baker"] },
    { id: "butcher", labels: ["butcher", "butchers"] },
    { id: "florist", labels: ["florist", "flowers"] },
    { id: "builder", labels: ["builder", "building firm"] },
    { id: "roofer", labels: ["roofer", "roofing"] },
    { id: "painter", labels: ["painter", "decorator"] },
    { id: "vet", labels: ["vet", "veterinary"] },
    { id: "dentist", labels: ["dentist", "dental"] },
    { id: "shop", labels: ["shop", "store", "retail"] },
  ];

  const FILLER =
    /\b(i(?:'| a)?m|we(?:'| a)?re|my|our|called|name is|the number is|number is|existing number|phone(?: number)? is|it is|it's|trade is|we are|i run|i own|yes|no|please|thanks|thank you|and|or|a|an|the|for|with|from|to|of)\b/gi;

  function normalise(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractNumber(text) {
    const match = text.match(
      /(?:\+44\s?\d[\d\s-]{8,}|\b0\d[\d\s-]{8,}\b)/
    );
    if (!match) return "";
    return match[0].replace(/\s+/g, " ").trim();
  }

  function labelPattern(label, flags) {
    return new RegExp("\\b" + label.replace(/\s+/g, "\\s+") + "s?\\b", flags || "i");
  }

  function extractTrade(text) {
    for (let i = 0; i < TRADES.length; i += 1) {
      const trade = TRADES[i];
      for (let j = 0; j < trade.labels.length; j += 1) {
        if (labelPattern(trade.labels[j]).test(text)) {
          return { id: trade.id, label: trade.labels[0] };
        }
      }
    }
    return null;
  }

  function stripTrades(text) {
    let leftover = text;
    TRADES.forEach(function (trade) {
      trade.labels.forEach(function (label) {
        leftover = leftover.replace(labelPattern(label, "ig"), " ");
      });
    });
    return leftover;
  }

  function extractShopName(text, number) {
    let leftover = text;
    if (number) leftover = leftover.replace(number, " ");
    leftover = stripTrades(leftover);
    leftover = leftover
      .replace(FILLER, " ")
      .replace(/[,.]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (leftover.length < 2) return "";
    return leftover.replace(/\b\w/g, function (ch) {
      return ch.toUpperCase();
    });
  }

  function parseUtterance(raw) {
    const text = normalise(raw);
    const number = extractNumber(text);
    const trade = extractTrade(text);
    const shopName = extractShopName(text, number);
    return {
      raw: text,
      shopName: shopName,
      tradeId: trade ? trade.id : "",
      tradeLabel: trade ? trade.label : "",
      number: number,
      capturedAt: new Date().toISOString(),
    };
  }

  function emptyProfile() {
    return {
      shopName: "",
      tradeId: "",
      tradeLabel: "",
      number: "",
      raw: "",
      capturedAt: "",
    };
  }

  function mergeFacts(profile, parsed) {
    const next = Object.assign(emptyProfile(), profile || {});
    if (parsed.shopName) next.shopName = parsed.shopName;
    if (parsed.tradeId && parsed.tradeLabel) {
      next.tradeId = parsed.tradeId;
      next.tradeLabel = parsed.tradeLabel;
    }
    if (parsed.number) next.number = parsed.number;
    const bits = [parsed.raw, next.raw].filter(Boolean);
    next.raw = bits.join(" ").trim();
    next.capturedAt = parsed.capturedAt || next.capturedAt || new Date().toISOString();
    return next;
  }

  function missingFacts(profile) {
    const missing = [];
    if (!profile || !profile.shopName) missing.push("shop name");
    if (!profile || !profile.tradeLabel) missing.push("trade");
    if (!profile || !profile.number) missing.push("existing number");
    return missing;
  }

  function isComplete(profile) {
    return missingFacts(profile).length === 0;
  }

  function askForMissing(profile) {
    const missing = missingFacts(profile);
    if (missing.length === 3) {
      return "I need your shop name, your trade, and the number you already use.";
    }
    if (missing.length === 2) {
      return "I still need your " + missing[0] + " and your " + missing[1] + ".";
    }
    if (missing.length === 1) {
      return "I still need your " + missing[0] + ".";
    }
    return "";
  }

  root.parseUtterance = parseUtterance;
  root.mergeFacts = mergeFacts;
  root.missingFacts = missingFacts;
  root.isComplete = isComplete;
  root.askForMissing = askForMissing;
  root.emptyProfile = emptyProfile;
  root.KALLO_TRADES = TRADES;
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined") {
  module.exports = {
    parseUtterance: globalThis.parseUtterance,
    mergeFacts: globalThis.mergeFacts,
    missingFacts: globalThis.missingFacts,
    isComplete: globalThis.isComplete,
    askForMissing: globalThis.askForMissing,
    emptyProfile: globalThis.emptyProfile,
  };
}
