/* eslint-disable no-nested-ternary */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const DateSegemnt = (props) => {
  const { date } = props;
  return (
    <div style={{ padding: '0 20px', margin: '30px 0 20px 0', color: '#3d4554', fontSize: 12 }} key={props.date.value.toString()}>
      <b>{moment(moment().format('YYYY-MM-DD')).diff(moment(date.value.format('YYYY-MM-DD')), 'days') <= 0 ? 'Today – ' : moment(moment().format('YYYY-MM-DD')).diff(moment(date.value.format('YYYY-MM-DD')), 'days') <= 1 ? 'Yesterday – ' : moment(moment().format('YYYY MM DD')).diff(moment(date.value.format('YYYY-MM-DD')), 'days') <= 7 ? `${moment(date.value.format('YYYY-MM-DD')).fromNow()} – ` : '' }{`${date.value.format('MMM. Do, YYYY')}`}</b>
    </div>
  );
};

DateSegemnt.propTypes = {
  date: PropTypes.object.isRequired,
};

export default DateSegemnt;
