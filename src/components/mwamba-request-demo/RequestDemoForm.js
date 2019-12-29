/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionButton from '../action-button-styled';
import IconButton from '../icon-button';

export default class RequestDemoFrom extends Component {
  static propTypes = {
    onCloseSidePanel: PropTypes.func,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.requestDemo = this.requestDemo.bind(this);

    this.state = {
      content: null,
      isRequestingDemo: false,
    };
  }

  handleChange(e) {
    this.setState({ content: e.target.value });
  }

  async requestDemo() {
    const { onCloseSidePanel, alertActions } = this.props;

    this.setState({ isRequestingDemo: true });

    setTimeout(() => {
      this.setState({ isRequestingDemo: false });
      onCloseSidePanel();
      alertActions.addAlert({ type: 'success', message: 'Your request has been submitted!' });
    }, 2000);
  }

  render() {
    const { onCloseSidePanel } = this.props;
    const { content, isRequestingDemo } = this.state;

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#F4F4F5', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>What to expect</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20 }}>
            <div>
              {/* <p style={{ textAlign: 'left', height: 18, margin: '16px 0 8px 0', color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0 }}>What to expect</p> */}
              <div style={{ display: 'flex', paddingBottom: 10 }}>
                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                <p style={{ textAlign: 'left' }}>Learn the features of customer analytics</p>
              </div>
              <div style={{ display: 'flex', paddingBottom: 10 }}>
                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                <p style={{ textAlign: 'left' }}>Build efficient and robust segments that will help you manage, track and engage your customers</p>
              </div>
              <div style={{ display: 'flex', paddingBottom: 10 }}>
                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                <p style={{ textAlign: 'left' }}>Understand your customers better and drive meaningful action</p>
              </div>
              <div style={{ display: 'flex', paddingBottom: 10 }}>
                <i className="material-icons" style={{ fontSize: 24, marginRight: 10, color: 'green' }}>check_circle_outline</i>
                <p style={{ textAlign: 'left' }}>Answer any other question that you may have</p>
              </div>
            </div>
            <div style={{ margin: '20px 0 0 0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <div style={{ width: '100%', margin: '0 5px' }}>
                <textarea
                  placeholder="Optional message"
                  onChange={this.handleChange}
                  name="textAreaInput" value={content}
                  className="hide-active-border"
                  style={{ borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #808285', padding: '10px 5px', width: '100%', backgroundColor: '#ffffff', display: 'block', width: '100%', minHeight: 80, maxHeight: 300, resize: 'vertical', color: 'rgb(109, 110, 113)' }}
                  />
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
              <ActionButton className="primary" type="submit" large icon="edit" text="Submit" disabled={isRequestingDemo} loading={isRequestingDemo} onClick={this.requestDemo} style={{ backgroundColor: '#bf2a2c', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
