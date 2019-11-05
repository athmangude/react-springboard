/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CheckboxComponent extends Component {
  static propTypes = {
    filter: PropTypes.object,
    onCheckboxChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      checked: [],
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { onCheckboxChange, filter } = this.props;
    let { checked } = this.state;
    const { value } = e.target;
    if (checked.includes(value)) {
      checked = checked.filter((item) => item !== value);
    } else {
      checked.push(value);
    }
    this.setState({ checked }, () => onCheckboxChange({ name: filter.name, value: checked }));
  }

  render() {
    const { filter } = this.props;
    const { checked } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {
          filter.options.map((option) => (
            <div key={option} style={{ width: '100%' }}>
              <label htmlFor={filter.name}>
                <input type="checkbox" value={option} checked={checked.includes(option)} onChange={this.onChange} style={{ fontSize: 11, color: '#6d6e71', textTransform: 'capitalize', marginRight: 10 }} />
                {option}
              </label>
            </div>
          ))
        }
      </div>
    );
  }
}
