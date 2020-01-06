/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import Questions from './Questions';

import styles from './index.css';

const PreviewWrapper = styled.div`${styles}`;

const Preview = ({ committedEditorValue }) => {
  const questionnaire = JSON.parse(committedEditorValue);
  const [responses, setResponses] = useState({});

  function onChange(tag, response) {
    setResponses({ ...responses, [tag]: response });
  }

  return (
    <PreviewWrapper>
      <Typography variant="h4" gutterBottom className="questionnaire-title">
        {questionnaire.title}
      </Typography>
      {
        questionnaire.sections.map(section => (
          <div key={section.title} className="section-container">
            <Typography variant="h6" gutterBottom className="section-title">
              {section.title}
            </Typography>
            <Questions
              questions={section.questions}
              responses={responses}
              onChange={onChange}
            />
          </div>
        ))
      }
    </PreviewWrapper>
  );
};

Preview.propTypes = {
  committedEditorValue: PropTypes.string.isRequired,
};

export default Preview;