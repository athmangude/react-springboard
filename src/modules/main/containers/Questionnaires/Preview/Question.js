/* eslint-disable no-lonely-if */
/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import styles from './Question.css';
import { Text, Number, Radio, Checkbox, Slider, DatePicker } from './input-types';

const QuestionWrapper = styled.div`${styles}`;

const Question = ({ question, onChange, response, responses, parent, parentValue }) => {
  let show = false;
  if (!question.parentTag) {
    show = true;
  } else if (parent.inputType === 'RADIO') {
    if ('showIfParentValueEquals' in question) {
      if (parentValue === question.showIfParentValueEquals) { // eslint-disable-line max-len
        show = true;
      }
    } else if ('showIfParentValueNotEquals' in question) {
      if (parentValue && parentValue !== question.showIfParentValueNotEquals) { // eslint-disable-line max-len
        show = true;
      }
    }
  } else if (parent.inputType === 'CHECKBOX') {
    if ('showIfParentValueIncludes' in question) {
      if (parentValue != null && parentValue.length > 0) {
        show = parentValue.includes(question.showIfParentValueIncludes);
      }
    } else {
      if ('showIfParentValueNotIncludes' in question) {
        if (question.showIfParentValueNotIncludes != null && question.showIfParentValueNotIncludes.length > 0) {
          if (Array.isArray(question.showIfParentValueNotIncludes)) {
            if (parentValue != null && parentValue.length > 0) {
              const item = lodash.intersection(question.showIfParentValueNotIncludes, parentValue);
              show = !(item.length > 0);
            }
          } else {
            // Defined as a string
            if (parentValue != null && parentValue.length > 0) {
              show = !(parentValue && parentValue.includes(question.showIfParentValueNotIncludes));
            }
          }
        }
      }
    }
  } else if (parent.inputType === 'REMOTE_QUERY') {
    if ('showIfParentValueEquals' in question) {
      if ((parentValue !== undefined) && parentValue === question.showIfParentValueEquals) { // eslint-disable-line max-len
        show = true;
      }
    } else if ('showIfParentValueNotEquals' in question) {
      if ((parentValue !== null) && parentValue !== question.showIfParentValueNotEquals) { // eslint-disable-line max-len
        show = true;
      }
    }
  } else if (parent.inputType === 'NUMBER') {
    if ('showIfParentValueEquals' in question) {
      if (parentValue === question.showIfParentValueEquals) { // eslint-disable-line max-len
        show = true;
      }
    } else if ('showIfParentValueNotEquals' in question) {
      if (parentValue && parentValue !== question.showIfParentValueNotEquals) { // eslint-disable-line max-len
        show = true;
      }
    }
  }

  if (show) {
    return (
      <QuestionWrapper>
        <Typography variant="body1" gutterBottom>
          {question.question}
        </Typography>
        {
          question.inputType === 'TEXT' ? (
            <Text
              tag={question.tag}
              label={question.label}
              onChange={onChange}
              response={response}
              validationRules={question.validationRules}
              name={question.tag}
              value={response}
              validations="isEmail"
              validationError="This is not a valid email"
            />
          ) : question.inputType === 'NUMBER' ? (
            <Number
              tag={question.tag}
              label={question.label}
              onChange={onChange}
              response={response}
              validationRules={question.validationRules}
              name={question.tag}
              value={response}

            />
          ) : question.inputType === 'RADIO' ? (
            <Radio
              tag={question.tag}
              label={question.label}
              onChange={onChange}
              response={response}
              validationRules={question.validationRules}
              options={question.options}
              name={question.tag}
              value={response}
            />
          ) : question.inputType === 'CHECKBOX' ? (
            <Checkbox
              tag={question.tag}
              label={question.label}
              onChange={onChange}
              response={response}
              validationRules={question.validationRules}
              options={question.options}
              name={question.tag} value={response}
              value={response}
            />
          ) : question.inputType === 'SLIDER' ? (
            <Slider
              tag={question.tag}
              label={question.label}
              onChange={onChange}
              response={response}
              validationRules={question.validationRules}
              min={question.min}
              max={question.max}
              step={question.step}
              defaultValue={question.defaultValue}
              name={question.tag}
              value={response}
            />
          ) : question.inputType === 'DATE' ? (
            <DatePicker
              tag={question.tag}
              label={question.label}
              onChange={onChange}
              response={response}
              validationRules={question.validationRules}
              name={question.tag}
              value={response}
            />
          ) : null
        }
      </QuestionWrapper>
    );
  }
  return null;
};

Question.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  response: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default Question;