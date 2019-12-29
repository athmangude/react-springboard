import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
  }

  state = {
    isChecked: false,
  }

  toggleCheckboxChange() {
    const { onChange, value } = this.props;
    this.setState(({ isChecked }) => ({ isChecked: !isChecked }));
    onChange(value);
  }

  render() {
    const { label, value } = this.props;
    const { isChecked } = this.state;

    return (
      <div>
        <label htmlFor="checkbox">
          <input
            type="checkbox"
            value={value}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />
          {label ? (<span style={{ textTransform: 'capitalize' }}>{value}</span>) : null}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
