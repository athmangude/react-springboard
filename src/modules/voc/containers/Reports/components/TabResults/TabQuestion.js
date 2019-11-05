/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';

const TabQuestion = ({ surveyId, question, startDate, endDate, EventHandler, alertActions }) => {
  if (question.questionType === '') {
    
  }
  return (
    <div>
      
    </div>
  );
};

TabQuestion.propTypes = {
  surveyId: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  EventHandler: PropTypes.object,
  alertActions: PropTypes.object,
};

export default TabQuestion;
