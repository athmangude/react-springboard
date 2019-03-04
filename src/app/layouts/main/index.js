import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './main.css';

export default class MainLayout extends Component {
  render() {
    return (
      <div>
        <div style={{ height: 64, width: '100%', backgroundColor: 'teal' }}>
          <Link to="/settings">Settings</Link>
        </div>
        <div style={{ height: 'calc(100vh - 64px)', width: '100%', overflow: 'auto' }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
