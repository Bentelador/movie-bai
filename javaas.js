
(function () {

  function cleanCSVString(csv) {
    return csv
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = [];
        let current = "";
        let insideQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === "," && !insideQuotes) {
            parts.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        parts.push(current.trim());

        return parts;
      });
  }

  async function ben(Textsearch) {
    const response = await fetch(
      "https://raw.githubusercontent.com/Bentelador/movie-bai/refs/heads/main/MOVIE_DATABASE.csv"
    );
    const data = await response.text();
    const arr = cleanCSVString(data);
    const q = Textsearch.toLowerCase();

    return arr.filter(row =>
      row[1] && row[1].toLowerCase().includes(q)
    );
  }

  window.__movieUtils_module_return = { ben };

})();
