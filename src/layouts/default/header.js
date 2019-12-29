import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './header.css';
import logo from 'Images/white-logo.svg';

const AppHeader = (props) => props.authentication.user ?
  (
    <div style={{ height: 60, backgroundColor: '#33597f', position: 'sticky', top: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999999 }}>
      <div className="container" style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <img src={logo} height={40} width={178} style={{ margin: 10 }} alt="logo" />
      </div>
    </div>
  ) : (
    <div />
  );

AppHeader.propTypes = {
  authentication: PropTypes.object.isRequired,
};

export default connect((state) => ({
  authentication: state.authentication,
}))(AppHeader);
