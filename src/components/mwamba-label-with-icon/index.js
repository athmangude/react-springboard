/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';

const MwambaLabelWithIcon = ({ icon, text, style }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#52bf8a', color: '#ffffff', borderRadius: 10, padding: '0 5px', ...style }}>
    <i className="material-icons" style={{ marginRight: 5, fontSize: 15 }}>{icon}</i>
    <div>{text}</div>
  </div>
);

MwambaLabelWithIcon.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  style: PropTypes.object,
};

export default MwambaLabelWithIcon;
