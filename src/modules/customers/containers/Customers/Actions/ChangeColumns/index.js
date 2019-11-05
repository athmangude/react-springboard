/* eslint-disable jsx-a11y/href-no-hash */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import IconButton from 'SharedComponents/icon-button';

export default class ChangeColumns extends Component {
  static propTypes = {
    options: PropTypes.array,
    onCloseSidePanel: PropTypes.func,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const { options } = props;

    this.onChange = this.onChange.bind(this);
    this.state = {
      options,
    };
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

  render() {
    const { options, onCloseSidePanel } = this.props;

    return (
      <div style={{ width: '100%', backgroundColor: '#fff' }}>
        <div style={{ width: '100%', height: 63, zIndex: 10, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)' }}>
          <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Table Columns</h2>
          <IconButton icon="close" onClick={onCloseSidePanel} />
        </div>
        <div style={{ padding: '0 10px 0 10px' }}>
          <div style={{ margin: '20px 0 0 5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, borderBottom: '1px solid #6d6e71' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              <span style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>
                Customer Attributes
              </span>
            </div>
          </div>

          {
            options.map((option) => (
              <div style={{ margin: '1px 5px' }}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      disableTouchRipple
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
      </div>
    );
  }
}
