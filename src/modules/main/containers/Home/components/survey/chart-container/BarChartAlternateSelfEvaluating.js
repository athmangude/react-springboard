/* eslint-disable jsx-a11y/href-no-hash */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './BarChartAlternate.css';
import './BarChartAlternateSelfEvaluating.css';

class BarChartAlternate extends Component {
  state = { setFill: false, viewAll: false };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ setFill: true });
    }, 250);
  }

  render() {
    const { question } = this.props;
    // const responseTexts = question.responses.map((response) => response.text);
    const responseTexts = Object.values(question.responses);
    const uniqueItems = new Set(responseTexts);
    let chartData = [];

    uniqueItems.forEach((item) => {
      const count = responseTexts.reduce((accumulator, currentValue) => currentValue === item ? accumulator + 1 : accumulator, 0);
      const total = responseTexts.length;
      chartData.push({
        name: item,
        count,
        percentage: this.state.setFill ? parseInt(count / total * 100) : 0, // eslint-disable-line radix, no-mixed-operators
      });
    });
    chartData = chartData.sort((a, b) => b.count - a.count).map((item, i) => ({
      ...item,
      fill: `rgba(72, 125, 179, ${parseFloat(0.5 + (0.5 * (uniqueItems.size / (uniqueItems.size + i)))).toFixed(1)}`, // eslint-disable-line no-mixed-operators
    }));

    if (chartData.length > 6) {
      if (!this.state.viewAll) {
        return (
          <div className="custom-tab" style={{ backgroundColor: '#FFF', padding: 10, width: '100%', position: 'relative' }}>
            {
              chartData.slice(0, 5).map((row) => (
                <div style={{ display: 'flex', alignItems: 'space-between', height: 35, margin: '5px 0 5px' }}>
                  <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}><span style={{ color: '#888888' }}>{row.name}</span></div>
                  <div style={{ width: '50%', margin: 0 }}>
                    <div style={{ width: `${row.percentage}%`, backgroundColor: row.fill, height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s' }}></div>
                  </div>
                  <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}><span style={{ color: '#888888' }}>{`${row.percentage}% (${row.count})`}</span></div>
                </div>
              ))
            }
            <div style={{ width: '100%', background: 'linear-gradient(to bottom, transparent, white, white)', height: 100, position: 'absolute', bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <a className="underline-hover" style={{ position: 'absolute', bottom: 0 }} href="#" onClick={(event) => { event.preventDefault(); this.setState({ viewAll: true }); }}>{`View More (+${chartData.length - 6})`}</a>
            </div>
          </div>
        );
      }

      return (
        <div className="custom-tab" style={{ backgroundColor: '#FFF', padding: 10, width: '100%' }}>
          {
            chartData.map((row) => (
              <div style={{ display: 'flex', alignItems: 'space-between', height: 35, margin: '5px 0 5px' }}>
                <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}><span style={{ color: '#888888' }}>{row.name}</span></div>
                <div style={{ width: '50%', margin: 0 }}>
                  <div style={{ width: `${row.percentage}%`, backgroundColor: row.fill, height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s' }}></div>
                </div>
                <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}><span style={{ color: '#888888' }}>{`${row.percentage}% (${row.count})`}</span></div>
              </div>
            ))
          }
          <div style={{ width: '100%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 30 }}>
            <a className="underline-hover" style={{ position: 'absolute', bottom: 0 }} href="#" onClick={(event) => { event.preventDefault(); this.setState({ viewAll: false }); }}>View Less</a>
          </div>
        </div>
      );
    }

    return (
      <div className="custom-tab" style={{ backgroundColor: '#FFF', padding: 10, width: '100%' }}>
        {
          chartData.map((row) => (
            <div style={{ display: 'flex', alignItems: 'space-between', height: 35, margin: '5px 0 5px' }}>
              <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}><span style={{ color: '#888888' }}>{row.name}</span></div>
              <div style={{ width: '50%', margin: 0 }}>
                <div style={{ width: `${row.percentage}%`, backgroundColor: row.fill, height: '100%', WebkitTransition: 'width 1s', transition: 'width 1s' }}></div>
              </div>
              <div style={{ width: '25%', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 10 }}><span style={{ color: '#888888' }}>{`${row.percentage}% (${row.count})`}</span></div>
            </div>
          ))
        }
      </div>
    );
  }
}

BarChartAlternate.propTypes = {
  question: PropTypes.object.isRequired,
};

export default BarChartAlternate;
