/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import d3Cloud from 'd3-cloud';
import PropTypes from 'prop-types';

import Text from './Text';
import './index.css';

const getFontSize = (value, max, min, fontSizes) => {
  const multiplier = (max - min) / (fontSizes.length - 1);
  const index = Math.floor(value / multiplier) >= fontSizes.length ? fontSizes.length - 1 : Math.floor(value / multiplier);
  return fontSizes[index];
};

export default class WordCloud extends Component {
  static propTypes = {
    fontSizes: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.object,
    colors: PropTypes.array,
  }

  constructor(props) {
    super(props);

    const { fontSizes = [14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82], colors = ['#a0a0a0'] } = this.props;

    this.state = {
      delay: 5000,
      current: null,
      cloudDimensions: [],
      fontSizes,
      colors,
    };

    this.clearBlink = this.clearBlink.bind(this);
    this.addBlink = this.addBlink.bind(this);
    this.blinkWord = this.blinkWord.bind(this);
  }

  componentDidMount() {
    const { width, height, data } = this.props;
    const { fontSizes, delay } = this.state;
    const values = Object.values(data).sort((a, b) => a - b);
    const keys = Object.keys(data);
    d3Cloud()
      .size([width, height])
      .words(keys.map((key) => ({ text: key, key, value: data[key], size: getFontSize(data[key], values[values.length - 1], values[0], fontSizes) })))
      .padding(8)
      .rotate(0)
      .font('Roboto,sans-serif')
      .fontSize((d) => d.size)
      .on('end', (cloudDimensions) => this.setState({ cloudDimensions, keys, current: null }))
      .start();

    // this.timer = setInterval(this.blinkWord, delay);
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }

  clearBlink(o) {
    const ca = o.getAttribute('class').split(' ');
    const i = ca.indexOf('blink');

    if (i !== -1) {
      ca.splice(i, 1);
      o.setAttribute('class', ca.join(' '));
    }
  }

  addBlink(o) {
    const ca = o.getAttribute('class').split(' ');
    ca.push('blink');
    o.setAttribute('class', ca.join(' '));
  }

  blinkWord() {
    const { current, keys } = this.state;
    let elem = this.svg.querySelector(`#${current}`);

    if (current !== null) {
      this.clearBlink(elem);
    }

    const nextIndex = Math.floor(Math.random() * keys.length);
    const next = keys[nextIndex];
    elem = this.svg.querySelector(`#${next}`);
    this.setState({ current: next }, () => this.addBlink(elem));
  }

  render() {
    const { width, height } = this.props;
    const { cloudDimensions, colors } = this.state;
    return (
      <div style={{ textAlign: 'left', backgroundColor: '#ffffff', color: '#ffffff', position: 'relative' }}>
        <svg width={width} height={height} ref={(c) => { this.svg = c; }}>
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {
              cloudDimensions.map((item, index) => (
                <Text key={item.key} item={item} fill={colors[index % colors.length]} />
              ))
            }
          </g>
        </svg>
      </div>
    );
  }
}
