import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Col } from 'react-grid-system';
import moment from 'moment';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import * as homeActions from 'Modules/voc/containers/Homeflux/actions';
import * as csReportActions from '../../CS/flux/actions';
import { addAlert } from 'Modules/voc/containers/App/Alerts/flux/actions';
import ActivityHandler from 'Utils/ActivityHandler';

@connect(
  (state) => ({
    authentication: state.authentication,
    csReport: state.aodReport,
  }),
  (dispatch) => ({
    homeActions: bindActionCreators(homeActions, dispatch),
    alertActions: bindActionCreators({ addAlert }, dispatch),
    csReportActions: bindActionCreators(csReportActions, dispatch),
    dispatch,
  })
)

export default class NPSComments extends Component {
  static propTypes = {
    questions: PropTypes.object,
    npsMetaDataFilters: PropTypes.object,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    npsFilters: PropTypes.object,
    isFetchingData: PropTypes.bool,
    alertActions: PropTypes.object,
    authentication: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      isFetchingResponses: false,
      offset: 20,
      responses: [],
      noMoreResponsesToLoad: false,
      checked: [],
      isMarkingAsRead: false,
      selectAll: false,
    };

    this.fetchQuestionResponses = this.fetchQuestionResponses.bind(this);
    this.updateReadState = this.updateReadState.bind(this);
    this.color = this.color.bind(this);
    this.onSelectComment = this.onSelectComment.bind(this);
    this.onSelectAllToggle = this.onSelectAllToggle.bind(this);
    this.onSelectAllComments = this.onSelectAllComments.bind(this);
    this.onMarkAsRead = this.onMarkAsRead.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { questions } = newProps;

    const responses = [];
    if (questions) {
      questions.forEach((question) => {
        responses.push(...question.responses);
      });
    }
    responses.sort((a, b) => b.createDate - a.createDate);

    this.setState({
      responses,
      noMoreResponsesToLoad: responses.length < 60,
    });
  }

  onSelectComment(commentId) {
    let { checked } = this.state;
    if (checked.includes(commentId)) {
      checked = checked.filter((checkedId) => checkedId !== commentId);
    } else {
      checked.push(commentId);
    }

    this.setState({ checked });
  }

  onSelectAllToggle() {
    const { selectAll } = this.state;
    this.setState({ selectAll: !selectAll }, () => {
      this.onSelectAllComments();
    });
  }

  onSelectAllComments() {
    const { responses, checked, selectAll } = this.state;

    if (selectAll) {
      responses.filter((response) => !response.read).forEach((response) => {
        if (!checked.includes(response.surveyProgressId)) {
          checked.push(response.surveyProgressId);
        }
      });
    } else {
      checked.length = 0;
    }

    this.setState({ checked });
  }

  async onMarkAsRead() {
    this.setState({ isMarkingAsRead: true });
    const { checked } = this.state;

    try {
      await this.props.homeActions.markNPSCommentsAsRead(checked);
      this.updateReadState();
      this.props.alertActions.addAlert({ message: 'Successfully marked comments as read' });
    } catch (exception) {
      console.log(exception);
    } finally {
      this.setState({ isMarkingAsRead: false });
    }
  }

  color(score) {
    if (score > 8) {
      return '#80c582';
    }
    if (score > 5) {
      return '#f0ca4d';
    }
    return '#f26b50';
  }

  updateReadState() {
    const { checked, responses } = this.state;
    responses.forEach((response) => {
      if (checked.includes(response.surveyProgressId)) {
        response.read = true;
      }
    });
    this.setState({ checked: [], responses, selectAll: false });
  }

  async fetchQuestionResponses() {
    this.setState({ isFetchingResponses: true });

    const { surveyId, questions, startDate, endDate, npsFilters } = this.props;
    const questionIds = questions.map((question) => question.questionId);
    const newResponses = [];

    try {
      const questionResponsesResult = await this.props.csReportActions.fetchSurveyQuestionResponses(surveyId, questionIds, { limit: 20, offset: this.state.offset }, { startDate, endDate }, npsFilters);

      questionResponsesResult.data.forEach((result) => newResponses.push(...result.Data));
      newResponses.reduce((a, b) => a.concat(b), []);
      this.setState((prevState) => ({
        responses: prevState.responses.concat(newResponses).sort((a, b) => b.createDate - a.createDate),
      }));
      this.props.alertActions.addAlert({ message: 'Successfully loaded more comments' });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingResponses: false, offset: this.state.offset + 20 });
      if (!newResponses.length) {
        this.setState({ noMoreResponsesToLoad: true });
      }
    }
  }

  render() {
    const { isFetchingResponses, noMoreResponsesToLoad, responses, checked, selectAll, isMarkingAsRead } = this.state;
    const { npsMetaDataFilters, questions, isFetchingData, authentication: { user } } = this.props;

    if (questions === null) {
      return (
        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
          <div style={{ height: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: 'solid 2px #979797', paddingBottom: 5 }}>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>Feed</div>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>
            </div>
          </div>
          <div style={{ height: 463 }}>
          </div>
        </Col>
      );
    }

    if (!responses.length) {
      return (
        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
          <div style={{ height: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: 'solid 2px #979797', paddingBottom: 5 }}>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>Feed</div>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>
            </div>
          </div>
          <div style={{ height: 463, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>No comments to display</div>
          </div>
        </Col>
      );
    }

    if (isFetchingData) {
      return (
        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
          <div style={{ height: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: 'solid 2px #979797', paddingBottom: 5 }}>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>
              <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 10 }} /></div>} />
            </div>
            <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>
              <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 10 }} /></div>} />
            </div>
          </div>
          <div style={{ height: 559, overflowY: 'auto' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div key={item} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 20 }}>
                <div style={{ width: 30 }}>
                  <div style={{ width: 15, height: 15, backgroundColor: '#ffffff', borderRadius: 15, marginTop: 5 }}>
                    <i className="material-icons" style={{ color: '#ffffff', border: '1px solid #d9d9d9', fontSize: 15, borderRadius: 15 }}>check</i>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'calc(100% - 30px)' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 10, marginBottom: 5 }} /></div>} />
                      <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 10 }} /></div>} />
                    </div>
                    <div>
                      <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: 90, height: 10 }} /></div>} />
                    </div>
                  </div>
                  <div style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>
                    <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10, marginBottom: 5 }} /></div>} />
                    <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%' }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>
      );
    }

    return (
      <Col xl={4} lg={4} md={4} sm={12} xs={12}>
        <div style={{ height: 25, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: 'solid 2px #979797', paddingBottom: 5 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#808285' }}>
            <div style={{ width: 30, textAlign: 'left' }}>
              {selectAll ? (
                <div role="button" tabIndex={0} style={{ width: 15, height: 15, backgroundColor: '#ffffff' }} onClick={this.onSelectAllToggle}>
                  <i className="material-icons" style={{ color: 'rgb(128, 130, 133)', fontSize: 17, fontWeight: 'bold' }}>check_circle_outline</i>
                </div>
              ) : (
                <div role="button" tabIndex={0} style={{ width: 15, height: 15, backgroundColor: '#ffffff', borderRadius: 15, border: '2px solid rgb(128, 130, 133)', marginTop: 5 }} onClick={this.onSelectAllToggle}></div>
              )}
            </div>
            <span>Unread</span>
          </div>
          <div style={{ display: user ? '' : 'none', fontFamily: 'Lato', fontSize: 11, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'center', color: '#487db3' }}>
            {isMarkingAsRead ? (<Loader active inline size="tiny" style={{ marginRight: 10 }} />) : null}
            <span role="button" tabIndex={0} onClick={this.onMarkAsRead}>Mark as Read</span>
          </div>
        </div>
        <div style={{ height: Object.keys(npsMetaDataFilters).length ? 559 : 525, overflowY: 'auto' }}>
          {responses.filter((response) => !response.read).map((response) => (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 10, padding: '5px 0 5px 0' }} key={response.surveyProgressId}>
              <div style={{ width: 30 }}>
                <div role="button" tabIndex={0} style={{ width: 15, height: 15, backgroundColor: this.color(response.score), borderRadius: 15, marginTop: 5 }} onClick={() => this.onSelectComment(response.surveyProgressId)}>
                  {checked.includes(response.surveyProgressId) ? (<i className="material-icons" style={{ color: '#ffffff', fontSize: 15 }}>check</i>) : null}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'calc(100% - 30px)' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'Lato', fontSize: 11 }}>
                      <span style={{ fontWeight: 'bold', color: '#3d4553' }}>{response.metadata.name}</span> &nbsp;
                      <span style={{ fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#6d6e71' }}>{response.commId}</span>
                    </div>
                    <div style={{ color: '#808285', fontFamily: 'Lato', fontSize: 11 }}>
                      <span>{moment.utc(response.createDate).fromNow()}</span>&nbsp;
                      {response.metadata.transactiontype ? (
                        <span>| {response.metadata.transactiontype}</span>
                      ) : null}
                    </div>
                  </div>
                  {response.metadata.location ? (
                    <div style={{ width: 100, textAlign: 'right' }}>
                      <i className="material-icons" style={{ height: 11, fontSize: 10, color: '#c4c4c4' }}>place</i> &nbsp;
                      <span style={{ height: 11, fontFamily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#a0a0a0' }}>{response.metadata.location}</span>
                    </div>
                  ) : null}
                </div>
                <div style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>
                  { response.response}
                </div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'right', padding: '15px 5px 15px 0' }}>
            {noMoreResponsesToLoad ? (
              <div style={{ height: 12, fontFamily: 'Lato', fontSize: 10, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#d9d9d9' }}>
                <span>No more responses</span>
              </div>
            ) : (
              <div role="button" tabIndex={0} onClick={this.fetchQuestionResponses} disabled={isFetchingResponses} style={{ height: 12, fontFamily: 'Lato', fontSize: 10, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#487db3' }}>
                <span>Load more</span>
                {isFetchingResponses ?
                  (<Loader active={isFetchingResponses} inline size="mini" style={{ marginLeft: 10 }} />)
                  : (<i className="material-icons" style={{ fontSize: 10 }}>add</i>)
                }
              </div>
            )}
          </div>
          <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: 'rgb(128, 130, 133)' }}>
            <span>Read</span>
          </div>
          {responses.filter((response) => response.read).map((response) => (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 10, backgroundColor: 'rgba(242,245,245,1)', padding: 5 }} key={response.surveyProgressId}>
              <div style={{ width: 30 }}>
                <div role="button" tabIndex={0} style={{ width: 15, height: 15, backgroundColor: this.color(response.score), borderRadius: 15, marginTop: 5 }} onClick={() => this.onSelectComment(response.surveyProgressId)}>
                  {checked.includes(response.surveyProgressId) ? (<i className="material-icons" style={{ color: '#ffffff', fontSize: 15 }}>check</i>) : null}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'calc(100% - 30px)' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'Lato', fontSize: 11 }}>
                      <span style={{ fontWeight: 'bold', color: '#3d4553' }}>{response.metadata.name}</span> &nbsp;
                      <span style={{ fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#6d6e71' }}>{response.commId}</span>
                    </div>
                    <div style={{ color: '#808285', fontFamily: 'Lato', fontSize: 11 }}>
                      <span>{moment.utc(response.createDate).fromNow()}</span>&nbsp;
                      {/* <span style={{ fontWeight: 'bold' }}>About:</span> &nbsp; */}
                      {response.metadata.transactiontype ? (
                        <span>| {response.metadata.transactiontype}</span>
                      ) : null}
                    </div>
                  </div>
                  {response.metadata.location ? (
                    <div style={{ width: 100, textAlign: 'right' }}>
                      <i className="material-icons" style={{ height: 11, fontSize: 10, color: '#c4c4c4' }}>place</i> &nbsp;
                      <span style={{ height: 11, fontFamily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#a0a0a0' }}>{response.metadata.location}</span>
                    </div>
                  ) : null}
                </div>
                <div style={{ width: '100%', height: 'auto', fontFa1ily: 'Lato', fontSize: 11, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, color: '#3d4553' }}>
                  { response.response}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Col>
    );
  }
}
