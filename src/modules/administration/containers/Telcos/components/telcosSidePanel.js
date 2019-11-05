/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';

const TelcosSidePanel = (props) => {
  const { showSidePanel, onCloseSidePanel, title, children } = props;
  const windowWidth = window.innerWidth;
  return (
    <div style={{ height: '100vh', transition: 'width 0.1s', width: showSidePanel === false ? 0 : windowWidth > 425 ? 425 : '100vw', overflowY: 'auto', position: 'fixed', right: 0, top: 0, backgroundColor: '#fff', boxShadow: '3px 0 10px rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
      <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
        <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{title}</h2>
        <IconButton icon="close" onClick={onCloseSidePanel} />
      </div>
      <div>
        { children }
      </div>
    </div>
  );
};

TelcosSidePanel.propTypes = {
  showSidePanel: PropTypes.bool,
  onCloseSidePanel: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.object,
};

export default TelcosSidePanel;
