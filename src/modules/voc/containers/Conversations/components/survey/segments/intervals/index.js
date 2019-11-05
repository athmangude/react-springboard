import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'formsy-semantic-ui-react';
import Switch from 'react-ios-switch';
import { Dropdown } from 'formsy-semantic-ui-react';
import './intervals.css';

export default class RetakeSegment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onParticipantTimeoutValueChanged = this.onParticipantTimeoutValueChanged.bind(this);
    this.onParticipantTimeoutUnitsChanged = this.onParticipantTimeoutUnitsChanged.bind(this);
    this.onsurveyTimeoutValueChanged = this.onsurveyTimeoutValueChanged.bind(this);
    this.onSurveyTimeoutUnitsChanged = this.onSurveyTimeoutUnitsChanged.bind(this);
    this.determineParticipantTimeoutUnits = this.determineParticipantTimeoutUnits.bind(this);
    this.determineSurveyTimeoutUnits = this.determineSurveyTimeoutUnits.bind(this);
  }

  state = {
    participantTimeoutValue: 0,
    participantTimeoutUnits: 'days',
    surveyTimeoutValue: 0,
    surveyTimeoutUnits: 'days',
  }

  componentDidMount() {
    this.determineParticipantTimeoutUnits(this.props.form.participantTimeoutInterval);
    this.determineSurveyTimeoutUnits(this.props.form.surveyTimeoutInterval);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.form.retakeInterval !== this.props.form.retakeInterval) {
      this.determineParticipantTimeoutUnits(nextProps.form.participantTimeoutInterval);
      this.determineSurveyTimeoutUnits(nextProps.form.surveyTimeoutInterval);
    }
  }

  onParticipantTimeoutValueChanged(event, { value }) {
    this.setState({ participantTimeoutValue: value }, () => {
      let participantTimoutMs;
      if (this.state.participantTimeoutUnits === 'days') {
        participantTimoutMs = this.state.participantTimeoutValue * 24 * 60 * 60 * 1000;
      } else if (this.state.participantTimeoutUnits === 'hours') {
        participantTimoutMs = this.state.participantTimeoutValue * 60 * 60 * 1000;
      } else {
        participantTimoutMs = this.state.participantTimeoutValue * 60 * 1000;
      }

      this.props.onChange(event, { name: 'participantTimeoutInterval', value: participantTimoutMs });
    });
  }

  onParticipantTimeoutUnitsChanged(event, { value }) {
    this.setState({ participantTimeoutUnits: value }, () => {
      let participantTimoutMs;
      if (this.state.participantTimeoutUnits === 'days') {
        participantTimoutMs = this.state.participantTimeoutValue * 24 * 60 * 60 * 1000;
      } else if (this.state.participantTimeoutUnits === 'hours') {
        participantTimoutMs = this.state.participantTimeoutValue * 60 * 60 * 1000;
      } else {
        participantTimoutMs = this.state.participantTimeoutValue * 60 * 1000;
      }

      this.props.onChange(event, { name: 'participantTimeoutInterval', value: participantTimoutMs });
    });
  }

  onsurveyTimeoutValueChanged(event, { value }) {
    this.setState({ surveyTimeoutValue: value }, () => {
      let surveyTimoutMs;
      if (this.state.surveyTimeoutUnits === 'days') {
        surveyTimoutMs = this.state.surveyTimeoutValue * 24 * 60 * 60 * 1000;
      } else if (this.state.surveyTimeoutUnits === 'hours') {
        surveyTimoutMs = this.state.surveyTimeoutValue * 60 * 60 * 1000;
      } else {
        surveyTimoutMs = this.state.surveyTimeoutValue * 60 * 1000;
      }

      this.props.onChange(event, { name: 'surveyTimeoutInterval', value: surveyTimoutMs });
    });
  }

  onSurveyTimeoutUnitsChanged(event, { value }) {
    this.setState({ surveyTimeoutUnits: value }, () => {
      let surveyTimoutMs;
      if (this.state.surveyTimeoutUnits === 'days') {
        surveyTimoutMs = this.state.surveyTimeoutValue * 24 * 60 * 60 * 1000;
      } else if (this.state.surveyTimeoutUnits === 'hours') {
        surveyTimoutMs = this.state.surveyTimeoutValue * 60 * 60 * 1000;
      } else {
        surveyTimoutMs = this.state.surveyTimeoutValue * 60 * 1000;
      }

      this.props.onChange(event, { name: 'surveyTimeoutInterval', value: surveyTimoutMs });
    });
  }

  determineParticipantTimeoutUnits(intervalMs) {
    let participantTimeoutUnits = 'days';
    let participantTimeoutValue = 0;
    if (intervalMs > (1000 * 60 * 60 * 24) && (intervalMs % (1000 * 60 * 60 * 24) === 0)) {
      participantTimeoutUnits = 'days';
      participantTimeoutValue = intervalMs / (1000 * 60 * 60 * 24);
    } else if (intervalMs > (1000 * 60 * 60) && (intervalMs % (1000 * 60 * 60) === 0)) {
      participantTimeoutUnits = 'hours';
      participantTimeoutValue = intervalMs / (1000 * 60 * 60);
    } else {
      participantTimeoutUnits = 'minutes';
      participantTimeoutValue = intervalMs / (1000 * 60);
    }

    this.setState({ participantTimeoutUnits, participantTimeoutValue });
  }

  determineSurveyTimeoutUnits(intervalMs) {
    let surveyTimeoutUnits = 'days';
    let surveyTimeoutValue = 0;
    if (intervalMs > (1000 * 60 * 60 * 24) && (intervalMs % (1000 * 60 * 60 * 24) === 0)) {
      surveyTimeoutUnits = 'days';
      surveyTimeoutValue = intervalMs / (1000 * 60 * 60 * 24);
    } else if (intervalMs > (1000 * 60 * 60) && (intervalMs % (1000 * 60 * 60) === 0)) {
      surveyTimeoutUnits = 'hours';
      surveyTimeoutValue = intervalMs / (1000 * 60 * 60);
    } else {
      surveyTimeoutUnits = 'minutes';
      surveyTimeoutValue = intervalMs / (1000 * 60);
    }

    this.setState({ surveyTimeoutUnits, surveyTimeoutValue });
  }

  render() {
    return (
      <div className="intervals-segment" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative', margin: '10px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100% - 50px)', position: 'relative', margin: '10px 0', border: 'solid 1px #d9d9d9' }}>
          <div className="intervals-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
            <Input
              name="participantTimeoutValue"
              label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px', minWidth: 160 }}><span>Participant Timeout</span></div>)}
              placeholder="time before a participant is timedout"
              validations={{ isNumeric: true }}
              value={this.state.participantTimeoutValue.toString()}
              onChange={this.onParticipantTimeoutValueChanged}
              validationErrors={{ isExisty: 'retake interval is required', isNumeric: 'retake interval must be a number' }}
              style={{ width: 'calc(100% - 20px) !important', position: 'relative', border: 'none', outline: 'none', height: 50, flexGrow: 3 }}
            />
            <Dropdown
              name="participantTimeoutUnits"
              validations={{ isExisty: true }}
              validationErrors={{ minLength: 'units is Required', isExisty: 'units is required' }}
              onChange={this.onParticipantTimeoutUnitsChanged}
              value={this.state.participantTimeoutUnits.toString()}
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
          <div className="intervals-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, border: 'solid 1px #d9d9d9' }}>
            <Input
              name="surveyTimeoutValue"
              label={(<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#f3f3f3', border: 'none', borderRight: 'solid 2px #d9d9d9', color: '#6d6e71', fontWeight: 'bold', padding: '0 15px', minWidth: 160 }}><span>Survey Timeout</span></div>)}
              placeholder="time before a survey is timedout"
              validations={{ isNumeric: true }}
              value={this.state.surveyTimeoutValue.toString()}
              onChange={this.onsurveyTimeoutValueChanged}
              validationErrors={{ isExisty: 'retake interval is required', isNumeric: 'retake interval must be a number' }}
              style={{ width: 'calc(100% - 20px) !important', position: 'relative', border: 'none', outline: 'none', height: 50, flexGrow: 3 }}
            />
            <Dropdown
              name="surveyTimeoutUnits"
              validations={{ isExisty: true }}
              validationErrors={{ minLength: 'units is Required', isExisty: 'units is required' }}
              onChange={this.onSurveyTimeoutUnitsChanged}
              value={this.state.surveyTimeoutUnits.toString()}
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
      </div>
    );
  }
}
