import React, { Component } from 'react';
import * as d3 from "d3";
import moment from 'moment';

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
        hospitalData: {},
        responseError: "",
        firstRender: true,
    }

    this.renderFirst = this.renderFirst.bind(this);
    this.subsequentRender = this.subsequentRender.bind(this);
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
          hospitalData: nextProps.hospitalData,
          responseError: "",
          firstRender: true,
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!document.getElementsByClassName("legendElement").length) {
      this.renderFirst();
    } else {
      this.subsequentRender();
    }
  }

  renderFirst() {
    const secondsPerInterval = 86400 / this.state.hospitalData.average[0].averages[0].daily.length;
    const data = this.state.hospitalData.average[0].averages[0].daily.map((ave, i) => {
      const secondsFromStart = i * secondsPerInterval;
      const timeFromStart = moment(0).startOf('day').add(secondsFromStart, 'seconds');
      return { index: i, value: ave, timeFromStart: timeFromStart.toDate() };
    });

    const svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime()
        .domain([data[1].timeFromStart, data[data.length-1].timeFromStart])
        .rangeRound([0, width]);

    const y = d3.scaleLinear()
        .rangeRound([height, 0]);

    const line = d3.line()
        .x(d => x(d.timeFromStart))
        .y(d => y(d.value));

    y.domain([30, 240]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Wait Time (min)");

    g.append("path")
        .datum(data)
        .attr("id", "line-graph-path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
  }

  subsequentRender() {
    const secondsPerInterval = 86400 / this.state.hospitalData.average[0].averages[0].daily.length;
    const data = this.state.hospitalData.average[0].averages[0].daily.map((ave, i) => {
      const secondsFromStart = i * secondsPerInterval;
      const timeFromStart = moment(0).startOf('day').add(secondsFromStart, 'seconds');
      return { index: i, value: ave, timeFromStart: timeFromStart.toDate() };
    });

    const svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime()
        .domain([data[1].timeFromStart, data[data.length-1].timeFromStart])
        .rangeRound([0, width]);

    const y = d3.scaleLinear()
        .rangeRound([height, 0]);

    const line = d3.line()
        .x(d => x(d.timeFromStart))
        .y(d => y(d.value));

    y.domain([30, 240]);

    d3.selectAll("#line-graph-path").remove();

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Wait Time (min)");

    g.append("path")
        .datum(data)
        .attr("id", "line-graph-path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("class", "line-graph-path")
        .attr("d", line);
  }

  render() {
    return (
      <div>
        <h3>Daily Breakdown</h3>
        <p className="chart-subheader">average wait time in minutes for a given time of day</p>
        <svg width="960" height="500"></svg>
      </div>
    );
  }
}