/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'SharedComponents/icon-button';

const RightDrawer = (props) => {
  const {
    drawn, show, children,
  } = props;

  const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child, { ...props }));
  return (
    <div
      style={{
        width: props.windowDimensions.width > 425 ? 300 : '100%',
        height: '100vh',
        position: 'absolute',
        top: 0,
        right: drawn ? 0 : (!show && props.windowDimensions.width > 425) ? -300 : (!show && props.windowDimensions.width <= 425) ? 'calc(0px - 100%)' : 0,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        transition: 'right 0.2s',
        backgroundColor: '#fff',
      }}
    >
      {childrenWithProps}
    </div>
  );
};

RightDrawer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  show: PropTypes.bool.isRequired,
  drawn: PropTypes.bool.isRequired,
  onToggleRightDrawer: PropTypes.func.isRequired,
  windowDimensions: PropTypes.object.isRequired,
};

export default RightDrawer;
