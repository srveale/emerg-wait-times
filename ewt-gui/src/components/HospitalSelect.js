import React, { Component } from 'react';
import { HOSPITALS } from '../constants'

class HospitalSelect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: false
    }
  }
  render() {
    return (
      <div className="hospital-select">
        <label htmlFor="#mainselection">Select a hospital: </label>
        <select id="mainselection" onChange={(e) => this.props.fetchHospitalData(e.target.value)}>
          {HOSPITALS.map(hospital => {
            return (
              <option
                key={`${hospital.short}-option`}
                value={hospital.long}>
                {hospital.short}
              </option>
            )
          })}
        </select>
      </div>
    );
  }
}

export default HospitalSelect;
