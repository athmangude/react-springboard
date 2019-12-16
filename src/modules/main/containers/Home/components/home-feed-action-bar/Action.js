import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styled from 'styled-components';
import actionStyles from './actionStyles';

const ActionWrapper = styled.button`${actionStyles}`;


const Action = (props) => (
  <ActionWrapper {...props} onClick={() => props.onChange({ [props.filter]: !props.value }, props.clearFeed)} className={classnames('action', props.type, { active: props.active })}>
    <i className="material-icons">{props.icon}</i>
    {
      props.type === 'nps' ? (
        <span className="label">{props.category}</span>
      ) : null
    }
  </ActionWrapper>
);

Action.propTypes = {
  category: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  clearFeed: PropTypes.bool.isRequired,
};

export default Action;
