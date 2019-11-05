/* eslint-disable jsx-a11y/href-no-hash, object-curly-newline, react/no-array-index-key */
import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import RuleConfiguration from './RuleConfiguration';
import AddValidationRule from './AddValidationRule';

const validationRules = [
  {
    title: 'between',
    value: 'btw',
    description: 'user should enter value between a defined range',
  },
  {
    title: 'less than',
    value: 'lt',
    description: 'user should enter value less than the defined value',
  },
  {
    title: 'greater than',
    value: 'gt',
    description: 'user should enter value greater than the defined value',
  },
];

class ValidationRules extends Component {
  constructor(props) {
    super(props);
    this.onAddValidationRule = this.onAddValidationRule.bind(this);
    this.onChangeRule = this.onChangeRule.bind(this);
    this.onUpdateRule = this.onUpdateRule.bind(this);
    this.onRemoveRule = this.onRemoveRule.bind(this);
  }

  onAddValidationRule() {
    const { updateValidationRules, rules } = this.props;
    updateValidationRules([...rules, {
      ruleType: 'btw',
      value: '0-6',
    }]);
  }

  onChangeRule(ruleType, i) {
    const { updateValidationRules, rules } = this.props;
    const newValidationRules = rules.map((rule, index) => {
      if (i === index) {
        return {
          ruleType,
          value: ruleType === 'btw' ? '0-6' : '5',
        };
      }
      return rule;
    });

    updateValidationRules(newValidationRules);
  }

  onUpdateRule(value, index) {
    const { updateValidationRules, rules } = this.props;
    const newValidationRules = rules.map((rule, i) => {
      if (i === index) {
        return {
          ...rule,
          value,
        };
      }
      return rule;
    });

    updateValidationRules(newValidationRules);
  }

  onRemoveRule(index) {
    const { updateValidationRules, rules } = this.props;
    const newValidationRules = rules.filter((rule, i) => {
      if (i === index) {
        return false;
      }
      return true;
    });

    updateValidationRules(newValidationRules);
  }

  render() {
    const { rules } = this.props;
    return (
      <div className="validation-rules" style={{ backgroundColor: '#fff', padding: 10, borderTop: 'solid 1px #d9d9d9' }}>
        <Header as="h5" content="Validation Rules" dividing />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            rules.map((rule, i) => (
              <div style={{ position: 'relative', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <RuleConfiguration validationRules={validationRules} value={validationRules.find((validationRule) => validationRule.value === rule.ruleType)} toggleMenu={this.onToggleMenu} updateRule={this.onUpdateRule} changeRule={this.onChangeRule} removeRule={this.onRemoveRule} role="button" rule={rule} index={i} key={i} />
              </div>
            ))
          }
          <AddValidationRule addValidationRule={this.onAddValidationRule} />
        </div>
      </div>
    );
  }
}

ValidationRules.propTypes = {
  updateValidationRules: PropTypes.func,
  rules: PropTypes.array,
};

export default ValidationRules;
