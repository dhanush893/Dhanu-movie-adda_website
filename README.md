# DHANU MOVIE ADDA

Responsive, iPhone-inspired movie discovery website with a black-and-gold cinema theme.

## Features
- Live trending movie feed powered by TMDB
- Live movie search
- Poster, synopsis, release year and TMDB rating
- Movie details with genres, runtime, top cast and official YouTube trailer when available
- Watchlist stored in browser localStorage
- Existing curated collections and KANNADIGA admin label

## Run locally
The static page can be opened directly, but the live TMDB integration needs the Vercel serverless API route. Deploy this project to Vercel to use `/api/tmdb`.

## Configure TMDB securely
1. A parent/guardian or project owner should create a TMDB account and request an API Read Access Token in the account's API settings.
2. In Vercel, open the project → Settings → Environment Variables.
3. Add `TMDB_API_TOKEN` and paste the API Read Access Token as its value.
4. Enable it for the Production and Preview environments as needed.
5. Redeploy the project so the serverless function receives the new variable.

**Never paste the token into `index.html`, GitHub source, or a public chat.** The `api/tmdb.js` serverless function keeps it on the server and only allows the movie endpoints used by this site.

## API route
- `/api/tmdb?type=trending` — trending movies
- `/api/tmdb?type=popular` — popular movies
- `/api/tmdb?type=search&q=movie-name` — search
- `/api/tmdb?type=details&id=TMDB_ID` — details, credits and videos

## Data attribution and licensing
Movie metadata and images are provided by **The Movie Database (TMDB)**. This project uses TMDB's developer API and is not endorsed or certified by TMDB. Display the TMDB logo/required attribution in the deployed site and follow the current TMDB terms. TMDB says its API is free for non-commercial use with attribution; commercial use requires a separate license. See:
- https://developer.themoviedb.org/docs/faq
- https://developer.themoviedb.org/docs/authentication-application

IMDb is not scraped or represented as the source of the live data. IMDb's official API is distributed through AWS Data Exchange and requires its own access/subscription process.

## Deployment note
GitHub Pages only hosts static files and cannot run `api/tmdb.js`. Use Vercel (or another host that supports serverless functions) for the live API integration. The frontend still contains the sample catalogue as a fallback.
