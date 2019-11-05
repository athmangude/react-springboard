import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import styles from './ActionsMenuStyles';

const ActionsMenuWrapper = styled.div`${styles}`;

const ActionsMenu = () => (
  <ActionsMenuWrapper>
    <Link className="action-link" to="/activity">Activity</Link>
    <Link className="action-link" to="/messages">Messages</Link>
  </ActionsMenuWrapper>
);

export default ActionsMenu;
