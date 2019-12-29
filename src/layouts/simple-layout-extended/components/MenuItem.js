import React from 'react';
import PropTypes from 'prop-types';

import './menuItem.scss';

const MenuItem = (props) => (
  <div className="menu-item">
    {props.text}
  </div>
);

MenuItem.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MenuItem;
