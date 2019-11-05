/* eslint-disable jsx-a11y/href-no-hash, jsx-a11y/interactive-supports-focus, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';

import Theme from './Theme';
import ActionButton from 'SharedComponents/action-button-styled';

class Themes extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    themes: PropTypes.array,
    colors: PropTypes.array,
    alertActions: PropTypes.object,
    selectedThemes: PropTypes.array,
  }

  constructor(props) {
    super(props);

    const { selectedThemes } = props;
    this.state = {
      menuOpen: false,
      selectedThemes,
    };
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onAddTheme = this.onAddTheme.bind(this);
    this.onRemoveTheme = this.onRemoveTheme.bind(this);
  }

  onAddTheme(selectedTheme) {
    const { selectedThemes } = this.state;
    const { alertActions, onChange } = this.props;
    if (selectedThemes.length >= 10) {
      alertActions.addAlert({ type: 'error', message: 'You cannot add more than 10 themes' });
      return;
    }
    selectedThemes.push(selectedTheme);
    this.setState({ selectedThemes });
    onChange(selectedThemes);
    this.onToggleMenu();
  }

  onRemoveTheme(selectedTheme) {
    const { onChange } = this.props;
    const { selectedThemes } = this.state;
    const newSelectedThemes = selectedThemes.filter((theme) => theme !== selectedTheme);
    this.setState({ selectedThemes: newSelectedThemes });
    onChange(newSelectedThemes);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { themes, colors } = this.props;
    const { selectedThemes, menuOpen } = this.state;
    const options = Object.keys(themes).filter((theme) => !selectedThemes.includes(theme));
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div style={{ position: 'relative', margin: '2px 5px', width: 150 }}>
          {
            !Object.keys(themes).length ? (
              <div>No themes found</div>
            ) : !options.length ? (
              <div>All themes selected</div>
            ) : !menuOpen ? (
              <ActionButton icon="add" text="Add More" onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb' }} />
            ) : (
              <div className="hide-scrollbars" style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: -10, left: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 200, overflowX: 'auto' }}>
                {
                  options.map((option) => (
                    <ActionButton key={option} text={`${option} (${themes[option]})`} onClick={() => this.onAddTheme(option)} style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%', textAlign: 'left' }} />
                  ))
                }
              </div>
            )
          }
        </div>
        <div style={{ width: 'calc(100% - 150px)', overflowX: 'auto' }} className="hide-scrollbars">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            {
              selectedThemes.map((theme, index) => (<Theme theme={theme} color={colors[index]} onClick={this.onRemoveTheme} />))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default enhanceWithClickOutside(Themes);
