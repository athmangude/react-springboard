/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './Recurring.css';

const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((time) => ({ text: time, value: time }));

export default class SendLater extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.selectLaterDate = this.selectLaterDate.bind(this);
    this.onTimeChanged = this.onTimeChanged.bind(this);

    // let runTimeLocal = times[10].value;

    // if (this.props.form.runTime) {
    //   runTimeLocal = `${moment.utc(this.props.form.runTime[0]).local().format('HH')}:00`;
    // }

    this.state = {
      laterDate: (this.props.form.runTime) ? moment(this.props.form.runTime[0]) : moment(),
      timeOfDay: (this.props.form.runTime) ? `${moment.utc(this.props.form.runTime[0]).local().format('HH')}:00` : times[10].value,
    };
  }

  componentDidMount() {
    const laterDate = this.state.laterDate.format('YYYY-MM-DD');
    const time = `${this.state.timeOfDay}:00`;

    const newLaterDate = moment(`${laterDate} ${time}`);
    this.props.onChange(null, { name: 'runTime', value: [newLaterDate.utc().format()] });
  }

  componentWillUnmount() {
    this.props.onChange(null, { name: 'runTime', value: null });
  }

  onTimeChanged(e, { value }) {
    this.setState({ timeOfDay: value }, () => {
      const laterDate = this.state.laterDate.format('YYYY-MM-DD');
      const time = `${value}:00`;

      const newLaterDate = moment(`${laterDate} ${time}`);

      this.setState({ laterDate: newLaterDate }, () => {
        this.props.onChange(null, { name: 'runTime', value: [newLaterDate.utc().format()] });
      });
    });
  }

  selectLaterDate(date) {
    // const currentTime = this.state.laterDate.format('HH:MM:ss');
    const newDate = moment(date).format('YYYY-MM-DD');
    const newDateTime = moment(`${newDate} ${this.state.timeOfDay}`);
    this.setState({ laterDate: newDateTime }, () => {
      this.props.onChange(null, { name: 'runTime', value: [newDateTime.utc().format()] });
    });
  }

  render() {
    return (
      <div className="schedule-day-picker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', width: '100%' }}>
        Send later on&nbsp;
        <DayPickerInput
          placeholder={`${this.state.laterDate.format('DD-MM-YYYY')}`}
          value={`${this.state.laterDate.format('DD-MM-YYYY')}`}
          onDayChange={this.selectLaterDate}
          dayPickerProps={{
            disabledDays: {
              before: moment().toDate(),
            },
          }}
          style={{ margin: 10, width: 137, height: 33 }}
        />
        at&nbsp;
        <Dropdown inline options={times} scrolling value={this.state.timeOfDay} onChange={this.onTimeChanged} />
      </div>
    );
  }
}
