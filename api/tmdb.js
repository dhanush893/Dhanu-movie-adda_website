// Server-side TMDB proxy. Keep TMDB_API_TOKEN in Vercel environment variables.
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  const token = process.env.TMDB_API_TOKEN;
  if (!token) return res.status(503).json({ error: "TMDB is not configured. Add TMDB_API_TOKEN in Vercel Environment Variables and redeploy." });
  const { type, q, id, media, genre } = req.query || {};
  let path, params = new URLSearchParams({ language: "en-US", region: "IN" });
  const today = new Date().toISOString().slice(0,10);
  if (type === "trending") path = "/trending/movie/week";
  else if (type === "series") path = "/trending/tv/week";
  else if (type === "upcoming") { path="/movie/upcoming"; params.set("region","IN"); params.set("page","1"); }
  else if (type === "top10") { path="/movie/top_rated"; params.set("region","IN"); params.set("page","1"); }
  else if (type === "genre") {
    if (!/^\d+$/.test(String(genre || ""))) return res.status(400).json({error:"A valid genre ID is required."});
    path="/discover/movie"; params.set("with_genres",String(genre)); params.set("sort_by","popularity.desc"); params.set("include_adult","false");
  } else if (type === "ott") {
    const start=new Date(Date.now()-180*86400000).toISOString().slice(0,10);
    path="/discover/movie"; params.set("watch_region","IN"); params.set("with_watch_monetization_types","flatrate"); params.set("sort_by","primary_release_date.desc"); params.set("primary_release_date.gte",start); params.set("primary_release_date.lte",today); params.set("vote_count.gte","10"); params.set("include_video","false");
  } else if (type === "kannada") {
    path="/discover/movie"; params.set("with_original_language","kn"); params.set("sort_by","popularity.desc"); params.set("vote_count.gte","10"); params.set("include_adult","false");
  } else if (type === "recent") {
    const start=new Date(Date.now()-120*86400000).toISOString().slice(0,10);
    path="/discover/movie"; params.set("with_original_language","kn,hi,te,ta"); params.set("sort_by","primary_release_date.desc"); params.set("primary_release_date.gte",start); params.set("primary_release_date.lte",today); params.set("include_adult","false"); params.set("vote_count.gte","1"); params.set("page","1");
  } else if (type === "popular") path="/movie/popular";
  else if (type === "search") {
    if (!q || typeof q!=="string" || q.length>100) return res.status(400).json({error:"A valid search query is required."});
    path="/search/multi"; params.set("query",q); params.set("include_adult","false");
  } else if (type === "details") {
    if (!id || !/^\d+$/.test(String(id))) return res.status(400).json({error:"A valid title ID is required."});
    const kind=media==="tv"?"tv":"movie"; path="/"+kind+"/"+id; params.set("append_to_response","videos,credits,external_ids");
  } else return res.status(400).json({error:"Unsupported request type."});
  try {
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),10000);
    let response;
    try { response=await fetch("https://api.themoviedb.org/3"+path+"?"+params.toString(),{headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:controller.signal}); }
    finally { clearTimeout(timeout); }
    const data=await response.json();
    if(!response.ok) return res.status(response.status).json({error:data.status_message||"TMDB request failed."});
    return res.status(200).json(data);
  } catch(error) {
    return res.status(502).json({error:error&&error.name==="AbortError"?"TMDB took too long to respond. Please try again.":"Could not reach TMDB. Please try again shortly."});
  }
};