// Vercel serverless proxy for The Movie Database (TMDB).
// Add TMDB_API_TOKEN in Vercel → Project Settings → Environment Variables.
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  const token = process.env.TMDB_API_TOKEN;
  if (!token) return res.status(503).json({ error: "TMDB_API_TOKEN is not configured on the server." });

  const { type, q, id } = req.query || {};
  let path;
  const params = new URLSearchParams({ language: "en-US", region: "IN" });

  if (type === "trending") {
    path = "/trending/movie/week";
  } else if (type === "ott") {
    const now = new Date();
    const end = now.toISOString().slice(0, 10);
    const start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    path = "/discover/movie";
    params.set("watch_region", "IN");
    params.set("with_watch_monetization_types", "flatrate");
    params.set("sort_by", "primary_release_date.desc");
    params.set("primary_release_date.gte", start);
    params.set("primary_release_date.lte", end);
    params.set("vote_count.gte", "10");
    params.set("include_video", "false");
  } else if (type === "kannada") {
    path = "/discover/movie";
    params.set("with_original_language", "kn");
    params.set("sort_by", "popularity.desc");
    params.set("vote_count.gte", "10");
    params.set("include_adult", "false");
  } else if (type === "recent") {
    const now = new Date();
    const end = now.toISOString().slice(0, 10);
    const start = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    path = "/discover/movie";
    params.set("with_original_language", "kn|hi|te|ta");
    params.set("sort_by", "primary_release_date.desc");
    params.set("primary_release_date.gte", start);
    params.set("primary_release_date.lte", end);
    params.set("include_adult", "false");
    params.set("vote_count.gte", "1");
    params.set("page", "1");
  } else if (type === "popular") {
    path = "/movie/popular";
  } else if (type === "search") {
    if (!q || typeof q !== "string" || q.length > 100) return res.status(400).json({ error: "A valid search query is required." });
    path = "/search/movie";
    params.set("query", q);
    params.set("include_adult", "false");
  } else if (type === "details") {
    if (!id || !/^\d+$/.test(String(id))) return res.status(400).json({ error: "A valid movie ID is required." });
    path = "/movie/" + id;
    params.set("append_to_response", "videos,credits,external_ids");
  } else {
    return res.status(400).json({ error: "Unsupported request type." });
  }

  try {
    const response = await fetch("https://api.themoviedb.org/3" + path + "?" + params.toString(), {
      headers: { Authorization: "Bearer " + token, Accept: "application/json" }
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.status_message || "TMDB request failed." });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: "Could not reach TMDB." });
  }
};
