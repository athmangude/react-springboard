import React from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import SidePanel from '../side-panel';

const DefaultLayout = (props) => {
  const removeLeftAndTopMarginStyle = props.removeLeftAndTopMargin ? { margin: '0 0 !important' } : {};
  const containerClass = props.removeLeftAndTopMargin ? '' : 'ui-container';

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Header />
      <div style={{ width: '100%' }}>
        <SidePanel style={{ width: 70 }} />
        <section className="head-panel main-panel main-section" style={{ paddingLeft: 51 }}>
          <div className={containerClass} style={removeLeftAndTopMarginStyle}>
            {props.children}
          </div>
        </section>
      </div>
    </div>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  removeLeftAndTopMargin: PropTypes.bool,
};

export default DefaultLayout;
