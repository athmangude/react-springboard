/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import ActionButton from 'SharedComponents/action-button-styled';

export default class CheckboxComponent extends Component {
  static propTypes = {
    filter: PropTypes.object,
    onCheckboxChange: PropTypes.func,
    selectedFilters: PropTypes.object,
    onClearFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      checked: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  componentDidMount() {
    this.loadSelectedFilters(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedFilters } = this.props;

    if (nextProps.selectedFilters !== selectedFilters) {
      this.loadSelectedFilters(nextProps);
    }
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

  onClear(name) {
    const { onClearFilter } = this.props;

    onClearFilter(name);
  }

  loadSelectedFilters(props) {
    const { onCheckboxChange, selectedFilters, filter } = props;
    const { checked } = this.state;

    const filters = selectedFilters.find((selectedFilter) => selectedFilter.filterType === 'SELECT' && selectedFilter.name === filter.name);

    if (filters) {
      filters.options.map((option) => {
        checked.push(option);
      });

      this.setState({ checked }, () => onCheckboxChange({ name: filter.name, value: checked }));
    } else {
      this.setState({ checked: [] });
    }
  }

  render() {
    const { filter } = this.props;
    const { checked } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {
          filter.options.map((option) => (
            <FormControlLabel
              control={(
                <Checkbox
                  disableTouchRipple
                  checked={checked.includes(option)}
                  onChange={this.onChange}
                  value={option}
                  style={{ color: '#888888', textTransform: 'capitalize' }}
                />
              )}
              label={option}
            />
          ))
        }
        {
          (checked.length) ? (
            <ActionButton text="Clear" icon="clear" loading={false} disabled={false} onClick={() => this.onClear(filter.name)} style={{ margin: 5 }} />
          ) : null
        }
      </div>
    );
  }
}
