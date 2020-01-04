/* eslint-disable react/require-default-props */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useTheme } from '@material-ui/core/styles';

import styles from './index.css';

const MySnackbarContentWrapper = styled(SnackbarContent)`${styles}`;

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};


const MySnackbar = ({ className, message, onClose, title, variant, open, adornment, ...other }) => {
  const Icon = variantIcon[variant];
  const theme = useTheme();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <MySnackbarContentWrapper
        className={clsx(className)}
        aria-describedby="client-snackbar"
        message={(
          <div id="client-snackbar" className="snackbar-dialog-content">
            <div className="icon-container">
              <Icon className="icon" color="warning" style={{ color: theme.palette[variant].main }} />
            </div>
            <div className="message-container">
              {
                title ? (
                  <span className="title">{title}</span>
                ) : null
              }
              <span className="message">{message}</span>
              {
                adornment ? (
                  <code className="adornment-container">
                    {adornment}
                  </code>
                ) : null
              }
            </div>
          </div>
        )}
        action={[
          <Button aria-label="close" color="inherit" onClick={onClose}>Close</Button>
        ]}
        {...other}
      />
    </Snackbar>
  );
};

MySnackbar.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
};

export default MySnackbar;
