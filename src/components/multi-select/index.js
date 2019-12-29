/* eslint-disable jsx-a11y/interactive-supports-focus */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import './index.scss';

class MultiSelect extends Component {
  static propTypes = {
    styles: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSelectToggled = this.onSelectToggled.bind(this);
  }

  state = {
    isOpen: false,
  }

  onToggleMenu(event) {
    event.stopPropagation();

    this.setState({ isOpen: !this.state.isOpen });
  }

  onMenuClicked(event) {
    event.stopPropagation();
  }

  onSelectToggled(property, value) {
    this.props.onChange(property, value);
  }

  handleClickOutside() {
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <div className="mwamba-multi-select" style={{ margin: '0 10px', position: 'relative', ...this.props.styles }}>
        <div
          role="button"
          onClick={this.onToggleMenu}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '3px 5px',
          }}
        >
          <span>{this.props.title}</span>
        </div>
        {
          this.state.isOpen ? (
            <div
              role="button"
              className="menu"
              onClick={this.onMenuClicked}
              style={{
                display: 'flex', flexDirection: 'column', width: 120, position: 'absolute', top: 0, right: 0, backgroundColor: '#fff', boxShadow: '0 3px 3px rgba(0, 0, 0, 0.1)', borderRadius: 3, zIndex: 1, padding: '10px 0',
              }}
            >
              {
                this.props.options.map((option) => (
                  <div
                    role="button"
                    onClick={() => this.onSelectToggled(option.label, !option.selected)}
                    className="option"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '6px 6px',
                    }}
                  >
                    {
                      !option.selected ? (
                        <div
                          style={{
                            height: 20, width: 20, border: 'solid 2px #6d6e71', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <i className="material-icons" style={{ color: 'transparent' }}>check</i>
                        </div>
                      ) : (
                        <div
                          style={{
                            height: 20, width: 20, backgroundColor: '#487db3', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2,
                          }}
                        >
                          <i className="material-icons" style={{ }}>check</i>
                        </div>
                      )
                    }
                    <div style={{ width: 'calc(100% - 20)', marginLeft: 10 }}>
                      <span style={{ color: '#6d6e71', textTransform: 'Capitalize' }}>{option.label}</span>
                    </div>
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

export default enhanceWithClickOutside(MultiSelect);
