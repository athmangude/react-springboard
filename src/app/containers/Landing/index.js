import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './index.css';

// import usabilityImage from 'Images/usability.png';

@connect((state) => ({
  ...state
}), (dispatch) => ({

}))
export default class Landing extends Component {
  state = {
    counter: 0,
  }

  render() {
    return (
      <section style={{ margin: 10 }}>
        <h1>Build something amazing</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </section>
    );
  }
}
