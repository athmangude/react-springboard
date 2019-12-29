/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Loader, Popup } from 'semantic-ui-react';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import ActionButton from '../action-button-styled';
import './index.css';

export default class MwambaDateRangePicker extends Component {
  static propTypes = {
    isFilteringByDate: PropTypes.bool,
    defaultStart: PropTypes.string,
    defaultEnd: PropTypes.string,
    handleDateRangeChanged: PropTypes.func,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { defaultStart, defaultEnd } = props;

    this.state = {
      from: defaultStart ? new Date(defaultStart) : new Date(),
      to: defaultEnd ? new Date(defaultEnd) : new Date(),
      numberOfMonths: 2,
      submitting: false,
      showCustomRange: false,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.filterByDateOptionSelection = this.filterByDateOptionSelection.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onInputChange() {
    return null;
  }

  async onSubmit() {
    const { handleDateRangeChanged } = this.props;
    const { from, to } = this.state;
    await handleDateRangeChanged({ from: moment(from).format('YYYY-MM-DD'), to: moment(to).format('YYYY-MM-DD') });
    this.handleRef.click();
  }

  filterByDateOptionSelection(range) {
    this.setState(range, () => this.onSubmit());
    this.handleRef.click();
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }

  render() {
    const { from, to, numberOfMonths, submitting } = this.state;
    const modifiers = { start: from, end: to };
    const { isFilteringByDate, loading } = this.props;

    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{ height: 35, width: 220, borderRadius: 2, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07)', backgroundColor: '#ffffff', border: 'solid 1px #e2e4eb' }}>
            <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 35, borderRadius: 2 }} /></div>} />
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        {isFilteringByDate ? (
          <Loader active inline size="tiny" style={{ marginRight: 10 }} />
        ) : null}
        <div className="InputFromTo" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 35, borderRadius: 2, backgroundColor: '#ffffff', color: 'rgb(109, 110, 113)', fontSize: 11 }}>
          <div style={{ height: 35, borderRadius: 2, boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07)', backgroundColor: '#ffffff', border: 'solid 1px #e2e4eb', display: 'flex', flexDirection: 'row', alignItems: 'center' }} ref={(ref) => { this.handleRef = ref; }}>
            <span style={{ backgroundColor: '#ffffff' }}><i className="material-icons" style={{ border: 'none', flex: 1, padding: '3px 5px 0 5px', fontSize: 20 }}>date_range</i></span>
            <Popup
              trigger={<input onChange={this.onInputChange} style={{ padding: '10px 0 10px 5px', width: 220 }} value={`${moment(from).format('LL')} - ${moment(to).format('LL')}`} />}
              basic
              on="click"
              hideOnScroll
              flowing
              content={(
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <div>
                    <DayPicker
                      className="Selectable"
                      numberOfMonths={numberOfMonths}
                      selectedDays={[from, { from, to }]}
                      modifiers={modifiers}
                      disabledDays={{ after: to }}
                      onDayClick={this.handleDayClick}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '20px 0', width: '100%' }}>
                      <ActionButton loading={submitting} disabled={submitting} onClick={this.onSubmit} text="Apply&nbsp;Filter" icon="date_range" />
                    </div>
                  </div>
                </div>
              )}
              position="bottom left"
            />
          </div>
        </div>
      </div>
    );
  }
}
