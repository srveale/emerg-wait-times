import React, { Component } from 'react';
import { HOSPITALS } from '../constants'

class HospitalTabs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: false
    }
  }
  render() {
    return (
      <div className="hospital-tabs">
          {HOSPITALS.map(hospital => {
            return (
              <a 
                href="#"
                onClick={() => this.props.fetchHospitalData(hospital.long)}
                key={`${hospital.short}-tab`}>
                {hospital.short} 
              </a>
            )
          })}
      </div>
    );
  }
}

export default HospitalTabs;
