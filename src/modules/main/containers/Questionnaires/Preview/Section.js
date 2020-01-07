/* eslint-disable react/forbid-prop-types */
import React, { useState, createRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Formsy, { addValidationRule } from 'formsy-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import styles from './Section.css';

import Question from './Question';

const SectionWrapper = styled(Formsy)`${styles}`;

const form = createRef();

const Section = ({ questions, onChange, responses, title, tag }) => {
  // eslint-disable-next-line no-unused-vars
  const [canSubmit, setCanSubmit] = useState(true);

  function onValidSubmit() {
    // a valid submission
  }

  function onValid() {
    // form is valid
    setCanSubmit(true);
  }

  function onInvalid() {
    // form is invalid
    setCanSubmit(false);
  }

  function onInvalidSubmit() {
    // an invalid submission
  }

  addValidationRule('isRequired', (values, value) => {
    if (typeof value === 'string') {
      return value && value.length;
    }

    if (Array.isArray(value)) {
      // catch an array value and do nothing. assume it passes
      return true;
    }

    if (typeof value === 'number') {
      // returning true because a number will be valid
      return true;
    }

    if (typeof value === 'object') {
      // this is a bit complex as a lot of things are objects in JS.

      if (value === null || value === 'undefined') {
        return false;
      }

      if (Object.keys(value) && Object.keys(value).length) {
        let checked = false;
        Object.keys(value).forEach((key) => {
          if (value[key]) {
            checked = true;
          }
        });

        return checked;
      }
      return true;
    }

    return false;
  });

  return (
    <SectionWrapper
      onValidSubmit={onValidSubmit}
      onInvalidSubmit={onInvalidSubmit}
      onValid={onValid}
      onInvalid={onInvalid}
      id={tag}
      ref={form}
    >
      <Typography variant="h6" gutterBottom className="section-title">
        {title}
      </Typography>
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
              name={question.tag}
              value={responses[question.tag]}
              validation={question.validation}
            />
          )
        })
      }
      <Button variant="contained" color="primary" type="submit" className="button-primary">Submit Section</Button>
      <Divider variant="fullWidth" className="divider" />
    </SectionWrapper>
  );
};

SectionWrapper.propTypes = {
  questions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  responses: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default Section;