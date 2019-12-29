import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import tabsStyles from './tabsStyles';

const TabsWrapper = styled.div`${tabsStyles}`;

const Tabs = (props) => {
  const { tabs, active, hideContentView, style, hideBottomBorder } = props;

  return (
    <TabsWrapper style={style} hideBottomBorder={hideBottomBorder}>
      <div className="tabs-control">
        <div className="tabs-container">
          {
            tabs.map((tab) => (
              <div
                key={tab.label}
                role="button"
                className={classnames('tab', { active: tab.label.toLowerCase() === active.toLowerCase() })}
                onClick={() => {
                  if (tab.label.toLowerCase() !== active.toLowerCase()) {
                    props.onChange(tab.label);
                  }
                }}
              >
                <span>{tab.label}</span>
              </div>
            ))
          }
        </div>

        {
          props.rightControl ? (
            <div className="right-control">
              {props.rightControl}
            </div>
          ) : null
        }
      </div>
      {
        !hideContentView ? (
          <div className="tab-content-view">
            {tabs.find((tab) => tab.label.toLowerCase() === active.toLowerCase()).component}
          </div>
        ) : null
      }
    </TabsWrapper>
  );
};

Tabs.propTypes = {
  active: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  rightControl: PropTypes.node,
  hideContentView: PropTypes.bool
};

export default Tabs;
