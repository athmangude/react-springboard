/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import Spinner from 'react-spinner-material';

import ActionButton from 'SharedComponents/action-button';

class MpesaStatTypes extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    mpesaStatTypes: PropTypes.array,
    isLoading: PropTypes.bool,
    defaultStatType: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const { defaultStatType } = props;
    this.state = {
      menuOpen: false,
      selected: defaultStatType,
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onChange(selected) {
    const { onChange } = this.props;
    this.setState({ selected, menuOpen: false });
    onChange(selected);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { mpesaStatTypes, isLoading } = this.props;

    if (isLoading) {
      return (
        <div style={{ position: 'relative', margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Spinner spinnerColor="#002366" size={20} spinnerWidth={3} />
        </div>
      );
    }

    const { selected, menuOpen } = this.state;
    const currentOption = mpesaStatTypes.find((option) => option.value === selected) || {};

    return (
      <div style={{ position: 'relative', margin: '2px 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        <ActionButton icon="settings_input_antenna" text={currentOption.text} onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb', textTransform: 'capitalize' }} />
        {
          menuOpen ? (
            <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: 0, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto' }}>
              {
                mpesaStatTypes.map((option) => (
                  <ActionButton key={option.key} text={option.text} onClick={() => this.onChange(option.key)} style={{ justifyContent: 'flex-start', borderRadius: 0, margin: 0, width: '100%', textTransform: 'capitalize' }} />
                ))
              }
            </div>
          ) : null
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(MpesaStatTypes);
