import React from 'react';
import styled from 'styled-components';

import styles from './AppInstallButton.css';

const AppInstallButtonWrapper = styled.button`${styles}`;

const AppInstallButton = ({ onInstallButtonClicked }) => {
  return (
    <AppInstallButtonWrapper
      onClick={onInstallButtonClicked}
    >
      <i className="material-icons" style={{ fontSize: 20, margin: '0 10px' }}>get_app</i>
      <span>Install Spring Board</span>
    </AppInstallButtonWrapper>
  )
}

export default AppInstallButton;
