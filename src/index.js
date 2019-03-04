import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Landing from './app/containers/Landing'

class App extends Component {
  render() {
    return (
      <div>
        <h1>Build something awesome now!</h1>
        <Landing />
      </div>
    );
  }
}

const mountPoint = document.getElementById("app");

ReactDOM.render(<App />, mountPoint);

if (module.hot) {
  module.hot.accept();
}
