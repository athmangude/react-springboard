import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import styles from './index.css';

import Question from './Question';

const QuestionsWrapper = styled.div`${styles}`;


const Questions = ({ questions, onChange, responses }) => (
  <QuestionsWrapper>
    {
      questions.map((question) => {
        let parent;
        if ('parentTag' in question) {
          parent = questions.find(aQuestion => aQuestion.tag === question.parentTag);
        }

        return (
          <Question
            question={question}
            key={question.tag}
            onChange={onChange}
            response={responses[question.tag]}
            parent={parent}
            parentValue={responses[question.parentTag]}
          />
        )
      })
    }
  </QuestionsWrapper>
);

QuestionsWrapper.propTypes = {
  questions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  responses: PropTypes.object.isRequired,
};

export default Questions;