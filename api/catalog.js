// Multi-source catalogue proxy for DHANU MOVIE ADDA.
module.exports = async (req, res) => {
 res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=600");
 const {type,q}=req.query||{}; const query=typeof q==="string"?q.trim().slice(0,100):""; const token=process.env.TMDB_API_TOKEN;
 try {
  if(type==="movie"||type==="tv"){
   if(!token)return res.status(503).json({error:"TMDB_API_TOKEN is not configured on the server."});
   const path=query?(type==="movie"?"/search/movie":"/search/tv"):(type==="movie"?"/trending/movie/week":"/trending/tv/week");
   const params=new URLSearchParams({language:"en-US",region:"IN"});if(query){params.set("query",query);params.set("include_adult","false");}
   const response=await fetch("https://api.themoviedb.org/3"+path+"?"+params,{headers:{Authorization:"Bearer "+token,Accept:"application/json"}});
   const data=await response.json();if(!response.ok)return res.status(response.status).json({error:data.status_message||"TMDB request failed."});return res.status(200).json(data);
  }
  if(type==="anime"||type==="manga"){
   const mediaType=type==="anime"?"ANIME":"MANGA";
   const gql="query ($search: String) { Page(page: 1, perPage: 24) { media(search: $search, type: "+mediaType+", sort: POPULARITY_DESC, isAdult: false) { id title { romaji english native } description(asHtml: false) startDate { year } averageScore coverImage { large } } } }";
   const response=await fetch("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:gql,variables:{search:query||null}})});
   const data=await response.json();if(!response.ok)return res.status(response.status).json({error:"AniList catalogue request failed."});
   return res.status(200).json({results:(data.data?.Page?.media||[]).map(x=>({id:x.id,title:x.title?.english||x.title?.romaji||x.title?.native,description:x.description,startDate:x.startDate,averageScore:x.averageScore,coverImage:x.coverImage}))});
  }
  if(type==="novel"){
   const url=new URL("https://openlibrary.org/search.json");url.searchParams.set("limit","24");url.searchParams.set("fields","key,title,first_publish_year,cover_i,author_name");url.searchParams.set(query?"q":"subject",query||"fiction");
   const response=await fetch(url);const data=await response.json();if(!response.ok)return res.status(response.status).json({error:"Open Library request failed."});
   return res.status(200).json({results:(data.docs||[]).map(x=>({id:x.key,title:x.title,year:x.first_publish_year,cover_i:x.cover_i,description:(x.author_name||[]).slice(0,3).join(", ")}))});
  }
  return res.status(400).json({error:"Choose movie, tv, anime, manga or novel."});
 } catch(e){return res.status(502).json({error:"Could not reach the selected catalogue source."});}
};
