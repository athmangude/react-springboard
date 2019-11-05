/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import moment from 'moment';

export default class MonthPicker extends Component {
  constructor(props) {
    super(props);

    const now = moment();
    const months = moment.monthsShort();
    this.state = {
      months,
      year: now.year(),
      month: now.format('MMM'),
    };

    this.onIncrementMonth = this.onIncrementMonth.bind(this);
    this.onDecrementMonth = this.onDecrementMonth.bind(this);
    this.onIncrementYear = this.onIncrementYear.bind(this);
    this.onDecrementYear = this.onDecrementYear.bind(this);
  }

  onIncrementMonth() {
    const { month, months } = this.state;
    this.setState({ month: months[(months.indexOf(month) + 1) % months.length] });
  }

  onDecrementMonth() {
    const { month, months } = this.state;
    this.setState({ month: months[(months.indexOf(month) - 1 + 12) % months.length] });
  }

  onIncrementYear() {
    const { year } = this.state;
    this.setState({ year: year + 1 });
  }

  onDecrementYear() {
    const { year } = this.state;
    this.setState({ year: year - 1 });
  }

  render() {
    const { month, year } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#4a4a4a', font: '300 14px/14px Roboto,sans-serif' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <div>{month}</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <button type="button" onClick={this.onIncrementMonth} className="material-icons hide-active-border" style={{ fontSize: 13 }}>expand_less</button>
            <button type="button" onClick={this.onDecrementMonth} className="material-icons hide-active-border" style={{ fontSize: 13 }}>expand_more</button>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>{year}</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <button type="button" onClick={this.onIncrementYear} className="material-icons hide-active-border" style={{ fontSize: 13 }}>expand_less</button>
            <button type="button" onClick={this.onDecrementYear} className="material-icons hide-active-border" style={{ fontSize: 13 }}>expand_more</button>
          </div>
        </div>
      </div>
    );
  }
}
