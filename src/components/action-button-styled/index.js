/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders'
import styled from 'styled-components';

import styles from './index.css';

const ActionButtonWrapper = styled.button`${styles}`;

// import './index.scss';

const ActionButton = (props) => {
  return (
    (props.show || props.show === undefined) ? (
      (props.preloading) ? (
        <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ margin: 5 }}><RectShape color="#d9d9d9" style={{ height: 30, width: 80, borderRadius: 17.5 }} /></div>} />
      ) : (
        <ActionButtonWrapper
          onClick={props.onClick}
          style={{ ...props.style }}
          disabled={props.disabled}
          type={props.type}
          active={props.active}
          className={props.className}
          {...props}
        >
          {
            props.loading ? (
              <div style={{ margin: '0 2px' }}>
                <Spinner spinnerColor={props.color || '#fff'} size={!props.large ? 16 : 20} spinnerWidth={!props.large ? 2 : 3} />
              </div>
            ) : (
              <i className="material-icons" style={{ fontSize: !props.large ? 15 : 25, fontWeight: 500 }}>{props.icon}</i>
            )
          }
          <span style={{ margin: '0 5px', fontSize: !props.large ? 13 : 17, fontWeight: 500 }}>{props.text}</span>
        </ActionButtonWrapper>
      )
    ) : null
  );
}

ActionButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  preloading: PropTypes.bool,
  text: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.object,
  large: PropTypes.bool,
  color: PropTypes.string,
  active: PropTypes.bool,
  type: PropTypes.string,
  show: PropTypes.bool,
};

export default ActionButton;
