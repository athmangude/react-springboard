/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TelcosSidePanel from './telcosSidePanel';
import EditNetworkIDForm from './editNetworkIDForm';


class NetworkIDListItem extends Component {
  static propTypes = {
    networkId: PropTypes.object,
    commDomain: PropTypes.string,
    commDomains: PropTypes.array,
    country: PropTypes.object,
    countries: PropTypes.array,
    alertActions: PropTypes.object,
    EventHandler: PropTypes.object,
    telcoActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onShowSidePanel = this.onShowSidePanel.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
  }

  state = {
    isMouseOver: false,
    showSidePanel: false,
    title: 'Edit Network ID',
  }

  componentDidMount() { }

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  onShowSidePanel() {
    this.setState({ showSidePanel: true });
  }

  onCloseSidePanel() {
    this.setState({ showSidePanel: false });
  }

  render() {
    const { networkId, commDomain, country, commDomains, countries, alertActions, EventHandler, telcoActions } = this.props;
    const { isMouseOver, showSidePanel, title } = this.state;
    return (
      <div>
        <div role="button" className="account-list-item" onClick={this.onShowSidePanel} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%',  padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent', cursor: 'pointer', marginLeft: '30px', marginBottom:'2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>{networkId.networkId}</span>
          </div>
          {
            isMouseOver ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* <IconButton icon="visibility" style={{ margin: 0, padding: 6 }} />
                  <IconButton icon="edit" style={{ margin: 0, padding: 6 }} />
                <IconButton icon="delete" style={{ margin: 0, padding: 6 }} /> */}
              </div>
            ) : null
          }
        </div>
        <TelcosSidePanel showSidePanel={showSidePanel} onCloseSidePanel={this.onCloseSidePanel} title={title}>
          <EditNetworkIDForm networkId={networkId} commDomain={commDomain} commDomains={commDomains} country={country} countries={countries} alertActions={alertActions} EventHandler={EventHandler} telcoActions={telcoActions} onCloseSidePanel={this.onCloseSidePanel}/>
        </TelcosSidePanel>
      </div>
    );
  }
}
export default NetworkIDListItem;
