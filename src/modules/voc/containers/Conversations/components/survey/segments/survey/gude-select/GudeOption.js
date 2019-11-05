import React from 'react';
import PropTypes from 'prop-types';

import './GudeOption.css';

const GudeOption = (props) => (
  <div
    className="gude-option"
    style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', backgroundColor: '#fff', borderBottom: 'solid 1px #d9d9d9', padding: 5, width: '100%' }}
    onClick={() => props.onClick(props.value)}
    role="button"
    tabIndex={0}
  >
    <b>{props.title}</b>
    <span style={{ fontSize: 10, lineHeight: 1 }}>{props.description}</span>
  </div>
);

GudeOption.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  onClick: PropTypes.func.isRequired,
};

export default GudeOption;
