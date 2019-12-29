import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './SideBarLinkStyles';
import IconButton from 'SharedComponents/icon-button';

const SideBarLinkWrapper = styled.div`${styles}`;

export default class SideBarLink extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    windowDimensions: PropTypes.object,
    open: PropTypes.bool,
  }

  static propTypes = {
    link: PropTypes.object.isRequired,
    windowDimensions: PropTypes.object.isRequired,
    open: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onToggleExpanded = this.onToggleExpanded.bind(this);
  }

  state = {
    isExpanded: false,
  }

  onToggleExpanded(path) {
    this.setState({ isExpanded: !this.state.isExpanded });

    this.context.router.history.push(path);
  }

  render() {
    let active = false;

    if (this.props.link.path !== '/' && this.context.router.route.match.path !== '/') {
      active = this.context.router.route.match.path.indexOf(this.props.link.path) > -1;
    } else if (this.props.link.path === '/' && this.context.router.route.match.path !== '/') {
      active = false;
    } else if (this.props.link.path === '/' && this.context.router.route.match.path === '/') {
      active = true;
    }

    return (
      <SideBarLinkWrapper windowDimensions={this.props.windowDimensions} open={this.props.open}>
        <div className="sidebar-actions">
          <button className={classNames('action', { active })} onClick={() => this.onToggleExpanded(this.props.link.path)}>
            <div className="link-text">
              <span>{this.props.link.label}</span>
              {
                Object.keys(this.props.link).includes('sublinks') && this.props.link.sublinks.length ? (
                  <IconButton className="action-toggle" icon={!this.state.isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} style={{ margin: 0, padding: 0 }} />
                ) : null
              }
            </div>
          </button>
          {
            Object.keys(this.props.link).includes('sublinks') && this.props.link.sublinks.length && this.state.isExpanded && (this.props.open || this.props.windowDimensions.width > 1440) ? (
              <div className="sublinks">
                {
                  this.props.link.sublinks.map((sublink, i) => (
                    <Link to={sublink.path} className={classNames('link', { active: this.context.router.route.match.path.indexOf(sublink.path) > -1 })} key={`${sublink.path}${sublink.label}${i}`}>
                      <span>{sublink.label}</span>
                    </Link>
                  ))
                }
              </div>
            ) : null
          }
        </div>
      </SideBarLinkWrapper>
    );
  }
}
