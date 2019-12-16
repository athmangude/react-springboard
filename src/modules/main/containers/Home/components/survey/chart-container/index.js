/* eslint-disable no-nested-ternary, jsx-a11y/no-static-element-interactions, no-return-assign, no-plus-plus */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider } from 'semantic-ui-react';

import CommentList from './CommentList';
import BarChartAlternate from './BarChartAlternate';
import ChartFeedback from '../../chart-feedback';
import BarChartAlternateSelfEvaluating from './BarChartAlternateSelfEvaluating';
import NPSChart from './NPSChart';

import './style.css';

@connect((state) => ({
  authentication: state.authentication,
}))
class ChartContainer extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    survey: PropTypes.object.isRequired,
    authentication: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    homeActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onAddTag = this.onAddTag.bind(this);
    this.onTagFieldKeyDown = this.onTagFieldKeyDown.bind(this);
    this.onTagFieldChanged = this.onTagFieldChanged.bind(this);
    this.onToggleCommentBox = this.onToggleCommentBox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateCommentingStatus = this.updateCommentingStatus.bind(this);
    this.onUpdateComments = this.onUpdateComments.bind(this);
    this.onToggleChartFeedback = this.onToggleChartFeedback.bind(this);
  }

  state = {
    comments: this.props.question.comments,
    showCommentBox: false,
    currentComment: '',
    refresh: 0,
    clickedAction: null,
    tags: [],
    currentTag: '',
    isSubmitting: false,
    showChartFeedback: false,
    isCommenting: false,
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({ refresh: this.state.refresh++ });
    }, 10);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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

  onCommentChange(event) {
    this.setState({ currentComment: event.target.value });
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

  onSubmit(form = null) {
    if (!this.state.currentComment.replace(/\s/g, '').length) {
      return;
    }

    this.setState({
      comments: [...this.state.comments, {
        user: this.props.authentication.user,
        time: new Date(),
        body: this.state.currentComment,
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
    const { question, survey } = this.props;

    if (!Object.values(question.responses).length) {
      return null;
    }

    if (question.type === 'MULTIPLE_CHOICE_SINGLE_SELECT') {
      const sumOfValues = Object.values(question.responses).reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);

      if (!sumOfValues) {
        return null;
      }
    }

    return (
      <div className="chart-container" style={{ width: '100%', backgroundColor: '#fff', padding: 15, border: 'solid 1px #d9d9d9', borderRadius: 8, margin: '10px 0' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <b>{question.text}&nbsp;|&nbsp;<span style={{ color: '#808285', fontWeight: 'normal' }}>{survey.uiSortDate.format('MMM. Do, YYYY')}</span></b>
            <span style={{ fontSize: 12, color: '#808285' }}>{this.props.survey.title}</span>
          </div>
        </div>
        <div style={{ padding: 0, margin: 0 }}>
          {
            question.type === 'OPEN_ENDED' || question.type === 'OPEN_ENDED_NPS' ? (
              <CommentList question={question} key={question.questionId} />
            ) : question.type === 'MULTIPLE_CHOICE_SINGLE_SELECT' ? (
              <BarChartAlternate question={question} key={question.questionId} />
            ) : question.type === 'OPEN_ENDED_DATE' || question.type === 'OPEN_ENDED_RANGE_0_10' || question.type === 'OPEN_ENDED_YEAR_YYYY' ? (
              <BarChartAlternateSelfEvaluating question={question} key={question.questionId} />
            ) : question.type === 'OPEN_ENDED_NPS_0_10' ? (
              <NPSChart question={question} key={question.questionId} />
            ) : (
              <div key={question.questionId}>
                This component is not defined
              </div>
            )
          }
        </div>
        <Divider style={{ margin: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div
              onClick={this.onToggleCommentBox}
              className={`card-action ${this.state.showCommentBox ? 'active' : ''}`}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 17.5, margin: '10px 5px 3px 5px', padding: '5px 15px', backgroundColor: this.state.showCommentBox ? '#d9d9d9' : 'transparent', color: '#6d6e71' }}
            >
              <i className="material-icons" style={{ fontSize: 15, margin: 0 }}>comment</i>
              <span style={{ margin: '0 5px', fontSize: 13 }}>Comment</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {
              this.state.comments.length ? (
                <div
                  onClick={this.onToggleChartFeedback}
                  className={`card-action ${this.state.showChartFeedback ? 'active' : ''}`}
                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 17.5, margin: '10px 5px 3px 5px', padding: '5px 15px', backgroundColor: this.state.showChartFeedback ? '#d9d9d9' : 'transparent', color: '#6d6e71' }}
                  role="button"
                >
                  <span style={{ color: '#6d6e71', fontSize: 12 }}>{`${this.state.comments.length} ${this.state.comments.length === 1 ? 'Comment' : 'Comments'}`}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 17.5, margin: '10px 5px 3px 5px', padding: '5px 15px', color: '#6d6e71' }}>
                  <span style={{ color: '#6d6e71', fontSize: 12 }}>{`${question.comments.length} ${question.comments.length === 1 ? 'Comment' : 'Comments'}`}</span>
                </div>
              )
            }
          </div>
          {/*
          {/*
          <div
            style={{ border: 'solid 1px #d9d9d9', borderRadius: 17, display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '2px 3px', padding: '0px 15px', fontSize: 9, color: this.state.clickedAction === 'Comment' ? '#FFF' : '#808285', backgroundColor: this.state.clickedAction === 'Comment' ? '#808285' : 'transparent' }}
            onClick={() => this.setState({ showCommentBox: !this.state.showCommentBox, clickedAction: !this.state.showCommentBox ? 'Comment' : null })}
            className="clickable"
          >
            <i className="material-icons" style={{ color: this.state.clickedAction === 'Comment' ? '#FFF' : '#808285', fontSize: 15, margin: 3, direction: 'rtl' }}>insert_drive_file</i> Comment
          </div>
          <Popup
            hoverable
            trigger={(
              <div
                style={{ border: 'solid 1px #d9d9d9', borderRadius: 17, display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '2px 3px', padding: '0px 15px', fontSize: 9, color: this.state.clickedAction === 'Edit Tags' ? '#FFF' : '#808285', backgroundColor: this.state.clickedAction === 'Edit Tags' ? '#808285' : 'transparent' }}
                className="clickable"
              >
                <i className="material-icons" style={{ color: this.state.clickedAction === 'Notes' ? '#FFF' : '#808285', fontSize: 15, margin: 3, direction: 'rtl' }}>local_offer</i> Edit Tags
              </div>
            )}
            style={{ display: 'flex', maxWidth: 300, minWidth: 100 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', width: '100%' }}>
              {
                !this.state.tags.length ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '3px 10px' }}>You have not created any tags</div>
                ) : this.state.tags.map((tag, i) => (
                  <Button key={i} style={{ backgroundColor: '#FFF', border: 'solid 1px #d9d9d9', borderRadius: 8, margin: '2px 3px', padding: 0, display: 'flex', alignItems: 'center', displayContent: 'center' }}><span style={{ margin: '2px 3px', padding: 0, fontSize: 10 }}>{tag}</span></Button>
                ))
              }
            </div>
            <Divider />
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <input name="newTag" onKeyDown={this.onTagFieldKeyDown} style={{ padding: 3, width: 'calc(100% - 23)' }} placeholder="type here" value={this.state.currentTag} onChange={this.onTagFieldChanged} />
              <Button onClick={this.onAddTag} disabled={!this.state.currentTag.length} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'normal', borderRadius: 10, padding: '5px 15px' }}><span>Add</span></Button>
            </div>
          </Popup>
          */}
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
              subject={question}
              updateCommentingStatus={this.updateCommentingStatus}
              isCommenting={this.state.isCommenting}
              collaborators={this.props.collaborators}
              updateComments={this.onUpdateComments}
              homeActions={this.props.homeActions}
            />
          ) : null
        }
      </div>
    );
  }
}

export default ChartContainer;
