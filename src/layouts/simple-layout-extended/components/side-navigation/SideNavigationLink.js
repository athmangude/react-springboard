import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styled from 'styled-components';
import { withRouter } from 'react-router';

import IconButton from 'SharedComponents/icon-button';

import styles from './SideNavigationLink.css';

const SideNavigationLinkWrapper = styled.div`${styles}`;

class SideNavigationLink extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    sideBarLink: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props);

    this.state = {
      isExpanded: !!props.sideBarLink.paths.find((path) => (context.router.route.match.path.substring(1).includes(path.substring(1)) && path.substring(1).length) || (path === '/' && context.router.route.match.path === '/')),
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
  }

  onToggleMenu() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    console.log('[props]', this.props);
    const { isExpanded } = this.state;
    const { authentication, sideBarLink, history } = this.props;

    return (
      <SideNavigationLinkWrapper>
        {
          'sublinks' in sideBarLink ? (
            <div
              to={sideBarLink.paths[0]}
              onClick={() => !isExpanded ? this.onToggleMenu() : history.push(sideBarLink.paths[0])}
              className={classNames('side-navigation-link', 'wide', { active: !!this.props.sideBarLink.paths.find((path) => (this.context.router.route.match.path.substring(1).includes(path.substring(1)) && path.substring(1).length) || (path === '/' && this.context.router.route.match.path === '/')) })}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="material-icons" onClick={(event) => { event.stopPropagation(); this.onToggleMenu() }} style={{ fontSize: 20, margin: '0 10px' }}>{this.props.sideBarLink.icon}</i>
                <span>{this.props.sideBarLink.label}</span>
              </div>
              {
                Object.keys(this.props.sideBarLink).includes('sublinks') ? (
                  <IconButton
                    icon={this.state.isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    onClick={this.onToggleMenu}
                    style={{
                      zIndex: 2, alignSelf: 'center', margin: 0, padding: 0,
                    }}
                  />
                ) : null
              }
            </div>
          ) : (
            <Link
              to = {sideBarLink.paths[0]}
              onClick={this.onToggleMenu}
              className={classNames('side-navigation-link', 'wide', { active: !!this.props.sideBarLink.paths.find((path) => (this.context.router.route.match.path.substring(1).includes(path.substring(1)) && path.substring(1).length) || (path === '/' && this.context.router.route.match.path === '/')) })}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="material-icons" style={{ fontSize: 20, margin: '0 10px' }}>{this.props.sideBarLink.icon}</i>
                <span>{this.props.sideBarLink.label}</span>
              </div>
              {
                Object.keys(this.props.sideBarLink).includes('sublinks') ? (
                  <IconButton
                    icon={this.state.isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    onClick={this.onToggleMenu}
                    style={{
                      zIndex: 2, alignSelf: 'center', margin: 0, padding: 0,
                    }}
                  />
                ) : null
              }
            </Link>
          )
        }
        {
          Object.keys(this.props.sideBarLink).includes('sublinks') && this.state.isExpanded ? (
            <div>
              {
                this.props.sideBarLink.sublinks.map((sublink) => {
                  return (
                    <Link
                      to={sublink.path}
                      className={classNames(['side-navigation-link', 'sublink'], { active: ((this.context.router.route.match.path.substring(1).includes(sublink.path.substring(1)) && sublink.path.substring(1).length) || (sublink.path === '/' && this.context.router.route.match.path === '/')) })}
                      style={{
                        color: '#000000de', padding: '10px 10px 10px 40px', width: '100%', display: 'flex', height: 48, alignItems: 'center', justifyContent: 'flex-start',
                      }}
                    >
                      <span>{sublink.label}</span>
                    </Link>
                  )
                } 
              )
              }
            </div>
          ) : null
        }
      </SideNavigationLinkWrapper>
    );
  }
}

export default withRouter(SideNavigationLink)
