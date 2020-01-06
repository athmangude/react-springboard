/* eslint-disable react/forbid-prop-types */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Formsy from 'formsy-react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import styles from './Section.css';

import Question from './Question';

const QuestionsWrapper = styled(Formsy)`${styles}`;

const Questions = ({ questions, onChange, responses, title, tag }) => (
  <QuestionsWrapper
    onValidSubmit={() => console.log('onValidSubmit')}
    onValid={() => console.log('form is valid')}
    onInvalid={() => console.log('form is invalid')}
    id={tag}
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
          />
        )
      })
    }
    <Button variant="contained" color="primary" type="submit" className="button-primary">Submit Section</Button>
    <Divider variant="fullWidth" className="divider" />
  </QuestionsWrapper>
);

QuestionsWrapper.propTypes = {
  questions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  responses: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

export default Questions;