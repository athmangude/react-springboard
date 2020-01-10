/* eslint-disable jsx-a11y/interactive-supports-focus */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import Pluralize from 'pluralize';

import DimensionOption from './DimensionOption';

class NPSSelect extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    menu: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  state = {
    menuOpen: false,
    selectedOption: null,
  }

  onSelect(selectedOption) {
    this.onToggleMenu();
    this.setState({ selectedOption });

    if (selectedOption !== this.state.selectedOption) {
      this.props.onChange(this.props.menu, selectedOption);
    }
  }

  onToggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    return (
      <div style={{ position: 'relative', margin: '2px 5px', width: 120 }}>
        {
          !this.state.menuOpen ? (
            <div
              role="button"
              onClick={this.onToggleMenu}
              style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', borderRadius: 10, padding: '0px 5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
            >
              <span style={{ fontSize: 11, textTransform: 'capitalize', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: 'calc(100% - 20px)', overflow: 'hidden' }}>{this.state.selectedOption ? `${this.state.selectedOption}` : `All ${Pluralize.plural(this.props.menu)}`}</span>
              <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 20 }}>keyboard_arrow_down</i>
            </div>
          ) : (
            <div className="dimensions-dropdown" style={{ border: 'solid 1px #d9d9d9', borderBottom: '2px solid #d9d9d9', position: 'absolute', top: -5, left: 0, zIndex: 99, backgroundColor: '#fff', width: 120, padding: '10px 0px 5px 0', maxHeight: 300, overflowX: 'auto' }}>
              <div style={{ padding: '3px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, textTransform: 'capitalize' }}>{this.state.selectedOption ? `${this.state.selectedOption}` : `All ${Pluralize.plural(this.props.menu)}`}</span>
                <i className="material-icons" style={{ color: '#d9d9d9', fontSize: 20 }}>keyboard_arrow_down</i>
              </div>
              <DimensionOption selectedOption={this.state.selectedOption} onSelect={this.onSelect} key={`All ${Pluralize.plural(this.props.menu)}`} option={`All ${Pluralize.plural(this.props.menu)}`} value={null} />
              {
                this.props.options.map((option) => (
                  <DimensionOption selectedOption={this.state.selectedOption} onSelect={this.onSelect} key={option} option={option} value={option} />
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(NPSSelect);
