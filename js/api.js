(() => {
  const config = window.DHANU_CONFIG || {};
  async function request(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let response;
    try {
      response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    } catch (error) {
      if (error && error.name === "AbortError") throw new Error("The movie service timed out. Please try again.");
      throw new Error("Could not connect to the movie service. Check your internet connection.");
    } finally {
      clearTimeout(timeout);
    }
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
