import React, { Component } from 'react';

import IconButton from 'SharedComponents/icon-button';

export default class NewIndustryTagPill extends Component {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'fit-content', padding: '10px 5px 10px 20px', margin: 10, height: 50, borderRadius: 25, border: 'dashed 3px rgba(0, 0, 0, 0.4)' }}>
        <span style={{ fontSize: 24 }}>
          <input type="text" placeholder="new theme" style={{ outline: 'none', width: 100 }} />
        </span>
        <IconButton icon="add" style={{ margin: '0 5px 0 10px', backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'rgba(0, 0, 0, 0.9)' }} />
      </div>
    );
  }
}
