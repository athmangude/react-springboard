/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';

import Tab from './Tab';

const SummaryTabs = ({ tabs, style, selectedTab, onTabSelected, minimal }) => (
  <div className="hide-scrollbars" style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#fff', overflowX: 'auto', ...style }}>
    {
      tabs.map((tab) => (
        <Tab onTabSelected={onTabSelected} tab={tab} selectedTab={selectedTab} minimal={minimal} />
      ))
    }
  </div>
);

SummaryTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
  minimal: PropTypes.bool,
};

export default SummaryTabs;
