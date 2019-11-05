/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import ActionButton from 'SharedComponents/action-button';
import './index.css';

const chartOptions = [
  { key: '7', text: (<span>Last&nbsp;7&nbsp;days</span>), value: '7' },
  { key: '30', text: (<span>Last&nbsp;30&nbsp;days</span>), value: '30' },
  { key: '90', text: (<span>Last&nbsp;90&nbsp;days</span>), value: '90' },
];

class DateFilterOptions extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultOption: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const { defaultOption } = props;
    this.state = {
      menuOpen: false,
      custom: false,
      selected: defaultOption || '30',
      from: new Date(),
      to: new Date(),
      numberOfMonths: 1,
      submitting: false,
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCustomSelect = this.onCustomSelect.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onChange(selected) {
    const { onChange } = this.props;
    this.setState({ selected, menuOpen: false });
    onChange(selected);
  }

  onCustomSelect() {
    this.setState({ custom: true });
  }

  onClear() {
    this.setState({ custom: false });
  }

  onInputChange() {
    return null;
  }

  async onSubmit() {
    // Call method
  }

  filterByDateOptionSelection(range) {
    this.setState(range, () => this.onSubmit());
    this.handleRef.click();
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false, custom: false });
  }

  render() {
    const { selected, custom, menuOpen, from, to, numberOfMonths, submitting } = this.state;
    const modifiers = { start: from, end: to };
    const currentOption = chartOptions.find((option) => option.value === selected);

    return (
      <div style={{ margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        {
          menuOpen && !custom ? (
            <div style={{ position: 'relative' }}>
              <button type="button" className="date-filter-options" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', lineHeight: 2, fontSize: 13 }}>
                <span>{currentOption.text}</span>
                &nbsp;
                <i className="material-icons" style={{ fontSize: 15 }}>expand_less</i>
              </button>
              <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', bottom: 0, left: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', minWidth: 120, borderRadius: 2 }}>
                {
                  chartOptions.map((option) => (
                    <ActionButton key={option.key} text={option.text} onClick={() => this.onChange(option.key)} style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%', lineHeight: 2, fontSize: 13 }} />
                  ))
                }
                <ActionButton text="Custom..." onClick={this.onCustomSelect} style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%', lineHeight: 2.4, fontSize: 14, fontWeight: 600, borderTop: '1px solid rgba(0,0,0,0.12)' }} />
              </div>
            </div>
          ) : menuOpen && custom ? (
            <div style={{ position: 'relative' }}>
              <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', bottom: -15, left: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', minWidth: 120, borderRadius: 2 }}>
                <DayPicker
                  className="Selectable"
                  numberOfMonths={numberOfMonths}
                  selectedDays={[from, { from, to }]}
                  modifiers={modifiers}
                  disabledDays={{ after: to }}
                  onDayClick={this.handleDayClick}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <ActionButton disabled={submitting} onClick={this.onClear} text="Clear" icon="clear" style={{ backgroundColor: '#ffffff' }} />
                  <ActionButton loading={submitting} disabled={submitting} onClick={this.onSubmit} text="Apply&nbsp;Filter" icon="date_range" />
                </div>
              </div>
            </div>
          ) : (
            <button type="button" onClick={this.onToggleMenu} className="date-filter-options" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', lineHeight: 2, fontSize: 13 }}>
              <span>{currentOption.text}</span>
              &nbsp;
              <i className="material-icons" style={{ fontSize: 15 }}>expand_more</i>
            </button>
          )
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(DateFilterOptions);
