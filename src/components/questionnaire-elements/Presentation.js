/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';



import styles from './Presentation.css';

const PresentationWrapper = styled.div`${styles}`;

const Presentation = ({ committedEditorValue }) => {
  const questionnaire = JSON.parse(committedEditorValue);
  const [responses, setResponses] = useState({});
  const [activeSection, setActiveSection] = useState(0);





  return (
    <PresentationWrapper>

    </PresentationWrapper>
  );
};

Presentation.propTypes = {
  committedEditorValue: PropTypes.string.isRequired,
};

export default Presentation;
