/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { observer } from 'mobx-react';

import IconButton from 'SharedComponents/icon-button';
import SendCampaign from './SendCampaign';

import SearchCampaigns from './SearchCampaigns';

import * as conversationActions from 'Modules/voc/containers/Conversations/flux/actions';

@connect((state) => ({
  audiences: state.audiences,
  authentication: state.authentication,
  conversations: state.conversations,
  loggedInUserRole: state.roles.loggedInUserRole,
  account: state.account,
  history: state.history,
  route: state.route,
}),
(dispatch) => ({
  conversationActions: bindActionCreators(conversationActions, dispatch),
  dispatch,
}))
@observer
class Campaigns extends Component {
  static propTypes = {
    EventHandler: PropTypes.object.isRequired,
    audiences: PropTypes.array.isRequired,
    onCloseSidePanel: PropTypes.func.isRequired,
    customerAnalyticsActions: PropTypes.object.isRequired,
    alertActions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    segmentId: PropTypes.number.isRequired,
    participants: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.onSurveySelected = this.onSurveySelected.bind(this);
    this.onCloseSidePanel = this.onCloseSidePanel.bind(this);
  }

  state = {
    conversation: null,
  }

  onSurveySelected(conversation) {
    this.setState({ conversation });
  }

  onCloseSidePanel() {
    const { onCloseSidePanel } = this.props;

    onCloseSidePanel();
  }

  render() {
    const {
      audiences: audiencesList, EventHandler, alertActions, customerAnalyticsActions, account, segmentId, participants,
    } = this.props;
    const { conversation } = this.state;
    const audiences = { items: [...audiencesList.items.panelsOwned, ...audiencesList.items.panelsSharedWithAccount] };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
        <div style={{ width: '100%', backgroundColor: '#fff', position: 'relative' }}>
          <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)', zIndex: 100 }}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Send Campaign</h2>
            <IconButton icon="close" onClick={this.onCloseSidePanel} />
          </div>
        </div>
        <div
          style={{
            padding: '5px 5px',
            width: '100%',
          }}
        >
          <SearchCampaigns onSelect={this.onSurveySelected} account={account} />
          {
            conversation !== null ? (
              <SendCampaign
                onCloseSidePanel={this.onCloseSidePanel}
                segmentId={segmentId}
                conversation={conversation}
                audiences={audiences}
                EventHandler={EventHandler}
                customerAnalyticsActions={customerAnalyticsActions}
                alertActions={alertActions}
                participants={participants}
              />
            ) : (
              <p>Please Search and select a campaign </p>
            )
          }
        </div>
      </div>
    );
  }
}

export default Campaigns;
