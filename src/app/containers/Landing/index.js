import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './index.css';

import usabilityImage from 'Images/usability.png';

@connect((state) => ({
  ...state
}), (dispatch) => ({

}))
export default class Landing extends Component {
  render() {
    console.log('[this.props]', this.props);
    return (
      <section>
        <img alt="banner" src={usabilityImage} style={{ width: '100%' }} />
      </section>
    );
  }
}
