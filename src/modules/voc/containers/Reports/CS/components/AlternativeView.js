/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable no-underscore-dangle, object-curly-newline */
import React from 'react';
import { Row, Col } from 'react-grid-system';
import PropTypes from 'prop-types';

import ChartContainer from '../../components/chart-container';
import LoadingEmptyChartComponent from '../../components/LoadingEmptyChartComponent';
import AlternativeSurveySummary from '../../components/SurveySummary';
import SurveyMetadata from '../../components/survey-metadata';
import NPSFilters from '../../components/NPSFilters';


const AlternativeView = ({ width, startDate, endDate, npsFilters, isFetchingSurveyQuestions, isFetchingStats, npsMetaDataFilters, isFetchingNPSMetadataFilters, surveyId, surveyResults, aodReport, setNPSFilters, authentication, onToggleOptionsMenu, collaborators, EventHandler, alertActions, onFilterByBarChartOption }) => {
  if (isFetchingSurveyQuestions) {
    return (
      <Row>
        <AlternativeSurveySummary isFetchingData={isFetchingStats} surveyId={surveyId} aodReport={aodReport} width={width} />
        <Col xl={7} lg={7} md={7} sm={12} xs={12}>
          <LoadingEmptyChartComponent
            items={3}
            isLoading={isFetchingSurveyQuestions}
          />
        </Col>
        <Col xl={5} lg={5} md={5} sm={12} xs={12}>
          <NPSFilters npsMetaDataFilters={npsMetaDataFilters} setNPSFilters={setNPSFilters} isFetchingNPSMetadataFilters={isFetchingNPSMetadataFilters} isFetchingData={isFetchingNPSMetadataFilters} />
          <SurveyMetadata user={authentication.user} targetStats={surveyResults ? surveyResults.participantStats : {}} activeParticipantStats={surveyResults ? surveyResults.activeParticipantStats : {}} target={surveyResults ? surveyResults.contacted : 0} responded={surveyResults ? surveyResults.responded : 0} isFetchingData={isFetchingStats} />
        </Col>
      </Row>
    );
  }

  if (Object.keys(aodReport).includes(surveyId)) {
    const survey = aodReport[surveyId];
    let questions = survey.responseStats;

    questions = questions.sort((a, b) => {
      return a.questionLevel.localeCompare(b.questionLevel, undefined, { numeric: true });
    });

    if (!questions.length) {
      return (
        <Row>
          <AlternativeSurveySummary isFetchingData={isFetchingStats} surveyId={surveyId} aodReport={aodReport} width={width} />
          <Col xl={7} lg={7} md={7} sm={12} xs={12}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <LoadingEmptyChartComponent isLoading={false} />
              <h3 style={{ fontWeight: 'lighter', margin: '10px 20px', textAlign: 'center' }}>
                Oops! We have not collected any data for this Conversation
              </h3>
            </div>
          </Col>
          <Col xl={5} lg={5} md={5} sm={12} xs={12}>
            <NPSFilters npsMetaDataFilters={npsMetaDataFilters} setNPSFilters={setNPSFilters} isFetchingNPSMetadataFilters={isFetchingNPSMetadataFilters} isFetchingData={isFetchingNPSMetadataFilters} />
            <SurveyMetadata user={authentication.user} targetStats={surveyResults ? surveyResults.participantStats : {}} activeParticipantStats={surveyResults ? surveyResults.activeParticipantStats : {}} target={surveyResults ? surveyResults.contacted : 0} responded={surveyResults ? surveyResults.responded : 0} isFetchingData={isFetchingStats} />
          </Col>
        </Row>
      );
    }

    return (
      <Row tabIndex={0} role="button" onClick={() => onToggleOptionsMenu('close')}>
        <AlternativeSurveySummary isFetchingData={isFetchingStats} surveyId={surveyId} aodReport={aodReport} surveyResults={survey} width={width} />
        <Col xl={7} lg={7} md={7} sm={12} xs={12}>
          {
            questions
              .map((question) => (
                <ChartContainer surveyId={surveyId} onFilterByBarChartOption={onFilterByBarChartOption} question={question} key={question.id} authentication={authentication} collaborators={collaborators} startDate={startDate} endDate={endDate} npsFilters={npsFilters} EventHandler={EventHandler} alertActions={alertActions} />
              ))
          }
        </Col>
        <Col xl={5} lg={5} md={5} sm={12} xs={12}>
          <NPSFilters npsMetaDataFilters={npsMetaDataFilters} setNPSFilters={setNPSFilters} isFetchingNPSMetadataFilters={isFetchingNPSMetadataFilters} isFetchingData={isFetchingNPSMetadataFilters} />
          <SurveyMetadata user={authentication.user} targetStats={surveyResults ? surveyResults.participantStats : {}} activeParticipantStats={surveyResults ? surveyResults.activeParticipantStats : {}} target={surveyResults ? surveyResults.contacted : 0} responded={surveyResults ? surveyResults.responded : 0} isFetchingData={isFetchingStats} />
        </Col>
      </Row>
    );
  }
  return null;
};

AlternativeView.propTypes = {
  width: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  npsFilters: PropTypes.string,
  isFetchingSurveyQuestions: PropTypes.bool,
  isFetchingStats: PropTypes.bool,
  npsMetaDataFilters: PropTypes.object,
  isFetchingNPSMetadataFilters: PropTypes.bool,
  surveyId: PropTypes.number,
  surveyResults: PropTypes.object,
  aodReport: PropTypes.object,
  setNPSFilters: PropTypes.object,
  authentication: PropTypes.object,
  onToggleOptionsMenu: PropTypes.func,
  collaborators: PropTypes.object,
  EventHandler: PropTypes.object,
  alertActions: PropTypes.object,
  onFilterByBarChartOption: PropTypes.func,
};

export default AlternativeView;
