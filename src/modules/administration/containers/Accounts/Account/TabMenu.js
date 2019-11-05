/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

const TabMenu = ({ tabs, onTabSelected, selectedTab, style }) => (
  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', borderBottom: 'solid 1px #d9d9d9', position: 'sticky', top: 0, backgroundColor: '#fff', height: 48, zIndex: 1, ...style }}>
    {
      tabs.map((tab) => (
        <Tab key={tab} onTabSelected={onTabSelected} tab={tab} selectedTab={selectedTab} />
      ))
    }
  </div>
);

TabMenu.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default TabMenu;
