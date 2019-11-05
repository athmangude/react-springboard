/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import SummaryTabs from '../SummaryTabs';
import Title from '../Title';
import ComparisonChart from '../ComparisonChart';
import DateFilterOptions from '../DateFilterOptions';
import ActionButton from 'SharedComponents/action-button-styled';

const tabs = [{ label: 'Age' }, { label: 'Gender' }, { label: 'LSM' }];

export default class Demographic extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    width: PropTypes.number,
    showFooterActions: PropTypes.bool,
    customerAnalyticsActions: PropTypes.object,
    EventHandler: PropTypes.object,
    selectedDateRange: PropTypes.object,
    appliedFilters: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
    this.onGoTo = this.onGoTo.bind(this);
  }

  state = {
    selectedTab: 'Age',
    data: {},
    isLoadingDemographics: false,
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

  onGoTo() {
    const { router } = this.context;

    router.history.push('/analytics/demographic');
  }

  geStats(demographics, loading) {
    const { data } = this.state;

    const lsm = [];
    const age = [];
    let male = 0;
    let female = 0;
    let other = 0;
    const gender = [];

    if (!loading) {
      if (demographics.lsmStats) {
        Object.keys(demographics.lsmStats).forEach((key) => (
          lsm.push({ name: key, count: demographics.lsmStats[key] })
        ));
      }

      if (demographics.ageStats) {
        Object.keys(demographics.ageStats).forEach((key) => (
          age.push({ name: key, count: demographics.ageStats[key] })
        ));
      }

      if (demographics.genderStats) {
        demographics.genderStats.forEach((item) => (
          Object.keys(item).forEach((key) => {
            if (key === 'male') {
              male += item[key];
            }

            if (key === 'female') {
              female += item[key];
            }

            if (key === 'other') {
              other += item[key];
            }
          })
        ));

        if (male > 0) {
          gender.push({ name: 'Male', count: male });
        }

        if (female > 0) {
          gender.push({ name: 'Female', count: female });
        }

        if (other > 0) {
          gender.push({ name: 'Other', count: other });
        }

        data.lsm = lsm;
        data.age = age;
        data.gender = gender;

        this.setState({ data });
      }
    }
  }

  render() {
    const { selectedTab, data } = this.state;
    const { width, showFooterActions, isLoadingDemographics } = this.props;
    const key = selectedTab.replace(' ', '').toLowerCase();
    const dataKeys = Object.keys(data).length ? data[key].map((item) => item.name) : [];
    const test = data[key] ? data[key] : [];

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <Title title="Basic Attributes " subtitle="What is the average demographic profile of my customers?" />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          <SummaryTabs tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} minimal />
          <ComparisonChart
            data={test}
            width={width}
            // chartOptions={['pie']}
            defaultChartType="pie"
            dataKeys={dataKeys}
            yAxis="count"
            isLoading={isLoadingDemographics}
            hideInterval
            nonLinear
          />
          {
            showFooterActions ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', borderTop: '1px solid #dddddd', padding: 5 }}>
                {/* <DateFilterOptions onChange={this.onDateFilterOptionChange} defaultOption="30" /> */}
                <ActionButton text="Demographic" icon="chevron_right" onClick={() => this.onGoTo()} />
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}
