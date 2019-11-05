/* eslint-disable jsx-a11y/href-no-hash */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ActionButton from 'SharedComponents/action-button-styled';

export default class RadioComponent extends PureComponent {
  static propTypes = {
    filter: PropTypes.object,
    selectedFilters: PropTypes.object,
    onRadioChange: PropTypes.func,
    onClearFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.loadSelectedFilters = this.loadSelectedFilters.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  state = {
    selected: '',
  };

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
    const { onRadioChange, filter } = this.props;
    const { value } = e.target;
    this.setState({ selected: value });
    onRadioChange({ name: filter.name, value });
  }

  onClear(name) {
    const { onClearFilter } = this.props;

    onClearFilter(name);
  }

  loadSelectedFilters(props) {
    const { onRadioChange, selectedFilters, filter } = props;

    const filters = selectedFilters.find((selectedFilter) => selectedFilter.filterType === 'RADIO' && selectedFilter.name === filter.name);

    if (filters) {
      const value = filters.options;

      this.setState({ selected: value[0] });

      onRadioChange({ name: filter.name, value });
    } else {
      this.setState({ selected: null });
    }
  }

  render() {
    const { filter } = this.props;
    const { selected } = this.state;
    return (
      <div>
        <RadioGroup
          value={selected ? selected.toLowerCase() : null}
          onChange={this.onChange}
        >
          {
            filter.options.map((option) => (
              <FormControlLabel value={option ? option.toLowerCase() : null} control={<Radio disableTouchRipple style={{ color: '#888888', textTransform: 'capitalize' }} />} label={option} />
            ))
          }
        </RadioGroup>

        {
          (selected) ? (
            <ActionButton text="Clear" icon="clear" loading={false} disabled={false} onClick={() => this.onClear(filter.name)} style={{ margin: 5 }} />
          ) : null
        }
      </div>
    );
  }
}
