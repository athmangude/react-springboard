import React, { Component } from 'react';

import './index.css';

import usabilityImage from 'Images/usability.png';

export default class Landing extends Component {
  render() {
    return (
      <div>
        <img src={usabilityImage} style={{ width: '100%' }} />
      </div>
    );
  }
}
