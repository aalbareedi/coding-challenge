let fileSelector = document.querySelector("#fileSelector");
let barChart = document.querySelector("#barChart");
let zeroHitsWrapper = document.querySelector("#zeroHitsWrapper");

fileSelector.addEventListener("change", async () => {
  // Getting the file object from files array
  let file = fileSelector.files[0];
  // Getting the file contents
  let contents = await file.text();

  // Converting the file contents to an array of objects
  let searches = d3.csvParse(contents);
  let searchesPerQuery = [];

  // TODO: Count the number of searches per query,
  // and put the totals in a new array.

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
      searchesPerQuery.push({
        query: searches[i].query,
        hits: searches[i].hits, // Keep the hits
        quantity: 1,
      });
    } else {
      searchesPerQuery.find((x) => {
        return x.query == searches[i].query;
      }).quantity += 1;
    }
  }

  /*
  searchesPerQuery:
  [
    { query: brewery, quantity: 3, hits: 25 },
    { query: chicago, quantity: 2, hits: 13 },
    { query: restaurant, quantity: 1, hits: 100 }
  ]
  */

  // Make a new array containing the searches with 0 hits
  let zeroHitSearches = searchesPerQuery.filter((x) => {
    return x.hits == 0;
  });

  zeroHitSearches.sort((a, b) => {
    // Descending
    return b.quantity - a.quantity;
  });

  searchesPerQuery.sort((a, b) => {
    // Ascending
    return a.quantity - b.quantity;
  });

  let topSearches = searchesPerQuery.slice(
    searchesPerQuery.length - 20,
    searchesPerQuery.length
  );

  addBarChart();

  function addBarChart() {
    // https://www.d3-graph-gallery.com/graph/barplot_horizontal.html

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 150 },
      width = 414 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    let scale = window.innerWidth / 414;
    if (scale > 2) scale = 2;

    barChart.style.transform = `scale(${scale})`;
    barChart.style.marginTop = `${window.innerWidth / 3}px`;
    barChart.style.marginBottom = `${window.innerWidth / 3}px`;
    barChart.innerHTML = `<h1>Top 20 searches</h1>`;

    // append the svg object to the body of the page
    const svg = d3
      .select("#barChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add X axis
    const x = d3.scaleLinear().domain([0, 130]).range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(topSearches.map((d) => d.query))
      .padding(0.1);
    svg.append("g").call(d3.axisLeft(y));

    //Bars
    svg
      .selectAll("myRect")
      .data(topSearches)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.query))
      .attr("width", (d) => {
        return x(d.quantity);
      })
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");
  }

  // 1. Add a table tag, with headers
  // 2. For each of the zeroHitSearches...
  // a. Add a tr tag to the table
  // b. Add a td tag for each column (query and quantity)

  zeroHitsWrapper.innerHTML = `
    <h1>Searches with zero hits</h1>
    <table>
      <thead>
        <tr>
          <td>Search Term</td>
          <td>Quantity</td>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

  let tbody = zeroHitsWrapper.querySelector("tbody");

  for (let i = 0; i < zeroHitSearches.length; i++) {
    tbody.innerHTML += `
      <tr>
        <td>${zeroHitSearches[i].query}</td>
        <td>${zeroHitSearches[i].quantity}</td>
      </tr>
    `;
  }

  /*
    <table>
      <thead>
        <tr>
          <td>Search Term</td>
          <td>Quantity</td>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>brewery</td>
          <td>3</td>
        </tr>
        <tr>
          <td>chicago</td>
          <td>10</td>
        </tr>
        <tr>
          <td>italian</td>
          <td>17</td>
        </tr>
      </tbody>
    </table>
  */
});
