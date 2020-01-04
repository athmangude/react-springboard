/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import styles from './Question.css';
import { Text, Number, Radio, Checkbox, Slider, DatePicker } from './input-types';

const QuestionWrapper = styled.div`${styles}`;

const Question = ({ question, onChange, answer }) => {
  return (
    <QuestionWrapper>
      <p>{question.question}</p>
      {
        question.inputType === 'TEXT' ? (
          <Text
            tag={question.tag}
            label={question.label}
            onChange={onChange}
            answer={answer}
            validationRules={question.validationRules}
          />
        ) : question.inputType === 'NUMBER' ? (
          <Number
            tag={question.tag}
            label={question.label}
            onChange={onChange}
            answer={answer}
            validationRules={question.validationRules}
          />
        ) : question.inputType === 'RADIO' ? (
          <Radio
            tag={question.tag}
            label={question.label}
            onChange={onChange}
            answer={answer}
            validationRules={question.validationRules}
            options={question.options}
          />
        ) : question.inputType === 'CHECKBOX' ? (
          <Checkbox
            tag={question.tag}
            label={question.label}
            onChange={onChange}
            answer={answer}
            validationRules={question.validationRules}
            options={question.options}
          />
        ) : question.inputType === 'SLIDER' ? (
          <Slider
            tag={question.tag}
            label={question.label}
            onChange={onChange}
            answer={answer}
            validationRules={question.validationRules}
            min={question.min}
            max={question.max}
            step={question.step}
            defaultValue={question.defaultValue}
          />
        ) : question.inputType === 'DATE' ? (
          <DatePicker
            tag={question.tag}
            label={question.label}
            onChange={onChange}
            answer={answer}
            validationRules={question.validationRules}
          />
        ) : null
      }
    </QuestionWrapper>
  );
};

Question.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  answer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default Question;