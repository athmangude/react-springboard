/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

export default class Text extends Component {
  static propTypes = {
    item: PropTypes.object,
    fill: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    isMouseOver: false,
  };

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  render() {
    const { item, fill } = this.props;
    const { isMouseOver } = this.state;
    return (
      <Tooltip title={`${item.text} : ${item.value}`} placement="top">
        <text id={item.key} textAnchor="middle" transform={`translate(${item.x} , ${item.y} )`} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ fontSize: item.size, textTransform: 'capitalize', fill, fillOpacity: isMouseOver ? 1 : 0.7 }} className="">{item.text}</text>
      </Tooltip>
    );
  }
}
