/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react/dist/commonjs';
import Spinner from 'react-spinner-material';
import ReactPlaceholder from 'react-placeholder';
import { RoundShape } from 'react-placeholder/lib/placeholders';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'styled-components';

import buttonStyles from './index.css';

const ButtonWrapper = styled(Button)`${buttonStyles}`;

const styles = (theme) => ({
  fab: {
    margin: theme.spacing.unit * 2,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

const withTooltip = (props) => (
  <Tooltip title={props.toolTipText} placement="top">
    {renderButton(props)}
  </Tooltip>
);

const renderButton = (props) => (
  (props.preloading) ? (
    <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RoundShape color="#d9d9d9" style={{ height: props.large ? 45 : 35, width: props.large ? 45 : 35 }} /></div>} />
  ) : (
    <ButtonWrapper
      className="action-button"
      onClick={props.onClick}
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', width: props.large ? 45 : 35, height: props.large ? 45 : 35, borderRadius: props.large ? 22.5 : 17.5, margin: '10px 5px 3px', padding: props.large ? 10 : 5, backgroundColor: 'transparent', ...props.style }}
      disabled={props.disabled}
      circular
    >
      {
        props.loading ? (
          <div style={{ margin: '0 2px' }}>
            <Spinner spinnerColor="#808285" size={!props.large ? 16 : 20} spinnerWidth={!props.large ? 2 : 3} />
          </div>
        ) : (
          <i className="material-icons" style={{ fontSize: !props.large ? 15 : 25, margin: 0, padding: 0 }}>{props.icon}</i>
        )
      }
    </ButtonWrapper>
  )
);

const IconButton = (props) => (
  (props.show || props.show === undefined) ? (
    (props.toolTipText) ? withTooltip(props) : renderButton(props)
  ) : null
);

IconButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  preloading: PropTypes.bool,
  icon: PropTypes.string,
  large: PropTypes.bool,
  style: PropTypes.object,
  toolTipText: PropTypes.string,
  show: PropTypes.bool,
};

export default withStyles(styles)(IconButton);
