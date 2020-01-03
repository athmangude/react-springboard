import React from 'react';
import styled from 'styled-components';

import styles from './index.css';

import Question from './Question';

const QuestionsWrapper = styled.div`${styles}`;


export default ({ questions, onChange, answers }) => (
  <QuestionsWrapper>
    {
      questions.map((question) => (
        <Question
          question={question}
          key={question.tag}
          onChange={onChange}
          answer={answers[question.tag]}
        />
      ))
    }
  </QuestionsWrapper>
);