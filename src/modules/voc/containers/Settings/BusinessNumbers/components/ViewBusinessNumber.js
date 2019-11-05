/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class ViewBusinessNumber extends Component {
  static propTypes = {
    businessNumber: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    EventHandler: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      mouseOver: null,
    };

    console.log(this.props.businessNumber);
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
    } = this.state;
    const { businessNumber, onCloseSidePanel } = this.props;
    const colorMix = stringToHexColor(businessNumber.location);
    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Business Number Details</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(businessNumber.location)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{businessNumber.location}</span>
            </div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('business_identifier')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'business_identifier' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Business Number</div>
            <div>{businessNumber.business_identifier}</div>
          </div>
          <div onMouseEnter={() => this.onMouseEnter('status')} onMouseLeave={this.onMouseLeave} style={{ margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'status' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
            <div style={{ margin: '0 10px' }}>Status</div>
            <div>{businessNumber.status ? 'Active' : 'Inactive'}</div>
          </div>
        </div>
      </div>
    );
  }
}
