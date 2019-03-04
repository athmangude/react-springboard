import React, { Component } from 'react';

import './index.css';

import usabilityImage from '../../../assets/images/usability.png';

export default class Landing extends Component {
  render() {
    return (
      <div className="dark">
        Landing page will come here in a few
        <img src={usabilityImage} />
      </div>
    );
  }
}
