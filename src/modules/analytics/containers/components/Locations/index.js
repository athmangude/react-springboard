/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import SummaryTabs from '../SummaryTabs';
import DistributionList from '../DistributionList';
import DistributionPie from '../DistributionPie';
import DateFilterOptions from '../DateFilterOptions';

const tabs = [{ label: 'Aggregate' }, { label: 'Performance' }];
const data = [
  { name: 'Limuru', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Eldoret', promoters: 170, passives: 50, detractors: 20 },
  { name: 'Elgeyo', promoters: 170, passives: 50, detractors: 20 },
  { name: 'Nyeri', promoters: 100, passives: 50, detractors: 20 },
  { name: 'South C', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Mombasa', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Kisumu', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Trans Nzoia', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Syokimau', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Wajir', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Lodwar', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Kerugoya', promoters: 70, passives: 50, detractors: 20 },
  { name: 'Kiambu', promoters: 35, passives: 50, detractors: 20 },
  { name: 'Nairobi', promoters: 183, passives: 50, detractors: 20 },
  { name: 'Murang\'a', promoters: 65, passives: 50, detractors: 20 },
  { name: 'Kajiado', promoters: 60, passives: 50, detractors: 20 },
];

export default class Locations extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.onTabSelected = this.onTabSelected.bind(this);
  }

  state = {
    selectedTab: 'Aggregate',
  }

  onTabSelected(selectedTab) {
    this.setState({ selectedTab });
  }

  render() {
    const { selectedTab } = this.state;

    return (
      <div className="grid-item" style={{ width: '100%', padding: '0 10px 10px 10px' }}>
        <div style={{ height: 18, margin: '16px 0 8px 0', color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0 }}>Where do my customers frequent?</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
          <SummaryTabs tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} minimal />
          <DistributionList name="" list={data} type={selectedTab} />
          <DistributionPie title={selectedTab} data={data} nps={selectedTab === 'Performance'} />
          <div style={{ height: 40, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #dddddd', padding: 5 }}>
            <DateFilterOptions onChange={this.onDateFilterOptionChange} defaultOption="30" />
          </div>
        </div>
      </div>
    );
  }
}
