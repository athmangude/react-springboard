import React from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

const TabMenu = (props) => (
  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', position: 'sticky', top: -1, backgroundColor: '#fff', zIndex: 2, ...props.style }}>
    {
      props.tabs.map((tab) => (
        <Tab onTabSelected={props.onTabSelected} tab={tab} selectedTab={props.selectedTab} />
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
