/* eslint-disable radix, jsx-a11y/interactive-supports-focus, react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import Spinner from 'react-spinner-material';
import moment from 'moment';
import enhanceWithClickOutside from 'react-click-outside';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';
import 'react-placeholder/lib/reactPlaceholder.css';
import Month from './Month';

import './index.css';

class MonthPicker extends Component {
  static propTypes = {
    currentSelectionDate: PropTypes.object.isRequired,
    isFetchingContacted: PropTypes.bool.isRequired,
    handleDateChanged: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.onMonthChanged = this.onMonthChanged.bind(this);
    this.onDecrementYear = this.onDecrementYear.bind(this);
    this.onIncrementYear = this.onIncrementYear.bind(this);
    this.onTogglePicker = this.onTogglePicker.bind(this);
    this.onUpdateContacted = this.onUpdateContacted.bind(this);
  }

  state = {
    isOpen: false,
    newMonth: this.props.currentSelectionDate ? parseInt(this.props.currentSelectionDate.format('M')) : null,
    newYear: this.props.currentSelectionDate ? parseInt(this.props.currentSelectionDate.format('YYYY')) : null,
    isPickerOpen: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentSelectionDate !== this.props.currentSelectionDate) {
      this.setState({
        newMonth: nextProps.currentSelectionDate ? parseInt(nextProps.currentSelectionDate.format('M')) : null,
        newYear: nextProps.currentSelectionDate ? parseInt(nextProps.currentSelectionDate.format('YYYY')) : null,
        isPickerOpen: false,
      });
    }
  }

  onMonthChanged(newMonth) {
    this.setState({ newMonth });
  }

  onDecrementYear() {
    this.setState({ newYear: this.state.newYear - 1 });
  }

  onIncrementYear() {
    this.setState({ newYear: this.state.newYear + 1 });
  }

  onTogglePicker() {
    this.setState({ isPickerOpen: !this.state.isPickerOpen });
  }

  onUpdateContacted() {
    const newSelectedDate = moment(`${this.state.newYear} ${this.state.newMonth} 01`);
    this.props.handleDateChanged(newSelectedDate);
  }

  handleClickOutside() {
    this.setState({ isPickerOpen: false });
  }

  render() {
    return (
      <div className="month-picker" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          {
            // this.props.isFetchingContacted && !this.state.isPickerOpen ? (
            //   <div style={{ margin: '0 5px' }}>
            //     <Spinner spinnerColor="#487db3" size={15} spinnerWidth={2} />
            //   </div>
            // ) : null
          }
          {
            this.props.isFetchingContacted && !this.props.currentSelectionDate ? (
              <ReactPlaceholder
                showLoadingAnimation
                customPlaceholder={(
                  <RectShape color="#d9d9d9" style={{ height: 25, width: 70, borderRadius: 8, margin: '0' }} />
                )}
              />
            ) : (
              <div role="button" style={{ border: 'none', padding: '3px 10px', borderRadius: 8 }}>
                {this.props.currentSelectionDate ? this.props.currentSelectionDate.format('MMMM, YYYY') : null}
              </div>
            )
          }
        </div>
        {
          this.state.isPickerOpen ? (
            <div style={{ backgroundColor: '#fff', padding: 10, position: 'absolute', top: 30, right: 0, zIndex: 99, flexDirection: 'column', width: 200, boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div onClick={this.onDecrementYear} className="scroll-button" role="button" style={{ padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30, width: 30, borderRadius: 15 }}>
                  <i className="material-icons" style={{ color: '#808285' }}>chevron_left</i>
                </div>
                <span>{this.state.newYear}</span>
                <div onClick={this.onIncrementYear} className="scroll-button" role="button" style={{ padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 30, width: 30, borderRadius: 15 }}>
                  <i className="material-icons" style={{ color: '#808285' }}>chevron_right</i>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                {
                  new Array(12).fill(0).map((item, i) => (
                    <Month key={i} monthId={i + 1} newMonth={this.state.newMonth} newYear={this.state.newYear} onMonthChanged={this.onMonthChanged} />
                  ))
                }
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {
                  !this.props.isFetchingContacted ? (
                    <Button onClick={this.onUpdateContacted} disabled={moment() < moment(`${this.state.newYear}-${this.state.newMonth}-01 00:00:00`)} className="mwamba-primary-button" style={{ borderRadius: 15, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 20px', marginTop: 10 }}><span>Submit</span></Button>
                  ) : (
                    <div style={{ marginTop: 10 }}>
                      <Spinner spinnerColor="#487db3" size={30} spinnerWidth={3} />
                    </div>
                  )
                }
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(MonthPicker);
