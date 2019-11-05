import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class ViewTouchPoint extends Component {
  static propTypes = {
    touchpoint: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    mouseOver: null,
  }

  onMouseEnter(row) {
    this.setState({ mouseOver: row });
  }

  onMouseLeave() {
    this.setState({ mouseOver: null });
  }

  render() {
    const { mouseOver } = this.state;
    const { touchpoint, onCloseSidePanel } = this.props;
    const colorMix = stringToHexColor(touchpoint.value);
    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>TouchPoint Details</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(touchpoint.value)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{touchpoint.value}</span>
            </div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('touchPointType')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'touchPointType' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Touchpoint Type</div>
            <div>{touchpoint.touchPointType}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('quota')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'quota' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Quota</div>
            <div>{touchpoint.quota}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('quotaType')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'quotaType' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Quota Type</div>
            <div>{touchpoint.quotaType}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('dailyStartTime')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'dailyStartTime' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Start Time</div>
            <div>{touchpoint.dailyStartTime}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('dailyEndTime')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'dailyEndTime' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>End Time</div>
            <div>{touchpoint.dailyEndTime}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('alternateJoincode')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'alternateJoincode' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Join Code</div>
            <div>{touchpoint.alternateJoincode}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('createDate')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'createDate' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Create Date</div>
            <div>{moment.utc(touchpoint.createDate).local().fromNow()}</div>
          </div>
        </div>
      </div>
    );
  };
}
