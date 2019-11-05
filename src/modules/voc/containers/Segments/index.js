import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withAuthentication from 'Utils/withAuthentication';
import SimpleLayout from 'Layouts/simple-layout-extended';

@connect((state) => ({
  authentication: state.authentication,
}), (dispatch) => ({
  dispatch,
}))
class Segments extends Component {
  static propTypes = {
    authentication: PropTypes.object.isRequired,
  }
  render() {
    return (
      <SimpleLayout authentication={this.props.authentication}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <h1>Hello segments</h1>
        </div>
      </SimpleLayout>
    );
  }
}

export default withAuthentication(Segments);
