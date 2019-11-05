import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import styled from 'styled-components';

import styles from './index.css';
const ActionButtonWrapper = styled.button`${styles}`

const ActionButton = (props) => (
  <ActionButtonWrapper
    className={`action-button ${props.className}`}
    onClick={props.onClick}
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', borderRadius: props.large ? 22.5 : 17.5, margin: '10px 5px 3px', padding: props.large ? 10 : '5px 5px 5px 10px', backgroundColor: 'transparent', outline: 'none', cursor: 'pointer', ...props.style }}
    disabled={props.disabled}
    type={props.type}
  >
    {
      props.loading ? (
        <div style={{ margin: '0 2px' }}>
          <Spinner spinnerColor={props.color || '#fff'} size={!props.large ? 16 : 20} spinnerWidth={!props.large ? 2 : 3} />
        </div>
      ) : (
        <i className="material-icons" style={{ fontSize: !props.large ? 15 : 25 }}>{props.icon}</i>
      )
    }
    <span style={{ margin: '0 5px', fontSize: !props.large ? 13 : 17, fontWeight: 'normal' }}>{props.text}</span>
  </ActionButtonWrapper>
);

ActionButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  text: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.object,
  large: PropTypes.bool,
  color: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

export default ActionButton;
