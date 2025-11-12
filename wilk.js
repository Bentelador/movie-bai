let Searcher = document.getElementById('Searcher')
let Textsearch = document.getElementById('search')
let movie = document.getElementById('movie')
Searcher.addEventListener("click", function(){
    movie.src = "https://vidsrc.to/embed/movie/" + Textsearch.value
})


