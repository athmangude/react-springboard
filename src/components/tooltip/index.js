import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

import TooltipStyles from './TooltipStyles';

const TooltipWrapper = Styled.div`${TooltipStyles}`;

export default class Tooltip extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.onShowToolTip = this.onShowToolTip.bind(this);
    this.onHideToolTip = this.onHideToolTip.bind(this);
  }

  state = {
    onShowToolTip: true,
  }

  onShowToolTip() {
    // this.setState({ onShowToolTip: true });
  }

  onHideToolTip() {
    // this.setState({ onShowToolTip: false });
  }

  render() {
    const { children, position, message } = this.props;
    return (
      <TooltipWrapper {...this.props} onMouseOver={this.onShowToolTip} onFocus={this.onShowToolTip} onMouseLeave={this.onHideToolTip} onBlur={this.onHideToolTip}>
        {children}
        {
          this.state.onShowToolTip && (
            <div className={`tooltip-bubble tooltip-${position}`}>
              <div className="tooltip-message">{message}</div>
            </div>
          )
        }
      </TooltipWrapper>
    );
  }
}
