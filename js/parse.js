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

  function extractTrade(text) {
    const lower = text.toLowerCase();
    for (let i = 0; i < TRADES.length; i += 1) {
      const trade = TRADES[i];
      for (let j = 0; j < trade.labels.length; j += 1) {
        if (lower.includes(trade.labels[j])) {
          return { id: trade.id, label: trade.labels[0] };
        }
      }
    }
    return { id: "shop", label: "shop" };
  }

  function extractShopName(text, number, trade) {
    let leftover = text;
    if (number) leftover = leftover.replace(number, " ");
    leftover = leftover.replace(
      /\b(i(?:'| a)?m|we(?:'| a)?re|my|our|called|name is|the number is|number is|existing number|phone(?: number)? is|on|and|a|an|the)\b/gi,
      " "
    );
    if (trade && trade.label) {
      leftover = leftover.replace(new RegExp("\\b" + trade.label + "s?\\b", "ig"), " ");
    }
    leftover = leftover
      .replace(/[,.]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!leftover) return "Your shop";
    return leftover.replace(/\b\w/g, function (ch) {
      return ch.toUpperCase();
    });
  }

  function parseUtterance(raw) {
    const text = normalise(raw);
    const number = extractNumber(text);
    const trade = extractTrade(text);
    const shopName = extractShopName(text, number, trade);
    return {
      raw: text,
      shopName: shopName,
      tradeId: trade.id,
      tradeLabel: trade.label,
      number: number || "Number on file",
      capturedAt: new Date().toISOString(),
    };
  }

  root.parseUtterance = parseUtterance;
  root.KALLO_TRADES = TRADES;
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined") {
  module.exports = {
    parseUtterance: globalThis.parseUtterance,
  };
}
