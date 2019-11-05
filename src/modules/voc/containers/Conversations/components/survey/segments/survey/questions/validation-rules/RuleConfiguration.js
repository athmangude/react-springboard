import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';

import RuleOption from './RuleOption';
import './RuleConfiguration.css';

class RuleConfiguration extends Component {
  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onLowerLimitChanged = this.onLowerLimitChanged.bind(this);
    this.onUpperLimitChanged = this.onUpperLimitChanged.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onRemoveRule = this.onRemoveRule.bind(this);
  }

  state = {
    menuOpen: false,
  }

  onSelect(selectedValue) {
    this.onToggleMenu();
    this.props.changeRule(selectedValue, this.props.index);
  }

  onToggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  onLowerLimitChanged(event) {
    const value = event.target.value;

    if (value === "") {
      return;
    }

    const newValue = `${value}-${this.props.rule.value.split('-')[1]}`;

    this.props.updateRule(newValue, this.props.index);
  }

  onRemoveRule() {
    this.props.removeRule(this.props.index);
  }

  onUpperLimitChanged(event) {
    const value = event.target.value;

    if (value === "") {
      return;
    }

    const newValue = `${this.props.rule.value.split('-')[0]}-${value}`;

    this.props.updateRule(newValue, this.props.index);
  }

  onValueChanged(event) {
    const value = event.target.value;
    if (value === "") {
      return;
    }

    this.props.updateRule(value, this.props.index);
  }

  handleClickOutside() {
    this.setState({ menuOpen: false });
  }

  render() {
    return (
      <div className="rule-configuration" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'solid 1px #d9d9d9', padding: '3px 10px', margin: '3px 5px', ...this.state.menuOpen ? { borderRadius: 0, zIndex: 999 } : { borderRadius: 40 } }}>
        {
          !this.state.menuOpen ? (
            <i onClick={this.onRemoveRule} className="material-icons" style={{ color: '#d9d9d9', margin: 'auto 10px auto 0' }}>close</i>
          ) : null
        }
        {
          this.props.value ? (
            <div>
              {
                this.props.value.value === 'btw' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <b onClick={this.onToggleMenu} style={{ color: '#6d6e71' }}>BETWEEN</b>
                    <input onChange={this.onLowerLimitChanged} value={parseInt(this.props.rule.value.split('-')[0])} type="number" name="fromValue" min={0} max={10} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                    <b onClick={this.onToggleMenu} style={{ color: '#6d6e71' }}>AND</b>
                    <input onChange={this.onUpperLimitChanged} value={parseInt(this.props.rule.value.split('-')[1])} type="number" name="toValue" min={0} max={10} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                  </div>
                ) : this.props.value.value === 'lt' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <b onClick={this.onToggleMenu} style={{ color: '#6d6e71' }}>LESS THAN</b>
                    <input value={parseInt(this.props.rule.value)} onChange={this.onValueChanged} type="number" name="fromValue" min={0} max={10} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                  </div>
                ) : this.props.value.value === 'gt' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <b onClick={this.onToggleMenu} style={{ color: '#6d6e71' }}>GREATER THAN</b>
                    <input value={parseInt(this.props.rule.value)} onChange={this.onValueChanged} type="number" name="fromValue" min={0} max={10} style={{ border: 'none', width: 60, height: 40, textAlign: 'center', margin: '0 5px', borderRadius: 0, padding: 3, fontSize: 11 }} />
                  </div>
                ) : null
              }
              {
                this.state.menuOpen ? (
                  <div style={{ position: 'absolute', top: 46, left: 0, boxShadow: '0 0 2px rgba(0, 0, 0,0.5)', width: '100%' }}>
                    {
                      this.props.validationRules.map((validationRule) => (
                        <RuleOption option={validationRule} onSelect={this.onSelect} key={validationRule.value} />
                      ))
                    }
                  </div>
                ) : null
              }
            </div>
          ) : null
        }
        {
          this.props.value ? (
            <i onClick={this.onToggleMenu} className="material-icons" style={{ color: '#d9d9d9', margin: 'auto 10px auto 0' }}>keyboard_arrow_down</i>
          ) : null
        }
        <div>
        </div>
      </div>
    )
  }
}

export default enhanceWithClickOutside(RuleConfiguration);
