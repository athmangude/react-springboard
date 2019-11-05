/* eslint-disable no-shadow */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import IconButton from '../icon-button';

class MwambaListMenu extends Component {
  static propTypes = {
    style: PropTypes.object,
    id: PropTypes.number.isRequired,
    item: PropTypes.isRequired,
    actions: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.showMenu = this.showMenu.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  state = {
    showMenu: false,
    mouseEnter: null,
  }

  onMouseEnter(id) {
    this.setState({ mouseEnter: id });
  }

  onMouseLeave() {
    this.setState({ mouseEnter: null });
  }

  showMenu(id) {
    this.setState({ showMenu: id });
  }

  handleClickOutside() {
    this.setState({ showMenu: false });
  }

  render() {
    const { id, actions, item, style } = this.props;
    const { showMenu, mouseEnter } = this.state;
    return (
      <div>
        <IconButton onClick={() => this.showMenu(id)} icon="more_vert" style={{ margin: 0, padding: 6 }} />
        {
          (showMenu === id) ? (
            <div className="options hide-scroll-bar" style={{ minWidth: 150, display: 'flex', flexDirection: 'column', position: 'absolute', top: 12, right: 10, boxShadow: '0 0 3px 0px rgba(0,0,0,0.3)', backgroundColor: '#FFFFFF', paddingTop: 10, paddingBottom: 10, zIndex: 1, borderRadius: 5, ...style }}>
              {
                actions.map((action, index) => (
                  <div key={action.id} className="option" role="button" onMouseEnter={() => this.onMouseEnter(index)} onMouseLeave={this.onMouseLeave} onClick={() => action.onClick(item)} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: (mouseEnter === index) ? '#E8EAED' : '#FFFFFF', padding: '10px 10px' }}>
                    <i className="material-icons" style={{ fontSize: 16, margin: '0px 10px' }}>{action.icon}</i>
                    <span style={{ textTransform: 'capitalize' }}>{action.label}</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(MwambaListMenu);
