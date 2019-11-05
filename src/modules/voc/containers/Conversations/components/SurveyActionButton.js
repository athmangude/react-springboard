import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import Spinner from 'react-spinner-material';
import styled from 'styled-components';

import styles from './SurveyActionButton.css';

const SurveyActionWrapper = styled(Button)`${styles}`;

const SurveyActionButton = (props) => (
  <SurveyActionWrapper
    className="survey-action-button"
    onClick={props.onClick}
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', height: 35, borderRadius: 17.5, margin: '0 5px', padding: '3px 20px', backgroundColor: 'transparent' }}
    disabled={props.disabled}
  >
    {
      props.loading ? (
        <div style={{ margin: '0 2px' }}>
          <Spinner spinnerColor="#808285" size={16} spinnerWidth={2} />
        </div>
      ) : (
        <i className="material-icons" style={{ fontSize: 20 }}>{props.icon}</i>
      )
    }
    <span style={{ margin: '0 5px', fontWeight: 'lighter' }}>{props.text}</span>
  </SurveyActionWrapper>
);

SurveyActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default SurveyActionButton;
