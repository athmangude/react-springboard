/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import ActionButton from '../action-button';

class CheckedMultiSelectTwo extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array,
    icon: PropTypes.string,
    listText: PropTypes.string,
    actionText: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { options } = props;

    this.state = {
      menuOpen: false,
      options,
    };

    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  onChange(option, event) {
    const { onChange } = this.props;
    const { options } = this.state;

    const columnIndex = options.findIndex((item) => item.name === option.name);

    if (columnIndex !== -1) {
      options[columnIndex] = { ...options[columnIndex], show: event.target.checked };

      this.setState({ options });

      onChange(options);
    }
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { menuOpen, options } = this.state;
    const { icon, actionText, listText } = this.props;

    return (
      <div style={{ position: 'relative', minwidth: 150, height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
        {
          menuOpen ? (
            <div style={{ border: 'solid 1px #d9d9d9', borderBottom: '1px solid #d9d9d9', position: 'absolute', top: 10, right: 0, zIndex: 99, backgroundColor: '#fff', padding: 0, maxHeight: 300, overflowX: 'auto', minWidth: 40 }}>
              <div style={{ margin: '10px 5px' }}><span style={{ fontWeight: 'bold' }}>{listText}</span></div>
              {
                options.map((option) => (
                  <div style={{ margin: '1px 5px' }}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={option.show}
                          onChange={(e) => this.onChange(option, e)}
                          value={option.name}
                          style={{ color: '#888888', textTransform: 'capitalize' }}
                        />
                      )}
                      label={option.name}
                    />
                  </div>
                ))
              }
            </div>
          ) : (
            <ActionButton icon={icon} text={actionText} onClick={this.onToggleMenu} style={{ border: 'solid 1px #e2e4eb', margin: '10px 0px 3px' }} />
          )
        }
      </div>
    );
  }
}

export default enhanceWithClickOutside(CheckedMultiSelectTwo);
