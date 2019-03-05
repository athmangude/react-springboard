import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './main.css';

import usabilityImage from 'Images/usability.png';

@connect((state) => ({
  ...state
}), (dispatch) => ({

}))
export default class MainLayout extends Component {
  render() {
    console.log(this.props);
    return (
      <main style={{ width: '100%' }}>
        <aside style={{ height: 64, width: '100%', backgroundColor: '#008080', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Link to="/" style={{ color: '#fff', fontSize: 25, textDecoration: 'none', textTransform: 'uppercase', fontWeight: 'bold', marginLeft: 10 }}>Spring Board</Link>
        </aside>
        <section style={{ height: 'calc(100vh - 64px)', width: '100%', overflow: 'auto' }}>
          {this.props.children}
        </section>
      </main>
    )
  }
}
