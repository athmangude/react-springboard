/* eslint-disable jsx-a11y/label-has-for, spaced-comment */

import React from 'react';
import PropTypes from 'prop-types';


import { Divider, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';

import SendLater from './SendLater';
import Recurring from './Recurring';
import './index.css';

let runTime = null;

@observer
class ScheduleSegment extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.onRunTimeChanged = this.onRunTimeChanged.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.updateReminder = this.updateReminder.bind(this);
    this.state = {
      scheduleType: props.form.scheduleType,
      selectedDays: [new Date(), (new Date() + 1)],
      scheduleTypes: [
        { scheduleType: 'IMMEDIATELY', text: 'Send Now', description: '' },
        { scheduleType: 'LATER', text: 'Send Later', description: '' },
        { scheduleType: 'RECURRING', text: 'Recurring', description: '' },
      ],
    };
  }

  onSelect(scheduleType) {
    this.setState({ scheduleType }, () => {
      this.updateReminder();
    });
  }

  onRunTimeChanged(event, {name, value}) {
    runTime = value;

    this.updateReminder();
  }

  updateReminder() {
    const {scheduleType} = this.state;

    if (scheduleType === 'IMMEDIATELY' && runTime === null) {
      this.props.onChange(scheduleType, runTime);
    } else if(scheduleType === 'LATER' && runTime !== null) {
      this.props.onChange(scheduleType, runTime);
    } else if(scheduleType === 'RECURRING' && runTime !== null) {
      this.props.onChange(scheduleType, runTime);
    }
  }
  
  render() {
    const { scheduleType, scheduleTypes } = this.state;
    let options = null;
    if (scheduleType === 'LATER') {
      options = (<SendLater onChange={this.onRunTimeChanged} form={this.props.form} />);
    }

    if (scheduleType === 'RECURRING') {
      options = (<Recurring onChange={this.onRunTimeChanged} form={this.props.form} />);
    }

    if(scheduleType === 'IMMEDIATELY') {
      options = (<p>The survey will be sent out immediately.</p>);
    }
    
    return (
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', flexWrap: 'wrap' }}>
                <div style={{ width: '100%', padding: '3px 0px 10px' }}>
                  <span style={{ color: '#808285' }}>Select time when the reminder will be sent</span>
                </div>
                {
                  scheduleTypes.map((option) => (
                    <Button
                      type='button'
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: option.scheduleType === scheduleType ? '#4a4f57' : '#d9d9d9', color: option.scheduleType === scheduleType ? '#fff' : '#808285', flexGrow: 1, padding: 20, margin: '0px 0px', borderRadius: 0, border: 'solid 1px #fff' }}
                      onClick={() => this.onSelect(option.scheduleType)}
                      className={option.scheduleType === scheduleType ? 'active' : ''}
                    >
                      {/* <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 10px 0' }}>
                        <i className="material-icons" style={{ margin: 'auto 10px auto 0', fontSize: 40 }}>{option.icon}</i>
                      </div> */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <b>{ option.text}</b>
                        <span style={{ fontSize: 10, fontWeight: 'lighter' }}>{ option.description }</span>
                      </div>
                    </Button>
                  ))
                }
              </div>
        <Divider hidden />
        <div className="scheduleType-options" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0 30px' }}>
          {options}
        </div>
      </div>
    );
  }
}

export default ScheduleSegment;
