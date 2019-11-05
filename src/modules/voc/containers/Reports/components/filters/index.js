import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import moment from 'moment';

import DateFilter from './Date';
import GenderFilter from './Gender';
import AgeFilter from './Age';
import CountryFilter from './Country';
import './index.css';

export default class Filters extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onAgeChanged = this.onAgeChanged.bind(this);
    this.onDateChanged = this.onDateChanged.bind(this);
    this.onCountryChanged = this.onCountryChanged.bind(this);
    this.onGenderChanged = this.onGenderChanged.bind(this);
    this.onResetAll = this.onResetAll.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
  }

  state = {
    age: { min: 0, max: 100 },
    date: { from: moment(), to: moment() },
    gender: { male: true, female: true },
    country: null,
  };

  onAgeChanged(value) {
    this.setState({
      age: value,
    });
  }

  onDateChanged(bound, value) {
    this.setState({ date: { ...this.state.date, [bound]: moment(value) } });
  }

  onCountryChanged(event, { value }) {
    this.setState({ country: value });
  }

  onGenderChanged(gender, value) {
    this.setState({ gender: { ...this.state.gender, [gender]: value } });
  }

  onResetAll() {
    this.setState({
      age: { min: 0, max: 100 },
      date: { from: moment(), to: moment() },
      gender: { male: true, female: true },
      country: null,
    });
  }

  onApplyFilters() {

  }

  render() {
    return (
      <div style={{ width: '100%', margin: 10, padding: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ color: '#3d4553', fontSize: 13, fontWeight: 'bold' }}>Survey Conversation Filter</span>
          <i className="material-icons" style={{ color: '#3d4553', fontSize: 20 }}>filter_list</i>
        </div>
        <DateFilter onChange={this.onDateChanged} value={this.state.date} />
        <GenderFilter onChange={this.onGenderChanged} value={this.state.gender} />
        <AgeFilter value={this.state.age} onAgeChanged={this.onAgeChanged} />
        <CountryFilter countries={this.props.user.countries} onChange={this.onCountryChanged} value={this.state.country} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <Button className="primary-button" onClick={this.onApplyFilters} style={{ backgroundColor: '#487db3', color: 'white' }}>
            <span style={{ fontSize: 12, padding: '0 16px', whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Apply&nbsp;Filters</span>
          </Button>
          <Button className="secondary-button" onClick={this.onResetAll} style={{ backgroundColor: '#fff', color: '#808285', border: 'solid 1px #d9d9d9' }}>
            <span style={{ fontSize: 12, padding: '0 16px', whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reset&nbsp;All</span>
          </Button>
        </div>
      </div>
    );
  }
}
