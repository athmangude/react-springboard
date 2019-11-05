/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import { Search } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import logo from 'Images/logo.png';

import './styles.css';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100vh', width: '100%', minHeight: 200 }}>
      <img src={logo} alt="logo" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Link to="/"><i className="material-icons" style={{ color: '#d9d9d9', fontSize: 35, margin: '0 3px 0 0', direction: 'rtl', position: 'relative', bottom: -175 }}>home</i></Link>
        <h1 style={{ fontSize: 188, color: '#bf2a2b', textShadow: '5px 5px 0 rgba(0, 0, 0, 0.7)' }}>404</h1>
      </div>
      <p style={{ fontSize: 28, color: '#3d4553', fontWeight: 100 }}>Oops! This page does not exist.</p>
      <Search
        className="search-custom-white"
        open={false}
        icon="search"
        style={{
          marginRight: 10,
          backgroundColor: 'white !important',
          border: 'solid 1px #6d6e71',
        }}
      />
      <span style={{ margin: '60px 0', fontSize: 12, color: '#808285' }}>&copy; Copyright 2012 - {moment().format('YYYY')}</span>
    </div>
  );
}
