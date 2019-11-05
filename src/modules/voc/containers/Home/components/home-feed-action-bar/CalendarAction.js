import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import moment from 'moment';
import calendarActionStyles from './calendarActionStyles';
import calendarStyles from './calendarStyles';

import DatePicker from 'Utils/date-picker/src';
import ActionButton from 'SharedComponents/action-button-styled';

const CalendarActionWrapper = styled.button`${calendarActionStyles}`;
const CalendarWrapper = styled.div`${calendarStyles}`;

export default class CalendarAction extends Component {
  static propTypes = {
    category: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    filter: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onOpenCalendar = this.onOpenCalendar.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    isCalendarOpen: false,
    show: 'from',
    from: this.props.value.from.toDate(),
    to: this.props.value.to.toDate(),
  }

  onOpenCalendar() {
    console.log('[this.onOpenCalendar]');
    this.setState({
      isCalendarOpen: true,
    });
  }

  onSubmit() {
    console.log('this.onSubmit', this.state);
    this.setState({ isCalendarOpen: false }, () => {
      setTimeout(() => {
        this.props.onChange({
          from: moment(this.state.from),
          to: moment(this.state.to),
        });
      }, 1000);
    });
  }

  onChange(changes) {
    this.setState({ ...changes });
  }

  render() {
    console.log('[this.state]', this.state);
    return (
      <div style={{ position: 'relative' }}>
        <CalendarActionWrapper {...this.props} onClick={this.onOpenCalendar} className={classnames('action', this.props.type, { active: this.props.active })}>
          <i className="material-icons">{this.props.icon}</i>
          {
            this.props.type === 'nps' ? (
              <span className="label">{this.props.category}</span>
            ) : null
          }
        </CalendarActionWrapper>
        {
          this.state.isCalendarOpen ? (
            <CalendarWrapper>
              {
                this.state.show === 'from' ? (
                  <div className="calendar-label-container">
                    <span className="calendar-label">FROM</span>
                  </div>
                ) : (
                  <div className="calendar-label-container">
                    <span className="calendar-label">TO</span>
                  </div>
                )
              }
              {
                this.state.show === 'from' ? (
                  <DatePicker showHeader={false} date={this.state.from} onDatePicked={(date) => this.onChange({ from: date, show: 'to' })} />
                ) : (
                  <DatePicker showHeader={false} date={this.state.to} onDatePicked={(date) => this.onChange({ to: date })} />
                )
              }
              <ActionButton onClick={this.onSubmit} label="Submit" text="Submit" style={{ width: 'calc(100% - 20px)', margin: 10 }} disabled={this.state.show === 'from'} />
            </CalendarWrapper>
          ) : null
        }
      </div>
    );
  }
}
