/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import './index.css';

class CheckedSingleSelect extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultOption: PropTypes.string,
    options: PropTypes.array,
  };

  constructor(props) {
    super(props);

    const { defaultOption } = props;
    this.state = {
      menuOpen: false,
      selected: defaultOption || 'Select Theme',
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onChange(e) {
    const { onChange } = this.props;
    const { selected } = this.state;
    const { value } = e.target;
    this.setState({ selected: value, menuOpen: false });
    onChange(selected);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { selected, menuOpen } = this.state;
    const { options } = this.props;

    return (
      <div style={{ margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        {
          menuOpen ? (
            <div style={{ position: 'relative' }}>
              <button type="button" className="checked-single-select-option" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', minWidth: 100, lineHeight: 2, fontSize: 13 }}>
                <span style={{ textTransform: 'uppercase' }}>{selected}</span>
                &nbsp;
                <i className="material-icons" style={{ fontSize: 15 }}>expand_less</i>
              </button>
              <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', bottom: 0, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', minWidth: 120, borderRadius: 2 }}>
                {
                  options.map((option) => (
                    <div key={option} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}>
                      <input type="radio" value={option} checked={selected === option} onChange={this.onChange} style={{ marginRight: 8 }} />
                      <div style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%', lineHeight: 2, fontSize: 13, textTransform: 'capitalize', color: '#6d6e71' }}>{option}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : (
            <button type="button" onClick={this.onToggleMenu} className="checked-single-select-option" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#6d6e71', lineHeight: 2, fontSize: 13, minWidth: 100 }}>
              <span style={{ textTransform: 'uppercase' }}>{selected}</span>
              &nbsp;
              <i className="material-icons" style={{ fontSize: 15 }}>expand_more</i>
            </button>
          )
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(CheckedSingleSelect);
