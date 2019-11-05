import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';

import styles from './index.css.js';

function isFeatureActive(features, option) {
  if (option.key === 'CS') {
    return features.voc;
  }

  if (option.key === 'AOD') {
    return features.aod;
  }

  return true;
}

const ObjectivesWrapper = styled.div`${styles}`;

const Objectives = (props) => (
  <ObjectivesWrapper>
    {
      props.options.map((option) => (
        <Button
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: option.key === props.active ? '#4a4f57' : '#d9d9d9', color: option.key === props.active ? '#fff' : '#808285', flexGrow: 1, padding: 20, margin: '0px 0px', borderRadius: 0, border: 'solid 1px #fff' }}
          onClick={() => props.onChange(option.key)}
          className={option.key === props.active ? 'active' : ''}
          disabled={!isFeatureActive(props.configurations.features, option)}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
            <i className="material-icons" style={{ margin: 'auto 10px auto 0', fontSize: 40 }}>{option.icon}</i>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <b>{option.name}</b>
            <span style={{ fontSize: 10, fontWeight: 'lighter' }}>{option.description}</span>
          </div>
        </Button>
      ))
    }
  </ObjectivesWrapper>
);

Objectives.propTypes = {
  options: PropTypes.array.isRequired,
  configurations: PropTypes.object,
};

export default Objectives;
