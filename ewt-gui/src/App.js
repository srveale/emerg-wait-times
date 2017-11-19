import React, { Component } from 'react';
import axios from 'axios';

import HospitalTabs from './components/HospitalTabs';
import './App.css';
import { API_PATH } from './config'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitalData: {
        hospital: {},
        recent: {},
        averages: {},
      }
    }

    this._fetchHospitalData = this._fetchHospitalData.bind(this);
  }

  _fetchHospitalData (hospital) {
    console.log('fetching hospital data')
    axios.get(`/hospital/${encodeURI(hospital)}`)
      .then(response => {
        console.log('response')
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"> 
          <h1 className="App-title">Alberta Emergency Room Wait Times</h1>
          <HospitalTabs fetchHospitalData={this._fetchHospitalData}/>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
