(() => {
 const KEY="dhanu_movie_adda_watchlist_v1";
 function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
 function write(v){localStorage.setItem(KEY,JSON.stringify(v.slice(0,500)))}
 window.DhanuWatchlist={all:read,has(id){return read().some(x=>String(x.id)===String(id))},toggle(movie){const a=read(),i=a.findIndex(x=>String(x.id)===String(movie.id));if(i>=0)a.splice(i,1);else a.unshift({id:movie.id,title:movie.title||"Untitled",poster_path:movie.poster_path||"",release_date:movie.release_date||"",vote_average:movie.vote_average||0});write(a);return i<0}};
})();