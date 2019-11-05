/* eslint-disable jsx-a11y/href-no-hash, no-shadow, no-nested-ternary, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { XMasonry, XBlock } from 'react-xmasonry/dist/index';

import Impact from '../../components/ImpactBarChart';
import KDA from '../../components/KeyDriverAnalysis';
import RewardsAndPenalties from '../../components/RewardsAndPenalties';

const Analytical = ({ windowDimensions, customerAnalyticsActions, alertActions, EventHandler, colors, selectedDateRange, themes, isLoadingThemes, appliedFilters, selectedSegment, demoMode }) => {
  const { width } = windowDimensions;

  return (
    <div id="loyalty-analytical">
      <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="themes-impact" width={3}>
            <Impact themes={themes} isLoadingThemes={isLoadingThemes} colors={colors} width={width} selectedDateRange={selectedDateRange} selectedSegment={selectedSegment} appliedFilters={appliedFilters} demoMode={demoMode} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} minimal />
          </XBlock>
        </XMasonry>
      </div>
      <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="themes-kda" width={3}>
            <KDA themes={themes} isLoadingThemes={isLoadingThemes} colors={colors} width={width} selectedDateRange={selectedDateRange} selectedSegment={selectedSegment} appliedFilters={appliedFilters} demoMode={demoMode} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} minimal />
          </XBlock>
        </XMasonry>
      </div>
      <div style={{ width: '100%' }}>
        <XMasonry>
          <XBlock key="themes-rewards-penalties" width={3}>
            <RewardsAndPenalties themes={themes} isLoadingThemes={isLoadingThemes} colors={colors} width={width} selectedDateRange={selectedDateRange} selectedSegment={selectedSegment} appliedFilters={appliedFilters} demoMode={demoMode} customerAnalyticsActions={customerAnalyticsActions} EventHandler={EventHandler} alertActions={alertActions} minimal />
          </XBlock>
        </XMasonry>
      </div>
    </div>
  );
};

Analytical.propTypes = {
  colors: PropTypes.array,
  themes: PropTypes.object,
  isLoadingThemes: PropTypes.bool,
  selectedDateRange: PropTypes.object,
  appliedFilters: PropTypes.array,
  demoMode: PropTypes.bool,
  selectedSegment: PropTypes.object,
  windowDimensions: PropTypes.object,
  customerAnalyticsActions: PropTypes.object,
  alertActions: PropTypes.object,
  EventHandler: PropTypes.object,
};

export default Analytical;
