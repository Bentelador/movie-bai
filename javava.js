
let Searcher = document.getElementById('Searcher')
let Textsearch = document.getElementById('search')

function loadUtils() {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "javaas.js";
    script.onload = () => {
      const utils = window.__movieUtils_module_return;
      delete window.__movieUtils_module_return;
      document.body.removeChild(script);
      resolve(utils);
    };
    document.body.appendChild(script);
  });
}


async function runSearch() {
  const utils = await loadUtils();
  const results = await utils.ben(Textsearch.value);
  return(results);
}

Textsearch.addEventListener("input", async function(){
  
    const firstMatch = await runSearch()

    var table = document.getElementById("table")
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    try {
    let aa = firstMatch.forEach((movie,dexe) => {
      if (dexe === 5) {throw "BreakException";}
       const row = table.insertRow();
       movie.forEach((dataas, dex) => {
        let cell;
        if (dex === 9) {
          cell = document.createElement('img')
          cell.src = firstMatch[dexe][9]
          console.log(dexe)
          cell.width = 200
        }else{
          cell = document.createElement('td')
        }

        cell.textContent = dataas;
        cell.style.border = '1px solid black';
        cell.style.padding = '5px';
        if (dex === 1) {
            cell.style.color = "blue";
            cell.addEventListener('click', function(){
              callas(firstMatch[dexe][0])
            });
          }
        row.appendChild(cell);
       })
    });
}catch(e)
{
if (e !== "BreakException") throw e;
}
});
