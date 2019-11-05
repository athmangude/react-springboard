import React from 'react';
import { BarLoader } from 'react-spinners';

import themes from 'SharedComponents/themes';

const { primaryColor } = themes.light;

import logo from 'Images/logo.png';

const LoadingIndicator = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', flexDirection: 'column' }}>
    <img src={logo} className="image" alt="logo" style={{ height: 100, width: 100, marginBottom: 20 }} />
    <BarLoader color={primaryColor} size={50} loading />
  </div>
);

export default LoadingIndicator;
