import React from 'react';
import PropTypes from 'prop-types';

const Theme = ({ theme, color, onClick }) => (
  <div style={{ height: 25, borderRadius: 12.5, border: 'solid 1px #e2e4eb', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color, padding: '0px 5px 0 12px', marginRight: 10 }}>
    <div style={{ fontSize: 12, fontWeight: 900, marginRight: 10 }}>{theme}</div>
    <button onClick={() => onClick(theme)} style={{ width: 16, height: 16, backgroundColor: '#d9d9d9', borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
      <i className="material-icons" style={{ fontSize: 10, color: '#ffffff', paddingTop: 2 }}>close</i>
    </button>
  </div>
);

Theme.propTypes = {
  theme: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
};

export default Theme;
