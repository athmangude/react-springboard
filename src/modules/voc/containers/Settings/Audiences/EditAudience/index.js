/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import Spinner from 'react-spinner-material';
import { connect } from 'react-redux';

import ActionButton from 'SharedComponents/action-button-styled';
import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';
import GenericPagePlaceholder from 'SharedComponents/mwamba-generic-page-placeholder';

import * as audienceActions from '../flux/actions';

@connect((state) => ({
  account: state.account,
}), (dispatch) => ({}))

export default class EditAudience extends Component {
  static propTypes = {
    alertActions: PropTypes.object,
    audiencesActions: PropTypes.object,
    onCloseSidePanel: PropTypes.func,
    EventHandler: PropTypes.object,
    user: PropTypes.object,
    audience: PropTypes.object,
    account: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { audience } = props;
    this.state = {
      audience: {
        name: audience.panelName,
      },
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchAudience();
  }

  onChange(event, { name, value }) {
    const { audience } = this.state;
    this.setState({ audience: { ...audience, [name]: value } });
  }

  async onSubmit() {
    this.setState({ submitting: true });
    const { audiencesActions, alertActions, EventHandler, onCloseSidePanel } = this.props;
    const { audience, country } = this.state;
    const { id, incentive, name } = audience;
    const body = {
      country: country.code,
      name,
      incentive: incentive || 0,
      type: 'PANEL',
    };

    try {
      await audiencesActions.editAudience(id, body);
      alertActions.addAlert({ type: 'success', message: 'Successfully updated audience' });
      EventHandler.trackEvent({ category: 'Audiences', action: 'edit audience', value: true });
      onCloseSidePanel();
      const fetchAudiencesResult = await audiencesActions.fetchSelectableAudiences();      
      const fetchAudiencesResultLength = fetchAudiencesResult.data.Data.panelsOwned.length + fetchAudiencesResult.data.Data.panelsSharedWithAccount.length;
      audiencesActions.setAudiences(fetchAudiencesResult.data.Data, fetchAudiencesResultLength, 1);  
    } catch (exception) {
      alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.trackEvent({ category: 'Audiences', actions: 'edit audience', value: false });
    } finally {
      this.setState({ submitting: false });
    }
  }

  async fetchAudience() {
    this.setState({ isFetching: true });
    const { audiencesActions, user, EventHandler, audience  } = this.props;
    try {
      const fetchAudienceResult = await audiencesActions.fetchAudience(audience.panelId);
      const country = user.countries.find((c) => parseInt(c.id, 10) === fetchAudienceResult.data.data.Data.countryId);
      this.setState({ audience: fetchAudienceResult.data.data.Data, country });
      EventHandler.trackEvent({ category: 'Audiences', action: 'fetch audience', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'Audiences', action: 'fetch audience', value: false });
    } finally {
      this.setState({ isFetching: false });
    }
  }

  render() {
    const { onCloseSidePanel , account } = this.props;
    const { audience, submitting, isFetching, country } = this.state;
    const colorMix = stringToHexColor(audience.name);

    if (!account.active) {
      return (
        <SettingsNavigationContainer
          topRightComponent={(
            <ActionButton icon="visibility" text="View Audiences" onClick={this.onViewAudience} />
          )}>
          <GenericPagePlaceholder title="Restricted Access" text="Your account is deactivated. You cannot edit a panel" />
        </SettingsNavigationContainer>
      );
    }

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Edit Audience</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        {
          isFetching ? (
            <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner spinnerColor="#002366" size={40} spinnerWidth={2} />
              <span style={{ margin: 20 }}>Fetching audience details</span>
            </div>
          ) : (
            <div style={{ padding: '0 10px 0 10px' }}>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(audience.name)}</div>
                  <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>{audience.name}</span>
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                  <b>Audience name</b>
                  <Input
                    label={false}
                    placeholder="Audience name"
                    name="name"
                    value={audience.name}
                    onChange={this.onChange}
                    className="full-width-input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                  <b>Country</b>
                  <Input
                    label={false}
                    placeholder="Country"
                    value={country ? country.name : ''}
                    className="full-width-input-field"
                    style={{ width: '100%' }}
                    disabled
                  />
                </div>
              </div>
              <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                  <b>Incentive</b>
                  <Input
                    label={false}
                    placeholder="Incentive"
                    name="incentive"
                    value={audience.incentive}
                    onChange={this.onChange}
                    className="full-width-input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px 0 0' }}>
                <ActionButton className="primary" type="submit" large icon="edit" text="Update" loading={submitting} disabled={submitting} onClick={this.onSubmit} style={{ backgroundColor: '#002366', color: '#fff', width: 200, boxShadow: '0 0 5px rgba(0, 0, 0, 0.8)', borderRadius: 5 }} />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}
