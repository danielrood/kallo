(function () {
  const profile = window.kalloStore.read();
  if (!window.isComplete(profile)) {
    window.location.replace(window.kalloHref("talk/"));
    return;
  }

  const items = window.kalloDemo.forTrade(profile.tradeId);
  const stateKey = "kallo.inbox.accepted." + profile.shopName;
  try {
    const accepted = JSON.parse(sessionStorage.getItem(stateKey) || "[]");
    items.forEach(function (item) {
      if (accepted.indexOf(item.id) !== -1) item.accepted = true;
    });
  } catch (err) {
    /* ignore */
  }

  const listEl = document.querySelector("[data-list]");
  const detailEl = document.querySelector("[data-detail]");
  const shopEl = document.querySelector("[data-shop]");
  const metaEl = document.querySelector("[data-shop-meta]");
  let selectedId = items[0] ? items[0].id : null;

  if (shopEl) shopEl.textContent = profile.shopName;
  if (metaEl) {
    metaEl.textContent =
      profile.tradeLabel + " · " + profile.number + " · owner inbox";
  }

  function persistAccepted() {
    const ids = items.filter(function (item) { return item.accepted; }).map(function (item) { return item.id; });
    sessionStorage.setItem(stateKey, JSON.stringify(ids));
  }

  function selected() {
    return items.find(function (item) { return item.id === selectedId; }) || items[0];
  }

  function renderList() {
    listEl.innerHTML = items
      .map(function (item) {
        return (
          '<button class="row' +
          (item.id === selectedId ? " is-active" : "") +
          '" type="button" data-open="' +
          item.id +
          '">' +
          '<span class="row__top">' +
          '<span class="chip chip--' +
          item.tag.toLowerCase() +
          '">' +
          item.tag +
          "</span>" +
          '<span class="demo-pill">Demo</span>' +
          '<span class="row__when">' +
          item.when +
          "</span>" +
          "</span>" +
          '<strong class="row__name">' +
          item.caller +
          "</strong>" +
          '<span class="row__line">' +
          item.line +
          "</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function renderDetail() {
    const item = selected();
    if (!item) {
      detailEl.innerHTML = "<p>No demo callbacks in this pack.</p>";
      return;
    }
    const quote = item.quote
      ? '<section class="quote">' +
        '<div class="quote__head"><span class="demo-pill">Demo</span><span>Quote</span></div>' +
        "<h3>" +
        item.quote.title +
        "</h3>" +
        '<p class="quote__amount">' +
        item.quote.amount +
        "</p>" +
        "<p>" +
        item.quote.note +
        "</p>" +
        (item.accepted
          ? '<p class="quote__done">Accepted · demo</p>'
          : '<button class="btn btn--primary" type="button" data-accept="' +
            item.id +
            '">Accept quote</button>') +
        "</section>"
      : '<p class="muted">No quote on this callback.</p>';

    detailEl.innerHTML =
      '<div class="detail__head">' +
      '<span class="chip chip--' +
      item.tag.toLowerCase() +
      '">' +
      item.tag +
      "</span>" +
      '<span class="demo-pill">Demo</span>' +
      "</div>" +
      "<h2>" +
      item.caller +
      "</h2>" +
      '<p class="detail__phone">' +
      item.phone +
      " · UK dummy number</p>" +
      "<h3>Summary</h3>" +
      "<p>" +
      item.summary +
      "</p>" +
      "<h3>Suggested callback</h3>" +
      "<p>" +
      item.callback +
      "</p>" +
      quote;
  }

  function render() {
    renderList();
    renderDetail();
  }

  listEl.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-open]");
    if (!btn) return;
    selectedId = btn.getAttribute("data-open");
    render();
  });

  detailEl.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-accept]");
    if (!btn) return;
    const id = btn.getAttribute("data-accept");
    const item = items.find(function (row) { return row.id === id; });
    if (!item) return;
    item.accepted = true;
    persistAccepted();
    render();
  });

  render();
})();
