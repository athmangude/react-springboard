/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import ForwardIcon from '@material-ui/icons/KeyboardArrowRight';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import styles from './BottomPanel.css';

const BottomPanelWrapper = styled(Paper)`${styles}`;

const BottomPanel = ({ onGoBack, canGoBack, canGoForward, onGoForward, activeSection, totalSections }) => {
  function getProgressValue() {
    if (activeSection === 0) {
      return 0;
    }

    return (activeSection / totalSections) * 100;
  }

  return (
    <BottomPanelWrapper square elevation={2}>
      <div className="progress-container">
        <LinearProgress className="progress-bar" variant="determinate" value={getProgressValue()} />
      </div>
      <div className="actions-container">
        <Button
          color="primary"
          variant="contained"
          startIcon={(<BackIcon />)}
          onClick={onGoBack}
          disabled={!canGoBack}
        >
          Back
        </Button>
        <Typography variant="h5" component="h2">
          {activeSection + 1}
          /
          {totalSections}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          endIcon={(<ForwardIcon />)}
          onClick={onGoForward}
          disabled={!canGoForward}
        >
          Next
        </Button>
      </div>
    </BottomPanelWrapper>
  );
};

BottomPanel.propTypes = {
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  activeSection: PropTypes.number.isRequired,
  totalSections: PropTypes.number.isRequired,
  canGoForward: PropTypes.bool.isRequired,
  onGoForward: PropTypes.func.isRequired,
};

export default BottomPanel;
