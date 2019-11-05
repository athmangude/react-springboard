/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-shadow, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-grid-system';

import Item from './Item';

const items = ['day', 'week', 'month'];

const Summary = ({ accountId, label, endpoint, statType, EventHandler, alertActions, metricsActions }) => (
  <Row style={{ width: '100%', margin: 0, padding: 0 }}>
    {
      items.map((item) => (
        <Item key={item} identifier={item} accountId={accountId} label={label} endpoint={endpoint} statType={statType} EventHandler={EventHandler} alertActions={alertActions} metricsActions={metricsActions} />
      ))
    }
  </Row>
);

Summary.propTypes = {
  accountId: PropTypes.number,
  label: PropTypes.string,
  endpoint: PropTypes.string,
  statType: PropTypes.string,
  EventHandler: PropTypes.object,
  alertActions: PropTypes.object,
  metricsActions: PropTypes.object,
};

export default Summary;
