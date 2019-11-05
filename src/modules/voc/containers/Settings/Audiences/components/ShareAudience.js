/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class ShareAudience extends Component {
  static propTypes = {
    audience: PropTypes.object,
    selectedTab: PropTypes.string,
    alertActions: PropTypes.object,
    audiencesActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isTogglingShare: false,
      shareWithAccountId: null,
    };

    this.onAccountChanged = this.onAccountChanged.bind(this);
    this.onToggleShare = this.onToggleShare.bind(this);
  }

  onAccountChanged(e, { name, value }) {
    this.setState({ [name]: value });    
  }

  async onToggleShare() {
    this.setState({ isTogglingShare: true });
    const { audience, selectedTab, audiencesActions, alertActions, onCloseSidePanel } = this.props;
    const { shareWithAccountId } = this.state;
    const share = selectedTab === 'Owned';
    try {
      await audiencesActions.toggleShare(audience.panelId, shareWithAccountId, share);
      onCloseSidePanel();
      alertActions.addAlert({ type: 'success', message: `Successfully ${share ? 'shared' : 'unshared'} audience` });
      const fetchAudiencesResult = await audiencesActions.fetchSelectableAudiences();      
      const fetchAudiencesResultLength = fetchAudiencesResult.data.Data.panelsOwned.length + fetchAudiencesResult.data.Data.panelsSharedWithAccount.length;
      audiencesActions.setAudiences(fetchAudiencesResult.data.Data, fetchAudiencesResultLength, 1);
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
    } finally {
      this.setState({ isTogglingShare: false });
    }
  }

  render() {
    const { audience, selectedTab, onCloseSidePanel, user } = this.props;
    const { isTogglingShare, shareWithAccountId } = this.state;
    const colorMix = stringToHexColor(audience.panelName);
    let options = selectedTab === 'Owned' ? user.accounts.filter((account) => account.id !== user['x-account-id']) : audience.sharedWith;
    options = options.map((account) => ({
      key: account.id,
      value: account.id,
      text: account.profilename,
    }));

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>
            {selectedTab === 'Owned' ? 'Share' : 'Unshare'}
            &nbsp;Audience
          </h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(audience.panelName)}</div>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{audience.panelName}</span>
            </div>
          </div>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%' }}>
              <Dropdown
                placeholder="Select Account"
                required
                search
                selection
                name="shareWithAccountId"
                value={shareWithAccountId}
                onChange={this.onAccountChanged}
                options = {options}
                style={{ width: 440, maxWidth: '100%', marginRight: 5, backgroundColor: '#fafbfc' }}
              />
            </div>
          </div>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
            <ActionButton className="primary" type="submit" large icon={selectedTab === 'Owned' ? 'share' : 'cancel'} text={selectedTab === 'Owned' ? 'Share Audience' : 'Unshare Audience'} disabled={isTogglingShare || !shareWithAccountId} loading={isTogglingShare} onClick={this.onToggleShare} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
          </div>
        </div>
      </div>
    );
  }
}
