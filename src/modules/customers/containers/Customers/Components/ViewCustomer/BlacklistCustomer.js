/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';

export default class BlacklistCustomer extends Component {
  static propTypes = {
    participant: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.updateSegment = this.updateSegment.bind(this);

    this.state = {
      isSavingSegment: false,
      reason: '',
    };
  }

  handleChange(e) {
    this.setState({ reason: e.target.value });
  }

  async updateSegment() {

  }

  render() {
    const { participant, onCloseSidePanel } = this.props;
    const { reason, isSavingSegment } = this.state;

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#F4F4F5', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Blacklist Customer</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}> 
          <div>
            <div style={{ margin: '20px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', margin: '0 5px' }}>
                <p>Reason</p>
                <input type="textarea" name="reason" rows="5" placeholder="Reason" value={reason} onChange={this.handleChange} className="hide-active-border" style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%' }} />
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
              <ActionButton className="primary" type="submit" text="Blacklist" disabled={isSavingSegment} loading={isSavingSegment} onClick={this.updateSegment} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
