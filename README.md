# Dhanu movie adda

A responsive, dark-and-gold movie and series discovery website built with vanilla HTML, CSS and JavaScript, powered by TMDB. The catalogue is restricted to Kannada, Telugu, Tamil, Hindi and Malayalam original-language movies and series.

## Homepage features

- Responsive header and mobile navigation: Home, Movies, Series, Genres and Search.
- Featured trending hero banner with details and official YouTube trailer actions.
- Horizontal browsing rows for Recently Added, Trending Now, Popular Series and Upcoming Releases.
- Genre chips that load movies from the selected category.
- Top 10 movies list, ranked by TMDB ratings across the five supported languages.
- Live multi-search for Kannada, Telugu, Tamil, Hindi and Malayalam movies and series only.\n- Language-restricted trending, latest, upcoming, genre, popular and Top 10 discovery feeds.
- Movie and series detail pages with synopsis, genres, cast and trailers when available.
- My List saved locally, with optional account-backed cloud sync after sign-in.
- Sign-in and registration through the MongoDB account API.
- IMDb ratings and additional metadata via the secure OMDb proxy when configured.
- India streaming availability and provider links via the secure Watchmode proxy when configured.
- Footer attribution and Telegram community link.

## Setup and deployment

This project uses Vercel serverless API routes. Keep all API credentials on the server; never paste tokens into frontend JavaScript or commit them to GitHub.

1. Import this repository into Vercel and deploy it.
2. In **Vercel → Project Settings → Environment Variables**, add `TMDB_API_TOKEN` with your TMDB API Read Access Token (Bearer token).
3. If you use optional OMDb enrichment elsewhere in the project, add `OMDB_API_KEY` as a server-side environment variable.
4. Redeploy after changing environment variables.
5. Check `/api/tmdb?type=trending` on the deployed domain. A successful response contains a `results` array.

The frontend calls same-origin `/api/tmdb`, `/api/omdb`, `/api/watchmode` and `/api/account` routes. Opening `index.html` directly or using GitHub Pages alone will not run Vercel serverless functions.

## Environment variables

| Variable | Required for |
|---|---|
| `TMDB_API_TOKEN` | Movie and series catalogue (required) |
| `MONGODB_URI` | User accounts and cloud sync |
| `SESSION_SECRET` | Signed account sessions (minimum 32 characters) |
| `OMDB_API_KEY` | Optional IMDb ratings and extra metadata |
| `WATCHMODE_API_KEY` | Optional streaming provider availability |
| `MONGODB_DB` | Optional database name; defaults to `dhanu_movie_adda` |

All values must be configured in Vercel Project Settings → Environment Variables, not in frontend files.

## Telegram community URL

In `index.html`, replace the placeholder `https://t.me/` on the **Join our Telegram Community** link with your actual public channel or group invite URL.

## Tech stack

- HTML5
- CSS3 (responsive layouts, glass surfaces and reduced-motion support)
- Vanilla JavaScript
- TMDB, OMDb and Watchmode APIs through server-side Vercel proxies
- MongoDB account and cloud-sync API

## Attribution

Built by **Dhanush**. Movie data, images and trailers are provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

GNU Affero General Public License v3.0 (AGPL-3.0) — see [LICENSE](LICENSE).


## Visual design reference

The mobile home-screen layout is an independent web adaptation inspired by the Zangetsu app screenshots supplied as a design reference. DHANU MOVIE ADDA uses its own branding, TMDB catalogue, account system and server-side API integrations; Zangetsu app source code and streaming extractors are not included in this website.
