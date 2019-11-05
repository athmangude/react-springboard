import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'react-grid-system';
import 'font-awesome/css/font-awesome.min.css';
import Spinner from 'react-spinner-material';
import ContainerDimensions from 'react-container-dimensions';

import withAuthentication from 'Utils/withAuthentication';
// import TopBarLayout from 'Layouts/top-bar';
// import SideTopBarLayout from 'Layouts/side-top-bar';
import SimpleLayoutExtended from 'Layouts/simple-layout-extended';
import CustomerService from './components/CustomerService';
import SearchRespondents from './components/SearchRespondents';
import Conversations from './components/Conversations';
import NewConversationFAB from './components/Conversations/NewConversationFAB';
import Messages from './components/Messages';
import Platforms from './components/Platforms';
import EmptyConversation from './components/EmptyConversation';
import * as configurationsActions from 'Modules/voc/containers/Configurations/flux/actions';


@connect((state) => ({
  authentication: state.authentication.user,
  history: state.history,
  configurations: state.configurations,
  route: state.route,
}),
(dispatch) => ({
  configurationsActions: bindActionCreators(configurationsActions, dispatch),
  dispatch,
}))

class Convo extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    configurations: PropTypes.object,
    authentication: PropTypes.object,
    route: PropTypes.object,
    alertActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const newPathNameArray = props.route.location.pathname.split('/');
    const activeConversationId = newPathNameArray.length > 2 ? parseInt(newPathNameArray[2], 10) : null;

    this.state = {
      activePlatformId: 1,
      activeConversationId,
      activeParticipant: null,
      loading: true,
      pollTime: null,
    };

    this.clickPlatformHandler = this.clickPlatformHandler.bind(this);
    this.clickConversationHandler = this.clickConversationHandler.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.backToConversations = this.backToConversations.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ pollTime: Date.now() }), 5000);
  }

  componentWillReceiveProps(newProps) {
    const { activeConversationId } = this.state;

    const newPathNameArray = newProps.route.location.pathname.split('/');
    const newActiveConversationId = newPathNameArray.length > 2 ? parseInt(newPathNameArray[2], 10) : null;

    if (newActiveConversationId && newActiveConversationId !== activeConversationId) {
      this.setState({
        activeConversationId: newActiveConversationId,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async clickPlatformHandler(id) {
    this.setState(() => ({ activePlatformId: id }));
  }

  async clickConversationHandler(participant) {
    this.setState(() => ({ activeConversationId: participant.id, activeParticipant: participant }));
  }

  toggleLoading(value) {
    this.setState(() => ({
      loading: value,
    }));
  }

  backToConversations() {
    this.setState({ activeConversationId: null, activeParticipant: null });
    this.context.router.history.push('/live-chat');
  }

  render() {
    const { activeConversationId, activePlatformId, loading, pollTime, activeParticipant } = this.state;
    const { toggleLoading, clickConversationHandler } = this;
    const { authentication, alertActions } = this.props;

    if (!this.props.configurations.features.convo) {
      return (
        <SimpleLayoutExtended>
          <Helmet title="Convo" meta={[{ name: 'description', content: 'Spring Board – Build something awesome' }]} />
          <div style={{ width: '100%' }}>
            <EmptyConversation
              text={!this.props.configurations.loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <h1 style={{ textAlign: 'center' }}>Chat with your customers in realtime</h1>
                  <p style={{ textAlign: 'center' }}>Live chat is not active for your account. Please contact support to learn more.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <p style={{ textAlign: 'center' }}>Checking configurations</p>
                  <Spinner spinnerColor="#487db3" size={15} spinnerWidth={2} />
                </div>
              )}
            />
          </div>
        </SimpleLayoutExtended>
      );
    }

    return (
      <SimpleLayoutExtended>
        <Helmet title="Convo" meta={[{ name: 'description', content: 'Convo, Live Chat, mSurvey, Product' }]} />
        <div style={{ width: '100%', margin: 0, padding: 0 }}>
          <ContainerDimensions>
            {
              ({ width }) => {
                if (width > 425) {
                  return (
                    <div style={{ backgroundColor: '#F9FAFC', margin: 0, height: 'calc(100vh - 60px)' }}>
                      <Row style={{ height: 'inherit', margin: 0, padding: 0 }}>
                        <Col xl={4} lg={4} md={5} sm={12} xs={12} style={{ backgroundImage: 'linear-gradient(to bottom, #5b8dc2, #33597f)', paddingLeft: 0, paddingRight: 0 }}>
                          <CustomerService me={authentication.user} account={authentication.account} loading={loading} />
                          <SearchRespondents activePlatformId={activePlatformId} alertActions={alertActions} />
                          <Platforms clickPlatformHandler={this.clickPlatformHandler} activePlatformId={activePlatformId} loading={loading} />
                          <Conversations activePlatformId={activePlatformId} activeConversationId={activeConversationId} clickConversationHandler={clickConversationHandler} toggleLoading={toggleLoading} pollTime={pollTime} width={width} />
                          <NewConversationFAB platformId={activePlatformId} loading={loading} alertActions={alertActions} />
                        </Col>
                        <Col xl={8} lg={8} md={7} sm={12} xs={12} style={{ backgroundColor: '#f3f4f9', paddingLeft: 0, paddingRight: 0 }}>
                          <Messages activeConversationId={activeConversationId} loading={loading} pollTime={pollTime} activeParticipant={activeParticipant} width={width} alertActions={alertActions} account={authentication.account} />
                        </Col>
                      </Row>
                    </div>
                  );
                } else if (width < 425) {
                  if (activeConversationId && activeParticipant) {
                    return (
                      <div style={{ backgroundColor: '#F9FAFC', margin: 0, height: 'calc(100vh - 100px)' }}>
                        <Row style={{ height: 'inherit', margin: 0, padding: 0 }}>
                          <Col xl={8} lg={8} md={7} sm={12} xs={12} style={{ backgroundColor: '#f3f4f9', paddingLeft: 0, paddingRight: 0 }}>
                            <Messages activeConversationId={activeConversationId} loading={loading} pollTime={pollTime} activeParticipant={activeParticipant} backToConversations={this.backToConversations} width={width} alertActions={alertActions} account={authentication.account} />
                          </Col>
                        </Row>
                      </div>
                    );
                  }
                }
                return (
                  <div style={{ backgroundColor: '#F9FAFC', margin: 0, height: 'calc(100vh - 100px)' }}>
                    <Row style={{ height: 'inherit', margin: 0, padding: 0 }}>
                      <Col xl={4} lg={4} md={5} sm={12} xs={12} style={{ backgroundImage: 'linear-gradient(to bottom, #5b8dc2, #33597f)', paddingLeft: 0, paddingRight: 0 }}>
                        <CustomerService me={authentication.user} account={authentication.account} loading={loading} />
                        <SearchRespondents activePlatformId={activePlatformId} alertActions={alertActions} />
                        <Platforms clickPlatformHandler={this.clickPlatformHandler} activePlatformId={activePlatformId} loading={loading} />
                        <Conversations activePlatformId={activePlatformId} activeConversationId={activeConversationId} clickConversationHandler={clickConversationHandler} toggleLoading={toggleLoading} pollTime={pollTime} width={width} />
                        <NewConversationFAB platformId={activePlatformId} loading={loading} alertActions={alertActions} />
                      </Col>
                    </Row>
                  </div>
                );
              }
            }
          </ContainerDimensions>
        </div>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(Convo);
