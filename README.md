# DHANU MOVIE ADDA

A responsive movie discovery and personal-library website with a premium black-and-gold cinema identity.

## Features
- Live trending movie feed, search and movie metadata through TMDB
- Posters, synopsis, release year, TMDB rating, genres, runtime, cast and official YouTube trailers when available
- Multiple local profiles (up to six), each with its own watchlist and viewing activity
- Continue Watching, progress tracking and mark-as-watched controls
- Export/import a JSON backup of profiles, watchlists and viewing history
- Responsive layout and KANNADIGA admin branding

## Run and deploy
The frontend is `index.html`. The live TMDB integration uses the Vercel serverless route in `api/tmdb.js`, so deploy the repository to Vercel for live movie data. GitHub Pages can host the static preview, but cannot execute this API route.

## Configure TMDB securely
1. Request a TMDB API Read Access Token through your TMDB account's API settings.
2. In Vercel, open Project → Settings → Environment Variables.
3. Add `TMDB_API_TOKEN` with your API Read Access Token as its value.
4. Redeploy the project.

Never put the token in `index.html`, GitHub source, or a public chat. The backend proxy keeps it server-side.

## Profiles and sync status
Profiles, watchlists and viewing progress currently use browser localStorage. They are separated by profile on the current device. Use **Library Sync & Backup → Export backup** to save a portable JSON backup, then **Import backup** on another device.

**Cloud sync is not yet connected.** Real cross-device automatic sync requires a backend database and secure user authentication; this UI does not claim otherwise.

## API route
- `/api/tmdb?type=trending` — trending movies
- `/api/tmdb?type=popular` — popular movies
- `/api/tmdb?type=search&q=movie-name` — movie search
- `/api/tmdb?type=details&id=TMDB_ID` — movie details, credits and videos

## Data attribution and licensing
Movie metadata and images are provided by **The Movie Database (TMDB)**. This project is not endorsed or certified by TMDB. Follow TMDB's current attribution and API terms; commercial use may require a separate license. See:
- https://developer.themoviedb.org/docs/faq
- https://developer.themoviedb.org/docs/authentication-application

IMDb is not scraped or represented as the source of the live data.

## Design reference and third-party licensing
The interaction concepts for profiles, personal libraries and progress tracking were informed by the public-facing feature set of [Spyou/Zangetsu](https://github.com/Spyou/Zangetsu), which is licensed under GPL-3.0. This website update is an independent HTML/CSS/JavaScript implementation: no Zangetsu source code, assets, or app binaries were copied into this repository. The reference project remains credited to its original authors. If any Zangetsu code is incorporated in a future update, the applicable GPL-3.0 notices, source availability and distribution terms must be followed.

## Legal scope
This is a discovery and personal tracking website. It does not host, provide, or embed unauthorized movie streams or downloads.
