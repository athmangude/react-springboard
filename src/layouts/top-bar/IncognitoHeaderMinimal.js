import React from 'react';
import { Container, Row } from 'react-grid-system';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import mSurveyLogo from 'Images/white-logo.svg';

const IncognitoHeaderMinimal = ({ onLinkClicked }) => (
  <div className="top-navigation-bar" style={{ height: 60, backgroundColor: '#33597f', position: 'fixed', top: 0, width: '100%', zIndex: 9999999, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)' }}>
    <Container fluid>
      <Row>
        <div className="container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
          <Link to="/" onClick={() => onLinkClicked('/')}>
            <img src={logo} height={40} style={{ margin: '10px 10px 10px 20px' }} alt="logo" />
          </Link>
        </div>
      </Row>
    </Container>
  </div>
);

IncognitoHeaderMinimal.propTypes = {
  onLinkClicked: PropTypes.func,
};

export default IncognitoHeaderMinimal;
