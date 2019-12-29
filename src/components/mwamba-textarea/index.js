// MwambaInput.js
import React from 'react';
import PropTypes from 'prop-types';
import { withFormsy } from 'formsy-react';

import './index.scss';

class MwambaInput extends React.Component {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    getErrorMessage: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    style: PropTypes.object,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    // Important: Don't skip this step. This pattern is required
    // for Formsy to work.
    this.props.setValue(event.currentTarget.value);
    this.props.onChange(event);
  }

  render() {
    // An error message is returned only if the component is invalid
    const errorMessage = this.props.getErrorMessage();

    return (
      <div>
        <textarea
          className="mwamba-input"
          onChange={this.changeValue}
          type={this.props.type || 'text'}
          name={this.props.name}
          style={{ width: '100%', borderBottom: !errorMessage ? 'solid 2px #808285' : 'solid 2px #002366', fontSize: 18, outline: 'none', ...this.props.style }}
          value={this.props.getValue() || ''}
          placeholder={this.props.placeholder}
          rows="3"
        >
        </textarea>
        <span style={{ color: '#002366' }}>{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(MwambaInput);
