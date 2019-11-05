/* eslint-disable jsx-a11y/href-no-hash, radix, no-mixed-operators, react/no-array-index-key, object-curly-newline */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import numeral from 'numeral';

import './BarChartAlternate.css';

export default class BarChartAlternate extends Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onFilterByBarChartOption: PropTypes.func.isRequired,
  }

  state = { setFill: false, viewAll: false, clickedOption: '' };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ setFill: true });
    }, 250);
  }

  onClick(row) {
    const { question, onFilterByBarChartOption } = this.props;
    let { clickedOption } = this.state;
    if (row.name === clickedOption) {
      clickedOption = '';
    } else {
      clickedOption = row.name;
    }
    this.setState({ clickedOption });
    onFilterByBarChartOption(question.questionId, clickedOption);
  }

  render() {
    const { question } = this.props;
    const { setFill, viewAll, clickedOption } = this.state;

    const total = Object.entries(question.analysis).reduce((accumulator, currentValue) => accumulator + Number(currentValue[1].count), 0);

    const chartData = Object.entries(question.analysis).map((analysis) => ({
      name: analysis[1].text,
      count: numeral(Number(analysis[1].count)).format('0 a'),
      percentage: setFill ? parseFloat(Number(analysis[1].count) / total * 100).toFixed(1) : 0,
    })).sort((a, b) => b.count - a.count).map((item, i) => ({
      ...item,
      fill: `rgba(72, 125, 179, ${0.5 + (0.5 * (Object.entries(question.analysis).length / (Object.entries(question.analysis).length + i)))}`,
    }));

    if (chartData.length > 6) {
      if (!viewAll) {
        return (
          <div className="custom-tab" style={{ backgroundColor: '#FFF', padding: 10, width: '100%', position: 'relative', textAlign: 'right' }}>
            {
              chartData.slice(0, 5).map((row, index) => (
                <button type="button" onClick={() => this.onClick(row)} className={`multiple-choice-bar ${clickedOption === row.name ? 'multiple-choice-bar-active' : ''}`} style={{ display: 'flex', alignItems: 'space-between', height: 35, margin: '5px 0 5px', width: '100%' }} key={`${index}-bar`}>
                  <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}>
                    <Popup
                      trigger={<span style={{ color: '#888888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name}</span>}
                      content={row.name}
                      basic
                      inverted
                      hoverable
                      style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                    />
                  </div>
                  <div style={{ height: 35, width: '55%', margin: 0, backgroundColor: '#f7f7f7' }}>
                    <div style={{ width: `${row.percentage}%`, backgroundImage: 'linear-gradient(to left, #5b8dc2, rgba(102, 151, 203, 0.5))', height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s', borderBottomRightRadius: 17.5, borderTopRightRadius: 17.5 }}></div>
                  </div>
                  <div style={{ width: '20%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10, fontSize: 12 }}><span style={{ color: '#888888' }}>{`${Number.isNaN(row.percentage) ? 0 : row.percentage}% (${row.count})`}</span></div>
                </button>
              ))
            }
            <div style={{ width: '100%', background: 'linear-gradient(to bottom, transparent, white, white)', height: 100, position: 'absolute', bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button type="button" className="underline-hover" style={{ position: 'absolute', bottom: 5 }} onClick={(event) => { event.preventDefault(); this.setState({ viewAll: true }); }}>
                {`View More (+${chartData.length - 6})`}
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="custom-tab" style={{ backgroundColor: '#FFF', padding: 10, width: '100%', textAlign: 'right' }}>
          {
            chartData.map((row, index) => (
              <button type="button" onClick={() => this.onClick(row)} className={`multiple-choice-bar ${clickedOption === row.name ? 'multiple-choice-bar-active' : ''}`} style={{ display: 'flex', alignItems: 'space-between', height: 35, margin: '5px 0 5px', width: '100%' }} key={`${index}-bar`}>
                <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}>
                  <Popup
                    trigger={<span style={{ color: '#888888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name}</span>}
                    content={row.name}
                    basic
                    inverted
                    hoverable
                    style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                  />
                </div>
                <div style={{ height: 35, width: '55%', margin: 0, backgroundColor: '#f7f7f7' }}>
                  <div style={{ width: `${row.percentage}%`, backgroundImage: 'linear-gradient(to left, #5b8dc2, rgba(102, 151, 203, 0.5))', height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s', borderBottomRightRadius: 17.5, borderTopRightRadius: 17.5 }}></div>
                </div>
                <div style={{ width: '20%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10, fontSize: 12 }}><span style={{ color: '#888888' }}>{`${Number.isNaN(row.percentage) ? 0 : row.percentage}% (${row.count})`}</span></div>
              </button>
            ))
          }
          <div style={{ width: '100%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 30 }}>
            <button type="button" className="underline-hover" style={{ position: 'absolute', bottom: 5 }} href="#" onClick={(event) => { event.preventDefault(); this.setState({ viewAll: false }); }}>
              View Less
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="custom-tab" style={{ backgroundColor: '#FFF', padding: 10, width: '100%', textAlign: 'right' }}>
        {
          chartData.map((row, index) => (
            <button type="button" onClick={() => this.onClick(row)} className={`multiple-choice-bar ${clickedOption === row.name ? 'multiple-choice-bar-active' : ''}`} style={{ display: 'flex', alignItems: 'space-between', height: 35, margin: '5px 0 5px', width: '100%' }} key={`${index}-bar`}>
              <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}>
                <Popup
                  trigger={<span style={{ color: '#888888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name}</span>}
                  content={row.name}
                  basic
                  inverted
                  hoverable
                  style={{ padding: '2px 5px', backgroundColor: '#58595b' }}
                />
              </div>
              <div style={{ height: 35, width: '55%', margin: 0, backgroundColor: '#f7f7f7' }}>
                <div style={{ width: `${row.percentage}%`, backgroundImage: 'linear-gradient(to left, #5b8dc2, rgba(102, 151, 203, 0.5))', height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s', borderBottomRightRadius: 17.5, borderTopRightRadius: 17.5 }}></div>
              </div>
              <div style={{ width: '20%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10, fontSize: 12 }}><span style={{ color: '#888888' }}>{`${Number.isNaN(row.percentage) ? 0 : row.percentage}% (${row.count})`}</span></div>
            </button>
          ))
        }
      </div>
    );
  }
}
