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
- My List saved in the browser with localStorage.
- Footer attribution and Telegram community link.

## Setup and deployment

This project uses Vercel serverless API routes. Keep all API credentials on the server; never paste tokens into frontend JavaScript or commit them to GitHub.

1. Import this repository into Vercel and deploy it.
2. In **Vercel → Project Settings → Environment Variables**, add `TMDB_API_TOKEN` with your TMDB API Read Access Token (Bearer token).
3. If you use optional OMDb enrichment elsewhere in the project, add `OMDB_API_KEY` as a server-side environment variable.
4. Redeploy after changing environment variables.
5. Check `/api/tmdb?type=trending` on the deployed domain. A successful response contains a `results` array.

The frontend calls same-origin `/api/tmdb` and `/api/omdb` routes. Opening `index.html` directly or using GitHub Pages alone will not run Vercel serverless functions.

## Telegram community URL

In `index.html`, replace the placeholder `https://t.me/` on the **Join our Telegram Community** link with your actual public channel or group invite URL.

## Tech stack

- HTML5
- CSS3 (responsive layouts, glass surfaces and reduced-motion support)
- Vanilla JavaScript
- TMDB API through a server-side Vercel proxy

## Attribution

Built by **Dhanush**. Movie data, images and trailers are provided by [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.

## License

MIT — see [LICENSE](LICENSE).
