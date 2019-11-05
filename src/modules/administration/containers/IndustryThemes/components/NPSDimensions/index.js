/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'react-grid-system';
import { Form, Dropdown, Checkbox } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NPSDimensionPill from './NpsDimensionPill';
import NPSDimensionPillPlaceholder from './NPSDimensionPillPlaceholder';

import ActivityHandler from 'Utils/ActivityHandler';
import withAuthentication from 'Utils/withAuthentication';
import SettingsNavigationContainer from '../../components/SettingsNavigationContainer';

import * as accountActions from '../flux/actions';
import * as conversationActions from 'Modules/voc/containers/Conversations/flux/actions';

@connect((state) => ({
  user: state.authentication.user,
  conversations: state.conversations,
}),
(dispatch) => ({
  accountActions: bindActionCreators(accountActions, dispatch),
  conversationActions: bindActionCreators(conversationActions, dispatch),
  dispatch,
}))
class NPSDimensions extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    conversations: PropTypes.object,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    accountActions: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.onAccountLevelToggled = this.onAccountLevelToggled.bind(this);
    this.onChangeSurvey = this.onChangeSurvey.bind(this);
    this.fetchAvailableNPSFIlters = this.fetchAvailableNPSFIlters.bind(this);
    this.fetchAppliedNPSFilters = this.fetchAppliedNPSFilters.bind(this);
    this.fetchConversations = this.fetchConversations.bind(this);
  }

  state = {
    surveyId: null,
    isFetchingAvailableNPSFilters: false,
    isFetchingAppliedNPSFilters: false,
    availableNPSFIlters: [],
    appliedNPSFIlters: [],
    limit: 20,
    offset: 0,
    accountLevel: true,
  }

  componentDidMount() {
    this.fetchConversations();
    this.fetchAvailableNPSFIlters();
    this.fetchAppliedNPSFilters();
  }

  onAccountLevelToggled(e, { id }) {
    this.setState({ [id]: e.target.checked, surveyId: null, availableNPSFIlters: [], appliedNPSFIlters: [] }, () => {
      if (e.target.checked) {
        this.fetchAvailableNPSFIlters();
        this.fetchAppliedNPSFilters();
      }
    });
  }

  onChangeSurvey(e, { name, value }) {
    this.setState({ [name]: value, offset: 0, availableNPSFIlters: [], appliedNPSFIlters: [] }, () => {
      this.fetchAvailableNPSFIlters();
      this.fetchAppliedNPSFilters();
    });
  }

  async fetchAvailableNPSFIlters() {
    this.setState({ isFetchingAvailableNPSFilters: true });
    const { surveyId } = this.state;
    try {
      const availableNPSFIltersResult = await this.props.accountActions.fetchAvailableNPSFIlters(surveyId);
      this.setState({ availableNPSFIlters: availableNPSFIltersResult.data.Data });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingAvailableNPSFilters: false });
    }
  }

  async fetchAppliedNPSFilters() {
    this.setState({ isFetchingAppliedNPSFilters: true });
    const { surveyId } = this.state;
    try {
      const appliedNPSFIltersResult = await this.props.accountActions.fetchAppliedNPSFilters(surveyId);
      this.setState({ appliedNPSFIlters: appliedNPSFIltersResult.data.Data });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingAppliedNPSFilters: false });
    }
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
    const { conversations } = this.props;
    const activeConversationItems = conversations.active.items ? conversations.active.items : [];
    const { accountLevel, surveyId, isFetchingAvailableNPSFilters, isFetchingAppliedNPSFilters, appliedNPSFIlters, availableNPSFIlters, isLoading } = this.state;

    return (
      <SettingsNavigationContainer EventHandler={this.props.EventHandler}>
        <div style={{ width: '100%' }}>
          <Container>
            <Row>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ width: 200, margin: '15px 0' }}>
                  <Checkbox toggle checked={accountLevel} id="accountLevel" onChange={this.onAccountLevelToggled} label={<label htmlFor="accountLevel" style={{ color: '#6d6e71' }}>Account Level?</label>} />
                </div>
                <div style={{ width: 'calc(100% - 200px)', margin: '10px 0' }}>
                  {!accountLevel ? (
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
        {!accountLevel && !surveyId ? (
          <div style={{ width: '100%', padding: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: '#fafbfc', border: '1px solid #e1e4e8', borderRadius: 3, boxShadow: 'inset 0 0 10px rgba(27,31,35,0.05)' }}>
            <span style={{ color: '#6d6e71', fontSize: 16, fontWeight: 'normal' }}>Select a survey to view the available and applied NPS filters</span>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <Container>
              <div style={{ width: '100%' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '100%', paddingBottom: 8, marginBottom: 16, borderBottom: '1px #e1e4e8 solid' }}>
                    <h2 style={{ fontSize: 24, fontWeight: 'normal' }}>Applied Filters</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                    {
                      isFetchingAvailableNPSFilters && !appliedNPSFIlters.length ? (
                        <NPSDimensionPillPlaceholder size="large" count={3} />
                      ) : !appliedNPSFIlters.length ? (
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: 'solid 1px #d9d9d9', backgroundColor: '#fff', borderRadius: 8, padding: '20px 10px' }}>
                          <b style={{ fontSize: 18, margin: 10, color: '#3d4553' }}>You have not applied any NPS filters</b>
                          <span style={{ margin: 5, color: '#3d4553' }}>Please add some from the list of available filters below</span>
                        </div>
                      ) : appliedNPSFIlters.map((filter, i) => (
                        <NPSDimensionPill stance="positive" key={i} filter={filter} surveyId={surveyId} accountLevel={accountLevel} accountActions={this.props.accountActions} fetchAppliedNPSFilters={this.fetchAppliedNPSFilters} isFetchingAvailableNPSFilters={isFetchingAvailableNPSFilters} isFetchingAppliedNPSFilters={isFetchingAppliedNPSFilters} alertActions={this.props.alertActions} EventHandler={this.props.EventHandler} />
                      ))
                    }
                  </div>
                </div>
                <br />
                <br />
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '100%', paddingBottom: 8, marginBottom: 16, borderBottom: '1px #e1e4e8 solid' }}>
                    <h2 style={{ fontSize: 24, fontWeight: 'normal' }}>Available Filters</h2>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                      isFetchingAvailableNPSFilters && !availableNPSFIlters.length ? (
                        <NPSDimensionPillPlaceholder size="small" count={3} />
                      ) : !availableNPSFIlters.length ? (
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: 'solid 1px #d9d9d9', backgroundColor: '#fff', borderRadius: 8, padding: '20px 10px' }}>
                          <b style={{ fontSize: 18, margin: 10, color: '#3d4553' }}>There is no metadata properties to to apply</b>
                          <span style={{ margin: 5, color: '#3d4553' }}>We automatically detect metadata you provide in. Metadata we have detected will be displayed here.</span>
                        </div>
                      ) : availableNPSFIlters.map((filter, i) => (
                        <NPSDimensionPill stance="negative" key={i} filter={filter} surveyId={surveyId} accountLevel={accountLevel} accountActions={this.props.accountActions} fetchAppliedNPSFilters={this.fetchAppliedNPSFilters} appliedNPSFIlters={appliedNPSFIlters} alertActions={this.props.alertActions} EventHandler={this.props.EventHandler} />
                      ))
                    }
                  </div>
                </div>
              </div>
            </Container>
          </div>
        )}
      </SettingsNavigationContainer>
    );
  }
}

export default withAuthentication(NPSDimensions);
