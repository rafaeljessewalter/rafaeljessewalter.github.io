async function loadContent(){
  const res = await fetch("data/content.json");
  if(!res.ok) throw new Error("Falha ao carregar data/content.json");
  return res.json();
}
