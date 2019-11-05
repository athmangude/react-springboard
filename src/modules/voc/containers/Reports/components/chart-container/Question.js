/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-return-assign, no-plusplus, object-curly-newline, no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-spinner-material';

import CommentList from './CommentList';
import BarChartAlternate from './BarChartAlternate';
import NPSChart from './NPSChart';
import ChartFeedback from 'Modules/voc/containers/Home/components/chart-feedback';
import ResponsesModal from '../ResponsesModal';
import CES from './CES';
import ActionButton from 'SharedComponents/action-button';

import * as aodReportActions from '../../AOD/flux/actions';

import styles from './Question.css';

const QuestionNumberWrapper = styled.div`${styles}`;

@connect(
  (state) => ({
    authentication: state.authentication,
    aodReport: state.aodReport,
  }),
  (dispatch) => ({
    aodReportActions: bindActionCreators(aodReportActions, dispatch),
    dispatch,
  })
)

export default class Question extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onFilterByBarChartOption: PropTypes.func.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    npsFilters: PropTypes.object,
    surveyId: PropTypes.string,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    aodReportActions: PropTypes.object,
  };

  static propTypes = {
    collaborators: PropTypes.array.isRequired,
    authentication: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onCommentChange = this.onCommentChange.bind(this);
    this.onToggleCommentBox = this.onToggleCommentBox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onUpdateComments = this.onUpdateComments.bind(this);
    this.updateCommentingStatus = this.updateCommentingStatus.bind(this);
    this.fetchComments = this.fetchComments.bind(this);
    this.onToggleChartFeedback = this.onToggleChartFeedback.bind(this);
  }

  state = {
    comments: [],
    showCommentBox: false,
    currentComment: '',
    showChartFeedback: false,
    isCommenting: false,
    isFetchingComments: false,
  }

  componentDidMount() {
    this.fetchComments();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  onCommentChange(event) {
    this.setState({ currentComment: event.target.value });
  }

  onToggleCommentBox() {
    const { EventHandler } = this.props;
    const { isCommenting, showChartFeedback, showCommentBox } = this.state;
    if (!isCommenting) {
      if (showChartFeedback) {
        this.setState({ showCommentBox: !showCommentBox });
      } else {
        this.setState({ showCommentBox: !showCommentBox, showChartFeedback: true });
      }
    }
    EventHandler.trackEvent({ category: 'Question', action: 'toggle comment box', value: true });
  }

  onSubmit(form = null) {
    const { authentication } = this.props;
    const { currentComment, comments } = this.state;
    if (!currentComment.replace(/\s/g, '').length) {
      return;
    }

    this.setState({
      comments: [...comments, {
        user: authentication.user,
        time: new Date(),
        body: currentComment,
      }],
      currentComment: '',
    });

    if (form) {
      form.reset();
    }
  }

  onKeyDown(event, form) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onSubmit(form);
    }
  }

  onUpdateComments(comments) {
    this.setState({ comments });
  }

  onToggleChartFeedback() {
    const { EventHandler } = this.props;
    const { showChartFeedback } = this.state;
    if (showChartFeedback) {
      this.setState({ showChartFeedback: !showChartFeedback, showCommentBox: !showChartFeedback });
    } else {
      this.setState({ showChartFeedback: !showChartFeedback });
    }
    EventHandler.trackEvent({ category: 'Question', action: 'toggle chart feedback', value: true });
  }

  async fetchComments() {
    const { EventHandler, aodReportActions, question } = this.props;
    this.setState({ isFetchingComments: true });
    try {
      const { startDate, endDate } = this.props;
      const fetchCommentsResult = await aodReportActions.fetchSurveyQuestionComments(question.questionId, { startDate, endDate });
      this.setState({ comments: fetchCommentsResult.data.Data });
      EventHandler.trackEvent({ category: 'Question', action: 'fetch comments', value: true });
    } catch (exception) {
      EventHandler.trackEvent({ category: 'Question', action: 'fetch comments', value: false });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isFetchingComments: false });
    }
  }

  updateCommentingStatus(isCommenting) {
    this.setState({ isCommenting });
  }

  render() {
    const { startDate, endDate, npsFilters, question, onFilterByBarChartOption, surveyId, authentication, EventHandler, alertActions, collaborators } = this.props;
    const { showCommentBox, comments, showChartFeedback, currentComment, isCommenting, isFetchingComments } = this.state;
    return (
      <QuestionNumberWrapper>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div className="question-level">
            <div style={{ fontSize: 8 }}>Question</div>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>{question.questionLevel}</div>
          </div>
          <div style={{ width: '75%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: question.score ? 'calc(100% - 60px)' : '100%', display: 'flex', alignSelf: 'flex-start' }}>
              <b style={{ color: '#3d4553' }}>{question.questionText}</b>
            </div>
            {
              question.questionType === 'SATISFACTION_RANGE' ? (
                <CES question={question} onChange={this.onChangeCESOption} />
              ) : null
            }
          </div>
        </div>
        <div style={{ padding: 0, margin: 0 }}>
          {
            question.questionType === 'OPEN_ENDED' || question.questionType === 'OPEN_ENDED_NPS' || question.questionType === 'OPEN_ENDED_INTEGER' ? (
              <CommentList question={question} />
            ) : question.questionType === 'MULTIPLE_CHOICE_SINGLE_SELECT' || question.questionType === 'MULTIPLE_CHOICE_MULTIPLE_SELECT' || question.questionType === 'OPEN_ENDED_RANGE_0_10' || question.questionType === 'OPEN_ENDED_RANGE_1_5' || question.questionType === 'OPEN_ENDED_DATE' || question.questionType === 'OPEN_ENDED_YEAR_YYYY' || question.questionType === 'INTRO_MESSAGE_MULTIPLE_CHOICE' || question.questionType === 'SATISFACTION_RANGE' ? (
              <BarChartAlternate question={question} onFilterByBarChartOption={onFilterByBarChartOption} />
            ) : question.questionType === 'OPEN_ENDED_NPS_0_10' ? (
              <NPSChart question={question} />
            ) : (
              <div>
                This component is not defined
              </div>
            )
          }
        </div>
        <Divider style={{ margin: '0px 0 0px' }} />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Button
              className={`button card-action ${showCommentBox ? 'active' : ''}`}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 17.5, margin: '10px 0 3px 5px', padding: '5px 15px', backgroundColor: showCommentBox ? '#d9d9d9' : 'transparent', color: showCommentBox ? '#6d6e71' : '#6d6e71' }}
              onClick={this.onToggleCommentBox}
              disabled={!authentication.user}
            >
              <i className="material-icons" style={{ fontSize: 16, margin: 3, direction: 'rtl' }}>chat</i>
              <span style={{ fontWeight: 'normal', fontSize: 14 }}>Comment</span>
            </Button>
            {
              question.questionType === 'OPEN_ENDED' || question.questionType === 'OPEN_ENDED_NPS' || question.questionType === 'OPEN_ENDED_INTEGER' ? (
                <ResponsesModal surveyId={surveyId} question={question} startDate={startDate} endDate={endDate} npsFilters={npsFilters} />
              ) : null
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {
              comments.length ? (
                <ActionButton onClick={this.onToggleChartFeedback} text={`${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`} className={showChartFeedback ? 'active' : ''} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 17.5, margin: '10px 5px 3px 5px', padding: '5px 15px', color: '#6d6e71' }}>
                  {
                    isFetchingComments ? (
                      <Spinner spinnerColor="#002366" size={20} spinnerWidth={2} />
                    ) : (
                      <span style={{ color: '#6d6e71', fontSize: 12 }}>{`${comments.length} Comments`}</span>
                    )
                  }
                </div>
              )
            }
          </div>
        </div>
        {
          collaborators.length && showChartFeedback ? (
            <ChartFeedback
              ref={(chartFeedback) => this.chartFeedback = chartFeedback}
              currentComment={currentComment}
              onCommentChange={this.onCommentChange}
              onSubmit={this.onSubmit}
              comments={comments}
              showCommentBox={showCommentBox}
              onKeyDown={this.onKeyDown}
              subject={question}
              updateCommentingStatus={this.updateCommentingStatus}
              isCommenting={isCommenting}
              collaborators={collaborators}
              updateComments={this.onUpdateComments}
              EventHandler={EventHandler}
              alertActions={alertActions}
            />
          ) : null
        }
      </QuestionNumberWrapper>
    );
  }
}
