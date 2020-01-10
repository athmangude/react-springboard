/* eslint-disable radix */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from 'material-components';

import ActionButton from 'SharedComponents/action-button';

import themes from 'SharedComponents/themes';

const { primaryColor, lightPrimaryColor, primaryTextColor, secondaryTextColor, errorColor, successColor, actionSurfaceTextColor } = themes.light;

export default class DateRangePicker extends Component {
  static propTypes = {
    feedFilters: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onMenuClose: PropTypes.func.isRequired,
    returnDateInUTC: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    const { feedFilters } = props;

    this.state = {
      calendar: {
        startCalendarDay: parseInt(moment(feedFilters.from).format('DD')),
        startCalendarMonth: parseInt(moment(feedFilters.from).format('M')) - 1,
        startCalendarYear: parseInt(moment(feedFilters.from).format('YYYY')),
        endCalendarDay: parseInt(moment(feedFilters.to).format('DD')),
        endCalendarMonth: parseInt(moment(feedFilters.to).format('M')) - 1,
        endCalendarYear: parseInt(moment(feedFilters.to).format('YYYY')),
      },
      startDate: {
        day: parseInt(moment(feedFilters.from).format('DD')),
        month: parseInt(moment(feedFilters.from).format('M')),
        year: parseInt(moment(feedFilters.from).format('YYYY')),
      },
      endDate: {
        day: parseInt(moment(feedFilters.to).format('DD')),
        month: parseInt(moment(feedFilters.to).format('M')),
        year: parseInt(moment(feedFilters.to).format('YYYY')),
      },
      visibleCalendar: 'start',
    };
  }

  getChildContext() {
    return {
      componentStyle: {
        primaryColor,
        primaryFontColor: primaryTextColor,
        secondaryColor,
        secondaryFontColor: secondaryTextColor,
        errorColor,
        successColor,
        typographyColor: actionSurfaceTextColor,
      },
    };
  }

  setStartCalendar = (changes) => {
    this.setState({ ...changes });
  }

  setEndCalendar = (changes) => {
    this.setState({ ...changes });
  }

  setStartCalendarDate = (date) => {
    const { startDate } = this.state;
    const nextDate = moment(date);
    this.setState({
      startDate: {
        ...startDate, day: parseInt(nextDate.format('DD')), month: parseInt(nextDate.format('M')), year: parseInt(nextDate.format('YYYY')),
      },
    });
  }

  setEndCalendarDate = (date) => {
    const { endDate } = this.state;
    const nextDate = moment(date);
    this.setState({
      endDate: {
        ...endDate, day: parseInt(nextDate.format('DD')), month: parseInt(nextDate.format('M')), year: parseInt(nextDate.format('YYYY')),
      },
    });
  }

  onApplyChanges = () => {
    const { startDate, endDate } = this.state;
    const { onChange, onMenuClose, returnDateInUTC } = this.props;

    let from = moment(`${startDate.year}-${startDate.month}-${startDate.day}`).startOf('day').format();
    let to = moment(`${endDate.year}-${endDate.month}-${endDate.day}`).endOf('day').format();

    if (returnDateInUTC) {
      from = moment(`${startDate.year}-${startDate.month}-${startDate.day}`).utc().endOf('day').format();
      to = moment(`${endDate.year}-${endDate.month}-${endDate.day}`).utc().endOf('day').format();
    }
    onChange({
      from,
      to,
      timeRangeLabel: 'Custom\u00a0Range',
    });

    onMenuClose();
  }

  render() {
    const {
      calendar, startDate, endDate, visibleCalendar,
    } = this.state;

    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', paddingBottom: 10, borderBottom: 'solid 1px #d9d9d9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span
              style={{
                padding: '3px 5px', backgroundColor: visibleCalendar === 'start' ? lightPrimaryColor : '#e8eaed', color: visibleCalendar === 'start' ? primaryColor : '#212121', borderRadius: 3,
              }}
            >
FROM
            </span>
&nbsp;&nbsp;
            <span>{moment(`${startDate.year}-${startDate.month}-${startDate.day}`).format('Do MMM, YYYY')}</span>
            &nbsp;&nbsp;
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            &nbsp;&nbsp;
            <span
              style={{
                padding: '3px 5px', backgroundColor: visibleCalendar === 'end' ? lightPrimaryColor : '#e8eaed', color: visibleCalendar === 'end' ? primaryColor : '#212121', borderRadius: 3,
              }}
            >
TO
            </span>
&nbsp;&nbsp;
            <span>{moment(`${endDate.year}-${endDate.month}-${endDate.day}`).format('Do MMM, YYYY')}</span>
          </div>
        </div>
        <div className="date-range-picker-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {
            visibleCalendar === 'start' ? (
              <Calendar
                year={calendar.startCalendarYear}
                month={calendar.startCalendarMonth}
                value={`${startDate.year}, ${startDate.month}, ${startDate.day}`}
                onChange={({ target }) => this.setStartCalendarDate(target.value)}
                onNavigate={({ target }) => this.setStartCalendar({ calendar: { ...calendar, startCalendarMonth: target.value.month, startCalendarYear: target.value.year } })}
              />
            ) : (
              <Calendar
                year={calendar.endCalendarYear}
                month={calendar.endCalendarMonth}
                value={`${endDate.year}, ${endDate.month}, ${endDate.day}`}
                onChange={({ target }) => this.setEndCalendarDate(target.value)}
                onNavigate={({ target }) => this.setEndCalendar({ calendar: { ...calendar, endCalendarMonth: target.value.month, endCalendarYear: target.value.year } })}
              />
            )
          }
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%',
          }}
        >
          {
            visibleCalendar === 'start' ? (
              <ActionButton text="Proceed" onClick={() => this.setState({ visibleCalendar: 'end' })} />
            ) : (
              <ActionButton text="Back" icon="keyboard_backspace" onClick={() => this.setState({ visibleCalendar: 'start' })} />
            )
          }
          {
            visibleCalendar === 'end' ? (
              <ActionButton text="Apply" onClick={this.onApplyChanges} />
            ) : null
          }
        </div>
      </div>
    );
  }
}
