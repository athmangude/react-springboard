import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import questionTypes from '../questions/questiontypes';
const visibleQuestionTypes = questionTypes.filter((questionType) => {
  if (questionType.key === 'OPEN_ENDED' || questionType.key === 'MULTIPLE_CHOICE_SINGLE_SELECT' || questionType.key === 'OPEN_ENDED_INTEGER' || questionType.key === 'OPEN_ENDED_RANGE_0_10') {
    return true;
  }
  return false;
});

import styles from './index.css';

const MySpeedDialWrapper = styled(SpeedDial)`${styles}`;

const actions = [{
  name: 'open-ended',
  label: 'OE',
  tooltip: 'Open Ended'
}, {
  name: 'multiple-choice',
  label: 'MC',
  tooltip: 'Multiple Choice'
}, {
  name: 'range-choice',
  label: 'RC',
  tooltip: 'Range Choice'
}];

class MySpeedDial extends Component {
  state = {
    open: false,
  }

  handleClick = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleOpen = () => {
    if (!this.state.hidden) {
      this.setState({
        open: true,
      });
    }
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { open } = this.state;

    let portal = document.getElementById('portal-container');
    if (!portal) {
      portal = document.createElement('div');
      portal.setAttribute('id', 'portal-container');
      document.getElementById('app').appendChild(portal);
    }


    return createPortal(
      <MySpeedDialWrapper
        ariaLabel="SpeedDial tooltip example"
        icon={<SpeedDialIcon />}
        onBlur={this.handleClose}
        onClick={this.handleClick}
        onClose={this.handleClose}
        onFocus={this.handleOpen}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
        open={open}
        classname="speed-dial"
      >
        {
          visibleQuestionTypes.map((questionType) => {
            let titleInitials = '';

            questionType.title.split(' ').forEach((segment) => {
              titleInitials = `${titleInitials}${segment[0].toUpperCase()}`;
            });

            return (
              <SpeedDialAction
                key={questionType.title}
                icon={titleInitials}
                tooltipTitle={questionType.title}
                tooltipOpen
                onClick={() => { this.props.onAddQuestion(questionType); this.setState({ expanded: false })}}
                className="speed-dial-action"
              />
            );
          })
        }
        <SpeedDialAction
          key="nps-section"
          icon="NS"
          tooltipTitle="NPS Section"
          tooltipOpen
          onClick={() => { this.props.onAddNPSSection(); this.setState({ expanded: false }) }}
          className="speed-dial-action"
        />
      </MySpeedDialWrapper>,
      document.getElementById('portal-container') // #portal-container is defined in the layout component
    );
  }
}

export default MySpeedDial;
