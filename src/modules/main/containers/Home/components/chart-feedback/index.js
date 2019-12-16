/* eslint-disable no-return-assign, no-nested-ternary */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import Textarea from 'react-expanding-textarea';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScrollArea from 'react-scrollbar';
import Spinner from 'react-spinner-material';

import Comment from './Comment';
import * as homeActions from '../../flux/actions';

import './style.css';

@connect(
  (state) => ({
    authentication: state.authentication,
    aodReport: state.aodReport,
    configurations: state.configurations,
  }),
  (dispatch) => ({
    homeActions: bindActionCreators(homeActions, dispatch),
    dispatch,
  })
)
class ChartFeedback extends Component {
  static propTypes = {
    comments: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    showCommentBox: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    collaborators: PropTypes.object.isRequired,
    isCommenting: PropTypes.bool.isRequired,
    updateCommentingStatus: PropTypes.func.isRequired,
    configurations: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onCommentChange = this.onCommentChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    currentComment: '',
  }

  onCommentChange(event) {
    this.setState({ currentComment: event.target.value });
  }

  onKeyDown(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.onSubmit();
    }
  }

  async onSubmit() {
    if (!this.state.currentComment.replace(/\s/g, '').length) {
      return;
    }

    this.props.updateCommentingStatus(true);

    if (this.props.subject.type === 'comment') {
      try {
        await this.props.homeActions.replyToComment(this.props.subject.id, {
          chatType: 'SURVEYRESPONSE',
          from: this.props.user.user.id,
          message: this.state.currentComment,
          surveyResponseId: this.props.subject.id,
          to: this.props.subject.commId,
        });

        this.setState({ currentComment: '' }, () => {
          this.form.reset();
        });

        const fetchSurveyResponseCommentsResult = await this.props.homeActions.fetchSurveyResponseComments(this.props.subject.id);
        this.props.updateComments(fetchSurveyResponseCommentsResult.data.Data);
        this.props.alertActions.addAlert({ type: 'success', message: 'Successfully submitted comment' });
        this.props.EventHandler.trackEvent({ category: 'ChartFeedback', action: 'reply to comment', value: true });
      } catch (exception) {
        this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
        this.props.EventHandler.trackEvent({ category: 'ChartFeedback', action: 'reply to comment', value: false });
        this.props.EventHandler.handleException(exception);
      } finally {
        this.props.updateCommentingStatus(false);
      }
    } else {
      try {
        await this.props.homeActions.commentOnChart(this.props.subject.questionId, {
          id: this.props.subject.questionId,
          message: this.state.currentComment,
          type: 'SURVEY',
          userId: this.props.user.user.id,
        });

        this.setState({ currentComment: '' }, () => {
          this.form.reset();
        });

        const fetchSurveyQuestionCommentsResult = await this.props.homeActions.fetchSurveyQuestionComments(this.props.subject.questionId);
        this.props.updateComments(fetchSurveyQuestionCommentsResult.data.Data);

        // IDEA: Let's not fire an alert when a comment is posted successfully
        // this.props.alertActions.addAlert({ type: 'success', message: 'Successfully commented on chart' });

        this.props.EventHandler.trackEvent({ category: 'ChartFeedback', action: 'comment on chart', value: true });
      } catch (exception) {
        this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
        this.props.EventHandler.trackEvent({ category: 'ChartFeedback', action: 'comment on chart', value: false });
        this.props.EventHandler.handleException(exception);
      } finally {
        this.props.updateCommentingStatus(false);
      }
    }
  }

  render() {
    const firstInitial = this.props.user.user.firstName.length ? this.props.user.user.firstName[0].toUpperCase() : '';
    const lastInitial = this.props.user.user.lastName.length ? this.props.user.user.lastName[0].toUpperCase() : '';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 0 -15px', width: '100%' }}>
        <ScrollArea
          style={{ width: '100%', maxHeight: 213, borderBottomLeftRadius: this.props.showCommentBox ? 0 : 8, borderBottomRightRadius: this.props.showCommentBox ? 0 : 8 }}
          verticalContainerStyle={{ width: 5, borderRadius: '2.5px', marginLeft: 10 }}
        >
          {
            this.props.comments.map((comment, i) => (
              <Comment comment={comment} collaborators={this.props.collaborators} comments={this.props.comments} showCommentBox={this.props.showCommentBox} i={i} />
            ))
          }
        </ScrollArea>
        {
          this.props.showCommentBox && this.props.configurations.features.convo ? (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 10, position: 'relative' }}>
              <div style={{ width: 60, diplay: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 10px 10px', alignSelf: 'start' }}>
                <div style={{ width: 50, height: 50, backgroundColor: '#d9d9d9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <span style={{ fontWeight: 'bold', fontSize: 20 }}>{`${firstInitial}${lastInitial}`}</span>
                </div>
              </div>
              <div style={{ width: 'calc(100% - 100px)' }}>
                <form ref={(form) => this.form = form} style={{ width: '100%' }}>
                  <Textarea
                    rows="3"
                    style={{ border: 'solid 1px #d9d9d9', padding: 15, margin: '5px 30px 10px 0px', backgroundColor: !this.props.isCommenting ? '#fff' : '#fafafa', overflow: 'hidden', resize: 'none', minHeight: 60, width: 'calc(100% - 10px)' }}
                    onChange={this.onCommentChange}
                    value={this.state.currentComment}
                    onKeyDown={this.onKeyDown}
                    disabled={this.props.isCommenting}
                  />
                </form>
              </div>
              <div style={{ width: 40, alignSelf: 'flex-end' }}>
                {
                  this.props.isCommenting ? (
                    <div style={{ position: 'absolute', bottom: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Spinner spinnerColor="#487db3" size={30} spinnerWidth={3} />
                    </div>
                  ) : (
                    <Button
                      style={{ backgroundColor: '#487db3', height: 40, width: 40, borderRadius: 20, margin: '0 0 20px' }}
                      onClick={this.onSubmit}
                      disabled={this.props.isCommenting}
                    >
                      <i className="material-icons" style={{ color: '#fff', margin: '-5px 3px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>send</i>
                    </Button>
                  )
                }
              </div>
            </div>
          ) : this.props.showCommentBox && !this.props.configurations.features.convo ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', padding: '10px 20px', background: '#b31e20', borderBottomRightRadius: 8, borderBottomLeftRadius: 8, color: '#fff' }}>
              <h1 style={{ textAlign: 'left', fontSize: 15, marginBottom: 0 }}>Close the loop on customer feedback</h1>
              <small style={{ lineHeight: '1em' }}>Contact support to learn more on how you can chat with your customers in realtime</small>
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default connect((state) => ({ user: state.authentication.user }))(ChartFeedback);
