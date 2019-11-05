/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-grid-system';

import Item from './Item';

const items = ['day', 'week', 'month'];

const Summary = ({ currency, width, activeSegment, customerAnalyticsActions, appliedFilters, startDate, endDate, EventHandler }) => (
  <Row style={{ width: '100%', margin: 0, padding: 0 }}>
    {
      items.map((item) => (
        <Item key={item} identifier={item} currency={currency} width={width} activeSegment={activeSegment} customerAnalyticsActions={customerAnalyticsActions} startDate={startDate} endDate={endDate} appliedFilters={appliedFilters} EventHandler={EventHandler} />
      ))
    }
  </Row>
);

Summary.propTypes = {
  width: PropTypes.number,
  activeSegment: PropTypes.object,
  customerAnalyticsActions: PropTypes.object,
  appliedFilters: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  EventHandler: PropTypes.object,
  currency: PropTypes.string,
};

export default Summary;
