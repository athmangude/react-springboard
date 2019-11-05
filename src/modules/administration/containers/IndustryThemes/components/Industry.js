import React, { Component } from 'react';

import Theme from './Theme';

export default class Industry extends Component {
  render() {
    return (
      <div className="industry-theme" style={{ boxShadow: '0 0 1px rgba(0, 0, 0, 0.6)', borderRadius: 8, minHeight: 100, width: 200, margin: 10, cursor: 'pointer' }}>
        <div className="heading" style={{ padding: 10 }}>
          Hospitality
        </div>
        <div className="content">
          <Theme />
          <Theme />
        </div>
      </div>
    );
  }
}
