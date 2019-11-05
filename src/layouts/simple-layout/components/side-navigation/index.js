/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import styles from './index.css';

const SideNavigationWrapper = styled.div`
  ${styles}
`;

const SideNavigation = (props, context) => {
  const { windowWidth, action } = props;
  const { router } = context;
  const { path } = router.route.match;

  if (windowWidth > 768) {
    // return a large menu on large screens
    return (
      <SideNavigationWrapper
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {action ? (
          <div
            style={{
              display: 'flex',
              alingItems: 'center',
              justifyContent: 'center',
              padding: '10px 0',
            }}
          >
            {action('large')}
          </div>
        ) : (
          <div style={{ margin: '5px 0', width: '100%' }} />
        )}
        <Link
          to="/accounts"
          className={`side-navigation-link ${
            path.indexOf('/accounts') > -1 ? 'active' : ''
          }`}
          style={{
            color: '#000000de',
            padding: 10,
            display: 'flex',
          }}
        >
          <i
            className="material-icons"
            style={{ fontSize: 20, margin: '0 10px' }}
          >
            business
          </i>
          <span>Accounts</span>
        </Link>
        <Link
          to="/metrics"
          className={`side-navigation-link ${
            path.indexOf('/metrics') > -1 ? 'active' : ''
          }`}
          style={{
            color: '#000000de',
            padding: 10,
            display: 'flex',
          }}
        >
          <i
            className="material-icons"
            style={{ fontSize: 20, margin: '0 10px' }}
          >
            dashboard
          </i>
          <span>Metrics</span>
        </Link>
        <Link
          to="/telcos"
          className={`side-navigation-link ${
            path.indexOf('/telcos') > -1 ? 'active' : ''
          }`}
          style={{
            color: '#000000de',
            padding: 10,
            display: 'flex',
          }}
        >
          <i
            className="material-icons"
            style={{ fontSize: 20, margin: '0 10px' }}
          >
            network_cell
          </i>
          <span>Telcos</span>
        </Link>
        <Link
          to="/participant-history"
          className={`side-navigation-link ${
            path.indexOf('/participant-history') > -1 ? 'active' : ''
          }`}
          style={{
            color: '#000000de',
            padding: 10,
            display: 'flex',
          }}
        >
          <i
            className="material-icons"
            style={{ fontSize: 20, margin: '0 10px' }}
          >
            supervisor_account
          </i>
          <span>Participant History</span>
        </Link>
        {/*
        <Link to="/industry-themes" className={`side-navigation-link ${path.indexOf('/industry-themes') > -1 ? 'active' : ''}`} style={{ color: '#000000de', padding: 10, width: '100%', display: 'flex' }}>
          <i className="material-icons" style={{ fontSize: 20, margin: '0 10px' }}>loyalty</i>
          <span>Themes</span>
        </Link>
        */}
      </SideNavigationWrapper>
    );
  }

  // otherwise return a small menu on smaller screens
  return (
    <SideNavigationWrapper
      style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {action ? (
        <div
          style={{
            display: 'flex',
            alingItems: 'center',
            justifyContent: 'center',
            padding: '10px 0',
          }}
        >
          {action('small')}
        </div>
      ) : null}
      <Link
        to="/accounts"
        className={`side-navigation-link ${
          path.indexOf('/accounts') > -1 ? 'active' : ''
        }`}
        style={{
          color: '#000000de',
          padding: 10,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i className="material-icons" style={{ fontSize: 20, margin: 0 }}>
          business
        </i>
      </Link>
      {/*
      <Link to="/industry-themes" className={`side-navigation-link ${path.indexOf('/industry-themes') > -1 ? 'active' : ''}`} style={{ color: '#000000de', padding: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="material-icons" style={{ fontSize: 20, margin: 0 }}>loyalty</i>
      </Link>
      */}
    </SideNavigationWrapper>
  );
};

SideNavigation.contextTypes = {
  router: PropTypes.object.isRequired,
};

SideNavigation.propTypes = {
  action: PropTypes.func,
  windowWidth: PropTypes.number.isRequired,
};

export default SideNavigation;
