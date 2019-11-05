/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-shadow, no-nested-ternary */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SelectedFilters from '../Filters/SelectedFilters';

export default class SelectedFiltersBar extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    onApplyFilters: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      appliedFilters: [],
    };

    this.onRemoveFromFilter = this.onRemoveFromFilter.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { appliedFilters } = newProps;
    this.setState({ appliedFilters });
  }

  onRemoveFromFilter(filter) {
    const { onApplyFilters } = this.props;
    let { appliedFilters } = this.state;
    appliedFilters = appliedFilters.filter((item) => item.name !== filter.name);
    this.setState({ appliedFilters }, () => onApplyFilters(appliedFilters));
  }

  render() {
    const { appliedFilters } = this.state;

    if (!appliedFilters.length) {
      return null;
    }

    return (
      <div className="hide-scrollbars" style={{ height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', overflowX: 'auto' }}>
        <SelectedFilters filters={appliedFilters} onRemoveFromFilter={this.onRemoveFromFilter} />
      </div>
    );
  }
}
