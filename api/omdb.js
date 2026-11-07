// Secure OMDb proxy for DHANU MOVIE ADDA.
// Configure OMDB_API_KEY in Vercel → Project Settings → Environment Variables.
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=86400");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "OMDB_API_KEY is not configured on the server." });
  }

  const query = req.query || {};
  const imdbId = typeof query.imdbId === "string" ? query.imdbId.trim() : "";
  const title = typeof query.title === "string" ? query.title.trim() : "";
  const year = typeof query.year === "string" ? query.year.trim() : "";

  if (imdbId && !/^tt\d{5,12}$/.test(imdbId)) {
    return res.status(400).json({ error: "A valid IMDb ID is required." });
  }
  if (!imdbId && (!title || title.length > 100)) {
    return res.status(400).json({ error: "Provide a valid IMDb ID or movie title." });
  }
  if (year && !/^\d{4}$/.test(year)) {
    return res.status(400).json({ error: "Year must contain four digits." });
  }

  const params = new URLSearchParams({ apikey: apiKey, plot: "full", r: "json" });
  if (imdbId) params.set("i", imdbId);
  else {
    params.set("t", title);
    if (year) params.set("y", year);
  }

  try {
    const response = await fetch("https://www.omdbapi.com/?" + params.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(502).json({ error: "OMDb is temporarily unavailable." });

    const data = await response.json();
    if (data.Response !== "True") {
      const missing = String(data.Error || "").toLowerCase().includes("not found");
      return res.status(missing ? 404 : 502).json({
        error: missing ? "No matching OMDb title was found." : "OMDb could not complete this request."
      });
    }

    // Return only the public metadata the details panel needs; never return the API key.
    return res.status(200).json({
      title: data.Title || "",
      year: data.Year || "",
      rated: data.Rated || "",
      released: data.Released || "",
      runtime: data.Runtime || "",
      genre: data.Genre || "",
      director: data.Director || "",
      writer: data.Writer || "",
      actors: data.Actors || "",
      plot: data.Plot || "",
      language: data.Language || "",
      country: data.Country || "",
      awards: data.Awards || "",
      ratings: Array.isArray(data.Ratings)
        ? data.Ratings.slice(0, 5).map(item => ({ source: item.Source || "", value: item.Value || "" }))
        : [],
      metascore: data.Metascore || "",
      imdbRating: data.imdbRating || "",
      imdbVotes: data.imdbVotes || "",
      imdbID: /^tt\d{5,12}$/.test(String(data.imdbID || "")) ? data.imdbID : "",
      boxOffice: data.BoxOffice || "",
      type: data.Type || ""
    });
  } catch (error) {
    return res.status(502).json({ error: "Could not reach OMDb." });
  }
};
