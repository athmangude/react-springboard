/* eslint-disable radix, no-extra-boolean-cast, no-nested-ternary, no-param-reassign, react/destructuring-assignment */

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import ContainerDimensions from "react-container-dimensions";


import withAuthentication from "Utils/withAuthentication";
import SimpleLayoutExtended from "Layouts/simple-layout-extended";

class HomeFeed extends PureComponent {

  static whyDidYouRender = false;

  state = {};

  render() {
    return (
      <SimpleLayoutExtended>
      </SimpleLayoutExtended>
    );
  }
}

export default withAuthentication(HomeFeed);
