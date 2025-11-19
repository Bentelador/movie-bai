import ben from "./javaas";
console.log("s")
 
let Searcher = document.getElementById('Searcher')
let Textsearch = document.getElementById('search')

Searcher.addEventListener("click", function(){
    console.log("asd")
    console.log(ben(Textsearch.value));
})
