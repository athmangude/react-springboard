/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Questions from './Questions';

import styles from './index.css';

const PreviewWrapper = styled.div`${styles}`;

const Preview = ({ committedEditorValue }) => {
  const questionnaire = JSON.parse(committedEditorValue);
  const [answers, setAnswers] = useState({});

  function onChange(tag, answer) {
    setAnswers({ ...answers, [tag]: answer });
  }

  return (
    <PreviewWrapper>
      <div className="heading">
        <h4>{questionnaire.title}</h4>
        <Questions
          questions={questionnaire.questions}
          answers={answers}
          onChange={onChange}
        />
      </div>
    </PreviewWrapper>
  );
};

Preview.propTypes = {
  committedEditorValue: PropTypes.object.isRequired,
};

export default Preview;