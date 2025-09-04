// Render helpers
function cardItem(item, fallbackType){
  const type = item.type || fallbackType || "movie";
  const href = type === "tv" ? `tv-detail.html?id=${item.id}` : `movie-detail.html?id=${item.id}`;
  const poster = item.poster_path ? (CONFIG.imageBase + item.poster_path) : null;
  const el = document.createElement("a");
  el.className="card";
  el.href = href;
  el.innerHTML = `
    <div class="img-wrap"></div>
    <div class="body">
      <div class="title">${item.title || item.name || "Título"}</div>
      <div class="meta"><span>${humanYear(item.release_date || item.first_air_date || "")}</span><span>★ ${ratingToStr(item.vote_average)}</span></div>
    </div>
  `;
  const wrap = el.querySelector(".img-wrap");
  wrap.appendChild(buildPoster(poster));
  return el;
}

async function hydrateItems(items){
  // If we have TMDb, fetch details for each item to enrich
  if(!CONFIG.tmdbApiKey){ 
    return items; 
  }
  const enriched = [];
  for(const base of items){
    try{
      const det = await getById(base.type, base.id);
      enriched.push({ ...base, ...det });
    }catch(e){
      enriched.push(base);
    }
  }
  return enriched;
}

async function renderGrid(container, items, fallbackType){
  container.innerHTML = "";
  const enriched = await hydrateItems(items);
  for(const it of enriched){
    container.appendChild(cardItem(it, fallbackType));
  }
}

// Page initializers
async function initIndex(){
  setPageTitle("Início");
  const data = await loadContent();
  await renderGrid(qs("#featured-grid"), data.featured);
  await renderGrid(qs("#movies-grid"), data.movies, "movie");
  await renderGrid(qs("#tv-grid"), data.tv, "tv");
}

async function initMovies(){
  setPageTitle("Filmes");
  const data = await loadContent();
  await renderGrid(qs("#list-grid"), data.movies, "movie");
}

async function initTV(){
  setPageTitle("Séries");
  const data = await loadContent();
  await renderGrid(qs("#list-grid"), data.tv, "tv");
}

async function initPopular(){
  setPageTitle("Populares");
  const data = await loadContent();
  const all = [...data.featured, ...data.movies, ...data.tv];
  await renderGrid(qs("#list-grid"), all.slice(0,60));
}

async function initTop(){
  setPageTitle("Top IMDB");
  const data = await loadContent();
  const all = [...data.movies, ...data.tv];
  await renderGrid(qs("#list-grid"), all.reverse());
}

async function initGenres(){
  setPageTitle("Gêneros");
  const data = await loadContent();
  const genres = data.genres || [
    {id:28,name:"Ação"},{id:35,name:"Comédia"},{id:18,name:"Drama"},{id:27,name:"Terror"},{id:10759,name:"Ação & Aventura"}
  ];
  const box = qs("#genres-box");
  box.innerHTML = genres.map(g => `<a class="tag" href="search.html?q=${encodeURIComponent("genre:"+g.id)}">${g.name}</a>`).join("");
}

async function initYear(){
  setPageTitle("Ano");
  const year = getParam("y");
  const data = await loadContent();
  const all = [...data.movies, ...data.tv];
  const list = year ? all.filter(i => (i.year||"") == year) : all;
  qs("#year-title").textContent = year ? `Lançamentos de ${year}` : "Filmes e Séries por Ano";
  await renderGrid(qs("#list-grid"), list);
}

async function initSearch(){
  const q = getParam("q") || "";
  setPageTitle("Buscar");
  const inp = qs("#q");
  inp.value = q;
  const out = qs("#list-grid");
  const data = await loadContent();
  const all = await hydrateItems([...data.movies, ...data.tv, ...data.featured]);
  function matches(it){
    if(q.startsWith("genre:")){
      const gid = q.split(":")[1];
      return (it.genres||[]).some(g => (g.id+"") === gid);
    }
    const t = (it.title||it.name||"").toLowerCase();
    return t.includes(q.toLowerCase());
  }
  await renderGrid(out, q ? all.filter(matches) : all.slice(0,40));
  qs("#search-form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const val = inp.value.trim();
    location.href = "search.html?q="+encodeURIComponent(val);
  });
}

async function initDetail(type){
  const id = getParam("id");
  setPageTitle(type === "tv" ? "Série" : "Filme");
  const det = await getById(type, id) || { id, title: "Título", overview: "Adicione sua API do TMDb em assets/js/config.js para detalhes.", backdrop_path:"", poster_path:"", vote_average:null, release_date:"" };
  // Banner
  const banner = qs(".banner");
  if(det.backdrop_path) banner.style.backgroundImage = `url(${CONFIG.imageBase}${det.backdrop_path})`;
  // Poster + title
  const content = qs(".details .content");
  content.innerHTML = `
    <div class="kv">
      <img class="poster" style="width:120px;border-radius:10px" src="${det.poster_path?CONFIG.imageBase+det.poster_path:"assets/img/placeholder-2x3.png"}" alt="Poster">
      <div>
        <h2 style="margin:0 0 6px">${det.title||det.name||"Título"}</h2>
        <div class="meta">Ano: ${humanYear(det.release_date||det.first_air_date)} • Nota: ★ ${ratingToStr(det.vote_average)}</div>
        <div class="toolbar" style="margin-top:10px">
          <a class="btn" href="watch.html?type=${type}&id=${id}">Assistir</a>
          <a class="btn ghost" href="https://www.themoviedb.org/${type}/${id}" target="_blank" rel="noopener">TMDb</a>
        </div>
      </div>
    </div>
    <h3>Sinopse</h3>
    <p>${det.overview || "Sem sinopse"}</p>
  `;
  // Sidebar similar content
  const side = qs(".sidebar .list");
  const data = await loadContent();
  const recs = (type==="tv"?data.tv:data.movies).slice(0,8);
  const enriched = await hydrateItems(recs);
  side.innerHTML = "";
  for(const it of enriched){
    const a = document.createElement("a");
    a.href = type==="tv" ? `tv-detail.html?id=${it.id}` : `movie-detail.html?id=${it.id}`;
    a.className="side-item";
    a.innerHTML = `<div style="display:flex;gap:10px;align-items:center"><img src="${it.poster_path?CONFIG.imageBase+it.poster_path:"assets/img/placeholder-2x3.png"}" style="width:44px;height:66px;border-radius:8px;object-fit:cover"/><div><div style="font-weight:700">${it.title||it.name||"Título"}</div><div class="notice">${humanYear(it.release_date||it.first_air_date)}</div></div></div>`;
    side.appendChild(a);
  }
}

async function initWatch(){
  const type = getParam("type") || "movie";
  const id = getParam("id");
  setPageTitle("Assistir");
  const box = qs("#player");
  box.innerHTML = `<div class="player"><iframe title="Player" srcdoc="<style>html,body{margin:0;background:#000;color:#fff;display:grid;place-items:center;height:100%}</style><div>Seu player entra aqui (ID: ${id})</div>" frameborder="0" allowfullscreen style="width:100%;height:100%"></iframe></div><p class='notice'>Este é um player de exemplo. Integre seu servidor/iframe real.</p>`;
}
