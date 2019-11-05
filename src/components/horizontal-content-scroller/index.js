/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from '../icon-button';

export default class HorizontalContentScroller extends Component {
  static propTypes = {
    children: PropTypes.object,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.scroller = React.createRef();

    this.state = {
      hasOverFlow: false,
      left: 0,
      right: 0,
      lastX: 0,
      maxWidth: 0,
      showLeftButton: false,
      showRightButton: false,
    };

    this.onScrollLeft = this.onScrollLeft.bind(this);
    this.onScrollRight = this.onScrollRight.bind(this);
    this.checkForOverFlow = this.checkForOverFlow.bind(this);
    this.onHandleScroll = this.onHandleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkForOverFlow);

    const maxWidth = this.scroller.current.scrollWidth - this.scroller.current.offsetWidth;

    this.setState({
      right: this.scroller.current.offsetWidth,
      showRightButton: this.scroller.current.offsetWidth < this.scroller.current.scrollWidth,
      maxWidth: maxWidth !== 0 ? maxWidth : this.scroller.current.scrollWidth,
    });

    this.checkForOverFlow();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkForOverFlow);
  }

  onHandleScroll() {
    const { lastX, maxWidth } = this.state;
    const currentX = this.scroller.current.scrollLeft;

    if (currentX > lastX) {
      if (this.scroller.current.scrollLeft === maxWidth) {
        this.setState({ showRightButton: false });
      } else {
        this.setState({ showLeftButton: true, showRightButton: true });
      }
    } else if (currentX === lastX) {
      this.setState({ showLeftButton: false });
    }

    this.setState({ lastX: this.scroller.current.scrollLeft });
  }

  onScrollLeft() {
    if (this.scroller) {
      let { left, right, showLeftButton, showRightButton } = this.state;

      right = left;

      left -= this.scroller.current.offsetWidth;

      if (left < 0) {
        left = 0;
        this.scroller.current.scrollLeft = 0;
        showRightButton = true;
        showLeftButton = false;
      } else {
        this.scroller.current.scrollLeft -= this.scroller.current.offsetWidth;
        showRightButton = true;
        showLeftButton = true;
      }

      this.setState({ left, right, showLeftButton, showRightButton });
    }
  }

  onScrollRight() {
    if (this.scroller) {
      let { left, right, showLeftButton, showRightButton } = this.state;

      left = right;

      right += this.scroller.current.offsetWidth;

      if (right > this.scroller.current.scrollWidth) {
        right = this.scroller.current.scrollWidth;
        this.scroller.current.scrollLeft = this.scroller.current.scrollWidth;
        showLeftButton = true;
        showRightButton = false;
      } else {
        this.scroller.current.scrollLeft += this.scroller.current.offsetWidth;
        showLeftButton = true;
        showRightButton = true;
      }

      this.setState({ left, right, showLeftButton, showRightButton });
    }
  }

  checkForOverFlow() {
    if (this.scroller && (this.scroller.current.offsetWidth < this.scroller.current.scrollWidth)) {
      this.setState({ hasOverFlow: true });
    } else {
      this.setState({ hasOverFlow: false });
    }
  }

  render() {
    const { hasOverFlow, showLeftButton, showRightButton } = this.state;
    const { children, style } = this.props;

    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 0, position: 'relative', ...style }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {
            (hasOverFlow && showLeftButton) ? (<IconButton icon="keyboard_arrow_left" onClick={this.onScrollLeft} style={{ margin: 0, background: '#fff', boxShadow: 'rgba(67, 70, 86, 0.1) 5px 0px 5px 3px', height: 72, width: 36, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 36, borderBottomRightRadius: 36, position: 'absolute' }} />) : null
          }
          {
            (hasOverFlow && showRightButton) ? (<IconButton icon="keyboard_arrow_right" onClick={this.onScrollRight} style={{ margin: 0, background: '#fff', boxShadow: 'rgba(67, 70, 86, 0.1) 0px 0px 5px 3px', height: 72, width: 36, borderTopLeftRadius: 36, borderBottomLeftRadius: 36, borderTopRightRadius: 0, borderBottomRightRadius: 0, position: 'absolute', right: 0 }} />) : null
          }
        </div>

        <div ref={this.scroller} onScroll={this.onHandleScroll} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', overflowX: 'auto', scrollBehavior: 'smooth', height: 100, padding: '1px 0px 1px 3px' }} className="segments-scrollable-view hide-scrollbars">
          {children}
        </div>
      </div>
    );
  }
}
