import React, { Component } from 'react';
import '../App.css';
import * as d3 from "d3";

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
        firstRender: true,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        hospitalData: nextProps.hospitalData,
        responseError: "",
        firstRender: true,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const margin = { top: 50, right: 0, bottom: 100, left: 30 },
        width = 960 - margin.left - margin.right,
        height = 430 - margin.top - margin.bottom,
        gridSize = Math.floor(width / 24),
        legendElementWidth = gridSize * 2,
        buckets = 9,
        colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
        days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

    const data = this.state.hospitalData.average[0].averages[0].weekly.map((ave, i) => {
      return { day: Math.floor(i / 24) + 1, hour: i % 24 + 1, value: ave };
    });

    const svg = d3.select("#heatmap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const dayLabels = svg.selectAll(".dayLabel")
        .data(days)
        .enter().append("text")
          .text(d => d)
          .attr("x", 0)
          .attr("y", (d, i) =>  i * gridSize)
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
          .attr("class", (d, i) => ((i >= 1 && i <= 5) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));

    const timeLabels = svg.selectAll(".timeLabel")
        .data(times)
        .enter().append("text")
          .text(d => d)
          .attr("x", (d, i) => i * gridSize)
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + gridSize / 2 + ", -6)")
          .attr("class", (d, i) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));

    const heatmapChart = function(data) {
      const colorScale = d3.scaleQuantile()
          .domain([60, buckets - 1, d3.max(data,  (d) => d.value)])
          .range(colors);

      const cards = svg.selectAll(".hour")
          .data(data, (d) => d.day+':'+d.hour);

      cards.append("title");

      cards.enter().append("rect")
          .attr("x", d => (d.hour - 1) * gridSize)
          .attr("y", d => (d.day - 1) * gridSize)
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", "hour bordered")
          .attr("width", gridSize)
          .attr("height", gridSize)
          .style("fill", d => colorScale(d.value));

      cards.transition().duration(1000)
          .style("fill", d => {
            console.log('colour transition', d.value)
            return colorScale(d.value);
          });

      cards.select("title").text(d => d.value);
      
      cards.exit().remove();

      const legend = svg.selectAll(".legend")
          .data([0].concat(colorScale.quantiles()), d => d);

      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
        .attr("x", (d, i) => legendElementWidth * i)
        .attr("y", height)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", (d, i) => colors[i]);

      legend.append("text")
        .attr("className", "mono")
        .text(d => "≥ " + Math.round(d))
        .attr("x", (d, i) => legendElementWidth * i)
        .attr("y", height + gridSize);

      legend.exit().remove();
    };  

    heatmapChart(data);
  }

  render() {
    return (
      <div width="960" height="500" id="heatmap">
        <div className="legend"></div>
      </div>
    );
  }
}

export default App;
