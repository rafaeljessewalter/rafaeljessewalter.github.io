async function tmdb(path, params={}){
  const key = window.CONFIG.tmdbApiKey;
  if(!key) return null;
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "pt-BR");
  for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v);
  const res = await fetch(url);
  if(!res.ok) throw new Error("TMDb error");
  return res.json();
}

async function getById(type, id){
  const details = await tmdb(`${type}/${id}`) || null;
  return details;
}

async function getCredits(type, id){
  return await tmdb(`${type}/${id}/credits`) || null;
}

async function getVideos(type, id){
  return await tmdb(`${type}/${id}/videos`) || null;
}

async function searchAll(query, page=1){
  const res = await tmdb("search/multi", { query, page });
  return res || { results:[] };
}
