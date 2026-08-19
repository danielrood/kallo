(function () {
  const path = window.location.pathname;
  window.KALLO_BASE = path.includes("/kallo/") ? "/kallo/" : "/";

  window.kalloHref = function (route) {
    const clean = String(route || "").replace(/^\/+/, "");
    return window.KALLO_BASE + clean;
  };

  window.kalloStore = {
    key: "kallo.trial.v1",
    read: function () {
      try {
        return JSON.parse(sessionStorage.getItem(this.key) || "null");
      } catch (err) {
        return null;
      }
    },
    write: function (value) {
      sessionStorage.setItem(this.key, JSON.stringify(value));
    },
  };

  document.documentElement.dataset.base = window.KALLO_BASE;
})();
