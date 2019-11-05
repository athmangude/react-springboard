/* eslint-disable no-nested-ternary, no-return-assign, jsx-a11y/no-static-element-interactions, jsx-a11y/interactive-supports-focus, react/no-array-index-key */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import numeral from 'numeral';
import CircularButton from 'SharedComponents/circular-button';
// import Rating from 'react-rating';

import ChartFeedback from '../chart-feedback';
import ActionButton from 'SharedComponents/action-button-styled';
import ThemeTag from './ThemeTag';
import NewThemeTag from './NewThemeTag';
import './style.css';

import * as alertActions from 'Modules/voc/containers/App/Alerts/flux/actions';
import * as EventHandler from 'Utils/EventHandler';

@connect((state) => ({
  authentication: state.authentication,
}), (dispatch) => ({
  alertActions: bindActionCreators(alertActions, dispatch),
  dispatch,
}))
export default class Feedback extends Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    alertActions: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    homeActions: PropTypes.object.isRequired,
    configurations: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.onAddTag = this.onAddTag.bind(this);
    this.onTagFieldKeyDown = this.onTagFieldKeyDown.bind(this);
    this.onTagFieldChanged = this.onTagFieldChanged.bind(this);
    this.onToggleCommentBox = this.onToggleCommentBox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateCommentingStatus = this.updateCommentingStatus.bind(this);
    this.onUpdateComments = this.onUpdateComments.bind(this);
    this.onToggleChartFeedback = this.onToggleChartFeedback.bind(this);
    this.onBookMarkComment = this.onBookMarkComment.bind(this);
    this.onMarkAsRead = this.onMarkAsRead.bind(this);
    this.onToggleAddTag = this.onToggleAddTag.bind(this);
    this.onSubmitTag = this.onSubmitTag.bind(this);
    this.onNewTagChanged = this.onNewTagChanged.bind(this);
    this.onRemoveCommentTag = this.onRemoveCommentTag.bind(this);
    this.onMarkAsOptimisticallyRead = this.onMarkAsOptimisticallyRead.bind(this);
  }

  state = {
    comments: this.props.comment.chats,
    showCommentBox: false,
    refresh: 0,
    clickedAction: null,
    currentTag: '',
    isSubmitting: false,
    showChartFeedback: false,
    isCommenting: false,
    isBookMarkingComment: false,
    read: this.props.comment.read,
    bookmarked: this.props.comment.bookmarked,
    showAddTag: false,
    tags: [...this.props.comment.systemTags, ...this.props.comment.userTags],
    newTag: '',
    isSubmittingTag: false,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      comments: nextProps.comment.chats,
      showCommentBox: false,
      refresh: 0,
      clickedAction: null,
      currentTag: '',
      isSubmitting: false,
      showChartFeedback: false,
      isCommenting: false,
      isBookMarkingComment: false,
      read: nextProps.comment.read,
      bookmarked: nextProps.comment.bookmarked,
      showAddTag: false,
      tags: [...nextProps.comment.systemTags, ...nextProps.comment.userTags],
      newTag: '',
      isSubmittingTag: false,
    });
  }

  componentWillUnmount() {
    // marking the comment as read if it is being seen for the first time
    if (!this.state.read) {
      this.onMarkAsOptimisticallyRead();
    }
  }

  onToggleAddTag() {
    this.setState({ showAddTag: !this.state.showAddTag });
  }

  onNewTagChanged(event) {
    this.setState({ newTag: event.target.value });
  }

  async onSubmitTag() {
    this.setState({ isSubmittingTag: true });

    try {
      await this.props.homeActions.submitNewCommentTag(this.state.newTag, this.props.comment.commentId);
      this.setState({ tags: [...this.state.tags, this.state.newTag], newTag: '' });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isSubmittingTag: false });
    }
  }

  onRemoveCommentTag(removedTag) {
    this.setState({ tags: this.state.tags.filter((tag) => tag !== removedTag) });
  }

  onAddTag() {
    if (!this.state.currentTag.replace(/\s/g, '').length) {
      return;
    }

    this.setState({
      tags: [...this.state.tags, this.state.currentTag],
      currentTag: '',
    });
  }

  async onSubmit(comment, user) {
    this.setState({
      comments: [...this.state.comments, {
        user,
        time: new Date(),
        body: comment,
      }],
    });
  }

  async onBookMarkComment(bookmarked) {
    this.setState({ isBookMarkingComment: true });

    try {
      await this.props.homeActions.bookmarkNPSComments([this.props.comment.id], bookmarked);
      this.setState({ bookmarked });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isBookMarkingComment: false });
    }
  }

  async onMarkAsOptimisticallyRead() {
    this.setState({ isMarkingAsRead: true });

    try {
      await this.props.homeActions.markNPSCommentsAsRead([this.props.comment.id]);
      this.setState({ read: true });
      EventHandler.trackEvent({
        category: 'Home Feed', action: 'marked as read', label: 'NPS Comment', value: this.props.comment.npsComment,
      });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isMarkingAsRead: false });
    }
  }

  async onMarkAsRead() {
    this.setState({ isMarkingAsRead: true });
    try {
      await this.props.homeActions.markNPSCommentsAsRead([this.props.comment.id]);
      this.props.homeActions.removeNPSComment(this.props.comment);
      this.props.homeActions.addFeedItems([{ ...this.props.comment, read: true }]);
      this.setState({ read: true });
    } catch (exception) {
      this.props.alertActions.addAlert({ type: 'error', message: exception.response.data.message || exception.message });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isMarkingAsRead: false });
    }
  }

  onToggleCommentBox() {
    if (!this.state.isCommenting) {
      if (this.state.showChartFeedback) {
        this.setState({ showCommentBox: !this.state.showCommentBox });
      } else {
        this.setState({ showCommentBox: !this.state.showCommentBox, showChartFeedback: true });
      }
    }
  }

  onToggleChartFeedback() {
    if (this.state.showChartFeedback) {
      this.setState({ showChartFeedback: !this.state.showChartFeedback, showCommentBox: !this.state.showChartFeedback });
    } else {
      this.setState({ showChartFeedback: !this.state.showChartFeedback });
    }
  }

  onTagFieldKeyDown(event) {
    if (event.keyCode === 13) {
      this.onAddTag(event);
    }
  }

  onTagFieldChanged(event) {
    this.setState({
      currentTag: event.target.value,
    });
  }

  onUpdateComments(comments) {
    this.setState({ comments });
  }

  updateCommentingStatus(isCommenting) {
    this.setState({ isCommenting });
  }

  render() {
    const { comment, collaborators } = this.props;
    const possibleLocationMetadata = ['location', 'branch', 'store'];
    let locationKey = null; // Default
    Object.keys(comment.metadata).forEach((key) => {
      const lowerCasedKey = key.toLocaleLowerCase();
      if (key !== lowerCasedKey) {
        // It's easier to convert the keys to lowercase as opposed to checcking for whether their exists a property in either uppercase or lowercase
        comment.metadata[lowerCasedKey] = comment.metadata[key];
      }
      if (possibleLocationMetadata.includes(lowerCasedKey)) {
        locationKey = lowerCasedKey;
      }
    });

    return (
      <div
        className="nps-comment-card"
        style={{
          display: 'flex', flexDirection: 'column', borderRadius: 8, width: '100%', padding: 0, margin: '10px 0', backgroundColor: '#FFF', boxShadow: '0 0 0 2px #e8eaed',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
          <div
            style={{
              width: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column',
            }}
          >
            <div
              style={{
                backgroundColor: comment.npsScore > 8 ? '#80c582' : comment.npsScore > 6 ? '#fcda6e' : '#fd9681', height: 40, width: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: Object.keys(comment.metadata).includes('location') ? 10 : 0,
              }}
            >
              <span style={{ color: '#FFF', fontWeight: 'bold', fontSize: 21 }}>{comment.npsScore}</span>
            </div>
            <CircularButton
              icon={this.state.bookmarked ? 'bookmark' : 'bookmark_border'}
              onClick={() => { this.state.bookmarked ? this.onBookMarkComment(false) : this.onBookMarkComment(true); }}
              style={{ margin: '10px 0' }}
            />
          </div>
          <div
            style={{
              width: 'calc(100% - 50px)', display: 'flex', flexDirection: 'column', padding: '0 0 0 10px',
            }}
          >
            {
              locationKey ? (
                <div
                  style={{
                    width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'start', justifyContent: 'flex-end', position: 'relative', marginTop: -10,
                  }}
                >
                  <i
                    className="material-icons"
                    style={{
                      fontSize: 10, position: 'relative', top: 5, margin: '0 0 0 5px', color: '#6d6e71',
                    }}
                  >
location_on
                  </i>
                  <span
                    style={{
                      color: '#6d6e71', fontSize: 10, textAlign: 'right', whiteSpace: 'no-wrap', textOverflow: 'ellipsis', overflow: 'hidden', textTransform: 'capitalize',
                    }}
                  >
                    {comment.metadata[locationKey]}
                  </span>
                </div>
              ) : null
            }
            <div
              style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div
                  style={{
                    marginTop: 5, color: '#808285', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  {Object.keys(comment.metadata).includes('first_name') ? (
                    <b style={{ textTransform: 'capitalize', color: '#6d6e71' }}>
                      {comment.metadata.first_name}
                      {' '}
                      {comment.metadata.last_name}
                    </b>
                  ) : Object.keys(comment.metadata).includes('name') ? (<b style={{ textTransform: 'capitalize', color: '#6d6e71' }}>{comment.metadata.name}</b>) : <b style={{ textTransform: 'capitalize', color: '#6d6e71' }}>ANONYMOUS</b>}
&nbsp;
                  {comment.commId}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 'bold', color: '#808285' }}>{moment().diff(comment.uiSortDate, 'days') > 0 ? comment.uiSortDate.format('MMM. DD, YYYY | h:mm a') : comment.uiSortDate.fromNow()}</span>
                    <span style={{ color: '#6d6e71' }}>|&nbsp;</span>
                    <span style={{ fontSize: 10, color: '#808285' }}>
                      <b>About:</b>
&nbsp;
                      {comment.surveyTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '10px 0' }}>
              {
                Object.keys(this.props.comment.metadata).includes('amount') ? (
                  <div
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ width: 'calc(100% - 70px)' }}>
                      <p style={{ color: '#3d4553' }}>{comment.npsComment}</p>
                    </div>
                    {
                      this.props.comment.metadata && this.props.comment.metadata.amount ? (
                        <div
                          style={{
                            width: 70, height: 70, borderRadius: 35, backgroundColor: '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bolder', fontSize: 12,
                          }}
                        >
                          {numeral(this.props.comment.metadata.amount).format('0,0.00')}
                        </div>
                      ) : null
                    }
                  </div>
                ) : (
                  <p style={{ color: '#3d4553' }}>{comment.npsComment}</p>
                )
              }
            </div>
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', padding: '10px 0',
              }}
            >
              {
                this.state.tags.map((item) => (
                  <ThemeTag tag={item} removeCommentTag={this.props.homeActions.removeCommentTag} onRemoveCommentTag={this.onRemoveCommentTag} commentId={this.props.comment.commentId} alertActions={this.props.alertActions} EventHandler={EventHandler} />
                ))
              }
              {
                this.state.showAddTag ? (
                  <NewThemeTag tags={this.state.tags} onSubmitTag={this.onSubmitTag} isSubmittingTag={this.state.isSubmittingTag} newTag={this.state.newTag} onNewTagChanged={this.onNewTagChanged} />
                ) : null
              }
            </div>
          </div>
        </div>
        <div
          className="hide-scrollbars"
          style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomRightRadius: 8, borderBottomLeftRadius: 8, overflowX: 'scroll',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {/* <ActionButton text="Reply" icon="comment" loading={false} disabled={false} onClick={this.onToggleCommentBox} active={this.state.showCommentBox} style={{ margin: 5 }} /> */}
            {
              !this.state.bookmarked ? (
                <ActionButton text="Bookmark" icon="bookmark" loading={this.state.isBookMarkingComment} disabled={this.state.isBookMarkingComment} onClick={() => this.onBookMarkComment(true)} style={{ margin: 5 }} />
              ) : (
                <ActionButton text="Remove&nbsp;Bookmark" icon="bookmark_border" loading={this.state.isBookMarkingComment} disabled={this.state.isBookMarkingComment} onClick={() => this.onBookMarkComment(false)} style={{ margin: 5 }} />
              )
            }
            <ActionButton text="Add&nbsp;Tag" icon="loyalty" loading={this.state.isAddingTag} disabled={this.state.isAddingTag} onClick={this.onToggleAddTag} active={this.state.showAddTag} style={{ margin: 5 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {
              this.state.comments.length ? (
                <ActionButton text={this.state.comments.length === 1 ? '1 Reply' : `${this.state.comments.length} Replies`} loading={false} disabled={false} onClick={this.onToggleChartFeedback} style={{ margin: 5, backgroundColor: this.state.showChartFeedback ? '#d9d9d9' : 'transparent' }} />
              ) : null
            }
          </div>
        </div>
        {
          this.state.showChartFeedback ? (
            <ChartFeedback
              ref={(chartFeedback) => this.chartFeedback = chartFeedback}
              currentComment={this.state.currentComment}
              onCommentChange={this.onCommentChange}
              onSubmit={this.onSubmit}
              comments={this.state.comments}
              showCommentBox={this.state.showCommentBox}
              onKeyDown={this.onKeyDown}
              subject={comment}
              updateCommentingStatus={this.updateCommentingStatus}
              isCommenting={this.state.isCommenting}
              collaborators={collaborators}
              updateComments={this.onUpdateComments}
              homeActions={this.props.homeActions}
              configurations={this.props.configurations}
            />
          ) : null
        }

      </div>
    );
  }
}
