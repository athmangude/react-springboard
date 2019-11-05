/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import numeral from 'numeral';
import ReactPlaceholder from 'react-placeholder';
import { RectShape } from 'react-placeholder/lib/placeholders';

import Gender from './Gender';
import AgeDistribution from './AgeDistribution';
import DimensionDistribution from './DimensionDistribution';

export default class SurveyMetadata extends Component {
  static propTypes = {
    targetStats: PropTypes.object,
    activeParticipantStats: PropTypes.object,
    target: PropTypes.number.isRequired,
    responded: PropTypes.number.isRequired,
    isFetchingData: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { targetStats, activeParticipantStats, target, responded, isFetchingData } = props;

    const demographicOptions = [
      { key: 'target', text: `Target (${numeral(target).format('0 a')})`, value: 'target' },
      { key: 'respondents', text: `Respondents (${numeral(responded).format('0 a')})`, value: 'respondents' },
    ];

    this.state = {
      targetStats,
      activeParticipantStats,
      demographicOptions,
      stats: targetStats,
      isFetchingData,
    };
  }

  componentWillReceiveProps(newProps) {
    const { targetStats, activeParticipantStats, target, responded, isFetchingData } = newProps;

    const demographicOptions = [
      { key: 'target', text: `Target (${numeral(target).format('0 a')})`, value: 'target' },
      { key: 'respondents', text: `Respondents (${numeral(responded).format('0 a')})`, value: 'respondents' },
    ];

    this.setState(() => ({
      targetStats,
      activeParticipantStats,
      demographicOptions,
      isFetchingData,
      stats: targetStats,
    }));
  }

  handleClick = (e, { value }) => {
    const { targetStats, activeParticipantStats } = this.state;
    if (value === 'target') {
      this.setState({ stats: targetStats });
    }
    if (value === 'respondents') {
      this.setState({ stats: activeParticipantStats });
    }
  }

  render() {
    const { stats, demographicOptions, isFetchingData } = this.state;

    if (isFetchingData) {
      return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: '0 0px 0px 2px rgba(67, 70, 86, 0.1) ', marginBottom: 20, marginTop: 10 }}>
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />

          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />


          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: 120, height: 25 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 10 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
          <ReactPlaceholder showLoadingAnimation customPlaceholder={<div style={{ width: '100%', marginBottom: 20 }}><RectShape color="#d9d9d9" style={{ width: '100%', height: 10 }} /></div>} />
        </div>
      );
    }
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, boxShadow: '0 0px 0px 2px rgba(67, 70, 86, 0.1) ', marginBottom: 20, marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', margin: '0 0 20px' }}>
          <span style={{ color: '#3d4553', fontSize: 13, fontWeight: 'bold' }}>Demographic</span>
          <span style={{ color: '#3d4553', fontSize: 13 }}>
            <Dropdown
              pointing="right"
              inline
              direction="left"
              options={demographicOptions}
              defaultValue={demographicOptions[0].value}
              onChange={this.handleClick}
            />
          </span>
        </div>
        <Gender stats={!stats ? {} : stats.genderStats === undefined ? {} : stats.genderStats} key="gender" />
        <AgeDistribution stats={!stats ? [] : stats.ageStats ? stats.ageStats : []} key="age" />
        <DimensionDistribution stats={!stats ? [] : stats.locationStats ? stats.locationStats : []} key="dimension" />
      </div>
    );
  }
}
