import React, { Component } from 'react';
import axios from 'axios';

import HospitalTabs from './components/HospitalTabs';
import LineGraph from './components/LineGraph';
import HeatMap from './components/HeatMap';
import './App.css';
import { API_PATH } from './config'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitalData: {
        hospital: {},
        logs: {},
        average: {},
      }
    }

    this._fetchHospitalData = this._fetchHospitalData.bind(this);
  }

  _fetchHospitalData (hospital) {
    axios.get(`/hospital/${encodeURI(hospital)}`)
      .then(response => {
        console.log('response', response.data)
        this.setState({ hospitalData: response.data })
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"> 
          <h1 className="App-title">Alberta Emergency Room Wait Times</h1>
          <HospitalTabs fetchHospitalData={this._fetchHospitalData}/>
        </header>
        <LineGraph hospitalData={this.state.hospitalData}/>
        <HeatMap hospitalData={this.state.hospitalData}/>
      </div>
    );
  }
}

export default App;
