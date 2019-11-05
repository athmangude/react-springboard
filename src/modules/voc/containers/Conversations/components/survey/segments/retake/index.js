import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-ios-switch';
import { Dropdown, Input } from 'formsy-semantic-ui-react';
import './retake.css';

export default class RetakeSegment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onRetakableChanged: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onIntervalChanged = this.onIntervalChanged.bind(this);
    this.onUnitsChanged = this.onUnitsChanged.bind(this);
    this.determineIntervalUnits = this.determineIntervalUnits.bind(this);
  }

  state = {
    intervalUnits: 'hours',
    interval: 0,
  }

  componentDidMount() {
    this.determineIntervalUnits(this.props.form.retakeInterval);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.form.retakeInterval !== this.props.form.retakeInterval) {
      this.determineIntervalUnits(nextProps.form.retakeInterval);
    }
  }

  onUnitsChanged(event, { value }) {
    this.setState({ intervalUnits: value }, () => {
      let retakeInterval;
      if (this.state.intervalUnits === 'days') {
        retakeInterval = this.state.interval * 24 * 60 * 60 * 1000;
      } else if (this.state.intervalUnits === 'hours') {
        retakeInterval = this.state.interval * 60 * 60 * 1000;
      } else {
        retakeInterval = this.state.interval * 60 * 1000;
      }

      this.props.onChange(event, { name: 'retakeInterval', value: retakeInterval });
    });
  }

  onIntervalChanged(event, { value }) {
    this.setState({ intervalUnits: value }, () => {
      let retakeInterval;
      if (this.state.intervalUnits === 'days') {
        retakeInterval = value * 24 * 60 * 60 * 1000;
      } else if (this.state.intervalUnits === 'hours') {
        retakeInterval = value * 60 * 60 * 1000;
      } else {
        retakeInterval = value * 60 * 1000;
      }

      this.props.onChange(event, { name: 'retakeInterval', value: retakeInterval });
    });
  }

  determineIntervalUnits(intervalMs) {
    let intervalUnits = 'days';
    let interval = 0;
    if (intervalMs > (1000 * 60 * 60 * 24) && (intervalMs % (1000 * 60 * 60 * 24) === 0)) {
      intervalUnits = 'days';
      interval = intervalMs / (1000 * 60 * 60 * 24);
    } else if (intervalMs > (1000 * 60 * 60) && (intervalMs % (1000 * 60 * 60) === 0)) {
      intervalUnits = 'hours';
      interval = intervalMs / (1000 * 60 * 60);
    } else {
      intervalUnits = 'minutes';
      interval = intervalMs / (1000 * 60);
    }

    this.setState({ intervalUnits, interval });
  }

  render() {
    return (
      <div className="retake-segment" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative', margin: '10px 0' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Switch
            checked={this.props.form.retakable}
            className={undefined}
            disabled={undefined}
            handleColor="white"
            name="retakable"
            offColor="white"
            onChange={this.props.onRetakableChanged}
            onColor="rgb(76, 217, 100)"
            pendingOffColor={undefined}
            pendingOnColor={undefined}
            readOnly={undefined}
            style={undefined}
          />
          {
            this.props.form.retakable ? (
              <span style={{ margin: 10 }}>This survey is retakable</span>
            ) : (
              <span style={{ margin: 10 }}>This survey is not retakable</span>
            )
          }
        </div>
        {
          this.props.form.retakable ? (
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100% - 50px)', position: 'relative', margin: '10px 0', border: 'solid 1px #d9d9d9' }}>
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
                <Input
                  name="retakeLimit"
                  label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px', minWidth: 160 }}><span>Retake Limit</span></div>)}
                  placeholder="maximum number of times survey can be retaken"
                  validations={{ isExisty: true, isNumeric: true }}
                  required
                  value={this.props.form.retakeLimit.toString()}
                  onChange={this.props.onChange}
                  validationErrors={{ isExisty: 'retake limit is required', isNumeric: 'retake limit must be a number' }}
                  style={{ width: '100%', position: 'relative', border: 'none', outline: 'none', height: 50 }}
                />
              </div>
              <div className="retake-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
                <Input
                  name="retakeInterval"
                  label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px', minWidth: 160 }}><span>Retake Interval</span></div>)}
                  placeholder="interval between retakes"
                  validations={{ isNumeric: true }}
                  value={this.state.interval.toString()}
                  onChange={this.onIntervalChanged}
                  validationErrors={{ isExisty: 'retake interval is required', isNumeric: 'retake interval must be a number' }}
                  style={{ width: 'calc(100% - 20px) !important', position: 'relative', border: 'none', outline: 'none', height: 50, flexGrow: 3 }}
                />
                <Dropdown
                  name="intervalUnits"
                  validations={{ isExisty: true }}
                  validationErrors={{ minLength: 'units is Required', isExisty: 'units is required' }}
                  onChange={this.onUnitsChanged}
                  value={this.state.intervalUnits.toString()}
                  options={[{ key: 'days', value: 'days', text: 'days' }, { key: 'hours', value: 'hours', text: 'hours' }, { key: 'minutes', value: 'minutes', text: 'minutes' }]}
                  search
                  placeholder="Select units"
                  selection
                  className="units-dropdown"
                  style={{ height: 50, borderRadius: 0, margin: '0 !important', width: '20px !important', flexGrow: 1 }}
                  icon={(
                    <i style={{ float: 'right', position: 'absolute', top: 10, right: 7, color: '#808285' }} className="material-icons">keyboard_arrow_down</i>
                  )}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}
