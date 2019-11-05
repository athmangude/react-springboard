/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from 'SharedComponents/icon-button';
import { stringToHexColor, extractInitials } from 'Utils/UtilFunctions';

export default class Delay extends Component {
  static propTypes = {
    delay: PropTypes.object,
    onEdit: PropTypes.func,
    onView: PropTypes.func,
  }

  constructor(props) {
    super(props);
    
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      isMouseOver: false,
      transactionalSurveyDelay: false,
      days: 10,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  componentDidMount() {
    const { delay } = this.props;
    const transactionalSurveyDelay = delay.surveyMetadata.find((metadata) => metadata.name === 'transactionalSurveyDelay');

    if (transactionalSurveyDelay) {
      this.calculateDelays(transactionalSurveyDelay);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { delay } = this.props;
    const newTransactionalSurveyDelay = nextProps.delay.surveyMetadata.find((metadata) => metadata.name === 'transactionalSurveyDelay');

    const transactionalSurveyDelay = delay.surveyMetadata.find((metadata) => metadata.name === 'transactionalSurveyDelay');

    if (newTransactionalSurveyDelay !== transactionalSurveyDelay) {
      this.calculateDelays(newTransactionalSurveyDelay);
    }
  }

  onMouseEnter() {
    this.setState({ isMouseOver: true });
  }

  onMouseLeave() {
    this.setState({ isMouseOver: false });
  }

  onView(delay) {
    const { onView } = this.props;
    onView(delay);
  }

  onEdit(delay) {
    const { onEdit } = this.props;
    onEdit(delay);
  }

  calculateDelays(transactionalSurveyDelay) {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const milliseconds = parseInt(transactionalSurveyDelay.value, 10);
    seconds = Math.floor(milliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds %= 60;
    hours = Math.floor(minutes / 60);
    minutes %= 60;
    days = Math.floor(hours / 24);
    hours %= 24;
    this.setState({
      transactionalSurveyDelay,
      days,
      hours,
      minutes,
      seconds,
    });
  }

  render() {
    const {
      isMouseOver,
      transactionalSurveyDelay,
      days,
      hours,
      minutes,
      seconds,
    } = this.state;
    const { delay } = this.props;
    const colorMix = stringToHexColor(delay.title);

    return (
      <div role="button" tabIndex={0} className="account-list-item" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={{ width: '100%', borderBottom: 'solid 1px #d9d9d9', padding: '10px 10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', cursor: 'pointer', backgroundColor: isMouseOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{ margin: '0 10px', height: 40, width: 40, borderRadius: 20, backgroundColor: colorMix.backgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorMix.color }}>{extractInitials(delay.title)}</div>
          <span>{delay.title}</span>
        </div>
        {
          transactionalSurveyDelay ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: 10, alignSelf: 'baseline' }}>
              <i className="material-icons" style={{ color: '#46b39d', marginRight: 10, alignSelf: 'flex-start' }}>timer</i>
              <span style={{ color: '#46b39d' }}>{`${days}D ${hours}H ${minutes}M ${seconds}S`}</span>
            </div>
          ) : null
        }
        {
          isMouseOver && transactionalSurveyDelay ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', padding: '0 10px' }}>
              <IconButton onClick={() => this.onView(delay)} icon="visibility" style={{ margin: 0, padding: 6 }} />
              <IconButton onClick={() => this.onEdit(delay)} icon="edit" style={{ margin: 0, padding: 6 }} />
            </div>
          ) : null
        }
        {
          isMouseOver && !transactionalSurveyDelay ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: 'rgba(255, 255, 255, 1)', padding: '0 10px' }}>
              <IconButton onClick={() => this.onEdit(delay)} icon="add" style={{ margin: 0, padding: 6 }} />
            </div>
          ) : null
        }
      </div>
    );
  }
}
