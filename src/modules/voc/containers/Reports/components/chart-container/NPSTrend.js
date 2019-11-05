import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Menu, Dropdown, Loader, Dimmer, Segment } from 'semantic-ui-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, ResponsiveContainer, Legend } from 'recharts';

import ActivityHandler from 'Utils/ActivityHandler';

import * as csReportActions from '../../CS/flux/actions';

const intervalOptions = [
  {
    key: 'daily',
    value: 'daily',
    text: 'Daily',
  },
  {
    key: 'weekly',
    value: 'weekly',
    text: 'Weekly',
  },
  {
    key: 'monthly',
    value: 'monthly',
    text: 'Monthly',
  },
  {
    key: 'quarterly',
    value: 'quarterly',
    text: 'Quarterly',
  },
  {
    key: 'yearly',
    value: 'yearly',
    text: 'Yearly',
  },
];

const getAxisYDomain = (fromIdx, toIdx, ref, offset, data) => {
  const refData = data.slice(fromIdx, toIdx);
  const values = [];
  refData.forEach((d) => {
    const recordValues = [d.promoters, d.passives, d.detractors];
    values.push(...recordValues);
  });

  return [(Math.min(...values) || 0) - offset, (Math.max(...values) || 0) + offset];
};

@connect(
  (state) => ({
    csReport: state.aodReport,
  }),
  (dispatch) => ({
    csReportActions: bindActionCreators(csReportActions, dispatch),
    dispatch,
  })
)

export default class NPSTrend extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    npsFilters: PropTypes.object,
    surveyId: PropTypes.string,
    showNPSTrend: PropTypes.bool,
    csReportActions: PropTypes.func,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onIntervalChanged = this.onIntervalChanged.bind(this);
    this.fetchNPSTrend = this.fetchNPSTrend.bind(this);
    this.zoom = this.zoom.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  state = {
    isFetchingNPSTrend: false,
    data: [],
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    top2: 'dataMax+20',
    bottom2: 'dataMin-20',
    animation: true,
    interval: 'daily',
    npsFilters: {},
    startDate: '',
    endDate: '',
  };

  componentDidMount() {
    this.fetchNPSTrend();
  }

  componentWillReceiveProps(newProps) {
    const { startDate, endDate, npsFilters } = this.props;
    if (
      startDate !== newProps.startDate ||
      endDate !== newProps.endDate ||
      npsFilters !== newProps.npsFilters
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

  zoom() {
    let { refAreaLeft, refAreaRight } = this.state;
    const { data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) {
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
    }

    // yAxis domain
    const fromIdx = data.findIndex((record) => record.period === refAreaLeft);
    const toIdx = data.findIndex((record) => record.period === refAreaRight);
    const [bottom, top] = getAxisYDomain(fromIdx, toIdx, 'promoters', 1, data);
    const [bottom2, top2] = getAxisYDomain(fromIdx, toIdx, 'nps', 50);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: fromIdx,
      right: toIdx,
      bottom,
      top,
      bottom2,
      top2,
    }));
  }

  zoomOut() {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top: 'dataMax+1',
      bottom: 'dataMin',
    }));
  }

  async fetchNPSTrend() {
    try {
      this.setState({ isFetchingNPSTrend: true });
      const { interval, npsFilters, startDate, endDate } = this.state;
      const { question: { questionId }, surveyId } = this.props;
      const fetchNPSTrendResult = await this.props.csReportActions.fetchNPSTrend(surveyId, questionId, { from: startDate, to: endDate }, npsFilters, { interval });
      this.setState({ data: fetchNPSTrendResult.data.Data });
    } catch (exception) {
      ActivityHandler.handleException(this.props.dispatch, exception);
    } finally {
      this.setState({ isFetchingNPSTrend: false });
    }
  }

  render() {
    const { data, left, right, refAreaLeft, refAreaRight, top, top2, bottom, bottom2, interval, isFetchingNPSTrend } = this.state;

    if (!this.props.showNPSTrend) {
      return null;
    }

    const computedData = [];
    data.forEach((npsRecord) => {
      const { promoters, passives, detractors } = npsRecord;
      let { period } = npsRecord;
      const total = promoters + passives + detractors;
      const nps = Math.round(((promoters - detractors) / total) * 100);
      if (interval === 'daily') {
        const periodArray = period.split(' ')[0].split('-');
        if (periodArray.length > 1) {
          period = periodArray[1].concat('-').concat(periodArray[2]);
        }
      }
      computedData.push({
        nps,
        promoters,
        passives,
        detractors,
        period,
      });
    });

    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start', flexWrap: 'wrap', width: '100%' }}>
          <Segment style={{ width: '100%', border: 'none', boxShadow: 'none' }}>
            <Dimmer active={isFetchingNPSTrend} inverted>
              <Loader active={isFetchingNPSTrend} >Loading {interval} trends</Loader>
            </Dimmer>

            <div className="highlight-bar-charts" style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: '5px 0 10px 0' }}>
                <Menu compact>
                  <Dropdown name="interval" onChange={this.onIntervalChanged} defaultValue={interval} options={intervalOptions} item />
                </Menu>
              </div>

              <div style={{ width: '100%', height: 250, marginBottom: 10 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={computedData}
                    onMouseDown={(e) => this.setState({ refAreaLeft: e.activeLabel })}
                    onMouseMove={(e) => this.state.refAreaLeft && this.setState({ refAreaRight: e.activeLabel })}
                    onMouseUp={this.zoom}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      allowDataOverflow
                      dataKey="period"
                      domain={[left, right]}

                    />
                    <YAxis
                      allowDataOverflow
                      domain={[bottom, top]}
                      type="number"
                      yAxisId="1"
                    />
                    <YAxis
                      orientation="right"
                      allowDataOverflow
                      domain={[bottom2, top2]}
                      type="number"
                      yAxisId="2"
                    />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="1" type="monotone" dataKey="promoters" stroke="#80c582" animationDuration={700} />
                    <Line yAxisId="1" type="monotone" dataKey="passives" stroke="#fcda6e" animationDuration={700} />
                    <Line yAxisId="1" type="monotone" dataKey="detractors" stroke="#fd9681" animationDuration={700} />
                    <Line yAxisId="2" type="monotone" dataKey="nps" stroke="#8884d8" animationDuration={700} />

                    {/* {(refAreaLeft && refAreaRight) ? (
                      <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
                      ) : null
                    } */}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Segment>
        </div>
      </div>
    );
  }
}
