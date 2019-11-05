import React from 'react';
import PropTypes from 'prop-types';

import './menu.scss';

const SideMenu = (props) => (
  <div className="side-menu" style={{ display: 'flex', width: '100%' }}>
    {props.children}
  </div>
);

SideMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default SideMenu;
