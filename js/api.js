(() => {
  const config = window.DHANU_CONFIG || {};
  async function request(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Request failed (" + response.status + ").");
    return data;
  }
  window.DhanuAPI = {
    tmdb(type, params = {}) {
      const url = new URL(config.tmdbEndpoint || "/api/tmdb", location.origin);
      url.searchParams.set("type", type);
      Object.entries(params).forEach(([key, value]) => { if (value != null && value !== "") url.searchParams.set(key, value); });
      return request(url);
    },
    omdb(params = {}) {
      const url = new URL(config.omdbEndpoint || "/api/omdb", location.origin);
      Object.entries(params).forEach(([key, value]) => { if (value != null && value !== "") url.searchParams.set(key, value); });
      return request(url);
    },
    account(action, method = "GET", body) {
      const url = new URL(config.accountEndpoint || "/api/account", location.origin);
      url.searchParams.set("action", action);
      return fetch(url, { method, credentials: "same-origin", headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined }).then(async r => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || "Account request failed.");
        return data;
      });
    }
  };
})();
