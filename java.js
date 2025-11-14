 
let Searcher = document.getElementById('Searcher')
let Textsearch = document.getElementById('search')
let movie = document.getElementById('movie')

function callas(ben) {
  movie.src = 'https://vidsrc.to/embed/movie/' + ben;
}

Searcher.addEventListener("click", function(){
 var fileInput = fetch('https://raw.githubusercontent.com/Bentelador/movie-bai/refs/heads/main/Movies.csv')
  .then(response => response.text())
   .then(data => piece(data))
   .catch(err => console.log(err))
  var table = document.getElementById("table")
  while (table.rows.length > 1) {
        table.deleteRow(1);
    }

   const ser = Textsearch.value
   function piece(data){
    console.log(data)
    let arr = data.split('\n').map(r =>r.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(s => s.replace(/^"|"$/g, '').trim()) || [])
    const firstMatch = arr.filter(innerArray =>
      innerArray.some(item => item.toLowerCase().includes(ser))
    );
    for (i = 1; i != firstMatch.length; i++){
      console.log(firstMatch[i][9])
    }
    let aa = firstMatch.forEach((movie,dexe) => {
       const row = table.insertRow();
       movie.forEach((dataas, dex) => {
         if (dex <= 9) {
        const cell = document.createElement('td')
        cell.textContent = dataas;
        cell.style.border = '1px solid black';  // optional styling
        cell.style.padding = '5px';
        if (dex === 1) {
            cell.style.color = "blue";
            cell.addEventListener('click', function(){
              callas(firstMatch[dexe][0])
            });
          }
        row.appendChild(cell);
       }})
    });
}})

  