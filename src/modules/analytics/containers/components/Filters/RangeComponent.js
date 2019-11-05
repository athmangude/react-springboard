/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ActionButton from 'SharedComponents/action-button-styled';

export default class RangeComponent extends PureComponent {
  static propTypes = {
    filter: PropTypes.object,
    selectedFilters: PropTypes.object,
    onRangeChange: PropTypes.func,
    onClearFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      range: {
        min: props.filter.minValue,
        max: props.filter.maxValue,
      },
    };
    this.onChange = this.onChange.bind(this);
    this.onLowerLimitChanged = this.onLowerLimitChanged.bind(this);
    this.onUpperLimitChanged = this.onUpperLimitChanged.bind(this);
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

  onChange(name, value) {
    const { onRangeChange } = this.props;
    this.setState({ range: value }, () => onRangeChange(name, value));
  }

  onLowerLimitChanged(event, name) {
    const { onRangeChange } = this.props;
    const { range } = this.state;
    const { value } = event.target;
    range.min = value;

    this.setState({ ...range }, () => onRangeChange(name, range));
  }

  onUpperLimitChanged(event, name) {
    const { onRangeChange } = this.props;
    const { range } = this.state;
    const { value } = event.target;
    range.max = value;

    this.setState({ ...range }, () => onRangeChange(name, range));
  }

  onClear(name) {
    const { onClearFilter } = this.props;
    onClearFilter(name);
  }

  loadSelectedFilters(props) {
    const { onRangeChange, selectedFilters, filter } = props;

    const filters = selectedFilters.find((selectedFilter) => selectedFilter.filterType === 'RANGE' && selectedFilter.name === filter.name);

    if (filters) {
      const range = { min: filters.minValue, max: filters.maxValue };
      this.setState({ range }, () => onRangeChange(filter.name, range));
    } else {
      this.setState({ range: { min: filter.minValue, max: filter.maxValue } });
    }
  }

  render() {
    const { filter, selectedFilters } = this.props;
    const { range } = this.state;

    return (
      <div>
        <div style={{ position: 'relative', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10 }}>
          <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgb(217, 217, 217)', padding: '3px 10px', margin: '3px 5px', borderRadius: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
              <b style={{ color: '#6d6e71' }}>BETWEEN</b>
              <input onChange={(e) => this.onLowerLimitChanged(e, filter.name)} value={parseInt(range.min, 10)} type="number" name="fromValue" min={parseInt(filter.minValue, 10)} max={parseInt(filter.maxValue, 10)} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
              <b style={{ color: '#6d6e71' }}>AND</b>
              <input onChange={(e) => this.onUpperLimitChanged(e, filter.name)} value={parseInt(range.max, 10)} type="number" name="toValue" min={parseInt(filter.minValue, 10)} max={parseInt(filter.maxValue, 10)} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
            </div>
          </div>
        </div>
        {
          (selectedFilters.find((selectedFilter) => selectedFilter.name === filter.name)) ? (
            <ActionButton text="Clear" icon="clear" loading={false} disabled={false} onClick={() => this.onClear(filter.name)} style={{ margin: 5 }} />
          ) : null
        }
      </div>
    );
  }
}
