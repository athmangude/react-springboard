/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Container, Row } from 'react-grid-system';
import { Form, Dropdown } from 'semantic-ui-react/dist/commonjs';
import { connect } from 'react-redux';

import TabMenu from 'SharedComponents/tab';
import Chart from './components/Chart';
import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../components/SettingsNavigationContainer';

import * as incentivesUsageActions from './flux/actions';
import * as conversationActions from '../../Conversations/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';

const tabs = [{ label: 'Account' }, { label: 'Survey' }];

@connect((state) => ({
  conversations: state.conversations,
}),
(dispatch) => ({
  incentivesUsageActions: bindActionCreators(incentivesUsageActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  alertActions: bindActionCreators({ addAlert }, dispatch),
  dispatch,
}))
class IncentivesUsage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    conversations: PropTypes.object,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      isFetchingIncentivesUsage: false,
      surveyId: null,
      isFilteringByDate: false,
      selectedTab: 'Account',
    };

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onChangeSurvey = this.onChangeSurvey.bind(this);
    this.fetchConversations = this.fetchConversations.bind(this);
  }

  componentDidMount() {
    this.fetchConversations();
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab, surveyId: null });
  }

  onChangeSurvey(e, { name, value }) {
    this.setState({ [name]: value });
    this.props.EventHandler.trackEvent({ category: 'IncetivesUsage', action: 'changed survey', value });
  }

  async fetchConversations(page) {
    this.setState({
      isLoading: true,
    });

    try {
      const fetchConversationsResult = await this.props.conversationActions.fetchConversations(page, 'active');
      this.props.conversationActions.setConversations({
        items: fetchConversationsResult.data.Data.objects,
        page,
        totalCount: fetchConversationsResult.data.Data.meta.totalCount,
      }, 'active');
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const { conversations, EventHandler } = this.props;
    const activeConversationItems = conversations.active.items ? conversations.active.items : [];
    const { surveyId, accountLevel, isLoading } = this.state;

    return (
      <SettingsNavigationContainer
        topRightComponent={null}
        EventHandler={this.props.EventHandler}
      >
        <div style={{ width: '100%' }}>
          <Container fluid style={{ margin: 0, padding: 0 }}>
            <Row style={{ margin: 0, padding: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: '#6d6e71' }}>Incentives Usage</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                <TabMenu tabs={tabs} selectedTab={this.state.selectedTab} onTabSelected={this.onTabSelected} style={{ backgroundColor: 'inherit' }} />
                <div style={{ width: '100%', margin: '10px 0' }}>
                  {this.state.selectedTab === 'Survey' ? (
                    <Form.Field
                      loading={isLoading}
                      control={Dropdown}
                      name="surveyId"
                      value={surveyId}
                      onChange={this.onChangeSurvey}
                      placeholder="Select Survey"
                      selection
                      options={activeConversationItems.map((c) => ({
                        key: c.id,
                        value: c.id,
                        text: c.title,
                      }))}
                      width={8}
                      style={{ width: '100%', borderRadius: 0 }}
                      className="custom-field"
                    />
                  ) : null}
                </div>
              </div>
            </Row>
          </Container>
        </div>
        <div style={{ width: '100%' }}>
          <Container fluid style={{ margin: 0, padding: 0 }}>
            <Row style={{ margin: 0, padding: 0 }}>
              <Chart surveyId={surveyId} EventHandler={EventHandler} alertActions={this.props.alertActions} tab={this.state.selectedTab} />
            </Row>
          </Container>
        </div>
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(IncentivesUsage);
