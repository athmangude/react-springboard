/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';

import TabQuestion from './TabQuestion';
import ChartContainer from '../chart-container';
import LoadingEmptyChartComponent from '../LoadingEmptyChartComponent';

const TabResults = ({ surveyId, surveyResults, selectedTab, aodReport, isFetchingSurveyQuestions, startDate, endDate, onFilterByBarChartOption, authentication, collaborators, npsFilters, EventHandler, alertActions }) => {
  if (isFetchingSurveyQuestions) {
    return (
      <LoadingEmptyChartComponent
        items={3}
        isLoading={isFetchingSurveyQuestions}
      />
    );
  }

  if (typeof surveyResults === 'object') {
    const questions = surveyResults.responseStats;

    if (!questions.length) {
      return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <LoadingEmptyChartComponent isLoading={false} />
          <h3 style={{ fontWeight: 'lighter', margin: '10px 20px', textAlign: 'center' }}>
            Oops! We have not collected any data for this Conversation
          </h3>
        </div>
      );
    }

    if (selectedTab === 'Summary') {
      return questions
        .sort((a, b) => {
          if (a.questionLevel.split('.')[0].length < b.questionLevel.split('.')[0].length) {
            return -1;
          }
          if (a.questionLevel.split('.')[0].length > b.questionLevel.split('.')[0].length) {
            return 1;
          }
          if (a.questionLevel < b.questionLevel) {
            return -1;
          }
          if (a.questionLevel > b.questionLevel) {
            return 1;
          }
          return 0;
        })
        .map((question) => (
          <ChartContainer surveyId={surveyId} aodReport={aodReport} onFilterByBarChartOption={onFilterByBarChartOption} npsFilters={npsFilters} question={question} key={question.questionId} authentication={authentication} collaborators={collaborators} startDate={startDate} endDate={endDate} EventHandler={EventHandler} alertActions={alertActions} />
        ));
    }

    const questionLevel = selectedTab.split(' ')[1];
    const selectedQuestion = questions.find((question) => question.questionLevel === questionLevel);
    if (selectedQuestion) {
      return (<TabQuestion surveyId={surveyId} question={selectedQuestion} startDate={startDate} endDate={endDate} EventHandler={EventHandler} alertActions={alertActions} />);
    }

    return (
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <LoadingEmptyChartComponent isLoading={false} />
        <h3 style={{ fontWeight: 'lighter', margin: '10px 20px', textAlign: 'center' }}>
          Oops! We could not fetch any data for this conversation. Please try again later.
        </h3>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <LoadingEmptyChartComponent isLoading={false} />
      <h3 style={{ fontWeight: 'lighter', margin: '10px 20px', textAlign: 'center' }}>
        Oops! We could not fetch any data for this conversation. Please try again later.
      </h3>
    </div>
  );
};

TabResults.propTypes = {
  surveyId: PropTypes.number,
  npsFilters: PropTypes.object,
  surveyResults: PropTypes.object,
  selectedTab: PropTypes.string,
  isFetchingSurveyQuestions: PropTypes.bool,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onFilterByBarChartOption: PropTypes.func,
  authentication: PropTypes.object,
  collaborators: PropTypes.array,
  aodReport: PropTypes.object.isRequired,
  EventHandler: PropTypes.object,
  alertActions: PropTypes.object,
};

export default TabResults;
