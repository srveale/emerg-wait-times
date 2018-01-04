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
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
          hospitalData: nextProps.hospitalData,
          responseError: "",
          firstRender: true,
      });
  }

  componentDidUpdate(prevProps, prevState){
    console.log('this.state.hospitalData', this.state.hospitalData)
    const secondsPerInterval = 86400 / this.state.hospitalData.average[0].averages[0].daily.length;
    const data = this.state.hospitalData.average[0].averages[0].daily.map((ave, i) => {
      const secondsFromStart = i * secondsPerInterval;
      const timeFromStart = moment(0).startOf('day').add(secondsFromStart, 'seconds');
      if (i === 0) console.log('secondsFromStart', secondsFromStart, 'timeFromStart', timeFromStart)
      return { index: i, value: ave, timeFromStart: timeFromStart.toDate() };
    });

    if (this.state.firstRender) {
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

      // x.domain(d3.extent(data, d => d.timeFromStart));
      y.domain([30, 200]);

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
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);
    }
  }

  render() {
    return (
      <svg width="960" height="500"></svg>
    );
  }
}