/* jsx-a11y/interactive-supports-focus */

import React from 'react';
import PropTypes from 'prop-types';

const Tab = ({ tab, onTabSelected, selectedTab }) => (
  <div role="button" onClick={() => onTabSelected(tab.label)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 9, margin: '0 10px -6px 0', borderBottom: selectedTab === tab.label ? 'solid 3px #002366' : 'none', cursor: 'pointer' }}>
    <span>{tab.label}</span>
  </div>
);

Tab.propTypes = {
  tab: PropTypes.object.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabSelected: PropTypes.func.isRequired,
};

export default Tab;
