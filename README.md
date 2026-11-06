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
- `/api/catalog?type=movie` or `tv` — trending movies/series; add `&q=...` to search
- `/api/catalog?type=anime` or `manga` — AniList catalogue and search
- `/api/catalog?type=novel` — Open Library catalogue and search


## Secure accounts and cloud sync

The web app includes account registration/sign-in and a MongoDB-backed cloud library API. Once configured and deployed, each account stores its own profiles, watchlists and viewing activity. The first successful sign-in uploads the current browser library and merges it with the account's cloud copy; watchlists are combined and the most recently updated progress record wins.

### Required Vercel environment variables

- \`TMDB_API_TOKEN\` — existing TMDB Read Access Token.
- \`MONGODB_URI\` — MongoDB Atlas connection string for a database user with access to the app database.
- \`MONGODB_DB\` — optional database name; defaults to \`dhanu_movie_adda\`.
- \`SESSION_SECRET\` — a private random secret of at least 32 characters. Generate a strong value and store it only in Vercel Environment Variables.

Never commit real credentials or paste them into the frontend. \`.env.example\` contains placeholders only. Configure the variables for the Vercel deployment environments and redeploy after changing them.

### MongoDB setup and API

1. Create a MongoDB Atlas cluster and a database user with least-privilege access to the application database.
2. Configure the Atlas network access rules for your deployment. Avoid unrestricted network access where your hosting setup supports narrower rules.
3. Copy the Atlas connection string into Vercel as \`MONGODB_URI\`; replace the username, password and cluster placeholders privately.
4. Deploy this repository to Vercel with the environment variables above.

Account endpoints are handled by \`api/account.js\`:
- \`POST /api/account?action=register\` — create an account.
- \`POST /api/account?action=login\` — sign in and set an HTTP-only session cookie.
- \`POST /api/account?action=logout\` — clear the session cookie.
- \`GET /api/account?action=me\` — check the current session.
- \`GET /api/account?action=sync\` — read the signed-in account's library.
- \`PUT /api/account?action=sync\` — merge a validated local library into that account.

The API hashes passwords with Node.js scrypt, signs short-lived session tokens with \`SESSION_SECRET\`, uses HTTP-only SameSite cookies, checks browser request origins for writes, validates incoming library data, and keeps user data scoped to the authenticated MongoDB user. A small in-process login/register throttle is included; it is not a distributed rate limiter. For a public production launch, add a shared rate-limiting service, email verification, password reset, monitoring and a privacy/retention policy.

### Sync and recovery behavior

- Local browser storage remains available if the network or account service is unavailable; the interface reports sync errors rather than deleting local changes.
- On sign-in, local profiles and libraries are merged into the signed-in account. Watchlists are unioned; progress entries use the latest \`updatedAt\` timestamp.
- Export/import JSON backup remains available as an independent recovery path.
- Cloud data is not a substitute for backups. Configure MongoDB Atlas backups and periodically export the app library.
- Signing out clears the session cookie but does not delete the local library or cloud account data.

Cloud sync requires valid \`MONGODB_URI\` and \`SESSION_SECRET\` values in the deployed environment. It cannot be fully verified until those are configured and an account is tested against the live deployment.

## Data attribution and licensing
Movie and TV metadata/images are provided by **The Movie Database (TMDB)**; anime/manga metadata are from **AniList**; book catalogue metadata is from **Open Library**. This project is not endorsed or certified by TMDB. Follow each provider's current attribution, API terms and usage rules; commercial use may require separate permission or licensing. See:
- https://developer.themoviedb.org/docs/faq
- https://developer.themoviedb.org/docs/authentication-application
- https://anilist.gitbook.io/anilist-apiv2-docs/
- https://openlibrary.org/developers/api

IMDb is not scraped or represented as the source of the live data.

## Design reference and third-party licensing
The interaction concepts for profiles, personal libraries and progress tracking were informed by the public-facing feature set of [Spyou/Zangetsu](https://github.com/Spyou/Zangetsu), which is licensed under GPL-3.0. This website update is an independent HTML/CSS/JavaScript implementation: no Zangetsu source code, assets, or app binaries were copied into this repository. The reference project remains credited to its original authors. If any Zangetsu code is incorporated in a future update, the applicable GPL-3.0 notices, source availability and distribution terms must be followed.

## Legal scope
This is a discovery and personal tracking website. It does not host, provide, or embed unauthorized movie streams or downloads.
