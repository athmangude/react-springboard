/* eslint-disable jsx-a11y/href-no-hash, no-shadow, object-curly-newline, no-nested-ternary */
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import Spinner from 'react-spinner-material';
import moment from 'moment';

import {
  createFakeGenderData,
  createFakeAgeData,
  createFakeLsmData,
  createFakeLocationData
} from '../../../components/DummyData';
import themes from 'SharedComponents/themes';
import MwambaRequestDemo from 'SharedComponents/mwamba-request-demo';
import SummaryTabs from 'Modules/analytics/containers/components/SummaryTabs';
import ErrorState from 'SharedComponents/mwamba-error-state';
const noData = require('Images/no_data.png');
const { primaryColor, lightPrimaryColor } = themes.light;

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.name} ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const tabs = [{ label: 'Gender' }, { label: 'Age' }, { label: 'LSM' }, { label: 'Location' }];

export default class Demographics extends PureComponent {
    static propTypes = {
      width: PropTypes.number,
    };

    constructor(props) {
      super(props);

      this.onTabSelected = this.onTabSelected.bind(this);
      this.fetchDemographics = this.fetchDemographics.bind(this);
      this.getStats = this.getStats.bind(this);
      this.createFakeAgeData = this.createFakeAgeData.bind(this);
      this.createFakeAgeData = this.createFakeAgeData.bind(this);
      this.createFakeLsmData = this.createFakeLsmData.bind(this);
      this.createFakeLocationData = this.createFakeLocationData.bind(this);
    }

    state = {
      activeIndex: 0,
      selectedTab: 'Gender',
      isLoading: false,
      gender: [],
      age: [],
      lsm: [],
      locations: [],
      selectedDateRange: {},
    };

    componentDidMount() {
      const {demoMode, selectedDateRange} = this.props;

      this.setState({ selectedDateRange }, () => {
        if(!demoMode) {
          this.fetchDemographics();
        } else {
          this.createFakeGenderData();
          this.createFakeAgeData();
          this.createFakeLsmData();
          this.createFakeLocationData();  
        }
      });
    }
  
    componentWillReceiveProps(newProps) {
      if((newProps.selectedDateRange.from !== this.props.selectedDateRange.from) || (newProps.selectedDateRange.to !== this.props.selectedDateRange.to)) {
        this.setState({ selectedDateRange: newProps.selectedDateRange }, () => {
          if(!newProps.demoMode) {
            this.fetchDemographics();
          } else {
            this.createFakeGenderData();
            this.createFakeAgeData();
            this.createFakeLsmData();
            this.createFakeLocationData();
          }
        })
      }
    }

    onTabSelected(selectedTab) {
      this.setState({ selectedTab });
    }

    onPieEnter = (data, index) => {
      this.setState({
        activeIndex: index,
      });
    };

  createFakeAgeData() {
    setTimeout(() => {
      this.setState({ age: createFakeAgeData()})
    }, 500)
  }

  createFakeGenderData() {
    setTimeout(() => {
      this.setState({ gender: createFakeGenderData() });
    }, 500)
  }

  createFakeLsmData() {
    setTimeout(() => {
      this.setState({ lsm: createFakeLsmData() });
    }, 500);
  }

  createFakeLocationData() {
    setTimeout(() => {
      this.setState({ locations: createFakeLocationData() });
    }, 500);
  }

    getStats() {
      const { demographics } = this.state;
  
      const lsm = [];
      const age = [];
      let male = 0;
      let female = 0;
      let other = 0;
      const gender = [];
      const locations = [];
  
      if (demographics.lsmStats) {
        Object.keys(demographics.lsmStats).forEach((key) => (
          lsm.push({ type: key, count: demographics.lsmStats[key] })
        ));
      }
  
      if (demographics.ageStats) {
        Object.keys(demographics.ageStats).forEach((key) => (
          age.push({ type: key, count: demographics.ageStats[key] })
        ));
      }
  
      if (demographics.regionStats) {
        Object.keys(demographics.regionStats).forEach((key) => (
          locations.push({ type: key, count: demographics.regionStats[key] })
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
          gender.push({ name: 'Male', value: male });
        }
  
        if (female > 0) {
          gender.push({ name: 'Female', value: female });
        }
  
        if (other > 0) {
          gender.push({ name: 'Other', value: other });
        }
  
        this.setState({ gender, age, lsm, locations });
      }
    }

    async fetchDemographics() {
      const { customerAnalyticsActions, EventHandler, segmentId, appliedFilters } = this.props;
      const { selectedDateRange } = this.state;
  
      let startDate = '';
      let endDate = '';
  
      if (selectedDateRange.value !== undefined) {
        startDate = moment(selectedDateRange.value.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
        endDate = moment(selectedDateRange.value.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
      } else {
        startDate = moment(selectedDateRange.from).startOf('day').format('YYYY-MM-DD HH:MM:SS');
        endDate = moment(selectedDateRange.to).endOf('day').format('YYYY-MM-DD HH:MM:SS');
      }
  
      this.setState({ isLoading: true });
  
      try {
        const fetchDemographicsResult = await customerAnalyticsActions.fetchDemographics({ startDate, endDate }, (!appliedFilters.length) ? segmentId : null, (appliedFilters.length) ? JSON.parse(appliedFilters) : []);
        this.setState({ demographics: Object.keys(fetchDemographicsResult.data.Data).length ? fetchDemographicsResult.data.Data : {} }, () => this.getStats());
      } catch (exception) {
        EventHandler.handleException(exception);
      } finally {
        this.setState({ isLoading: false});
      }
    }

    render() {
      const { activeIndex, selectedTab, gender, age, lsm, locations, isLoading } = this.state;
      const { width, EventHandler, alertActions } = this.props;

      return (
        <div className="grid-item" style={{ width: '100%', padding: '0px 10px 10px' }}>
          <div style={{ height: 18, margin: '16px 0 8px 0', color: '#4a4a4a', font: '300 18px/14px Roboto,sans-serif', letterSpacing: 0 }}>How are their demographics spread?</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: '#ffffff', borderRadius: 2, boxShadow: '0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)', marginBottom: 20, marginTop: 10 }}>
            {
              (isLoading) ? (
                <div style={{ width: '100%', height: 100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Spinner spinnerColor="#002366" size={40} spinnerWidth={4} />
                </div>
              ) : (
                <div style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
                  <SummaryTabs tabs={tabs} selectedTab={selectedTab} onTabSelected={this.onTabSelected} minimal />
                  {
                    selectedTab === 'Gender' ? (
                      <div style={{ width: '100%', height: 280, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '5px 0px 5px 0px' }}>
                        {
                          (gender.length) ? (
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  activeIndex={activeIndex}
                                  activeShape={renderActiveShape}
                                  data={gender}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  fill={primaryColor}
                                  dataKey="value"
                                  startAngle={-270}
                                  onMouseEnter={this.onPieEnter}
                                >
                                  {
                                    gender.map((entry, index) => (<Cell key={`cell-${index}`} fill={`rgba(72, 125, 179, ${(gender.length - index) / gender.length})`} />))
                                  }
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          ) : (
                            <ErrorState />
                          )
                        }
                      </div>
                    ) : (selectedTab === 'Age') ? (
                      <div style={{ width: '100%', height: 280, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '5px 0px 5px 0px'  }}>
                        {
                          (age.length) ? (
                            <ResponsiveContainer>
                              <BarChart
                                layout="vertical"
                                data={age}
                                margin={{
                                  top: 45, right: 30, left: 20, bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickLine={false} />
                                <YAxis dataKey="type" type="category" tickLine={false} />
                                <Tooltip cursor={{fill: lightPrimaryColor}} />
                                <Legend />
                                <Bar dataKey="count" fill={primaryColor} />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div>
                              <img src={noData} />
                              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
                            </div> 
                          )                          
                        }
                      </div>  
                      ) : (selectedTab === 'LSM') ? (
                        <div style={{ width: '100%', height: 280, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '5px 0px 5px 0px'  }}>
                          {
                            (lsm.length) ? (
                              <ResponsiveContainer>
                                <BarChart
                                  layout="vertical"
                                  data={lsm}
                                  margin={{
                                    top: 45, right: 30, left: 20, bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis type="number" tickLine={false} />
                                  <YAxis dataKey="type" type="category" tickLine={false} />
                                  <Tooltip cursor={{fill: lightPrimaryColor}} />
                                  <Legend />
                                  <Bar dataKey="count" fill={primaryColor} />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div>
                                <img src={noData} />
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
                              </div>
                            )                          
                          }
                        </div>
                      ) : (selectedTab === 'Location') ? (
                        <div style={{ width: '100%', height: 280, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '5px 0px 5px 0px'  }}>
                          {
                            (locations.length) ? (
                              <ResponsiveContainer>
                                <BarChart
                                  layout="vertical"
                                  data={locations}
                                  margin={{
                                    top: 45, right: 30, left: 20, bottom: 5,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis type="number" tickLine={false} />
                                  <YAxis dataKey="type" type="category" tickLine={false} />
                                  <Tooltip cursor={{fill: lightPrimaryColor}} />
                                  <Legend />
                                  <Bar dataKey="count" fill={primaryColor} />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div>
                                <img src={noData} />
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>No data to display</div>
                              </div>
                            )
                          }
                        </div>  
                      ) : null
                  }
                </div>
              )
            }
          </div>
        </div>
      );
    }
}
