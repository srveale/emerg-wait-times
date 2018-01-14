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
        hospital: 'aggregate',
        logs: {},
        average: {},
      }
    }

    this._fetchHospitalData = this._fetchHospitalData.bind(this);
  }

  _fetchHospitalData (hospital) {
    axios.get(`/hospital/${encodeURI(hospital)}`)
      .then(response => {
        console.log('hospital in fetch', response.data)
        this.setState({ hospitalData: response.data })
      })
  }

  componentWillMount () {
    this._fetchHospitalData('aggregate');
  }

  render() {
    const { hospitalData } = this.state;
    const currentHospital = hospitalData.hospital;
    const isAggregate = currentHospital === 'aggregate';
    console.log('hospitalData', hospitalData)
    
    console.log('currentHospital', currentHospital)
    console.log('isAggregate', isAggregate)
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Alberta Emergency Room Wait Times</h1>
        </header>
        <h2>Wait times {isAggregate ? `for ${currentHospital}`: 'across the region'}</h2>
        <HospitalSelect fetchHospitalData={this._fetchHospitalData}/>
        {!isAggregate && <p>Current wait time: {hospitalData.logs[hospitalData.logs.length - 1].waitTime}</p>}
        <LineGraph hospitalData={this.state.hospitalData}/>
        <br/>
        <HeatMap hospitalData={this.state.hospitalData}/>
      </div>
    );
  }
}

export default App;
