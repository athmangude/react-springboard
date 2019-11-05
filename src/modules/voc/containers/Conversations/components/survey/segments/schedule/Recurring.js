/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Dropdown, Divider } from 'semantic-ui-react';
import moment from 'moment';
import numeral from 'numeral';

import 'react-day-picker/lib/style.css';
import './Recurring.css';

function formatDay(day) {
  if (day === 1) {
    return `${day}st`;
  }

  if (day === 2) {
    return `${day}nd`;
  }

  if (day === 3) {
    return `${day}rd`;
  }

  return `${day}th`;
}

const days = [{ key: 'Sunday', value: 0 }, { key: 'Monday', value: 1 }, { key: 'Tuesday', value: 2 }, { key: 'Wednesday', value: 3 }, { key: 'Thursday', value: 4 }, { key: 'Friday', value: 5 }, { key: 'Saturday', value: 6 }].map((day) => ({ key: day.key, text: day.key, value: day.value }));
const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((time) => ({ text: time, value: time }));
const monthDays = new Array(28).fill(0).map((item, i) => ({ key: i, text: formatDay(i + 1), value: i }));

class Recurring extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    const { form } = this.props;
    this.state = {
      selectedDays: { daysOfWeek: [1] },
      sendOptions: [
        { text: 'Week', value: 'weekly' },
        { text: 'Day', value: 'daily' },
        { text: 'Month', value: 'monthly' },
      ],
      startDate: moment(),
      endDate: moment().day(30),
      mode: (form.mode) ? (form.mode) : 'weekly',
      dayOfMonth: 0,
      dayOfWeek: days[1].value,
      timeOfDay: (form.runTime) ? `${moment.utc(form.runTime[0]).local().format('HH')}:00` : times[10].value,
    };

    this.onTimeChange = this.onTimeChange.bind(this);
    this.onWeekdayChange = this.onWeekdayChange.bind(this);
    this.onMonthDayChange = this.onMonthDayChange.bind(this);
    this.calculateDates = this.calculateDates.bind(this);
  }

  componentDidMount() {
    const { form } = this.props;

    // eslint-disable-next-line no-unused-expressions
    (form.runTime) ? this.loadSavedDates() : this.calculateDates();
  }

  componentWillUnmount() {
    const { onChange } = this.props;

    onChange(null, { name: 'runTime', value: null, interval: null });
  }

  onSwitchMode = (e, { value }) => { // eslint-disable-line consistent-return
    const {
      dayOfWeek,
      startDate,
      endDate,
      dayOfMonth,
    } = this.state;
    const mode = value;
    if (mode === 'weekly') {
      return this.setState({
        mode,
        selectedDays: {
          daysOfWeek: [dayOfWeek],
        },
      }, () => this.calculateDates());
    }

    if (mode === 'daily') {
      return this.setState({
        mode,
        selectedDays: {
          from: startDate.toDate(),
          to: endDate.toDate(),
        },
      }, () => this.calculateDates());
    }

    if (mode === 'monthly') {
      return this.setState({
        mode,
        selectedDays: (day) => day.getDate() === dayOfMonth + 1,
      }, () => this.calculateDates());
    }
  }

  onWeekdayChange(e, { value }) {
    // TODO: calculate schedule dates and times
    this.setState({
      dayOfWeek: value,
      selectedDays: {
        daysOfWeek: [value],
      },
    }, () => this.calculateDates());
  }

  onMonthDayChange(e, { value }) {
    this.setState({
      dayOfMonth: value,
    }, () => this.calculateDates());
  }

  onTimeChange(e, { value }) {
    this.setState({
      timeOfDay: value,
    }, () => this.calculateDates());
  }

  handleDateSelection = (name, value) => {
    const { mode, startDate, endDate } = this.state;

    if (mode === 'daily') {
      this.setState({
        selectedDays: {
          from: (name === 'startDate') ? value.toDate() : startDate.toDate(),
          to: (name === 'endDate') ? value.toDate() : endDate.toDate(),
        },
      });
    }

    this.setState({ [name]: value }, () => this.calculateDates());
  }

  // eslint-disable-next-line consistent-return
  loadSavedDates() {
    const { mode, dayOfMonth } = this.state;
    const { form } = this.props;
    let startDate = moment();
    let endDate = moment().day(30);

    if (form.runTime[0] instanceof moment) {
      // eslint-disable-next-line prefer-destructuring
      startDate = form.runTime[0];
    } else {
      startDate = moment(form.runTime[0]);
    }

    if (form.runTime.length > 1) {
      const arrayLength = form.runTime.length;

      if (form.runTime[arrayLength - 1] instanceof moment) {
        endDate = form.runTime[arrayLength - 1];
      } else {
        endDate = moment(form.runTime[arrayLength - 1]);
      }
    }

    if (mode === 'daily') {
      return this.setState({
        endDate,
        selectedDays: {
          from: startDate.toDate(),
          to: endDate.toDate(),
        },
      }, () => this.calculateDates());
    }

    if (mode === 'weekly') {
      const day = startDate.day();
      return this.setState({
        endDate,
        dayOfWeek: day,
        selectedDays: {
          daysOfWeek: [day],
        },
      }, () => this.calculateDates());
    }

    if (mode === 'monthly') {
      return this.setState({
        dayOfMonth: startDate.date() - 1,
        endDate: endDate.endOf('month'),
        selectedDays: (day) => day.getDate() === dayOfMonth + 1,
      }, () => this.calculateDates());
    }
  }

  calculateDates() {
    const {
      dayOfMonth,
      dayOfWeek,
      timeOfDay,
      startDate,
      endDate,
      mode,
    } = this.state;
    const { onChange } = this.props;

    const dateTimes = [];

    if (mode === 'daily') {
      const time = moment(`${moment().format('YYYY-MM-DD')} ${timeOfDay}:00`).format('HH:mm:ss');
      let currentDate = moment(startDate);
      dateTimes.push(moment(`${currentDate.format('YYYY-MM-DD')} ${time}`));

      while (currentDate <= moment(endDate)) {
        dateTimes.push(moment(`${currentDate.format('YYYY-MM-DD')} ${time}`).utc().format());
        currentDate = currentDate.add(1, 'days');
      }
    }

    if (mode === 'monthly') {
      const time = moment(`${moment().format('YYYY-MM-DD')} ${timeOfDay}:00`).format('HH:mm:ss');
      let currentDate = moment(startDate);
      let timeInstance = moment(`${currentDate.format('YYYY-MM-')}${numeral(Number(dayOfMonth) + 1).format('00')} ${time}`);

      while (timeInstance <= moment(endDate)) {
        timeInstance = moment(`${currentDate.format('YYYY-MM-')}${numeral(Number(dayOfMonth) + 1).format('00')} ${time}`);

        if (timeInstance >= moment(startDate) && timeInstance <= moment(endDate)) {
          dateTimes.push(timeInstance.utc().format());
        }
        currentDate = currentDate.add(1, 'months');
      }
    }

    if (mode === 'weekly') {
      const timeOfDayArray = timeOfDay.split(':');
      const hour = timeOfDayArray[0];
      const min = timeOfDayArray[1];

      const currentDayOfWeek = startDate.format('e');

      let occurence;

      const clonedStartDate = startDate.clone();

      if (currentDayOfWeek > dayOfWeek) {
        const daysToAdd = 7 - (currentDayOfWeek - dayOfWeek);
        occurence = clonedStartDate.add(daysToAdd, 'days');
      } else {
        const daysToAdd = dayOfWeek - currentDayOfWeek;

        occurence = clonedStartDate.add(daysToAdd, 'days');
      }

      while (occurence <= moment(endDate)) {
        if (occurence >= moment(startDate) && occurence <= moment(endDate)) {
          dateTimes.push(occurence.clone().hour(hour).minutes(min).utc().format());
        }
        occurence = occurence.add(1, 'weeks');
      }
    }

    onChange(null, { name: 'runTime', value: dateTimes, interval: mode });
  }

  render() {
    const {
      sendOptions,
      dayOfWeek,
      timeOfDay,
      dayOfMonth,
      startDate,
      endDate,
      mode,
      selectedDays,
    } = this.state;
    return (
      <div className="schedule-day-picker">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          Every&nbsp;
          <Dropdown inline options={sendOptions} onChange={this.onSwitchMode} value={mode} />
          from&nbsp;
          <DayPickerInput
            placeholder={`${startDate.format('DD-MM-YYYY')}`}
            onDayChange={(day) => this.handleDateSelection('startDate', moment(day))}
            dayPickerProps={{
              disabledDays: {
                before: moment().toDate(),
              },
            }}
            style={{ margin: 10 }}
          />
          &nbsp;
          to
          &nbsp;
          <DayPickerInput
            placeholder={`${endDate.format('DD-MM-YYYY')}`}
            onDayChange={(day) => this.handleDateSelection('endDate', moment(day))}
            dayPickerProps={{
              month: new Date(moment(endDate)),
              disabledDays: {
                before: startDate.toDate(),
              },
            }}
            style={{ margin: 10 }}
          />
          {
            // eslint-disable-next-line no-nested-ternary
            mode === 'weekly' ? (
              <span>
                on&nbsp;
                <Dropdown inline options={days} value={dayOfWeek} onChange={this.onWeekdayChange} />
              </span>
            ) : mode === 'monthly' ? (
              <span>
                on&nbsp;
                <Dropdown inline options={monthDays} value={dayOfMonth} onChange={this.onMonthDayChange} />
              </span>
            ) : null
          }
          at&nbsp;
          <Dropdown inline options={times} scrolling value={timeOfDay} onChange={this.onTimeChange} />
        </div>
        <Divider hidden />
        <DayPicker
          disabledDays={{
            before: startDate.toDate(),
            after: endDate.toDate(),
          }}
          numberOfMonths={2}
          selectedDays={selectedDays}
          onDayClick={this.handleDayClick}
        />
      </div>
    );
  }
}

export default Recurring;
