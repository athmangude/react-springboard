/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import './AddValidationRule.css';

const AddValidationRule = ({ addValidationRule }) => (
  <button type="button" onClick={addValidationRule} className="add-validation-rule" style={{ border: 'dashed 1px #d9d9d9', padding: 10, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 190, marginBottom: 150 }}>
    <i className="material-icons" style={{ color: '#d9d9d9', margin: 'auto 10px auto 0' }}>add</i>
    &nbsp;
    <span style={{ color: '#d9d9d9' }}>Add a validation rule</span>
  </button>
);

AddValidationRule.propTypes = {
  addValidationRule: PropTypes.func,
};

export default AddValidationRule;
