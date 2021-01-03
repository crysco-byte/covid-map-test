import "./App.css";
import * as counties from "./counties.json";
import * as d3 from "d3";

const req = new XMLHttpRequest({ mozSystem: true });
req.open(
  "GET",
  "https://raw.githubusercontent.com/crysco-byte/brazilian-homocide-by-race/main/src/homicidios-nao-negros.csv"
);
req.send();
req.onload = () => {
  console.log(req.responseText);
};

const covidCases = require("./covidcases.json");
const width = 960,
  height = 800;
const svg = d3
  .select("body")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const projection = d3.geoAlbersUsa();
const pathGen = d3.geoPath().projection(projection);

const getTotalCases = (data) => {
  let res;
  for (let i = 0; i < covidCases.length; i++) {
    if (covidCases[i].county_name === data) {
      res = covidCases[i].cases_total;
    }
  }
  return res;
};

const colorScale = d3
  .scaleOrdinal()
  .domain([covidCases.cases_total])
  .range([...d3.schemePurples[9]]);

svg
  .selectAll("path")
  .data(counties.default.features)
  .enter()
  .append("path")
  .attr("d", pathGen)
  .attr("class", "county")
  .attr("data-cases", (d) => getTotalCases(d.properties.NAME))
  .attr("class", (d) => `total cases: ${getTotalCases(d.properties.NAME)}`)
  .attr("fill", (d) => colorScale(getTotalCases(d.properties.NAME)))
  .append("title")
  .append("text")
  .attr("id", "tooltip")
  .text(
    (d) => `County: ${d.properties.NAME}
    \nTotal Cases: ${getTotalCases(d.properties.NAME)}`
  );

function App() {
  return (
    <div className="App">
      <h1 id="title">Covid-19 Cases</h1>
      <h2 id="description"> Covid-19 Cases By County 2020-12-24</h2>
    </div>
  );
}

export default App;
