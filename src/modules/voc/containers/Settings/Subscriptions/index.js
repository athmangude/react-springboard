/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-grid-system';
import { Button, Checkbox } from 'semantic-ui-react';
import { connect } from 'react-redux';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';
import * as subscriptionsActions from './flux/actions';
import * as rolesActions from '../Roles/flux/actions';
import * as meActions from '../../Authentication/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

@connect((state) => ({
  user: state.authentication.user,
  roles: state.roles,
}),
(dispatch) => ({
  subscriptionsActions: bindActionCreators(subscriptionsActions, dispatch),
  rolesActions: bindActionCreators(rolesActions, dispatch),
  meActions: bindActionCreators(meActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))

class Subscriptions extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    rolesActions: PropTypes.func,
    meActions: PropTypes.func,
    EventHandler: PropTypes.func,
    roles: PropTypes.array,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const { user } = props.user;
    const subscriptions = user.subscriptions ? JSON.stringify(user.subscriptions) : [];
    this.state = {
      isFetchingRoles: false,
      isUpdatingSubscriptionSettings: false,
      subscriptions: JSON.parse(subscriptions),
    };

    this.onSubscriptionToggled = this.onSubscriptionToggled.bind(this);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.updateSubscriptionSettings = this.updateSubscriptionSettings.bind(this);
  }

  componentDidMount() {
    this.fetchRoles();
  }

  onSubscriptionToggled(e, { id }) {
    let { subscriptions } = this.state;

    if (e.target.checked) {
      subscriptions.push(id);
    } else {
      subscriptions = subscriptions.filter((s) => s !== id);
    }

    this.setState({ subscriptions });
    this.props.EventHandler.trackEvent({ category: 'Subscriptions', action: 'toggle subscription', value: id });
  }

  async fetchRoles() {
    this.setState({ isFetchingRoles: true });
    try {
      const fetchRolesResult = await this.props.rolesActions.fetchRoles();
      this.props.rolesActions.addRoles(fetchRolesResult.data.data.Data);
    } catch (exception) {
      this.props.EventHandler.trackEvent({ category: 'Subscriptions', action: 'fetch roles', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingRoles: false });
    }
  }

  async updateSubscriptionSettings() {
    this.setState({
      isUpdatingSubscriptionSettings: true,
    });

    const { subscriptions } = this.state;

    try {
      await this.props.subscriptionsActions.updateSubscriptions(subscriptions);
      this.props.meActions.updateSubscriptions(subscriptions);
      this.props.alertActions.addAlert({ type: 'success', message: 'Successfully updated subscriptions' });
      this.props.EventHandler.trackEvent({ category: 'Subscriptions', action: 'update subscriptions settings', value: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      this.props.EventHandler.trackEvent({ category: 'Subscriptions', action: 'update subscriptions settings', value: false });
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isUpdatingSubscriptionSettings: false,
      });
    }
  }

  render() {
    const { isUpdatingSubscriptionSettings, isFetchingRoles, subscriptions } = this.state;
    const { roles, user: { user } } = this.props;
    const currentSubscriptions = user.subscriptions ? user.subscriptions : [];
    const filteredRoles = [];

    roles.items
      .filter((role) => !['ADMIN', 'COLLABORATOR'].includes(role.name))
      .forEach((role) => {
        const title = role.name.toLowerCase().replace(/_/g, ' ');
        filteredRoles.push({
          id: role.id,
          name: role.name,
          title,
          description: `When you’re subscribed to this subscription, you will automatically receive ${title} reports in your inbox.`,
        });
      });

    return (
      <SettingsNavigationContainer EventHandler={this.props.EventHandler}>
        <Container fluid style={{ margin: 0, padding: 0 }}>
          <Row style={{ margin: 0, padding: 0 }}>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '100%', paddingBottom: 8, marginBottom: 16, borderBottom: '1px #e1e4e8 solid' }}>
                <h2 style={{ fontSize: 24, fontWeight: 'normal' }}>Subscriptions</h2>
              </div>
            </Col>
          </Row>
          <Row style={{ margin: 0, padding: 0 }}>
            { isFetchingRoles ? (
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <p style={{ marginBottom: 10, fontSize: 14 }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} /></p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #d1d5da', borderRadius: 3, marginTop: 16 }}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} style={{ width: '100%', margin: '0 0 20px', padding: 16, marginTop: -1, listStyleType: 'none', borderTop: '1px solid #e1e4e8' }}>
                      <h4 style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 25 }} /></div>} /></h4>
                      <p style={{ minHeight: 17, margin: '4px 0 2px', fontSize: 14, color: '#586069' }}><ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 15 }} /></div>} /></p>
                      <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 180, height: 20 }} /></div>} />
                    </div>
                  ))}
                </div>
              </Col>
            ) : filteredRoles.length ? (
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <p style={{ marginBottom: 10, fontSize: 14 }}>Choose what subscriptions you would like to receive. These subscription settings apply to your subscriptions.</p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #d1d5da', borderRadius: 3, marginTop: 16 }}>
                  {filteredRoles.map((role) => (
                    <div key={role.id} style={{ width: '100%', margin: '0 0 20px', padding: 16, marginTop: -1, listStyleType: 'none', borderTop: '1px solid #e1e4e8' }}>
                      <h4 style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{role.title}</h4>
                      <p style={{ minHeight: 17, margin: '4px 0 2px', fontSize: 14, color: '#586069' }}>{role.description}</p>
                      <Checkbox toggle checked={subscriptions.includes(role.id)} onChange={this.onSubscriptionToggled} id={role.id} label={subscriptions.includes(role.id) ? (<label style={{ fontWeight: 600 }}>Unsubscribe</label>) : (<label style={{ fontWeight: 600 }}>Subscribe</label>)} style={{ marginTop: 5 }} />
                    </div>
                  ))}
                </div>
                <div style={{ width: '100%', margin: '0 0 20px' }}>
                  <Button type="submit" disabled={isUpdatingSubscriptionSettings || JSON.stringify(currentSubscriptions.sort()) === JSON.stringify(subscriptions.sort())} loading={isUpdatingSubscriptionSettings} onClick={this.updateSubscriptionSettings} style={{ height: 35, borderRadius: 17.5, backgroundColor: '#002366', margin: '10px 10px', width: 133 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -5 }}>
                      <i className="material-icons" style={{ color: '#FFF', marginRight: 10 }}>edit</i>
                      <span style={{ color: '#FFF', fontSize: 12 }}>Update</span>
                    </div>
                  </Button>
                </div>
              </Col>
            ) : null}
          </Row>
        </Container>
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(Subscriptions);
