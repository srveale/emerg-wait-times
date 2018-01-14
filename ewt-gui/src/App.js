import React, { Component } from 'react';
import axios from 'axios';

import HospitalTabs from './components/HospitalTabs';
import HospitalSelect from './components/HospitalSelect';
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
    console.log('hospital in fetch', hospital)
    axios.get(`/hospital/${encodeURI(hospital)}`)
      .then(response => {
        this.setState({ hospitalData: response.data })
      })
  }

  componentWillMount () {
    this._fetchHospitalData('aggregate');
  }

  render() {
    const currentHospital = this.state.hospitalData.hospital;
    return (
      <div className="App">
        <h1>Alberta Emergency Room Wait Times</h1>
        <p></p>
        <h2>Average wait times {currentHospital !== 'aggregate' ? `for ${currentHospital}`: 'across Alberta'}</h2>
        <HospitalSelect fetchHospitalData={this._fetchHospitalData}/>
        <LineGraph hospitalData={this.state.hospitalData}/>
        <h3>Hourly breakdown</h3>
        <HeatMap hospitalData={this.state.hospitalData}/>
      </div>
    );
  }
}

export default App;
