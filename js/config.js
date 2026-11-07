// Public frontend configuration. Secrets remain on the server in Vercel environment variables.
window.DHANU_CONFIG = Object.freeze({
  tmdbEndpoint: "/api/tmdb",
  omdbEndpoint: "/api/omdb",
  accountEndpoint: "/api/account"
});
