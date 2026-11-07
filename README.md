# 🎬 Dhanu Movie Adda

A dark, cinematic movie discovery site — browse trending and top-rated
movies, search the full catalog, watch trailers, and keep a personal
watchlist. Built with plain HTML/CSS/JS and the [TMDB API](https://www.themoviedb.org/documentation/api),
no framework or build step required.

> This is a **browsing and tracking** site only. It does not stream,
> host, or link to any video content beyond official trailers — movie
> data, posters and trailers all come from TMDB's public API.

## Features

- **Home** — hero banner for the week's top trending movie, plus rails
  for Trending, Popular, and Critically Acclaimed
- **Search** — live, debounced search across TMDB's movie catalog
- **Detail page** — backdrop, poster, synopsis, genres, cast, and a
  trailer player (official YouTube embeds)
- **My List** — a personal watchlist saved in the browser via
  `localStorage`, no account or backend needed
- Responsive: bottom tab bar on mobile, top nav on desktop

## Setup

1. Get a free TMDB API key (v3 auth) at
   [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) —
   takes about a minute, no credit card.
2. Open `js/config.js` and paste your key in place of
   `YOUR_TMDB_API_KEY_HERE`.
3. Open `index.html` in a browser (or serve the folder with any static
   server, e.g. `npx serve` / the VS Code "Live Server" extension).

Until a key is added, the site runs fine and shows a friendly prompt
instead of movie data.

> **Note:** TMDB's v3 key is a client-side key by design, which is why
> it lives in a plain JS file here — normal for a small/demo project
> like this. For a production app with real traffic, proxy requests
> through a small backend instead of shipping the key to the browser.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In **Settings → Pages**, set the source to the `main` branch
   (root).
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## Tech stack

Vanilla HTML, CSS and JavaScript — no build tools, no dependencies.
Fonts via Google Fonts (Bebas Neue, Manrope).

## Credits

Built by **Dhanush**. Movie data, images and trailers courtesy of
[TMDB](https://www.themoviedb.org/). This product uses the TMDB API
but is not endorsed or certified by TMDB.

## License

MIT — see [LICENSE](LICENSE).
