/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SummaryTabs from '../../components/SummaryTabs';
import Title from '../../components/Title';
import ComparisonChart from '../../components/ComparisonChart';

const tabs = [{ label: 'Education Level' }, { label: 'Occupation' }, { label: 'Banked' }, { label: 'Internet Access' }, { label: 'Household Spendings' }];

export default class Others extends Component {
  static propTypes = {
    width: PropTypes.number,
    demographics: PropTypes.object,
    isLoadingDemographics: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
  }

  state = {
    selectedTab: 'Education Level',
    data: {},
  }

  componentDidMount() {
    const { demographics, isLoadingDemographics } = this.props;

    this.geStats(demographics, isLoadingDemographics);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoadingDemographics) {
      this.geStats(nextProps.demographics, nextProps.isLoadingDemographics);
    }
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  geStats(demographics, loading) {
    const { data } = this.state;

    const educationlevel = [];
    const occupation = [];
    const banked = [];
    const internetaccess = [];
    const householdspendings = [];

    if (!loading) {
      if (demographics.educationLevelStats) {
        Object.keys(demographics.educationLevelStats).forEach((key) => (
          educationlevel.push({ name: key, count: demographics.educationLevelStats[key] })
        ));
      }

      if (demographics.occupationStats) {
        Object.keys(demographics.occupationStats).forEach((key) => (
          occupation.push({ name: key, count: demographics.occupationStats[key] })
        ));
      }

      if (demographics.bankedStats) {
        Object.keys(demographics.bankedStats).forEach((key) => (
          banked.push({ name: key === 'true' ? 'Yes' : 'No', count: demographics.bankedStats[key] })
        ));
      }

      if (demographics.internetAccessStats) {
        Object.keys(demographics.internetAccessStats).forEach((key) => (
          internetaccess.push({ name: key === 'true' ? 'Yes' : 'No', count: demographics.internetAccessStats[key] })
        ));
      }

      if (demographics.householdSpendingStats) {
        Object.keys(demographics.householdSpendingStats).forEach((key) => (
          householdspendings.push({ name: key, count: demographics.householdSpendingStats[key] })
        ));
      }

      data.educationlevel = educationlevel;
      data.occupation = occupation;
      data.banked = banked;
      data.internetaccess = internetaccess;
      data.householdspendings = householdspendings;

      this.setState({ data });
    }
  }

  render() {
    const { selectedTab, data } = this.state;
    const { width, isLoadingDemographics } = this.props;
    const key = selectedTab.replace(' ', '').toLowerCase();
    const dataKeys = Object.keys(data).length ? data[key].map((item) => item.name) : [];
    const test = data[key] ? data[key] : [];

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Other Attributes " subtitle="What are other demographic attributes of my customers?" />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          <SummaryTabs tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} minimal />
          <ComparisonChart data={test} width={width} chartOptions={['pie', 'bar', 'stacked']} defaultChartType="pie" dataKeys={dataKeys} yAxis="count" isLoading={isLoadingDemographics} hideInterval nonLinear />
        </div>
      </div>
    );
  }
}
