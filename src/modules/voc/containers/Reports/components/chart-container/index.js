/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, no-return-assign, no-plusplus, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NoResults from './NoResults';
import Question from './Question';

import * as aodReportActions from '../../AOD/flux/actions';

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

export default class ChartContainer extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    npsFilters: PropTypes.object,
    surveyId: PropTypes.string,
    collaborators: PropTypes.array,
    EventHandler: PropTypes.object,
    alertActions: PropTypes.object,
    onFilterByBarChartOption: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.toggleIntroMessage = this.toggleIntroMessage.bind(this);

    this.state = {
      showIntroMessage: false,
    };
  }

  toggleIntroMessage() {
    const { EventHandler } = this.state;
    this.setState((prevState) => ({ showIntroMessage: !prevState.showIntroMessage }));
    EventHandler.trackEvent({ category: 'ChartContainers', action: 'toggle intro message', value: true });
  }

  render() {
    const { startDate, endDate, npsFilters, question, onFilterByBarChartOption, surveyId, collaborators, EventHandler, alertActions } = this.props;
    const { showIntroMessage } = this.state;
    if (!question.analysis.length) {
      return (
        <NoResults question={question} />
      );
    }

    if (question.questionType !== 'INTRO_MESSAGE_MULTIPLE_CHOICE') {
      return (<Question question={question} onFilterByBarChartOption={onFilterByBarChartOption} startDate={startDate} endDate={endDate} npsFilters={npsFilters} surveyId={surveyId} collaborators={collaborators} EventHandler={EventHandler} alertActions={alertActions} />);
    }

    return (
      <div>
        <button type="button" onClick={this.toggleIntroMessage} style={{ color: '#6D6E71', margin: '5px 0 5px 0' }}>
          {showIntroMessage ? 'Hide' : 'Show'}
          &nbsp;intro message
        </button>
        {showIntroMessage ? (
          <Question question={question} onFilterByBarChartOption={onFilterByBarChartOption} startDate={startDate} endDate={endDate} npsFilters={npsFilters} surveyId={surveyId} collaborators={collaborators} EventHandler={EventHandler} alertActions={alertActions} />
        ) : null}
      </div>
    );
  }
}
