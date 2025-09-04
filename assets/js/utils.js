function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function getParam(name){ return new URLSearchParams(location.search).get(name); }
function setPageTitle(t){ document.title = t ? t + " • DooClone" : "DooClone"; }
function humanYear(d){ if(!d) return ""; return (""+d).slice(0,4); }
function ratingToStr(v){ return v ? (Math.round(v*10)/10).toString() : "-"; }
function buildPoster(src){ const img = new Image(); img.loading="lazy"; img.className="poster"; img.alt="Poster"; img.src = src || "assets/img/placeholder-2x3.png"; return img; }
