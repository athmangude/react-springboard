import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Loader, Popup, Button } from 'semantic-ui-react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './index.css';

const options = [
  { key: 'today', value: 'today', text: 'Today' },
  { key: 'last7Days', value: 'last7Days', text: 'Last 7 days' },
  { key: 'last30Days', value: 'last30Days', text: 'Last 30 days' },
  { key: 'thisMonth', value: 'thisMonth', text: 'This Month' },
  { key: 'lastMonth', value: 'lastMonth', text: 'Last Month' },
  { key: 'allTime', value: 'allTime', text: 'All Time' },
  { key: 'customRange', value: 'customRange', text: 'Custom Range' },
];

export default class DateRangePicker extends Component {
  static propTypes = {
    isFilteringByDate: PropTypes.bool,
    defaultStart: PropTypes.string,
    defaultEnd: PropTypes.string,
    beginning: PropTypes.string,
    margin: PropTypes.number,
    padding: PropTypes.number,
    handleDateRangeChanged: PropTypes.func,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);
    const { defaultStart, defaultEnd } = props;

    this.state = {
      from: new Date(defaultStart),
      to: new Date(defaultEnd),
      numberOfMonths: 1,
      submitting: false,
      selectedOption: { key: 'last30Days', value: 'last30Days', text: 'Last 30 days' },
      showCustomRange: true,
    };

    this.onDateSelectOption = this.onDateSelectOption.bind(this);
    this.filterByDateOptionSelection = this.filterByDateOptionSelection.bind(this);
    this.handleFromDayClick = this.handleFromDayClick.bind(this);
    this.handleToDayClick = this.handleToDayClick.bind(this);
    this.toggleCustomRange = this.toggleCustomRange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onDateSelectOption(value) {
    const { beginning } = this.props;
    const to = new Date();
    const from = new Date();
    const beginningDate = new Date(beginning);
    // this.toggleCustomRange(false);

    const selected = options.find((option) => option.value === value);

    this.setState({ selectedOption: selected }, () => {
      switch (value) {
        case 'today':
          this.filterByDateOptionSelection({ from: to, to });
          break;
        case 'last7Days':
          from.setDate(from.getDate() - 7);
          this.filterByDateOptionSelection({ from, to });
          break;
        case 'last30Days':
          from.setDate(from.getDate() - 30);
          this.filterByDateOptionSelection({ from, to });
          break;
        case 'thisMonth':
          from.setDate(1);
          this.filterByDateOptionSelection({ from, to });
          break;
        case 'lastMonth':
          from.setDate(1);
          from.setMonth(from.getMonth() - 1);
          to.setDate(0);
          this.filterByDateOptionSelection({ from, to });
          break;
        case 'allTime':
          this.filterByDateOptionSelection({ from: beginningDate, to });
          break;
        case 'customRange':
          // this.toggleCustomRange(true);
          break;
        default:
          break;
      }
    });
  }

  async onSubmit() {
    const { from, to } = this.state;
    await this.props.handleDateRangeChanged({ from: moment(from).format('YYYY-MM-DD'), to: moment(to).format('YYYY-MM-DD') });
  }

  filterByDateOptionSelection(range) {
    this.setState(range, () => this.onSubmit());
    this.handleRef.click();
  }

  handleFromDayClick(from) {
    this.setState({ from });
  }

  handleToDayClick(to) {
    this.setState({ to });
  }

  toggleCustomRange(value) {
    this.setState({ showCustomRange: value });
  }

  render() {
    const { from, to, numberOfMonths, submitting, showCustomRange, selectedOption } = this.state;
    const modifiers = { start: from, end: to };
    const { isFilteringByDate, margin = 10, padding = 10, width } = this.props;

    return (
      <div style={{ width: '100%', margin, padding, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        {isFilteringByDate ? (
          <Loader active inline size="tiny" style={{ marginRight: 10 }} />
        ) : null}
        <div className="InputFromTo" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 35, borderRadius: 5, backgroundColor: '#ffffff', border: 'solid 1px #d9d9d9', color: 'rgb(109, 110, 113)', fontSize: 11 }}>
          <div style={{ border: '1px solid #d9d9d9', display: 'flex', flexDirection: 'row', alignItems: 'center', height: 35 }} ref={(ref) => this.handleRef = ref}>
            <span style={{ backgroundColor: '#ffffff' }}><i className="material-icons" style={{ border: 'none', flex: 1, padding: '3px 5px 0 5px', fontSize: 20 }}>date_range</i></span>
            <Popup
              trigger={<div style={{ padding: 10, minWidth: 200 }}>{selectedOption.value === 'customRange' ? `${moment(from).format('MMM Do YYYY')} - ${moment(to).format('MMM Do YYYY')}` : selectedOption.text}</div>}
              on="click"
              hideOnScroll
              basic
              flowing
              content={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    {
                      options.map((option) => (
                        <div role="button" tabIndex={0} key={option.key} onClick={() => this.onDateSelectOption(option.value)} style={{ fontFamily: 'Lato', width: '100%', fontSize: 11, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: selectedOption.value === option.value ? '#ffffff' : '#487db3', backgroundColor: selectedOption.value === option.value ? '#487db3' : '#ffffff', padding: 2, cursor: 'pointer' }}>{option.text}</div>
                      ))
                    }
                  </div>
                  <div style={{  }}>
                    <div style={{ display: 'flex', flexDirection: !width ? 'row' : 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <div style={{ paddingLeft: 20, fontWeight: 900, fontSize: 15 }}>From:</div>
                        <DayPicker
                          className="Selectable"
                          numberOfMonths={numberOfMonths}
                          selectedDays={[from]}
                          modifiers={modifiers}
                          // disabledDays={{ after: to }}
                          onDayClick={this.handleFromDayClick}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <div style={{ paddingLeft: 20, fontWeight: 900, fontSize: 15 }}>To</div>
                        <DayPicker
                          className="Selectable"
                          numberOfMonths={numberOfMonths}
                          selectedDays={[to]}
                          modifiers={modifiers}
                          // disabledDays={{ after: to }}
                          onDayClick={this.handleToDayClick}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '20px 0', width: '100%' }}>
                      <Button loading={submitting} disabled={submitting} onClick={this.onSubmit} style={{ height: 35, borderRadius: 17.5, backgroundColor: '#487db3', marginRight: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#FFF', fontSize: 12 }}>Filter by Date Range</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              }
              position={width && width < 425 ? 'bottom left' : 'bottom right'}
            />
          </div>
        </div>
      </div>
    );
  }
}
