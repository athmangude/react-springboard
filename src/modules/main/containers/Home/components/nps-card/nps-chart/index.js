import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import NPSChartStyles from './NPSChartStyles';

const NPSChartWrapper = styled.div`${NPSChartStyles}`;

const NPSChart = (props) => {
  const {
    detractors, passives, promoters, total,
  } = props;

  return (
    <NPSChartWrapper>
      {
        detractors !== '0' && (
          <button type="button" className="detractors nps-group" style={{ width: `${(detractors / total * 100).toFixed(0)}%` }} onClick={() => props.onFeedFiltersChanged({ detractors: true, passives: false, promoters: false }, true)}></button>
        )
      }
      {
        passives !== '0' && (
          <button type="button" className="passives nps-group" style={{ width: `${(passives / total * 100).toFixed(0)}%` }} onClick={() => props.onFeedFiltersChanged({ detractors: false, passives: true, promoters: false }, true)}></button>
        )
      }
      {
        promoters !== '0' && (
          <button type="button" className="promoters nps-group" style={{ width: `${(promoters / total * 100).toFixed(0)}%` }} onClick={() => props.onFeedFiltersChanged({ detractors: false, passives: false, promoters: true }, true)}></button>
        )
      }
    </NPSChartWrapper>
  );
};

NPSChart.propTypes = {
  detractors: PropTypes.number.isRequired,
  passives: PropTypes.number.isRequired,
  promoters: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onFeedFiltersChanged: PropTypes.func.isRequired,
};

export default NPSChart;
