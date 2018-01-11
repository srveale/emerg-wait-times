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
    return (
      <div className="App">
        <h2> Average wait times across Alberta </h2>
        <LineGraph hospitalData={this.state.hospitalData}/>
        <HospitalSelect fetchHospitalData={this._fetchHospitalData}/>
        <h3>Hourly breakdown</h3>
        <HeatMap hospitalData={this.state.hospitalData}/>
      </div>
    );
  }
}

export default App;
