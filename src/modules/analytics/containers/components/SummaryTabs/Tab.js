/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';

import './index.css';

const Tab = ({ tab, selectedTab, onTabSelected, minimal }) => (
  <button
    type="button"
    onClick={() => onTabSelected(tab.label)}
    className="summary-tab"
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: tab.label === selectedTab ? '#f5f5f5' : '#ffffff', borderTop: selectedTab === tab.label ? 'solid 3px #002366' : 'none', padding: minimal ? '14px 10px 0' : '10px 20px 10px 20px', cursor: 'pointer', minWidth: 130, borderRight: '1px solid #dddddd', borderBottom: '1px solid #dddddd' }}
  >
    <div style={{ color: selectedTab === tab.label ? 'rgba(0,0,0,0.87)' : '#4a4a4a', font: '300 14px/14px Roboto,sans-serif', letterSpacing: 0 }}>
      <div style={{ marginBottom: 10, textAlign: 'left' }}>{tab.label}</div>
      {
        !minimal ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ font: '300 30px Roboto,sans-serif', marginRight: 10 }}>{tab.value > 999 ? numeral(tab.value).format('0.0 a').toUpperCase().replace(' ', '') : tab.value}</div>
            {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: -10, minHeight: 9, color: tab.performance > 0 ? '#0f9d58' : tab.performance < 0 ? '#db4437' : 'inherit' }}>
              <i className="material-icons" style={{ fontSize: 13, fontWeight: 'bold' }}>
                {tab.performance > 0 ? 'arrow_upward' : tab.performance < 0 ? 'arrow_downward' : 'arrow_forward' }
              </i>
              &nbsp;
              <span style={{ font: '300 12px/14px Roboto,sans-serif', letterSpacing: 0.01 }}>{`${tab.performance}%`}</span>
            </div> */}
          </div>
        ) : null
      }
    </div>
  </button>
);

Tab.propTypes = {
  tab: PropTypes.object.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabSelected: PropTypes.func.isRequired,
  minimal: PropTypes.bool,
};

export default Tab;
