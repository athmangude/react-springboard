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
    return value && value.length;
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
}

SectionWrapper.propTypes = {
  questions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  responses: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default Section;