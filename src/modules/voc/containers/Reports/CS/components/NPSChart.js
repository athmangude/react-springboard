/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Col } from 'react-grid-system';
import { Dropdown, Segment, Dimmer, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ContainerDimensions from 'react-container-dimensions';
import PropTypes from 'prop-types';
import moment from 'moment';

import IconButton from 'SharedComponents/icon-button';
import NPSFilters from '../../components/NPSFilters';
import CustomTooltip from './CustomTooltip';
import ActivityHandler from 'Utils/ActivityHandler';

import * as csReportActions from '../../CS/flux/actions';

const intervalOptions = [
  { key: 'daily', value: 'daily', text: 'Daily', reference: 'Today', style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' } },
  { key: 'weekly', value: 'weekly', text: 'Weekly', reference: 'This Week', style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' } },
  { key: 'monthly', value: 'monthly', text: 'Monthly', reference: 'This Month', style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' } },
  { key: 'quarterly', value: 'quarterly', text: 'Quarterly', reference: 'This Quarter', style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' } },
  { key: 'yearly', value: 'yearly', text: 'Yearly', reference: 'This Year', style: { height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'left', color: '#808285' } },
];

const months = [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@connect(
  (state) => ({
    csReport: state.aodReport,
  }),
  (dispatch) => ({
    csReportActions: bindActionCreators(csReportActions, dispatch),
    dispatch,
  })
)

export default class NPSChart extends Component {
  static propTypes = {
    question: PropTypes.object,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    npsFilters: PropTypes.object,
    surveyId: PropTypes.string,
    npsMetaDataFilters: PropTypes.object,
    isFetchingNPSMetadataFilters: PropTypes.bool,
    setNPSFilters: PropTypes.func,
    csReportActions: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const { startDate, endDate, npsFilters } = props;
    this.state = {
      isFetchingNPSTrend: false,
      data: [],
      interval: 'daily',
      npsFilters,
      startDate,
      endDate,
      left: 0,
      right: 0,
    };
    this.panLeft = this.panLeft.bind(this);
    this.panRight = this.panRight.bind(this);
    this.onIntervalChanged = this.onIntervalChanged.bind(this);
    this.fetchNPSTrend = this.fetchNPSTrend.bind(this);
  }

  componentDidMount() {
    this.fetchNPSTrend();
  }

  componentWillReceiveProps(newProps) {
    const { startDate, endDate, npsFilters, question } = this.props;
    if (
      startDate !== newProps.startDate ||
      endDate !== newProps.endDate ||
      npsFilters !== newProps.npsFilters ||
      JSON.stringify(question) !== JSON.stringify(newProps.question)
    ) {
      this.setState({ startDate: newProps.startDate, endDate: newProps.endDate, npsFilters: newProps.npsFilters }, () => {
        this.fetchNPSTrend();
      });
    }
  }

  onIntervalChanged(e, { name, value }) {
    this.setState({ [name]: value }, () => {
      this.fetchNPSTrend();
    });
  }

  panLeft() {
    const { left, right } = this.state;
    if ((left + 100) >= 50) return;

    this.setState(() => ({
      right: right - 100,
      left: left + 100,
    }));
  }

  panRight() {
    const { left, right } = this.state;

    if ((right + 100) >= 50) {
      return;
    }

    this.setState(() => ({
      left: left - 100,
      right: right + 100,
    }));
  }

  async fetchNPSTrend() {
    try {
      this.setState({ isFetchingNPSTrend: true });
      const { interval, npsFilters, startDate, endDate } = this.state;
      const { question: { questionId }, surveyId } = this.props;
      const fetchNPSTrendResult = await this.props.csReportActions.fetchNPSTrend(surveyId, questionId, { from: moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'), to: moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss') }, npsFilters, { interval });
      const right = fetchNPSTrendResult.data.Data.length > 14 ? -40 * (fetchNPSTrendResult.data.Data.length - 14) : 0;
      this.setState({ data: fetchNPSTrendResult.data.Data, right, left: 0 });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingNPSTrend: false });
    }
  }
  render() {
    const { question, npsMetaDataFilters, isFetchingNPSMetadataFilters, setNPSFilters } = this.props;

    if (!question) {
      return (
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <div style={{ width: '100%', borderRadius: 8, boxShadow: '0px 0px 0px 2px rgba(67, 70, 86, 0.1)', backgroundColor: '#ffffff', border: 'none', padding: '10px 15px 15px 15px' }}>
            <Segment style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                <div style={{ height: 22, fontFamily: 'Lato', fontSize: 18, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.8, textAlign: 'right', color: '#808285' }}>
                </div>
              </div>
              <div style={{ width: '100%', height: 30 }}>
              </div>
              <div style={{ width: '100%', height: 400 }}>
              </div>
            </Segment>
          </div>
        </Col>
      );
    }

    const { data, interval, isFetchingNPSTrend, left, right } = this.state;


    const computedData = [];
    let cumulativePromoters = 0;
    let cumulativePassives = 0;
    let cumulativeDetractors = 0;

    data.forEach((npsRecord) => {
      const { promoters, passives, detractors } = npsRecord;
      let { period } = npsRecord;
      const total = promoters + passives + detractors;
      // const nps = Math.round(((promoters - detractors) / total) * 100);
      const nps = parseInt(((promoters - detractors) / total) * 100);
      cumulativePromoters += promoters;
      cumulativePassives += passives;
      cumulativeDetractors += detractors;
      if (interval === 'daily' || interval === 'weekly') {
        const periodArray = period.split(' ')[0].split('-');
        if (periodArray.length > 1) {
          period = periodArray[2].concat(' ').concat(months[parseInt(periodArray[1], 10)]);
        }
      }
      computedData.push({
        nps,
        promoters,
        passives,
        detractors,
        contacted: promoters + passives + detractors,
        period,
      });
    });

    const averagePromoters = cumulativePromoters / computedData.length;
    const averagePassives = cumulativePassives / computedData.length;
    const averageDetractors = cumulativeDetractors / computedData.length;
    const totalContacted = averagePromoters + averagePassives + averageDetractors;

    const promoterFraction = averagePromoters / totalContacted;
    const passiveFraction = averagePassives / totalContacted;
    const detractorFraction = averageDetractors / totalContacted;

    const percentagePromoters = Math.round(promoterFraction * 100);
    const percentagePassives = Math.round(passiveFraction * 100);
    const percentageDetractors = Math.round(detractorFraction * 100);
    const averageNPS = Math.floor((promoterFraction - detractorFraction) * 100);

    computedData.forEach((record) => {
      record.average = averageNPS;
    });


    const currentOption = intervalOptions.find((option) => option.value === interval);

    return (
      <Col xl={12} lg={12} md={12} sm={12} xs={12}>
        <div style={{ width: '100%', borderRadius: 8, boxShadow: '0px 0px 0px 2px rgba(67, 70, 86, 0.1)', backgroundColor: '#ffffff', border: 'none', padding: '10px 0 10px', marginBottom: 20 }}>
          <Segment style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
            <Dimmer active={isFetchingNPSTrend} inverted>
              <Loader active={isFetchingNPSTrend} >Loading {interval} trends</Loader>
            </Dimmer>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ height: 16, fontFamily: 'Lato', fontSize: 13, fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.8, textAlign: 'left', color: '#33597f' }}>
                <span style={{ fontWeight: 'bold' }}>Net Promoter Score</span>&nbsp;
              </div>
              <Dropdown inline name="interval" defaultValue={interval} onChange={this.onIntervalChanged} trigger={<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}><i className="material-icons">date_range</i> &nbsp;<span>{currentOption.text}</span></div>} options={intervalOptions} item style={{ maxWidth: 125, height: 38, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.5, textAlign: 'right', color: '#808285', display: 'flex', flexDirection: 'row', alignItems: 'center' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid rgba(151, 151, 151, 0.5)', marginTop: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 65, height: 65, borderRadius: 8, backgroundColor: '#f2f5f7', border: 'solid 1px #d9d9d9', marginRight: 15, textAlign: 'center' }}>
                <span style={{ width: '100%', height: 29, fontFamily: 'Lato', fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 1.4, color: '#33597f' }}>{averageNPS || 0}</span>
              </div>
              <ContainerDimensions>
                {
                  ({ width }) => (
                    <div style={{ width: 'calc(100% - 65px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: `${percentagePromoters || '33'}%`, height: 40, borderBottomLeftRadius: 8, borderTopLeftRadius: 8, backgroundColor: '#80c582' }}>
                          <span style={{ height: 15, fontFamily: 'Lato', fontSize: width > 500 ? 12 : 10, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: width > 500 ? 0.7 : 0, color: '#ffffff' }}>{percentagePromoters || 0}%</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: `${percentagePassives || '33'}%`, height: 40, backgroundColor: '#fcda6e' }}>
                          <span style={{ height: 15, fontFamily: 'Lato', fontSize: width > 500 ? 12 : 10, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: width > 500 ? 0.7 : 0, color: '#ffffff' }}>{percentagePassives || 0}%</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: `${percentageDetractors || '33'}%`, height: 40, borderBottomRightRadius: 8, borderTopRightRadius: 8, backgroundColor: '#f26b50' }}>
                          <span style={{ height: 15, fontFamily: 'Lato', fontSize: width > 500 ? 12 : 10, fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: width > 500 ? 0.7 : 0, color: '#ffffff' }}>{percentageDetractors || 0}%</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '5px 10px 0 0' }}>
                          <span style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#80c582', marginRight: 10 }}></span>
                          <span style={{ height: 15, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.7, color: '#808285' }}>Promoters ({cumulativePromoters})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '5px 10px 0 0' }}>
                          <span style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#fcda6e', marginRight: 10 }}></span>
                          <span style={{ height: 15, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.7, color: '#808285' }}>Passives ({cumulativePassives})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '5px 10px 0 0' }}>
                          <span style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: '#f26b50', marginRight: 10 }}></span>
                          <span style={{ height: 15, fontFamily: 'Lato', fontSize: 12, fontWeight: 'normal', fontStyle: 'normal', fontStretch: 'normal', lineHeight: 'normal', letterSpacing: 0.7, color: '#808285' }}>Detractors ({cumulativeDetractors})</span>
                        </div>
                      </div>
                    </div>
                  )
                }
              </ContainerDimensions>
            </div>
            <div style={{ width: '100%' }}>
              <NPSFilters npsMetaDataFilters={npsMetaDataFilters} setNPSFilters={setNPSFilters} isFetchingNPSMetadataFilters={isFetchingNPSMetadataFilters} isFetchingData={isFetchingNPSMetadataFilters} title={false} />
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {left ? (<IconButton icon="arrow_back_ios" onClick={this.panLeft} style={{ margin: 0, padding: 0, border: '1px solid #d9d9d9' }} />) : null}
              <ContainerDimensions>
                {
                  ({ width }) => {
                    const height = width > 500 ? 400 : 200;
                    let offset = 0;
                    offset += left ? 35 : 0;
                    offset += right ? 35 : 0;
                    return (
                      <div style={{ width: `calc(100% - ${offset}px)`, height }}>
                        {
                          !computedData.length ? (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height, wifth: '100%' }}>No data to display.</div>
                          ) : width > 500 ? (
                            <ResponsiveContainer>
                              <ComposedChart data={computedData} barGap={1} barSize={40}>
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                                <YAxis tickLine={false} yAxisId="left" label={{ value: 'Contacted', angle: -90, position: 'insideLeft' }} />
                                <YAxis tickLine={false} yAxisId="right" domain={[-100, 100]} label={{ value: 'NPS', angle: 90, position: 'insideRight' }} orientation="right" />
                                <Tooltip content={<CustomTooltip interval={interval} />} />
                                <Legend />
                                <defs>
                                  <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7ca1c8" stopOpacity={1} />
                                    <stop offset="100%" stopColor="rgba(199, 210, 223)" stopOpacity={0.5} />
                                  </linearGradient>
                                </defs>
                                <Bar dataKey="contacted" yAxisId="left" fill="url(#colorContacted)" background={{ fill: '#f7f7f7' }} />
                                <Line dataKey="nps" yAxisId="right" stroke="#33597f" strokeWidth={2} dot={{ r: 5 }} />
                                <Line dataKey="average" yAxisId="right" stroke="#fcda6e" strokeWidth={2} dot={{ r: 0 }} />
                              </ComposedChart>
                            </ResponsiveContainer>
                          ) : (
                            <ResponsiveContainer>
                              <ComposedChart data={computedData} barGap={1} barSize={40}>
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis allowDataOverflow tickLine={false} dataKey="period" padding={{ left, right }} />
                                <YAxis tickLine={false} yAxisId="left" />
                                <YAxis tickLine={false} yAxisId="right" domain={[-100, 100]} orientation="right" />
                                <Tooltip content={<CustomTooltip interval={interval} />} />
                                <Legend />
                                <defs>
                                  <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7ca1c8" stopOpacity={1} />
                                    <stop offset="100%" stopColor="rgba(199, 210, 223)" stopOpacity={0.5} />
                                  </linearGradient>
                                </defs>
                                <Bar dataKey="contacted" yAxisId="left" fill="url(#colorContacted)" background={{ fill: '#f7f7f7' }} />
                                <Line dataKey="nps" yAxisId="right" stroke="#33597f" strokeWidth={2} dot={{ r: 5 }} />
                                <Line dataKey="average" yAxisId="right" stroke="#fcda6e" strokeWidth={2} dot={{ r: 0 }} />
                              </ComposedChart>
                            </ResponsiveContainer>
                          )
                        }
                      </div>
                    );
                  }
                }
              </ContainerDimensions>
              {right ? (<IconButton icon="arrow_forward_ios" onClick={this.panRight} style={{ margin: 0, padding: 0, border: '1px solid #d9d9d9' }} />) : null}
            </div>
          </Segment>
        </div>
      </Col>
    );
  }
}
