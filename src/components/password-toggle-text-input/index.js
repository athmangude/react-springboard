import React, { useState } from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

import CircularButton from 'SharedComponents/circular-button';

import styles from './index.css';

const PasswordToggleTextInputWrapper = styled.div`${styles}`;

const PasswordToggleTextInput = ({ value, onChange, placeholder, type, name, onKeyDown }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <PasswordToggleTextInputWrapper>
      <input type={!isPasswordVisible ? type : 'text'} name={name} placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onKeyDown} className="text-input" />
      <div className="adornment-container">
        <Tooltip title="Show password" aria-label="show password">
          <CircularButton icon={isPasswordVisible ? 'visibility_off' : 'visibility'} size="medium" onClick={() => { !isPasswordVisible ? setPasswordVisible(true) : setPasswordVisible(false)}} />
        </Tooltip>
      </div>
    </PasswordToggleTextInputWrapper>
  );
}

PasswordToggleTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func,
}

export default PasswordToggleTextInput;
