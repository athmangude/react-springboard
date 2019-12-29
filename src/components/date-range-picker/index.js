/* eslint-disable jsx-a11y/href-no-hash, radix */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Calendar } from 'material-components';

import themes from 'SharedComponents/themes';
const { primaryColor, lightPrimaryColor } = themes.light;

import ActionButton from '../action-button-styled';

export default class DateRangePicker extends Component {
  static propTypes = {
    range: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onMenuClose: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { range } = props;

    this.state = {
      calendar: {
        startCalendarDay: parseInt(moment(range.from).format('DD')),
        startCalendarMonth: parseInt(moment(range.from).format('M')) - 1,
        startCalendarYear: parseInt(moment(range.from).format('YYYY')),
        endCalendarDay: parseInt(moment(range.to).format('DD')),
        endCalendarMonth: parseInt(moment(range.to).format('M')) - 1,
        endCalendarYear: parseInt(moment(range.to).format('YYYY')),
      },
      startDate: {
        day: parseInt(moment(range.from).format('DD')),
        month: parseInt(moment(range.from).format('M')),
        year: parseInt(moment(range.from).format('YYYY')),
      },
      endDate: {
        day: parseInt(moment(range.to).format('DD')),
        month: parseInt(moment(range.to).format('M')),
        year: parseInt(moment(range.to).format('YYYY')),
      },
      visibleCalendar: 'start',
    };
  }

  getChildContext() {
    return {
      componentStyle: {
        primaryColor: '#FFC107',
        primaryFontColor: 'rgba(0, 0, 0, 0.7)',
        secondaryColor: '#009688',
        secondaryFontColor: 'rgba(255, 255, 255, 0.9)',
        errorColor: '#C00',
        successColor: '#090',
        typographyColor: '#212121',
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
    const { onChange, onMenuClose } = this.props;
    onChange({
      from: moment(`${startDate.year}-${startDate.month}-${startDate.day}`).startOf('day').format(),
      to: moment(`${endDate.year}-${endDate.month}-${endDate.day}`).endOf('day').format(),
      label: `Custom: ${moment(`${startDate.year}-${startDate.month}-${startDate.day}`).format('MMM D, YYYY')} - ${moment(`${endDate.year}-${endDate.month}-${endDate.day}`).format('MMM D, YYYY')}`,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
