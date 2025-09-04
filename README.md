
# DooClone (estilo DooPlay) — IDs via JSON

Este template replica o estilo e a navegação do tema DooPlay em páginas estáticas.
O conteúdo é carregado de `data/content.json` (apenas **IDs** e tipo). Se você
preencher sua API Key do TMDb em `assets/js/config.js`, o site buscará os detalhes
(título, poster, sinopse, etc.) em tempo de execução.

## Como usar
1. Extraia o ZIP em uma pasta local e abra `index.html` num servidor local
   (ex.: com a extensão "Live Server" no VSCode) para evitar bloqueios de CORS.
2. Edite `assets/js/config.js` e defina `tmdbApiKey` com sua chave.
3. Edite `data/content.json` com os IDs dos filmes/séries que deseja listar.

## Páginas incluídas
- `index.html` (Início, destaques, listas)
- `movies.html` (Catálogo de filmes)
- `tv.html` (Catálogo de séries)
- `popular.html` (Populares)
- `top.html` (Top IMDB)
- `genres.html` (Gêneros com busca)
- `year.html` (Filtrar por ano via querystring ?y=2023)
- `search.html` (Busca por título, ou por `genre:<id>`)
- `movie-detail.html` (Página de detalhes de filme)
- `tv-detail.html` (Página de detalhes de série)
- `watch.html` (Player de exemplo)

## Observações
- Sem API do TMDb, o layout funciona com placeholders usando os IDs do JSON.
- Integre seu player real substituindo o iframe em `initWatch()`.
- Estrutura, estilos e nomenclaturas são inspirados, mas o código é original.
