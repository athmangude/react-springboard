/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class ViewDelay extends Component {
  static propTypes = {
    delay: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    const { delay } = this.props;
    const transactionalSurveyDelay = delay.surveyMetadata.find((metadata) => metadata.name === 'transactionalSurveyDelay');

    if (transactionalSurveyDelay) {
      const milliseconds = parseInt(transactionalSurveyDelay.value, 10);
      seconds = Math.floor(milliseconds / 1000);
      minutes = Math.floor(seconds / 60);
      seconds %= 60;
      hours = Math.floor(minutes / 60);
      minutes %= 60;
      days = Math.floor(hours / 24);
      hours %= 24;
    }
    this.state = {
      mouseOver: null,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  onMouseEnter(row) {
    this.setState({ mouseOver: row });
  }

  onMouseLeave() {
    this.setState({ mouseOver: null });
  }

  render() {
    const {
      mouseOver,
      days,
      hours,
      minutes,
      seconds,
    } = this.state;
    const { delay, onCloseSidePanel } = this.props;
    const colorMix = stringToHexColor(delay.title);
    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Delay Details</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(delay.title)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{delay.title}</span>
            </div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('days')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'days' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Days</div>
            <div>{days}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('hours')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'hours' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Hours</div>
            <div>{hours}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('minutes')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'minutes' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Minutes</div>
            <div>{minutes}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('seconds')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'seconds' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Seconds</div>
            <div>{seconds}</div>
          </div>
        </div>
      </div>
    );
  }
}
