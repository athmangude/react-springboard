/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// https://github.com/icarus-sullivan/react-calendar-material

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import themes from 'SharedComponents/themes';
const { primaryColor } = themes.light;

import styles from './index.css.js';
import icBack from './ic_back.svg';
import icForward from './ic_forward.svg';

const CalendarWrapper = styled.div`${styles}`;

const config = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  month_subs: ['Jan', 'Feb', 'Apr', 'Mar', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  week_subs: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
  today() {
    return new Date();
  },
};
const TODAY = config.today();

class Calendar extends Component {
  static propTypes = {
    date: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      current: config.today(),
      selected: this.props.date,
      ldom: 30,
    };

    this.prev = this.prev.bind(this);
    this.updateMonth = this.updateMonth.bind(this);
    this.next = this.next.bind(this);
  }

  componentWillMount() {
    this.updateMonth(0);
  }

  onDatePicked(month, day) {
    const d = new Date(this.state.current.getTime());
    d.setMonth(d.getMonth() + month);
    d.setDate(day);
    this.props.onDatePicked(d);
    this.setState({
      selected: d,
    });
  }

  prev() {
    this.updateMonth(-1);
  }

  next() {
    this.updateMonth(1);
  }

  updateMonth(add) {
    const d = this.state.current;
    d.setMonth(d.getMonth() + add);
    const eom = new Date(d.getYear(), d.getMonth() + 1, 0).getDate();
    this.setState({
      current: d,
      ldom: eom,
    });
  }

  renderDay(opts = {}) {
    let baseClasses = 'day noselect';
    let today = '';
    let todayStyle = {};
    let containerStyle = {};
    if (opts.today) {
      today = 'current';
      todayStyle = {
        borderColor: primaryColor,
      };
    }

    let selected = '';
    let selectedStyle = {};
    if (opts.selected) {
      selected = 'selected';
      selectedStyle = {
        backgroundColor: primaryColor,
      };
      containerStyle = {
        color: '#ffffff',
        backgroundColor: primaryColor,
        height: 32,
        borderRadius: 16,
      };
    }

    baseClasses += opts.current ? '' : ' non-current';

    return (
      <div
        className={baseClasses}
        style={containerStyle}
      >
        <div className={today} style={todayStyle}></div>
        <div className={selected} style={selectedStyle}></div>
        <p
          onClick={(ev) => {
            const day = ev.target.innerHTML;
            this.onDatePicked(opts.month, day);
          }}
        >
          {opts.date.getDate()}
        </p>
      </div>
    );
  }

  renderDays(copy) {
    const days = [];

    // set to beginning of month
    copy.setDate(1);

    // if we are missing no offset, include the previous week
    const offset = copy.getDay() === 0 ? 7 : copy.getDay();

    copy.setDate(-offset);

    let inMonth = false;
    let lastMonth = true;
    for (let i = 0; i < 42; i++) { // eslint-disable-line no-plusplus
      // increase date
      copy.setDate(copy.getDate() + 1);

      // make sure we pass any previous month values
      if (i < 30 && copy.getDate() === 1) {
        inMonth = true;
        lastMonth = false;
      } // eslint-disable-line brace-style

      // if we are seeing the '1' again, we have iterated over
      // the current month
      else if (i > 30 && copy.getDate() === 1) {
        inMonth = false;
      }

      console.log('[this.state]', this.state);

      const sel = new Date(this.state.selected.getTime());
      const isSelected = (sel.getFullYear() === copy.getFullYear()
        && sel.getDate() === copy.getDate()
        && sel.getMonth() === copy.getMonth());

      const isToday = (TODAY.getFullYear() === copy.getFullYear()
        && TODAY.getDate() === copy.getDate()
        && TODAY.getMonth() === copy.getMonth());

      days.push(this.renderDay({
        today: isToday,
        selected: isSelected,
        current: inMonth,
        month: (inMonth ? 0 : (lastMonth ? -1 : 1)), // eslint-disable-line no-nested-ternary
        date: copy,
      }));
    }

    return days;
  }

  renderHeaders() {
    const header = [];

    for (let i = 0; i < config.week_subs.length; i++) { // eslint-disable-line no-plusplus
      header.push(<p className="day-headers noselect">
        {config.week_subs[i]}
      </p>);
    }

    return header;
  }

  render() {
    // get su-sat header
    const header = this.renderHeaders();

    // copy our current time state
    const copy = new Date(this.state.current.getTime());

    // get the month days
    const days = this.renderDays(copy);

    const tMonth = config.months[this.state.selected.getMonth()];
    const tDate = this.state.selected.getDate();
    const month = config.months[this.state.current.getMonth()];
    const year = this.state.current.getFullYear();
    const date = this.state.current.getDate();

    let upperDate = null;
    if (this.props.showHeader) {
      upperDate = (
        <div
          className="flex-2 header center"
          style={{
            backgroundColor: this.props.accentColor,
          }}
        >
          <p className="header-month">{tMonth.toUpperCase()}</p>
          <p className="header-day">{tDate}</p>
        </div>
      );
    }

    return (
      <div className={this.props.orientation} style={{ width: 250 }}>
        {upperDate}
        <div className="padding">
          <div className="month">
            <img className="month-arrow-left" src={icBack} alt="back" onClick={this.prev}></img>
            <p className="month-title">
              {month}
              <br />
              <span className="month-year">{year}</span>
            </p>
            <img className="month-arrow-right" src={icForward} alt="forward" onClick={this.next}></img>
          </div>
          <div className="footer">
            {header}
            {days}
          </div>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  accentColor: PropTypes.string,
  onDatePicked: PropTypes.func,
  showHeader: PropTypes.bool,
  orientation: PropTypes.string,
};

Calendar.defaultProps = {
  accentColor: '#00C1A6',
  onDatePicked() {},
  showHeader: true,
  orientation: 'flex-col',
};

export default Calendar;
