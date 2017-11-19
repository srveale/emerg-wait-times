import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
        moreToggled: false,
        firstRender: true,
    }
  }

  componentWillReceiveProps(nextProps) {
      // this.setState({
      //     artistName: nextProps.artistData.artistName,
      //     error: nextProps.artistData.error,
      //     firstRender: true,
      // });
  }

  render(){
    <div><div>
  }
}