/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './ActionMenu.css';

const ActionMenuWrapper = styled.div`${styles}`;

const ActionMenu = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ActionMenuWrapper>
      <IconButton aria-label="more_vert" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {
          options.map(option => (
            <MenuItem onClick={option.action}>{option.label}</MenuItem>
          ))
        }
      </Menu>
    </ActionMenuWrapper>
  );
};

ActionMenu.propTypes = {
  options: PropTypes.array.isRequired,
};

export default ActionMenu;
