import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft';

import styles from './BottomPanel.css';

const BottomPanelWrapper = styled(Paper)`${styles}`;

const BottomPanel = ({ onGoBack, canGoBack }) => {
  return (
    <BottomPanelWrapper elevation={2} square>
      <Button
        color="primary"
        variant="contained"
        startIcon={(<BackIcon />)}
        onClick={onGoBack}
        disabled={!canGoBack}
      >
        Go Back
      </Button>
    </BottomPanelWrapper>
  );
};

BottomPanel.propTypes = {
  onGoBack: PropTypes.func.isRequired,
  canGoBack: PropTypes.func.isRequired,
}

export default BottomPanel;