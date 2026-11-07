# Dhanu movie adda

A responsive, dark-and-gold movie and series discovery website built with vanilla HTML, CSS and JavaScript, powered by the TMDB API.

## Homepage features

- Responsive header and mobile navigation: Home, Movies, Series, Genres and Search.
- Featured trending hero banner with details and official YouTube trailer actions.
- Horizontal browsing rows for Recently Added, Trending Now, Popular Series and Upcoming Releases.
- Genre chips that load movies from the selected category.
- Top 10 movies list, ranked by TMDB's top-rated movie results.
- Live multi-search for movies and series.
- Movie and series detail pages with synopsis, genres, cast and trailers when available.
- My List saved locally, with optional account-backed cloud sync after sign-in.\n- Sign-in and registration through the MongoDB account API.\n- IMDb ratings and additional metadata via the secure OMDb proxy when configured.\n- India streaming availability and provider links via the secure Watchmode proxy when configured.
- Footer attribution and Telegram community link.

## Setup and deployment

This project uses Vercel serverless API routes. Keep all API credentials on the server; never paste tokens into frontend JavaScript or commit them to GitHub.

1. Import this repository into Vercel and deploy it.
2. In **Vercel → Project Settings → Environment Variables**, add `TMDB_API_TOKEN` with your TMDB API Read Access Token (Bearer token).
3. If you use optional OMDb enrichment elsewhere in the project, add `OMDB_API_KEY` as a server-side environment variable.
4. Redeploy after changing environment variables.
5. Check `/api/tmdb?type=trending` on the deployed domain. A successful response contains a `results` array.

The frontend calls same-origin `/api/tmdb`, `/api/omdb`, `/api/watchmode` and `/api/account` routes. Opening `index.html` directly or using GitHub Pages alone will not run Vercel serverless functions.

## Environment variables\n\n| Variable | Required for |\n|---|---|\n| `TMDB_API_TOKEN` | Movie and series catalogue (required) |\n| `MONGODB_URI` | User accounts and cloud sync |\n| `SESSION_SECRET` | Signed account sessions (minimum 32 characters) |\n| `OMDB_API_KEY` | Optional IMDb ratings and extra metadata |\n| `WATCHMODE_API_KEY` | Optional streaming provider availability |\n| `MONGODB_DB` | Optional database name; defaults to `dhanu_movie_adda` |\n\nAll values must be configured in Vercel Project Settings → Environment Variables, not in frontend files.\n\n## Telegram community URL

In `index.html`, replace the placeholder `https://t.me/` on the **Join our Telegram Community** link with your actual public channel or group invite URL.

## Tech stack

- HTML5
- CSS3 (responsive layouts, glass surfaces and reduced-motion support)
- Vanilla JavaScript
- TMDB, OMDb and Watchmode APIs through server-side Vercel proxies\n- MongoDB account and cloud-sync API

## Attribution

Built by **Dhanush**. Movie data, images and trailers are provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

MIT — see [LICENSE](LICENSE).
