/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const MwambaLink = ({ onClick, text, icon }) => {
  return (
    <button type="button" onClick={onClick} className="mwamba-link" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 3 }}>
      <span style={{ textTransform: 'uppercase', color: '#002366', font: '400 13px Roboto,sans-serif' }}>{text}</span>
      &nbsp;&nbsp;
      <i className="material-icons" style={{ color: '#002366', fontWeight: 'bold', fontSize: 15 }}>{icon}</i>
    </button>
  );
};

MwambaLink.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

export default MwambaLink;
