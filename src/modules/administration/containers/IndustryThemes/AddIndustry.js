import React, { Component } from 'react';

import IndustryTagPill from './components/IndustryTagPill';
import EmptyIndustryTagPill from './components/EmptyIndustryTagPill';

import ActionButton from 'SharedComponents/icon-button';

export default class AddIndustry extends Component {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: 80, backgroundColor: '#002366', color: '#fff' }}>
          <input type="text" name="industry" placeholder="industry name" style={{ height: '100%', width: '100%', padding: '10px 20px', fontSize: 25, outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%', height: 'calc(100% - 140px)', overFlow: 'auto', padding: 10 }}>
          <IndustryTagPill tag="food" />
          <IndustryTagPill tag="furniture" />
          <IndustryTagPill tag="facilities" />
          <IndustryTagPill tag="hygiene" />
          <EmptyIndustryTagPill />
        </div>
        <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ActionButton className="primary" icon="add" text="Add Industry" onClick={this.onAddIndustry} large style={{ backgroundColor: '#002366', color: '#fff', width: 'calc(100% - 40px)', height: 50, width: '100%', borderRadius: 3, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)' }} />
        </div>
      </div>
    );
  }
}
