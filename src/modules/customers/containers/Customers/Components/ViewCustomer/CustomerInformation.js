/* eslint-disable jsx-a11y/href-no-hash, no-nested-ternary, object-curly-newline */
import React, { Component } from 'react';
import 'react-input-range/lib/css/index.css';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import numeral from 'numeral';
import moment from 'moment';
import { connect } from 'react-redux';

import IconButton from 'SharedComponents/icon-button';
import ActionButton from 'SharedComponents/action-button-styled';
import Accordion from 'SharedComponents/mwamba-accordion/Accordion';

@connect((state) => ({
  filters: state.customerAnalytics.filters,
}), () => ({}))

export default class CustomerInformation extends Component {
  static propTypes = {
    onCloseSidePanel: PropTypes.func,
    participant: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      mouseOver: null,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
  }

  onMouseEnter(row) {
    this.setState({ mouseOver: row });
  }

  onMouseLeave() {
    this.setState({ mouseOver: null });
  }

  render() {
    const { onCloseSidePanel, participant } = this.props;
    const { mouseOver } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
        <div style={{ width: '100%', backgroundColor: '#fff', position: 'relative' }}>
          <div style={{ width: '100%', height: 63, backgroundColor: '#d9d9d9', position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 10px 30px 20px', boxShadow: '0 0 7px rgba(0, 0, 0, 0.6)', zIndex: 100 }}>
            <h2 style={{ fontWeight: 'normal', fontSize: 20, margin: 0 }}>Customer Information</h2>
            <IconButton icon="close" onClick={onCloseSidePanel} />
          </div>
        </div>

        <div style={{ width: '100%', backgroundColor: '#fff', position: 'relative' }}>
          <div style={{ padding: '0 10px 0 10px' }}>
            <div style={{ padding: '20px 0 20px 0' }}>
              <Accordion allowMultipleOpen accordionStyle={{ marginBottom: 20 }}>
                <div label="Basic&nbsp;Information" style={{ margin: '0px 20px' }}>
                  <div onMouseEnter={() => this.onMouseEnter('age')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'age' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Age</div>
                    <div>{participant.age}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('sex')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'sex' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Gender</div>
                    <div>{participant.sex}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('commId')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'commId' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Phone No.</div>
                    <div>{participant.commId}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('employmentType')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'employmentType' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Employment Type</div>
                    <div>{participant.employmentType}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('profession')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'profession' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Profession</div>
                    <div>{participant.profession}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('educationLevel')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'educationLevel' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Education Level</div>
                    <div>{participant.educationLevel}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('country')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'country' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Country</div>
                    <div>{participant.country}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('county')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'county' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>County</div>
                    <div>{participant.county}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('region')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'region' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Region</div>
                    <div>{participant.region}</div>
                  </div>
                </div>

                <div label="Socio-economic&nbsp;Status">
                  <div onMouseEnter={() => this.onMouseEnter('lsm')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'lsm' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>LSM</div>
                    <div>{participant.lsm}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('banked')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'banked' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Banked</div>
                    <div>{participant.banked}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('cableTvSubscription')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'cableTvSubscription' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Cable Tv Subscription</div>
                    <div>{participant.cableTvSubscription}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('familyCarOwnership')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'familyCarOwnership' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Owns car</div>
                    <div>{participant.familyCarOwnership}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('headOfHousehold')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'headOfHousehold' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Head of Household</div>
                    <div>{participant.headOfHousehold}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('internetAccess')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'internetAccess' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Internet Access </div>
                    <div>{participant.internetAccess}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('smartPhoneOwnership')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'smartPhoneOwnership' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Owns Smart Phone </div>
                    <div>{participant.smartPhoneOwnership}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('npsScore')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'npsScore' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>NPS Score</div>
                    <div>{participant.npsScore}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('npsTags')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'npsTags' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>NPS Tags</div>
                    <div>{participant.npsTags}</div>
                  </div>
                </div>

                <div label="Survey&nbsp;Information">
                  <div onMouseEnter={() => this.onMouseEnter('surveyCompletionRate')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'surveyCompletionRate' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Survey Completion Rate</div>
                    <div>{participant.surveyCompletionRate}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('surveyResponseRate')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'surveyResponseRate' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Survey Response Rate</div>
                    <div>{participant.surveyResponseRate}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('surveysCompleted')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'surveysCompleted' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Surveys Completed</div>
                    <div>{participant.surveysCompleted}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('surveysReceived')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'surveysReceived' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Surveys Received</div>
                    <div>{participant.surveysReceived}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('totalIncentivesReceived')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'totalIncentivesReceived' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Total Incentives Received</div>
                    <div>{participant.totalIncentivesReceived}</div>
                  </div>
                </div>

                <div label="Transaction&nbsp;Information">
                  <div onMouseEnter={() => this.onMouseEnter('averageTransactionSpend')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'averageTransactionSpend' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Average Transaction Spend</div>
                    <div>{numeral(participant.averageTransactionSpend).format('0,0')}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('lastTransactionLocation')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'lastTransactionLocation' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Last Transaction Location</div>
                    <div>{participant.lastTransactionLocation}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('lastTransactionSpent')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'lastTransactionSpent' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>lastTransactionSpent</div>
                    <div>{numeral(participant.lastTransactionSpent).format('0,0')}</div>
                  </div>
                  <div onMouseEnter={() => this.onMouseEnter('lastTransactionTimestamp')} onMouseLeave={this.onMouseLeave} style={{ width: '100%', margin: '0 0 0 5px', padding: '10px 10px 10px 0px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: mouseOver === 'lastTransactionTimestamp' ? 'rgba(0, 0, 0, 0.03)' : 'transparent' }}>
                    <div style={{ margin: '0 10px' }}>Last Seen</div>
                    <div>{participant.lastTransactionTimestamp ? moment.utc(participant.lastTransactionTimestamp).local().fromNow() : 'N|A'}</div>
                  </div>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
