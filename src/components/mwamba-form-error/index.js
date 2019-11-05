import React from 'react';
import PropTypes from 'prop-types';

const validateField = (name, value, rules) => {
  const errors = [];
  if (value === null) {
    return errors;
  }

  rules.forEach((rule) => {
    switch (rule) {
      case 'validEmail': {
        const validEmail = /\S+@\S+\.\S+/;
        if (!validEmail.test(String(value).toLowerCase())) {
          errors.push('invalid email');
        }
        break;
      }
      case 'required': {
        if (!value.toString().length) {
          errors.push('required');
        }
        break;
      }
      case 'strongPassword': {
        if (value.length) {
          /**
           * ^ The password string will start this way
           * (?=.*[a-z]) The string must contain at least 1 lowercase alphabetical character
           * (?=.*[A-Z]) The string must contain at least 1 uppercase alphabetical character
           * (?=.*[0-9]) The string must contain at least 1 numeric character
           * (?=.[!@#\$%\^&]) The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
           * (?=.{8,}) The string must be eight characters or longer
           */
          const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(String(value));
          if (!strong) {
            errors.push(
              <ul style={{ paddingLeft: 11 }}>
                <li>password must contain a numeric character (0 - 9)</li>
                <li>have at least one lower case alphabetic character (a - z)</li>
                <li>one uppercase alphabetic character (A - Z)</li>
                <li>and one special character (!@#\$%\^&)</li>
              </ul>
            );
          }
          if (value.length < 8) {
            errors.push('password should be at least 8 characters long');
          }
        }
        break;
      }
      default:
        // do nothing
    }
  });

  return errors;
};

const ErrorComponent = (props) => {
  const validationErrors = validateField(props.name, props.value, props.rules);
  if (validationErrors.length) {
    return (
      <div>
        <span style={{ fontSize: 11, color: '#f26b50' }}>{validationErrors[0]}</span>
      </div>
    );
  }

  return null;
};

ErrorComponent.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  rules: PropTypes.array,
};

export default ErrorComponent;
