/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';

import SimpleLayoutExtended from "Layouts/simple-layout-extended";

import './styles.css';

export default function NotFound() {
  return (
    <SimpleLayoutExtended>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100%', width: '100%', minHeight: 200 }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h1 style={{ fontSize: 188, color: '#bf2a2b', textShadow: '5px 5px 0 rgba(0, 0, 0, 0.7)' }}>404</h1>
        </div>
        <p style={{ fontSize: 28, color: '#3d4553', fontWeight: 100 }}>NOT FOUND</p>
      </div>
    </SimpleLayoutExtended>
  );
}
