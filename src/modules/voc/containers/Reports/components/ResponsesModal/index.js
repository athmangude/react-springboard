import React, { Component } from 'react';
import { Button, Modal, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Comment from '../chart-container/Comment';
import * as csReportActions from '../../CS/flux/actions';
import ActivityHandler from 'Utils/ActivityHandler';

@connect((state) => ({
  user: state.authentication.user,
}),
(dispatch) => ({
  csReportActions: bindActionCreators(csReportActions, dispatch),
  dispatch,
}))

export default class ResponsesModal extends Component {
  static propTypes = {
    question: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const { question } = props;

    this.state = {
      viewModal: false,
      isFetchingResponses: false,
      offset: 20,
      responses: question.responses,
      noMoreResponsesToLoad: question.responses.length < 20,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.fetchQuestionResponses = this.fetchQuestionResponses.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { question } = newProps;

    this.setState({
      responses: question.responses,
      noMoreResponsesToLoad: question.responses.length < 20,
    });

    this.toggleModal = this.toggleModal.bind(this);
    this.fetchQuestionResponses = this.fetchQuestionResponses.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }


  toggleModal() {
    this.setState((prevState) => ({
      viewModal: !prevState.viewModal,
    }));
  }

  async fetchQuestionResponses() {
    this.setState({ isFetchingResponses: true });

    const { surveyId, question, startDate, endDate, npsFilters } = this.props;
    let newResponses = [];

    try {
      const questionResponsesResult = await this.props.csReportActions.fetchSurveyQuestionResponses(surveyId, question.questionId, { limit: 20, offset: this.state.offset }, { startDate, endDate }, npsFilters);

      newResponses = questionResponsesResult.data.Data;
      this.setState((prevState) => ({
        responses: prevState.responses.concat(newResponses),
      }));
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingResponses: false, offset: this.state.offset + 20 });
      if (!newResponses.length) {
        this.setState({ noMoreResponsesToLoad: true });
      }
    }
  }

  renderFooter() {
    const { isFetchingResponses, noMoreResponsesToLoad } = this.state;

    if (noMoreResponsesToLoad) {
      return (<div style={{ textAlign: 'center', fontSize: 11, color: '#6d6e71' }}>No more responses to load</div>);
    }

    return (
      <Button onClick={this.fetchQuestionResponses} disabled={isFetchingResponses || noMoreResponsesToLoad} className="mwamba-primary-button" style={{ borderRadius: 15, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 20px', marginTop: 10 }}>
        <span>Load More</span>
        {isFetchingResponses ? (<Loader active={isFetchingResponses} inline size="mini" style={{ marginLeft: 10 }} />) : null}
      </Button>
    );
  }

  render() {
    const { viewModal, responses } = this.state;
    const { toggleModal } = this;
    const { question } = this.props;
    return (
      <div>
        <Modal
          style={{ zIndex: 9999, marginTop: 100, marginRight: 'auto', marginLeft: 'auto', position: 'relative' }}
          trigger={
            <Button
              className={`button card-action ${viewModal ? 'active' : ''}`}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 17.5, margin: '10px 0 3px 0', padding: '5px 15px', backgroundColor: viewModal ? '#d9d9d9' : 'transparent', color: viewModal ? '#6d6e71' : '#6d6e71' }}
              onClick={toggleModal}
            >
              <i className="material-icons" style={{ fontSize: 16, margin: 3, direction: 'rtl' }}>visibility</i>
              <span style={{ fontWeight: 'normal', fontSize: 14 }}>View More</span>
            </Button>
          }
          onClose={this.toggleModal}
          open={viewModal}
        >
          <Modal.Header key="header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
              <div style={{ width: 50, height: 50, backgroundColor: '#f7f7f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: 10, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: -0.5, textAlign: 'center', color: '#6d6e71' }}>
                <div style={{ fontSize: 8 }}>Question</div>
                <div style={{ fontSize: 16, fontWeight: 'bold' }}>{question.questionLevel}</div>
              </div>
              <div style={{ width: 'calc(100% - 50px)' }}>
                <b style={{ color: '#3d4553' }}>{question.questionText}</b>
              </div>
            </div>
          </Modal.Header>
          <Modal.Content scrolling key="content">
            <Modal.Description>
              {responses.map((response, i) => {
                if (!response.response) {
                  return null;
                }
                return (<Comment key={i} response={response} i={i} />);
              })}
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0', padding: '10px 0' }}>
                {this.renderFooter()}
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions key="actions">
            <Button onClick={toggleModal}>
              Close <i className="material-icons" style={{ fontSize: 16, margin: 3, direction: 'rtl' }}>close</i>
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
