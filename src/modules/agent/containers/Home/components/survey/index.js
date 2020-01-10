import React from 'react';
import PropTypes from 'prop-types';

import ChartContainer from './chart-container';

const Survey = (props) => (
  <div>
    {
      props.survey.questions.map((question) => (
        <ChartContainer configurations={props.configurations} survey={props.survey} question={question} key={question.questionId} uiSortDate={props.uiSortDate} collaborators={props.collaborators} homeActions={props.homeActions} />
      ))
    }
  </div>
);

Survey.propTypes = {
  survey: PropTypes.object.isRequired,
  homeActions: PropTypes.object.isRequired,
};

export default Survey;
