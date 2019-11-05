/* eslint-disable jsx-a11y/href-no-hash */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MultiSelectTag from 'SharedComponents/multi-select-tags';
import ActionButton from 'SharedComponents/action-button-styled';

let selectedOptions = [];

export default class SelectComponent extends PureComponent {
  static propTypes = {
    filter: PropTypes.object,
    onSelectChange: PropTypes.func,
    multi: PropTypes.bool,
    onClearFilter: PropTypes.func,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  state = {
    selectedOptions: [],
  };

  componentWillMount() {
    this.getSelectedOptions(this.props);
  }

  onChange(type, value) {
    const { onSelectChange } = this.props;
    onSelectChange(type, value);
  }

  onClear(name) {
    const { onClearFilter } = this.props;

    onClearFilter(name);
  }

  getSelectedOptions(props) {
    const selectedOptionsList = props.filteredOptions.find((option) => option.name === props.filter.name);

    selectedOptions = selectedOptionsList ? selectedOptionsList.options : [];
  }

  render() {
    const { filter, style } = this.props;
    return (
      <div>
        <MultiSelectTag buttonStyle={{ borderRadius: 5 }} type={filter.name} options={filter.options} optionStyle={{ width: '100%' }} selectedOptions={selectedOptions} placeholder="Select" onChange={this.onChange} removeFilter={this.onRemove} searchable showScrollBar style={style} />
        {
          (selectedOptions.length) ? (
            <ActionButton text="Clear" icon="clear" loading={false} disabled={false} onClick={() => this.onClear(filter.name)} style={{ margin: 5 }} />
          ) : null
        }
      </div>
    );
  }
}
