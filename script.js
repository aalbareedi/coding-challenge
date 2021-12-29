let fileSelector = document.querySelector("#fileSelector");
let pieChart = document.querySelector("#pieChart");

fileSelector.addEventListener("change", async () => {
  // Getting the file object from files array
  let file = fileSelector.files[0];
  // Getting the file contents
  let contents = await file.text();
  // console.log(contents);

  // TODO: Count the number of searches per query,
  // and put the totals in a new array.

  // Converting the file contents to an array of objects
  let searches = d3.csvParse(contents);
  let searchesPerQuery = [];

  // 1. Loop through searches
  // 2. Check if this search has a new query value
  //    a. Add an object to searchesPerQuery
  // else
  //    b. ...

  /*
  searches:
  [
    {query: "brewery", id: 400, hits: 25, ...},
    {query: "brewery", id: 401, hits: 25, ...},
    {query: "brewery", id: 402, hits: 25, ...},
    {query: "chicago", id: 403, hits: 13, ...},
    {query: "chicago", id: 404, hits: 13, ...},
    {query: "restaurant", id: 405, hits: 100, ...}
  ]
  */
  // 1.
  for (let i = 0; i < searches.length; i++) {
    // 2.
    if (
      searchesPerQuery.find((x) => {
        return x.query == searches[i].query;
      }) == null
    ) {
      // a. Add an object to searchesPerQuery
      searchesPerQuery.push({ query: searches[i].query, quantity: 1 });
    } else {
      searchesPerQuery.find((x) => {
        return x.query == searches[i].query;
      }).quantity += 1;
    }
  }
  console.log(searchesPerQuery);
});

/*
searchesPerQuery:
[
  { query: brewery, quantity: 1 }
  { query: chicago, quantity: 1 }
]
*/
