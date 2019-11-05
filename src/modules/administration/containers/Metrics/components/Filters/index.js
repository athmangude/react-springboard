/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-grid-system';

import DateRangePicker from 'SharedComponents/mwamba-date-range-picker';

const Filters = ({ startDate, endDate, handleDateRangeChanged, alertActions, EventHandler }) => (
  <Row style={{ width: '100%', margin: 0, padding: 0 }}>
    <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ padding: '0 10px 0 10px' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20, marginTop: 10 }}>
        <DateRangePicker handleDateRangeChanged={handleDateRangeChanged} defaultStart={startDate} defaultEnd={endDate} padding={0} margin={0} EventHandler={EventHandler} alertActions={alertActions} />
      </div>
    </Col>
  </Row>
);

Filters.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  handleDateRangeChanged: PropTypes.string,
  alertActions: PropTypes.object,
  EventHandler: PropTypes.object,
};

export default Filters;
