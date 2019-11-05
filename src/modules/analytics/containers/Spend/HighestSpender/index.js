/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary, no-return-assign, jsx-a11y/no-static-element-interactions, jsx-a11y/interactive-supports-focus, react/no-array-index-key */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import numeral from "numeral";
// import Rating from 'react-rating';

import Title from "../../components/Title";
import ChartFeedback from "Modules/voc/containers/Home/components/chart-feedback";
import ActionButton from "SharedComponents/action-button-styled";
import ThemeTag from "Modules/voc/containers/Home/components/feedback/ThemeTag";
import NewThemeTag from "Modules/voc/containers/Home/components/feedback/NewThemeTag";
import "Modules/voc/containers/Home/components/feedback/style.css";

import * as alertActions from "Modules/voc/containers/App/Alerts/flux/actions";

@connect(
  state => ({
    authentication: state.authentication
  }),
  dispatch => ({
    alertActions: bindActionCreators(alertActions, dispatch),
    dispatch
  })
)
export default class HighestSpender extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    title: PropTypes.object,
    subtitle: PropTypes.object,
    alertActions: PropTypes.object.isRequired,
    EventHandler: PropTypes.object.isRequired,
    collaborators: PropTypes.array.isRequired,
    homeActions: PropTypes.object.isRequired,
    configurations: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { comment } = props;
    this.state = {
      comments: comment.chats,
      showCommentBox: false,
      currentTag: "",
      showChartFeedback: false,
      isCommenting: false,
      isBookMarkingComment: false,
      bookmarked: comment.bookmarked,
      showAddTag: false,
      tags: [...comment.systemTags, ...comment.userTags],
      newTag: "",
      isSubmittingTag: false
    };

    this.onAddTag = this.onAddTag.bind(this);
    this.onTagFieldKeyDown = this.onTagFieldKeyDown.bind(this);
    this.onTagFieldChanged = this.onTagFieldChanged.bind(this);
    this.onToggleCommentBox = this.onToggleCommentBox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateCommentingStatus = this.updateCommentingStatus.bind(this);
    this.onUpdateComments = this.onUpdateComments.bind(this);
    this.onToggleChartFeedback = this.onToggleChartFeedback.bind(this);
    this.onBookMarkComment = this.onBookMarkComment.bind(this);
    this.onToggleAddTag = this.onToggleAddTag.bind(this);
    this.onSubmitTag = this.onSubmitTag.bind(this);
    this.onNewTagChanged = this.onNewTagChanged.bind(this);
    this.onRemoveCommentTag = this.onRemoveCommentTag.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      comments: nextProps.comment.chats,
      showCommentBox: false,
      currentTag: "",
      showChartFeedback: false,
      isCommenting: false,
      isBookMarkingComment: false,
      bookmarked: nextProps.comment.bookmarked,
      showAddTag: false,
      tags: [...nextProps.comment.systemTags, ...nextProps.comment.userTags],
      newTag: "",
      isSubmittingTag: false
    });
  }

  onToggleAddTag() {
    const { showAddTag } = this.state;
    this.setState({ showAddTag: !showAddTag });
  }

  onNewTagChanged(event) {
    this.setState({ newTag: event.target.value });
  }

  async onSubmitTag() {
    this.setState({ isSubmittingTag: true });
    const { newTag, tags } = this.state;
    const { comment, homeActions, alertActions, EventHandler } = this.props;

    try {
      await homeActions.submitNewCommentTag(newTag, comment.commentId);
      this.setState({ tags: [...tags, newTag], newTag: "" });
    } catch (exception) {
      alertActions.addAlert({
        type: "error",
        message: exception.response.data.message || exception.message
      });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isSubmittingTag: false });
    }
  }

  onRemoveCommentTag(removedTag) {
    const { tags } = this.state;
    this.setState({ tags: tags.filter(tag => tag !== removedTag) });
  }

  onAddTag() {
    const { currentTag, tags } = this.state;
    if (!currentTag.replace(/\s/g, "").length) {
      return;
    }

    this.setState({
      tags: [...tags, currentTag],
      currentTag: ""
    });
  }

  async onSubmit(comment, user) {
    const { comments } = this.state;
    this.setState({
      comments: [
        ...comments,
        {
          user,
          time: new Date(),
          body: comment
        }
      ]
    });
  }

  async onBookMarkComment(bookmarked) {
    this.setState({ isBookMarkingComment: true });
    const { homeActions, comment, EventHandler, alertActions } = this.props;

    try {
      await homeActions.bookmarkNPSComments([comment.id], bookmarked);
      this.setState({ bookmarked });
    } catch (exception) {
      alertActions.addAlert({
        type: "error",
        message: exception.response.data.message || exception.message
      });
      EventHandler.handleException(exception);
    } finally {
      this.setState({ isBookMarkingComment: false });
    }
  }

  onToggleCommentBox() {
    const { isCommenting, showChartFeedback, showCommentBox } = this.state;
    if (!isCommenting) {
      if (showChartFeedback) {
        this.setState({ showCommentBox: !showCommentBox });
      } else {
        this.setState({
          showCommentBox: !showCommentBox,
          showChartFeedback: true
        });
      }
    }
  }

  onToggleChartFeedback() {
    const { showChartFeedback } = this.state;
    if (showChartFeedback) {
      this.setState({
        showChartFeedback: !showChartFeedback,
        showCommentBox: !showChartFeedback
      });
    } else {
      this.setState({ showChartFeedback: !showChartFeedback });
    }
  }

  onTagFieldKeyDown(event) {
    if (event.keyCode === 13) {
      this.onAddTag(event);
    }
  }

  onTagFieldChanged(event) {
    this.setState({
      currentTag: event.target.value
    });
  }

  onUpdateComments(comments) {
    this.setState({ comments });
  }

  updateCommentingStatus(isCommenting) {
    this.setState({ isCommenting });
  }

  render() {
    const {
      comment,
      collaborators,
      homeActions,
      alertActions,
      EventHandler,
      configurations,
      title,
      subtitle
    } = this.props;
    const {
      bookmarked,
      tags,
      isSubmittingTag,
      newTag,
      showAddTag,
      showCommentBox,
      currentComment,
      isBookMarkingComment,
      isCommenting,
      comments,
      showChartFeedback,
      isAddingTag
    } = this.state;
    const possibleLocationMetadata = ["location", "branch", "store"];
    let locationKey = null; // Default
    Object.keys(comment.metadata).forEach(key => {
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
        className="grid-item"
        style={{ width: "100%", padding: "0 10px 10px 10px" }}
      >
        {title ? <Title title={title} subtitle={subtitle} /> : null}
        <div
          className="nps-comment-card"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)",
            marginBottom: 20,
            marginTop: 10
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 10,
              width: "100%"
            }}
          >
            <div
              style={{
                width: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  backgroundColor:
                    comment.npsScore > 8
                      ? "#80c582"
                      : comment.npsScore > 6
                      ? "#fcda6e"
                      : "#fd9681",
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: Object.keys(comment.metadata).includes("location")
                    ? 10
                    : 0
                }}
              >
                <span
                  style={{ color: "#FFF", fontWeight: "bold", fontSize: 21 }}
                >
                  {comment.npsScore}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  bookmarked
                    ? this.onBookMarkComment(false)
                    : this.onBookMarkComment(true)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  margin: "10px 0"
                }}
              >
                <i
                  className="material-icons"
                  style={{ color: "#487db3", fontSize: 40 }}
                >
                  {bookmarked ? "bookmark" : "bookmark_border"}
                </i>
              </button>
            </div>
            <div
              style={{
                width: "calc(100% - 50px)",
                display: "flex",
                flexDirection: "column",
                padding: "0 0 0 10px"
              }}
            >
              {locationKey ? (
                <div
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "flex-end",
                    position: "relative",
                    marginTop: -10
                  }}
                >
                  <i
                    className="material-icons"
                    style={{
                      fontSize: 10,
                      position: "relative",
                      top: 5,
                      margin: "0 0 0 5px",
                      color: "#6d6e71"
                    }}
                  >
                    location_on
                  </i>
                  <span
                    style={{
                      color: "#6d6e71",
                      fontSize: 10,
                      textAlign: "right",
                      whiteSpace: "no-wrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      textTransform: "capitalize"
                    }}
                  >
                    {comment.metadata[locationKey]}
                  </span>
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  width: "100%"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%"
                  }}
                >
                  <div
                    style={{
                      marginTop: 5,
                      color: "#808285",
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    {Object.keys(comment.metadata).includes("first_name") ? (
                      <b
                        style={{
                          textTransform: "capitalize",
                          color: "#6d6e71"
                        }}
                      >
                        {comment.metadata.first_name}{" "}
                        {comment.metadata.last_name}
                      </b>
                    ) : Object.keys(comment.metadata).includes("name") ? (
                      <b
                        style={{
                          textTransform: "capitalize",
                          color: "#6d6e71"
                        }}
                      >
                        {comment.metadata.name}
                      </b>
                    ) : (
                      <b
                        style={{
                          textTransform: "capitalize",
                          color: "#6d6e71"
                        }}
                      >
                        ANONYMOUS
                      </b>
                    )}
                    &nbsp;
                    {comment.commId}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "#808285"
                        }}
                      >
                        {moment().diff(comment.uiSortDate, "days") > 0
                          ? comment.uiSortDate.format("MMM. DD, YYYY | h:mm a")
                          : comment.uiSortDate.fromNow()}
                      </span>
                      <span style={{ color: "#6d6e71" }}>|&nbsp;</span>
                      <span style={{ fontSize: 10, color: "#808285" }}>
                        <b>About:</b>
                        &nbsp;
                        {comment.surveyTitle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "10px 0" }}>
                {Object.keys(comment.metadata).includes("amount") ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ width: "calc(100% - 70px)" }}>
                      <p style={{ color: "#3d4553" }}>{comment.npsComment}</p>
                    </div>
                    <div
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: "#e8eaed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bolder",
                        fontSize: 12
                      }}
                    >
                      {numeral(comment.metadata.amount).format("0,0.00")}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#3d4553" }}>{comment.npsComment}</p>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  padding: "10px 0"
                }}
              >
                {tags.map(item => (
                  <ThemeTag
                    tag={item}
                    removeCommentTag={homeActions.removeCommentTag}
                    onRemoveCommentTag={this.onRemoveCommentTag}
                    commentId={comment.commentId}
                    alertActions={alertActions}
                    EventHandler={EventHandler}
                  />
                ))}
                {showAddTag ? (
                  <NewThemeTag
                    tags={tags}
                    onSubmitTag={this.onSubmitTag}
                    isSubmittingTag={isSubmittingTag}
                    newTag={newTag}
                    onNewTagChanged={this.onNewTagChanged}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div
            className="hide-scrollbars"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
              overflowX: "scroll",
              marginBottom: 20
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <ActionButton
                text="Reply"
                icon="comment"
                loading={false}
                disabled={false}
                onClick={this.onToggleCommentBox}
                active={showCommentBox}
                style={{ margin: 5 }}
              />
              {!bookmarked ? (
                <ActionButton
                  text="Bookmark"
                  icon="bookmark"
                  loading={isBookMarkingComment}
                  disabled={isBookMarkingComment}
                  onClick={() => this.onBookMarkComment(true)}
                  style={{ margin: 5 }}
                />
              ) : (
                <ActionButton
                  text="Remove&nbsp;Bookmark"
                  icon="bookmark_border"
                  loading={isBookMarkingComment}
                  disabled={isBookMarkingComment}
                  onClick={() => this.onBookMarkComment(false)}
                  style={{ margin: 5 }}
                />
              )}
              <ActionButton
                text="Add&nbsp;Tag"
                icon="loyalty"
                loading={isAddingTag}
                disabled={isAddingTag}
                onClick={this.onToggleAddTag}
                active={showAddTag}
                style={{ margin: 5 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {comments.length ? (
                <ActionButton
                  text={
                    comments.length === 1
                      ? "1 Reply"
                      : `${comments.length} Replies`
                  }
                  loading={false}
                  disabled={false}
                  onClick={this.onToggleChartFeedback}
                  style={{
                    margin: 5,
                    backgroundColor: showChartFeedback
                      ? "#d9d9d9"
                      : "transparent"
                  }}
                />
              ) : null}
            </div>
          </div>
          {showChartFeedback ? (
            <ChartFeedback
              ref={chartFeedback => (this.chartFeedback = chartFeedback)}
              currentComment={currentComment}
              onCommentChange={this.onCommentChange}
              onSubmit={this.onSubmit}
              comments={comments}
              showCommentBox={showCommentBox}
              onKeyDown={this.onKeyDown}
              subject={comment}
              updateCommentingStatus={this.updateCommentingStatus}
              isCommenting={isCommenting}
              collaborators={collaborators}
              updateComments={this.onUpdateComments}
              homeActions={homeActions}
              configurations={configurations}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
