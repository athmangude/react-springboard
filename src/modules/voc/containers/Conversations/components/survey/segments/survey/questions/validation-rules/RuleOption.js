import React from 'react';
import './RuleOption.css';

const RuleOption = (props) => {
  return (
    <div
      className="rule-option"
      role="button"
      style={{ display: 'flex', alignItems: 'start', justifyContent: 'center', flexDirection: 'column', padding: 3 }}
      onClick={(event) => props.onSelect(props.option.value)}
    >
      <b style={{ textTransform: 'uppercase', margin: '0px 5px', fontSize: 11 }}>{props.option.title}</b>
      <span style={{ textTransform: 'capitalize', margin: '-3px 5px', fontSize: 11 }}>{props.option.description}</span>
    </div>
  );
}

export default RuleOption;
