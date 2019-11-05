import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DateRangePicker from 'SharedComponents/mwamba-date-range-picker';

export default class Actions extends Component {
  static propTypes = {
    loading: PropTypes.bool,
  };

  state = {};

  render() {
    const { loading } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <DateRangePicker loading={loading} />
      </div>
    );
  }
}
