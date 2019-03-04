import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Routes from './app/routes';

class App extends Component {
  render() {
    return (
      <Routes />
    );
  }
}

const mountPoint = document.getElementById("app");

ReactDOM.render(<App />, mountPoint);

if (module.hot) {
  module.hot.accept();
}
