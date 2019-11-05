/* jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';

const Tab = (props) => (
  <div
    role="button"
    onClick={() => props.onTabSelected(props.tab.label)}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 9, margin: '0 10px', borderBottom: props.selectedTab === props.tab.label ? 'solid 2px #002366' : 'none', cursor: 'pointer', height: 48,
    }}
  >
    <span>{props.tab.label}</span>
  </div>
);

Tab.propTypes = {
  tab: PropTypes.object.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabSelected: PropTypes.func.isRequired,
};

export default Tab;
