// Server-side Watchmode streaming availability proxy.
// API key stays in WATCHMODE_API_KEY and is never returned to the browser.
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const apiKey = process.env.WATCHMODE_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "WATCHMODE_API_KEY is not configured on the server." });

  const query = req.query || {};
  const id = typeof query.id === "string" ? query.id.trim() : "";
  const media = query.media === "tv" ? "tv" : "movie";
  const region = typeof query.region === "string" && /^[A-Z]{2}$/.test(query.region) ? query.region : "IN";
  if (!/^\d{1,12}$/.test(id)) return res.status(400).json({ error: "A valid TMDB title ID is required." });

  const watchmodeId = (media === "tv" ? "tv-" : "movie-") + id;
  try {
    const response = await fetch("https://api.watchmode.com/v1/title/" + watchmodeId + "/sources/?regions=" + encodeURIComponent(region), {
      headers: { Accept: "application/json", "X-API-Key": apiKey },
      signal: AbortSignal.timeout(10000)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const status = response.status === 404 ? 404 : 502;
      return res.status(status).json({ error: status === 404 ? "Streaming availability was not found for this title." : "Watchmode is temporarily unavailable. Check your API plan and try again." });
    }
    const sources = (Array.isArray(data) ? data : []).slice(0, 40).map(source => ({
      name: String(source.name || "Streaming service").slice(0, 80),
      type: String(source.type || "").slice(0, 20),
      region: String(source.region || region).slice(0, 2),
      web_url: typeof source.web_url === "string" && /^https:\/\//i.test(source.web_url) ? source.web_url : "",
      price: source.price == null ? "" : String(source.price).slice(0, 30),
      format: String(source.format || "").slice(0, 40)
    }));
    return res.status(200).json({ region, sources });
  } catch (error) {
    return res.status(502).json({ error: error && error.name === "TimeoutError" ? "Watchmode took too long to respond." : "Could not reach Watchmode." });
  }
};
