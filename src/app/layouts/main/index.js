import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './main.css';

export default class MainLayout extends Component {
  render() {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ height: 64, width: 'calc(100% - 20px)', backgroundColor: '#008080', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
          <Link to="/" style={{ color: '#fff', fontSize: 20, textDecoration: 'none', textTransform: 'uppercase', fontWeight: 'bold' }}>SpringBoard</Link>
        </div>
        <div style={{ height: 'calc(100vh - 64px)', width: '100%', overflow: 'auto' }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
