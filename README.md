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

## Setup and deployment

This project uses Vercel serverless API routes. TMDB credentials must stay on the server; do not paste API tokens into frontend JavaScript or commit them to GitHub.

1. Import this repository into Vercel and deploy it.
2. In **Vercel → Project Settings → Environment Variables**, add `TMDB_API_TOKEN` with your TMDB API Read Access Token (Bearer token).
3. If you use the optional OMDb enrichment, add `OMDB_API_KEY` as a second server-side environment variable.
4. Redeploy after adding or changing environment variables.
5. Open the deployed site and check `/api/tmdb?type=trending`. A successful response should be JSON containing a `results` array. If the response says the token is not configured, check the Vercel variable name and deployment environment (Production/Preview).

The frontend calls the same-origin `/api/tmdb` and `/api/omdb` endpoints. Opening `index.html` directly or deploying only to GitHub Pages will not run these serverless endpoints; use Vercel or another host configured to run the `api/` functions.

## Tech stack

Vanilla HTML, CSS and JavaScript — no build tools, no dependencies.
Fonts via Google Fonts (Bebas Neue, Manrope).

## Credits

Built by **Dhanush**. Movie data, images and trailers courtesy of
[TMDB](https://www.themoviedb.org/). This product uses the TMDB API
but is not endorsed or certified by TMDB.

## License

MIT — see [LICENSE](LICENSE).
